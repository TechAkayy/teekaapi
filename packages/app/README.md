# The Teekaapi site

The website of Teekaapi, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). The [site brief](../../README.md) owns the design; the [roadmap](../../plans/roadmap.md) owns the order of delivery.

The output is a static site in `dist/`. It has no server and stores nothing.

## Commands

Use a Node version of the range in the root `package.json`; the root `.nvmrc` names one. Run the commands from the root of the repository.

```sh
pnpm install                    # install the workspace
pnpm --dir packages/app dev     # development server
pnpm --dir packages/app build   # build the site to packages/app/dist
pnpm --dir packages/app preview # serve the built site
pnpm --dir packages/app check   # type and template check
pnpm --dir packages/app test    # build, then run the browser tests
```

## Browser tests

The tests in `tests/` run the built site in Chromium through [Playwright](https://playwright.dev), at a phone, a tablet and a desktop width. Download the browser once on each machine:

```sh
pnpm --dir packages/app exec playwright install chromium
```

The tests start their own preview server on port 4329 and stop it at the end.

## Notes on the toolchain

- The type check uses TypeScript 6, because `astro check` does not support TypeScript 7.
- `pnpm-workspace.yaml` lists `wasm32` under `supportedArchitectures`, because the type check runs a WebAssembly module and pnpm skips its runtime without that entry.
