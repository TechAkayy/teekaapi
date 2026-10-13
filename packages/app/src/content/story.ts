// The words and the pictures of the story page.
// The narrative, the milestones and the captions are sample content: `sample: true` means that
// the cafe has not confirmed it. No page prints the field. A milestone carries no year and a
// portrait names no person; the cafe supplies both with its own story.
import type { ImageMetadata } from 'astro';
import storyHands from '../assets/images/story-hands.jpg';
import storyRoom from '../assets/images/story-room.jpg';
import storyTumbler from '../assets/images/story-tumbler.jpg';

export const intro = {
  flourish: 'How it started',
  heading: 'Our Story',
  line: 'Two cups, one question: tea or kaapi?',
  sample: true,
};

export const narrative: { heading: string; text: string; sample: boolean }[] = [
  {
    heading: 'Where it comes from',
    text: 'Teekaapi takes its name from the offer made in every South Indian home when a guest walks in: tea or coffee. The cafe starts from that welcome, and from the slow, strong filter coffee that goes with it.',
    sample: true,
  },
  {
    heading: 'Why Melbourne',
    text: 'Melbourne takes its coffee seriously and its brunch even more so. Teekaapi sits where the two habits meet: a tumbler of filter kaapi beside a flat white, on the same table.',
    sample: true,
  },
  {
    heading: 'How we cook and pour',
    text: 'The menu keeps the flavours and bends the forms. A dosa becomes a toastie, podi lands on hot chips, and jaggery rounds out an espresso. Nothing is fusion for its own sake; it has to taste like it always belonged.',
    sample: true,
  },
];

export type MilestoneIcon = 'bean' | 'pot' | 'store' | 'sparkle';

export interface Milestone {
  icon: MilestoneIcon;
  title: string;
  text: string;
  sample: boolean;
}

export const milestones: Milestone[] = [
  { icon: 'bean', title: 'The first decoction', text: 'A steel filter, a kitchen bench and a lot of tasting.', sample: true },
  { icon: 'pot', title: 'The test kitchen', text: 'Friends at the table, and the first dosa toastie.', sample: true },
  { icon: 'store', title: 'Doors open', text: 'A room of our own, with the coffee machine up front.', sample: true },
  { icon: 'sparkle', title: 'What comes next', text: 'New specials, late sessions and more reasons to stay.', sample: true },
];

export interface Portrait {
  image: ImageMetadata;
  alt: string;
  caption: string;
  // Where the square crop sits on the photograph.
  position: 'center' | 'top' | 'bottom';
  sample: boolean;
}

// Hands at work and the room. No portrait shows a person who can be recognised.
export const portraits: Portrait[] = [
  { image: storyHands, alt: 'A hand holds a cup while milk is poured into the coffee.', caption: 'Every cup poured by hand', position: 'center', sample: true },
  { image: storyTumbler, alt: 'A steel tumbler of filter coffee on a dark counter.', caption: 'The tumbler that started it', position: 'center', sample: true },
  { image: storyRoom, alt: 'Green vines hang from timber shelves over a bright wall.', caption: 'A room made for staying', position: 'top', sample: true },
];
