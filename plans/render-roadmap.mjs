#!/usr/bin/env node

// Markdown report renderer with spanning phase-header rows.
// Usage: node render-roadmap.mjs --source roadmap.md --output roadmap.html [--check]
import { createHash, randomUUID } from 'node:crypto'
import { constants as fsConstants, lstatSync, readFileSync } from 'node:fs'
import { lstat, open, realpath, rename, unlink } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const mermaidAssetRoot = path.resolve(new URL('./assets/mermaid/', import.meta.url).pathname)
import GithubSlugger from 'github-slugger'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function safeHref(value) {
  const href = value.trim()
  if (!href || /[\u0000-\u001f\u007f]/.test(href) || href.startsWith('//')) {
    throw new Error(`Unsafe link target: ${value}`)
  }
  const scheme = href.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase()
  if (scheme && !['http', 'https', 'mailto'].includes(scheme)) {
    throw new Error(`Unsafe link scheme: ${scheme}`)
  }
  return href
}

function rawMarkupLoadsContent(value) {
  const attribute =
    /\b(href|xlink:href|src|srcset|imagesrcset|poster|action|formaction)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi
  for (const match of value.matchAll(attribute)) {
    const name = match[1].toLowerCase()
    const target = (match[2] ?? match[3] ?? match[4] ?? '').trim()
    if ((name === 'href' || name === 'xlink:href') && target.startsWith('#')) {
      continue
    }
    return true
  }
  if (/@import\b/i.test(value)) return true
  const cssUrl = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi
  for (const match of value.matchAll(cssUrl)) {
    const target = (match[1] ?? match[2] ?? match[3] ?? '').trim()
    if (!target.startsWith('#')) return true
  }
  return false
}

function inline(value) {
  const codeSpans = []
  const protectedValue = escapeHtml(value).replace(/`([^`]+)`/g, (_, code) => {
    codeSpans.push(code)
    return `\uE000${codeSpans.length - 1}\uE001`
  })

  return protectedValue
    .replace(/\*\*([^*]+(?:\*(?!\*)[^*]*)*)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label, href) => `<a href="${safeHref(href)}">${label}</a>`,
    )
    .replace(/\uE000(\d+)\uE001/g, (_, index) => `<code>${codeSpans[Number(index)]}</code>`)
}

function tableInline(
  value,
  {
    breakHyphens = false,
    breakSlashes = true,
    preserveAllWords = false,
    preserveHyphenatedWords = false,
  } = {},
) {
  let breakableDepth = 0

  return inline(value)
    .split(/(<[^>]+>)/u)
    .map((part) => {
      if (part.startsWith('<')) {
        if (/^<\/(?:a|code)>$/iu.test(part)) breakableDepth = Math.max(0, breakableDepth - 1)
        else if (/^<(?:a|code)(?:\s[^>]*)?>$/iu.test(part)) breakableDepth += 1
        return part
      }

      const addDelimiterBreaks = (text) =>
        text
          .split(/(<[^>]+>)/u)
          .map((segment) => {
            if (segment.startsWith('<')) return segment
            let result = segment
            if (breakSlashes) result = result.replaceAll('/', '/<wbr>')
            if (breakHyphens) result = result.replaceAll('-', '-<wbr>')
            return result
          })
          .join('')
      if (breakableDepth > 0) {
        return breakSlashes ? part.replaceAll('/', '/<wbr>') : part
      }
      if (preserveAllWords) {
        return addDelimiterBreaks(
          part.replace(
            /[\p{L}\p{N}]+(?:[.,'\u2019\-\u2010-\u2015][\p{L}\p{N}]+)*/gu,
            '<span class="whole-word">$&</span>',
          ),
        )
      }
      if (preserveHyphenatedWords) {
        return addDelimiterBreaks(
          part.replace(
            /(?<![\p{L}\p{N}])\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![\p{L}\p{N}])|[\p{L}\p{N}]+(?:[-\u2010-\u2015][\p{L}\p{N}]+)+/gu,
            '<span class="whole-word">$&</span>',
          ),
        )
      }
      return addDelimiterBreaks(
        part.replace(
          /(?<![\p{L}\p{N}])\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![\p{L}\p{N}])/gu,
          '<span class="whole-word">$&</span>',
        ),
      )
    })
    .join('')
}

function headingText(value) {
  const document = fromMarkdown(`# ${value}\n`)
  return toString(document.children.find((node) => node.type === 'heading')).trim()
}

function splitNumber(text) {
  const match = text.match(/^(\d+(?:\.\d+)*\.?)\s+(.*)$/)
  if (!match) return { index: '', label: text }
  return { index: match[1].replace(/\.$/, ''), label: match[2] }
}

const isTableSeparator = (line) => /^\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(line)
const isTableRow = (line) => /^\|.*\|\s*$/.test(line)

function tableCells(line) {
  const value = line.replace(/^\|/, '').replace(/\|\s*$/, '')
  const cells = []
  let cell = ''
  let inCode = false

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    const next = value[index + 1]
    if (character === '\\' && (next === '|' || next === '\\')) {
      cell += next
      index += 1
    } else if (character === '`') {
      inCode = !inCode
      cell += character
    } else if (character === '|' && !inCode) {
      cells.push(cell.trim())
      cell = ''
    } else {
      cell += character
    }
  }
  cells.push(cell.trim())
  return cells
}

const ID_HEADERS =
  /^(#|no\.?|id|ids|seq|sequence|slice|slices|unit|units|phase|phases|code|codes|ref|key|count|total)$/i

function plainText(cell) {
  return cell
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

function isCompactCell(cell, requireDigit = true) {
  const text = plainText(cell)
  if (!text) return true
  if (text.length > 24 || (requireDigit && !/\d/.test(text))) return false
  return /^[A-Za-z0-9.\-\u2013\u2014/+,()\u00b7:_@\s]+$/.test(text)
}

function idColumns(header, rows) {
  return header.map((title, column) => {
    const values = rows.map((row) => row[column] ?? '').filter((cell) => plainText(cell))
    if (!values.length) return false
    const declaredCompact = ID_HEADERS.test(plainText(title))
    if (!declaredCompact && values.some((cell) => /\s/u.test(plainText(cell)))) return false
    if (!values.every((cell) => isCompactCell(cell, !declaredCompact))) return false
    return declaredCompact || values.length >= 2
  })
}

function compactProseColumns(header, rows) {
  return header.map((title, column) => {
    if (ID_HEADERS.test(plainText(title))) return false
    const values = rows.map((row) => row[column] ?? '').filter((cell) => plainText(cell))
    return (
      values.length >= 2 &&
      values.some((cell) => /\s/u.test(plainText(cell))) &&
      values.every((cell) => isCompactCell(cell))
    )
  })
}

function isCompactSliceRoute(cell) {
  const text = plainText(cell)
  if (!/\bT\d+(?:\.\d+)?\b/u.test(text)) return false
  return (
    text
      .replace(/\bT\d+(?:\.\d+)?\b/gu, '')
      .replace(/\b(?:and|with|plus|then|first|thereafter)\b/giu, '')
      .replace(/[\s/.,;:()\u2013\u2014-]+/gu, '') === ''
  )
}

function sliceRouteColumns(header, rows) {
  return header.map((title, column) => {
    if (plainText(title).toLowerCase() !== 'likely owner if later promoted') return false
    const values = rows.map((row) => row[column] ?? '').filter((cell) => plainText(cell))
    return values.length > 0 && values.every(isCompactSliceRoute)
  })
}

function alignments(separator) {
  return tableCells(separator).map((cell) => {
    const left = cell.startsWith(':')
    const right = cell.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    return 'left'
  })
}

function compiledMermaidFigure(target, label) {
  if (!target.startsWith('roadmap-and-archi-assets/') || !target.endsWith('.svg')) return null
  const asset = path.join(mermaidAssetRoot, path.basename(target))
  if (path.dirname(asset) !== mermaidAssetRoot) throw new Error(`Unsafe Mermaid asset: ${target}`)
  const svg = requireRegularAsset(asset)
  if (!/^<svg\b/u.test(svg.trim()) || rawMarkupLoadsContent(svg)) throw new Error(`Unsafe compiled Mermaid SVG: ${target}`)
  return `<figure class="mermaid-diagram" aria-label="${escapeHtml(label)}">${svg.trim()}<figcaption>${escapeHtml(label)}</figcaption></figure>`
}

function requireRegularAsset(file) {
  const stat = lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Expected a regular Mermaid asset: ${file}`)
  return readFileSync(file, 'utf8')
}

function markdownToHtml(markdown, { wrapWideContent = false } = {}) {
  const lines = markdown.split(/\r?\n/)
  const output = []
  const toc = []
  let inCode = false
  let list = null
  let section = false
  let subsection = false
  let seenTitle = false
  let titleId = null
  let index = 0
  const headingIds = new GithubSlugger()

  const headingId = (text) => {
    return headingIds.slug(headingText(text))
  }

  const closeList = () => {
    if (list) output.push(`</${list}>`)
    list = null
  }
  const closeSubsection = () => {
    if (subsection) output.push('</div>')
    subsection = false
  }
  const closeSection = () => {
    closeSubsection()
    if (section) output.push('</section>')
    section = false
  }

  while (index < lines.length) {
    const line = lines[index]

    const machineMetadataFence = /^```(peer-system|roadmap-review)$/u.exec(line.trim())
    if (machineMetadataFence) {
      closeList()
      let closed = false
      index += 1
      while (index < lines.length && lines[index].trim() !== '```') index += 1
      if (index < lines.length) {
        closed = true
        index += 1
      }
      if (!closed) throw new Error(`Unclosed ${machineMetadataFence[1]} metadata block`)
      continue
    }

    const image = /^!\[([^\]]+)\]\(([^)]+)\)\s*$/u.exec(line)
    if (image) {
      closeList()
      const figure = compiledMermaidFigure(image[2], image[1])
      if (!figure) throw new Error(`Unsupported retrospective image; use inline-safe Mermaid: ${image[2]}`)
      output.push(figure)
      index += 1
      continue
    }

    if (line.startsWith('```mermaid')) {
      closeList()
      const source = []
      let closed = false
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) {
        source.push(escapeHtml(lines[index]))
        index += 1
      }
      if (index < lines.length) {
        closed = true
        index += 1
      }
      if (!closed) throw new Error('Unclosed Mermaid block')
      output.push(
        '<details class="mermaid-source"><summary>Mermaid source</summary>' +
          `<pre><code>${source.join('\n')}\n</code></pre></details>`,
      )
      continue
    }

    if (line.startsWith('```')) {
      closeList()
      inCode = !inCode
      output.push(inCode ? '<pre><code>' : '</code></pre>')
      index += 1
      continue
    }
    if (inCode) {
      output.push(`${escapeHtml(line)}\n`)
      index += 1
      continue
    }

    if (/^<(figure|svg|details|div)\b/i.test(line.trim())) {
      closeList()
      const tag = line.trim().match(/^<([a-z]+)/i)?.[1]?.toLowerCase()
      const raw = []
      let closed = false
      while (index < lines.length) {
        raw.push(lines[index])
        if (tag && new RegExp(`</${tag}>`, 'i').test(lines[index])) {
          closed = true
          index += 1
          break
        }
        index += 1
      }
      if (!closed) throw new Error(`Unclosed raw HTML block: ${tag}`)
      const rawHtml = raw.join('\n')
      if (
        /<(script|iframe|object|embed|link|meta|base|style|form|input|button|select|textarea|video|audio|source|track|img|picture|foreignObject|animate|animateMotion|animateTransform|set)\b/i.test(rawHtml) ||
        /\son[a-z]+\s*=/i.test(rawHtml) ||
        rawMarkupLoadsContent(rawHtml)
      ) {
        throw new Error(`Unsafe raw HTML block: ${tag}`)
      }
      output.push(rawHtml)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      const text = heading[2]

      let nextContentIndex = index + 1
      while (nextContentIndex < lines.length && !lines[nextContentIndex].trim()) {
        nextContentIndex += 1
      }
      if (
        level === 2 &&
        /^(?:\d+(?:\.\d+)*\.\s+)?Semantic parity index$/iu.test(text.trim()) &&
        lines[nextContentIndex]?.trim() === '```roadmap-review'
      ) {
        index += 1
        continue
      }

      if (level === 1 && !seenTitle) {
        seenTitle = true
        titleId = headingId(text)
        index += 1
        continue
      }
      const id = headingId(text)
      if (level === 2) {
        closeSection()
        section = true
        toc.push({ level, id, ...splitNumber(text) })
        output.push(`<section class="report-section" id="${id}-section">`)
        output.push(`<h2 id="${id}">${inline(text)}</h2>`)
        index += 1
        continue
      }
      if (level === 3) {
        closeSubsection()
        if (!section) {
          section = true
          output.push('<section class="report-section">')
        }
        subsection = true
        toc.push({ level, id, ...splitNumber(text) })
        output.push('<div class="report-subsection">')
        output.push(`<h3 id="${id}">${inline(text)}</h3>`)
        index += 1
        continue
      }
      output.push(`<h${level} id="${id}">${inline(text)}</h${level}>`)
      index += 1
      continue
    }

    if (isTableRow(line) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      closeList()
      const header = tableCells(line)
      const alignment = alignments(lines[index + 1])
      if (alignment.length !== header.length) {
        throw new Error('Table header and separator column counts differ')
      }
      index += 2
      const rows = []
      while (index < lines.length && isTableRow(lines[index]) && !isTableSeparator(lines[index])) {
        const row = tableCells(lines[index])
        if (row.length !== header.length) {
          throw new Error('Table row column count differs from its header')
        }
        rows.push(row)
        index += 1
      }
      const isSectionRow = (row) =>
        row[0].startsWith('**') &&
        row[0].endsWith('**') &&
        plainText(row[0]) !== '' &&
        row.slice(1).every((cell) => plainText(cell) === '')
      const dataRows = rows.filter((row) => !isSectionRow(row))
      const ids = idColumns(header, dataRows)
      const compactProse = compactProseColumns(header, dataRows)
      const sliceRoutes = sliceRouteColumns(header, dataRows)
      const renderTableInline = (cell, column, options) =>
        sliceRoutes[column] ? inline(cell) : tableInline(cell, options)
      const cellClass = (column) =>
        `align-${alignment[column] ?? 'left'}${ids[column] && !sliceRoutes[column] ? ' nowrap' : ''}${sliceRoutes[column] ? ' slice-route' : ''}`
      const tableClasses = []
      if (header.length >= 9) tableClasses.push('dense', 'denser')
      else if (header.length >= 6) tableClasses.push('dense')
      tableClasses.push(`columns-${header.length}`)
      if (header.length === 2) tableClasses.push('two-column')
      if (ids[0]) tableClasses.push('id-first')
      const tableProfile = tableClasses.length ? ` class="${tableClasses.join(' ')}"` : ''
      output.push('<div class="table-wrap">')
      output.push(`<table${tableProfile}>`)
      output.push('<thead>')
      output.push(
        `<tr>${header
          .map(
            (cell, column) =>
              `<th class="${cellClass(column)}">${renderTableInline(cell, column, {
                preserveHyphenatedWords: true,
              })}</th>`,
          )
          .join('')}</tr>`,
      )
      output.push('</thead><tbody>')
      for (const row of rows) {
        if (isSectionRow(row)) {
          output.push(
            `<tr class="table-section-row"><th scope="colgroup" colspan="${header.length}">` +
              `${renderTableInline(row[0], 0, {
                breakHyphens: true,
                breakSlashes: true,
              })}</th></tr>`,
          )
          continue
        }
        output.push(
          `<tr>${row
            .map(
              (cell, column) =>
                `<td class="${cellClass(column)}">${renderTableInline(cell, column, {
                  breakHyphens: !(compactProse[column] || ids[column]),
                  breakSlashes: !(column === 0 && ids[column]),
                  preserveAllWords: compactProse[column] || ids[column],
                })}</td>`,
            )
            .join('')}</tr>`,
        )
      }
      output.push('</tbody></table></div>')
      continue
    }

    if (/^>\s?/.test(line)) {
      closeList()
      const paragraphs = []
      let paragraph = []
      while (index < lines.length) {
        const match = lines[index].match(/^>\s?(.*)$/)
        if (!match) break
        if (match[1].trim()) paragraph.push(match[1].trim())
        else if (paragraph.length) {
          paragraphs.push(paragraph.join(' '))
          paragraph = []
        }
        index += 1
      }
      if (paragraph.length) paragraphs.push(paragraph.join(' '))
      output.push(
        `<blockquote>${paragraphs.map((value) => `<p>${inline(value)}</p>`).join('')}</blockquote>`,
      )
      continue
    }

    const bullet = line.match(/^[-*]\s+(.+)$/)
    const ordered = line.match(/^\d+\.\s+(.+)$/)
    if (bullet || ordered) {
      const wanted = bullet ? 'ul' : 'ol'
      if (list !== wanted) {
        closeList()
        list = wanted
        output.push(`<${list}>`)
      }
      const item = [(bullet || ordered)[1].trim()]
      index += 1
      while (
        index < lines.length &&
        /^\s{2,}\S/.test(lines[index]) &&
        !/^\s*([-*]|\d+\.)\s/.test(lines[index])
      ) {
        item.push(lines[index].trim())
        index += 1
      }
      output.push(`<li>${inline(item.join(' '))}</li>`)
      continue
    }

    closeList()
    if (!line.trim()) {
      index += 1
      continue
    }

    const paragraph = []
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6}\s|>|```|\||[-*]\s|\d+\.\s|<)/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    if (paragraph.length) {
      output.push(`<p>${inline(paragraph.join(' '))}</p>`)
      continue
    }
    output.push(`<p>${inline(line.trim())}</p>`)
    index += 1
  }

  closeList()
  closeSection()
  if (inCode) throw new Error('Unclosed fenced code block')
  return { body: output.join('\n'), toc, titleId }
}

function tocMarkup(toc) {
  if (!toc.length) return ''
  const output = []
  let group = false
  let children = false
  const link = (entry) =>
    `<a class="toc-link toc-level-${entry.level === 2 ? 1 : 2}-link" href="#${entry.id}">` +
    `<span class="toc-index">${escapeHtml(entry.index)}</span>` +
    `<span class="toc-label">${inline(entry.label)}</span></a>`

  for (const entry of toc) {
    if (entry.level === 2) {
      if (children) {
        output.push('</ol>')
        children = false
      }
      if (group) output.push('</li>')
      output.push('<li class="toc-group">', link(entry))
      group = true
    } else {
      if (!group) {
        output.push(`<li class="toc-group">${link(entry)}</li>`)
        continue
      }
      if (!children) {
        output.push('<ol class="toc-level toc-level-2">')
        children = true
      }
      output.push(`<li>${link(entry)}</li>`)
    }
  }
  if (children) output.push('</ol>')
  if (group) output.push('</li>')
  return `<ol class="toc-level toc-level-1">\n${output.join('\n')}\n</ol>`
}

const STYLE = `
:root {
  color-scheme: light;
  --ink: #202428; --muted: #626a70; --line: #d8dddf; --soft: #f4f6f5;
  --paper: #fff; --teal: #0f766e; --teal-dark: #0a5c56;
  --green-soft: #e9f5ef; --coral: #c4513f; --gold: #8a6408; --gold-soft: #fbf5dd;
}
* { box-sizing: border-box; }
html { max-width: 100%; overflow-x: clip; scroll-behavior: smooth; scroll-padding-top: 24px; }
body {
  margin: 0; max-width: 100%; overflow-x: clip; background: var(--paper); color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  font-size: 24px; line-height: 1.62;
}
a { color: var(--teal-dark); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { color: var(--coral); }
.skip-link {
  position: fixed; top: 8px; left: 8px; z-index: 20; transform: translateY(-160%);
  padding: 8px 12px; background: var(--ink); color: #fff;
}
.skip-link:focus { transform: none; }
.report-header { border-bottom: 1px solid var(--line); background: var(--soft); }
.report-header-inner { max-width: 1240px; margin: 0 auto; padding: 46px 28px 34px; }
.eyebrow { margin: 0 0 10px; font-size: 18px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.report-header h1 { margin: 0; font-size: 51px; line-height: 1.18; }
.header-meta { margin: 14px 0 0; color: var(--muted); font-size: 21px; }
.report-layout {
  display: grid; grid-template-columns: 250px minmax(0, 900px); gap: 54px;
  max-width: 1240px; margin: 0 auto; padding: 42px 28px 80px;
}
.report-layout.no-toc { grid-template-columns: minmax(0, 1fr); }
.desktop-toc {
  align-self: start; position: sticky; top: 24px; max-height: calc(100vh - 48px);
  overflow-y: auto; padding-right: 8px;
}
.desktop-toc h2 { margin: 0 0 14px; font-size: 22.5px; }
.toc-toggle {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 6px 12px; border: 1px solid var(--line); border-radius: 5px;
  background: var(--paper); color: var(--teal-dark); font: inherit; font-size: 19.5px; cursor: pointer;
}
.toc-toggle::before { content: "◀"; font-size: 10px; }
body[data-toc="collapsed"] .toc-toggle::before { content: "▶"; }
body[data-toc="collapsed"] .desktop-toc { display: none; }
body[data-toc="collapsed"] .report-layout { grid-template-columns: minmax(0, 1fr); gap: 0; }
.desktop-toc ol { margin: 0; padding: 0; list-style: none; }
.desktop-toc li { margin: 0; border-top: 1px solid var(--line); }
.desktop-toc a {
  display: grid; grid-template-columns: 30px 1fr; gap: 7px;
  border-left: 3px solid transparent; padding: 8px 8px 8px 12px;
  color: var(--muted); font-size: 19.5px; line-height: 1.28; text-decoration: none;
}
.desktop-toc .toc-level-2-link { padding-left: 22px; font-size: 18.75px; }
.desktop-toc a[aria-current="location"] {
  border-left-color: var(--coral); background: #eef6f4; color: var(--teal-dark); font-weight: 750;
}
.toc-index { color: var(--teal); font-variant-numeric: tabular-nums; }
.mobile-toc { display: none; }
main { min-width: 0; }
main > section { scroll-margin-top: 24px; margin-top: 70px; }
main > section:first-child { margin-top: 0; }
main > section > h2 {
  margin: 0 0 22px; padding-bottom: 10px; border-bottom: 3px solid var(--teal);
  font-size: 45px; line-height: 1.2;
}
h3 { scroll-margin-top: 24px; margin: 40px 0 14px; color: var(--teal-dark); font-size: 31.5px; line-height: 1.28; }
h4 { margin: 28px 0 10px; font-size: 24px; }
p { margin: 14px 0; }
ul, ol { margin: 14px 0; padding-left: 24px; }
li { margin: 6px 0; }
code {
  background: var(--soft); padding: 1px 5px; border-radius: 3px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .88em;
  overflow-wrap: anywhere;
}
pre {
  max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere;
  word-break: normal; overflow-x: auto; background: var(--soft);
  border: 1px solid var(--line); padding: 16px; border-radius: 6px;
}
pre code { background: none; padding: 0; white-space: inherit; overflow-wrap: inherit; }
blockquote { margin: 22px 0; padding: 14px 18px; background: var(--gold-soft); border-left: 4px solid var(--gold); color: #4a3a10; }
blockquote p:first-child { margin-top: 0; }
blockquote p:last-child { margin-bottom: 0; }
.table-wrap { max-width: 100%; min-width: 0; overflow-x: auto; contain: inline-size; margin: 24px 0 28px; }
table { width: 100%; max-width: 100%; table-layout: auto; margin: 0; border-collapse: collapse; font-size: 21px; }
th, td {
  padding: 9px 11px; border: 1px solid var(--line); text-align: left; vertical-align: top;
  overflow-wrap: normal; word-break: normal; hyphens: none;
}
.whole-word { white-space: nowrap; }
table.id-first th:first-child,
table.id-first td:first-child {
  white-space: nowrap; overflow-wrap: normal; word-break: normal;
}
td.slice-route {
  white-space: nowrap; overflow-wrap: normal; word-break: normal;
}
table.dense { font-size: 19.5px; }
table.dense th, table.dense td { padding: 6px 8px; }
table.denser { font-size: 18.75px; }
table.denser th, table.denser td { padding: 5px 6px; }
th.nowrap {
  white-space: normal; overflow-wrap: normal; word-break: normal; hyphens: none;
}
td.nowrap {
  white-space: normal; overflow-wrap: anywhere; word-break: break-word; hyphens: none;
}
th.nowrap code, td.nowrap code,
th a, td a, th code, td code {
  white-space: normal; overflow-wrap: anywhere; word-break: break-word;
}
table.id-first th:first-child a,
table.id-first th:first-child code,
table.id-first td:first-child a,
table.id-first td:first-child code {
  white-space: nowrap; overflow-wrap: normal; word-break: normal;
}
th { background: #e8efec; color: #1e302d; }
tbody tr:nth-child(even) { background: #f8f9f8; }
tr.table-section-row th {
  background: var(--green-soft); color: var(--teal-dark); text-align: left;
  font-size: 22.5px; border-top: 3px solid var(--teal);
}
table.id-first tr.table-section-row th,
table.id-first tr.table-section-row th a,
table.id-first tr.table-section-row th code {
  white-space: normal;
}
.align-right { text-align: right; }
.align-center { text-align: center; }
figure {
  margin: 24px 0 28px; padding: 20px; background: var(--soft);
  border: 1px solid var(--line); border-radius: 6px; overflow-x: clip;
}
figure svg { display: block; width: auto; max-width: 100%; height: auto; margin: 0 auto; }
figcaption { margin-top: 12px; color: var(--muted); font-size: 19.5px; text-align: center; }
.mermaid-source { margin: 0 0 28px; font-size: 21px; }
.mermaid-source summary { cursor: pointer; color: var(--muted); }
.mermaid-source pre { margin-top: 10px; }
.dg-box { fill: var(--paper); stroke: var(--line); }
.dg-accent { fill: var(--green-soft); stroke: var(--teal); }
.dg-gate { fill: var(--gold-soft); stroke: var(--gold); stroke-dasharray: 4 3; }
.dg-label { fill: var(--ink); font: 600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
.dg-sub { fill: var(--teal); font: 10px ui-monospace, SFMono-Regular, Menlo, monospace; }
.dg-line { stroke: var(--muted); fill: none; }
.report-footer { border-top: 1px solid var(--line); background: var(--soft); }
.report-footer-inner { max-width: 1240px; margin: 0 auto; padding: 24px 28px; color: var(--muted); font-size: 21px; }
@media (max-width: 980px) {
  .report-header-inner { padding: 36px 20px 28px; }
  .report-header h1 { font-size: 40.5px; }
  .report-layout { display: block; padding: 30px 20px 64px; }
  .desktop-toc, .toc-toggle { display: none; }
  .mobile-toc {
    display: block; margin: 0 0 34px; padding: 16px 18px;
    background: var(--soft); border: 1px solid var(--line); border-radius: 6px;
  }
  .mobile-toc h2 { margin: 0 0 10px; font-size: 21px; }
  .mobile-toc ol { margin: 0; padding: 0; list-style: none; }
  .mobile-toc .toc-level-2 { display: none; }
  .mobile-toc li { border-top: 1px solid var(--line); }
  .mobile-toc a {
    display: grid; grid-template-columns: 30px 1fr; gap: 6px;
    padding: 7px 2px; color: var(--muted); font-size: 19.5px; text-decoration: none;
  }
  main > section { margin-top: 52px; }
  main > section > h2 { font-size: 37.5px; }
}
`

const WRAP_WIDE_CONTENT_MARKER =
  '<div data-retro-layout="wrap-wide-content" hidden></div>'

const WRAP_WIDE_CONTENT_STYLE = `
/* Opt-in profile for unusually wide evidence documents. */
@media (min-width: 981px) {
  .report-layout {
    max-width: 1280px;
    grid-template-columns: 230px minmax(0, 1015px);
    gap: 5px;
    padding-left: 15px;
    padding-right: 15px;
  }
  body[data-toc="collapsed"] .report-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
}
.table-wrap { overflow-x: clip; }
table.dense, table.denser { font-size: 21px; }
table.dense th, table.dense td { padding: 5px 6px; }
table.dense:has(th:nth-child(8)) { line-height: 1.45; }
table.dense:has(th:nth-child(8)) th,
table.dense:has(th:nth-child(8)) td { padding: 5px 2px; }
.desktop-toc a, .mobile-toc a {
  grid-template-columns: minmax(5ch, max-content) minmax(0, 1fr);
}
.desktop-toc .toc-level-2-link { font-size: 17.25px; }
.toc-index { white-space: nowrap; }
.toc-label { min-width: 0; overflow-wrap: normal; word-break: normal; }
`

function usesWrapWideContent(markdown) {
  return markdown
    .split(/\r?\n/u)
    .some((line) => line.trim() === WRAP_WIDE_CONTENT_MARKER)
}

const SCRIPT = `
(() => {
  const headings = [...document.querySelectorAll('#report > .report-section > h2[id], #report .report-subsection > h3[id]')]
  const toc = document.querySelector('.desktop-toc')
  const links = [...document.querySelectorAll('.desktop-toc a[href^="#"], .mobile-toc a[href^="#"]')]
  if (!headings.length || !links.length) return
  let activeId = ''
  let pending = false

  const update = () => {
    pending = false
    let nextId = headings[0].id
    const readingLine = Math.min(160, Math.max(96, window.innerHeight * 0.2))
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      nextId = headings[headings.length - 1].id
    } else {
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > readingLine) break
        nextId = heading.id
      }
    }
    if (nextId === activeId) return
    activeId = nextId
    for (const link of links) {
      const matches = link.getAttribute('href') === '#' + activeId
      if (matches) {
        link.setAttribute('aria-current', 'location')
        if (toc && toc.contains(link)) link.scrollIntoView({ block: 'nearest' })
      } else link.removeAttribute('aria-current')
    }
  }
  const schedule = () => {
    if (pending) return
    pending = true
    requestAnimationFrame(update)
  }
  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule)
  update()

  const toggle = document.querySelector('.toc-toggle')
  if (!toggle) return
  const key = 'retro-toc-collapsed'
  const apply = (collapsed) => {
    document.body.dataset.toc = collapsed ? 'collapsed' : 'expanded'
    toggle.setAttribute('aria-expanded', String(!collapsed))
    toggle.textContent = collapsed ? 'Show contents' : 'Hide contents'
  }
  let stored = null
  try { stored = localStorage.getItem(key) } catch {}
  apply(stored === '1')
  toggle.addEventListener('click', () => {
    const collapsed = document.body.dataset.toc !== 'collapsed'
    apply(collapsed)
    try { localStorage.setItem(key, collapsed ? '1' : '0') } catch {}
    schedule()
  })
})()
`

function argument(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function readRegularNoFollow(file, { missing = false } = {}) {
  let before
  try {
    before = await lstat(file)
  } catch (error) {
    if (missing && error?.code === 'ENOENT') return ''
    throw error
  }
  if (!before.isFile() || before.isSymbolicLink()) {
    throw new Error(`Expected a regular non-symlink file: ${file}`)
  }
  const handle = await open(
    file,
    fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0),
  )
  try {
    const opened = await handle.stat()
    if (
      !opened.isFile() ||
      opened.dev !== before.dev ||
      opened.ino !== before.ino
    ) {
      throw new Error(`File identity changed before read: ${file}`)
    }
    const text = await handle.readFile('utf8')
    const after = await lstat(file)
    if (after.dev !== opened.dev || after.ino !== opened.ino) {
      throw new Error(`File identity changed during read: ${file}`)
    }
    return text
  } finally {
    await handle.close()
  }
}

async function writeRegularAtomic(file, content) {
  try {
    const current = await lstat(file)
    if (!current.isFile() || current.isSymbolicLink()) {
      throw new Error(`Refusing to replace a non-regular or symlinked output: ${file}`)
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  const temporary = path.join(
    path.dirname(file),
    `.${path.basename(file)}.${randomUUID()}.tmp`,
  )
  const handle = await open(temporary, 'wx', 0o644)
  try {
    await handle.writeFile(content, 'utf8')
    await handle.close()
    await rename(temporary, file)
  } catch (error) {
    await handle.close().catch(() => {})
    await unlink(temporary).catch(() => {})
    throw error
  }
}

export function renderRetroDocument(markdown, { fallbackTitle = 'Retrospective' } = {}) {
const digest = createHash('sha256').update(markdown).digest('hex')
const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? fallbackTitle
const wrapWideContent = usesWrapWideContent(markdown)
const { body, toc, titleId } = markdownToHtml(markdown, { wrapWideContent })
const navigation = tocMarkup(toc)
const hasNavigation = Boolean(navigation)
const layoutStyle = wrapWideContent ? WRAP_WIDE_CONTENT_STYLE : ''
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="retro-source-sha256" content="${digest}">
  <title>${escapeHtml(title)}</title>
  <style>${STYLE}${layoutStyle}</style>
</head>
<body>
  <a class="skip-link" href="#report">Skip to report</a>
  <header class="report-header">
    <div class="report-header-inner">
      <p class="eyebrow">Derived review view</p>
      <h1 id="${escapeHtml(titleId ?? 'retrospective')}">${escapeHtml(title)}</h1>
      <p class="header-meta">Markdown controls this pair. sha256 <code>${digest}</code></p>
      ${
        hasNavigation
          ? '<button class="toc-toggle" type="button" aria-expanded="true" aria-controls="contents">Hide contents</button>'
          : ''
      }
    </div>
  </header>
  <div class="report-layout${hasNavigation ? '' : ' no-toc'}">
    ${
      hasNavigation
        ? `<nav class="desktop-toc" id="contents" aria-label="Contents">
      <h2>Contents</h2>
${navigation}
    </nav>`
        : ''
    }
    <main id="report">
      ${
        hasNavigation
          ? `<nav class="mobile-toc" aria-label="Contents">
        <h2>Contents</h2>
${navigation}
      </nav>`
          : ''
      }
${body}
    </main>
  </div>
  <footer class="report-footer">
    <div class="report-footer-inner">Derived from the Markdown source. Regenerate after every change.</div>
  </footer>
  <script>${SCRIPT}</script>
</body>
</html>
`

  return { digest, html }
}

export async function main() {
  const sourceArg = argument('--source')
  const outputArg = argument('--output')
  const check = process.argv.includes('--check')

  if (!sourceArg || !outputArg) {
    console.error('Usage: render-roadmap --source <file.md> --output <file.html> [--check]')
    process.exitCode = 2
    return
  }

  const source = path.resolve(sourceArg)
  const output = path.resolve(outputArg)
  if (
    path.extname(source) !== '.md' ||
    path.extname(output) !== '.html' ||
    path.dirname(source) !== path.dirname(output) ||
    path.basename(source, '.md') !== path.basename(output, '.html')
  ) {
    console.error('Source and output must be a same-directory, same-name .md/.html pair')
    process.exitCode = 2
    return
  }
  if (await realpath(path.dirname(source)) !== path.dirname(source)) {
    throw new Error('Retrospective pair directory must not traverse a symlink')
  }

  const markdown = await readRegularNoFollow(source)
  const { digest, html } = renderRetroDocument(markdown, {
    fallbackTitle: path.basename(source, '.md'),
  })

  if (check) {
    const current = await readRegularNoFollow(output, { missing: true })
    if (current !== html) {
      console.error(`Derived HTML is stale or missing: ${output}`)
      process.exitCode = 1
      return
    }
    console.log(`Retro pair valid: sha256:${digest}`)
  } else {
    await writeRegularAtomic(output, html)
    console.log(`Rendered ${output} from sha256:${digest}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main()
}
