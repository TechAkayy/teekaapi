// These photographs and captions are samples, not confirmed scenes at the cafe.
import type { ImageMetadata } from 'astro';
import espresso from '../assets/images/hero-espresso.jpg';
import kaapi from '../assets/images/drink-filter-kaapi.jpg';
import icedCoffee from '../assets/images/drink-iced-coffee.jpg';
import dosa from '../assets/images/food-dosa.jpg';
import dosaLeaf from '../assets/images/social-dosa-leaf.jpg';
import booth from '../assets/images/social-booth.jpg';
import room from '../assets/images/story-room.jpg';
import hands from '../assets/images/story-hands.jpg';
import pour from '../assets/images/social-pour.jpg';

export const categories = ['Coffee', 'Food', 'Space', 'People'] as const;

export interface GalleryPhoto {
  category: (typeof categories)[number];
  image: ImageMetadata;
  position: 'center' | 'top' | 'bottom';
  alt: string;
  title: string;
  description: string;
  sample: true;
}

export const gallery = {
  flourish: 'A little atmosphere',
  heading: 'Gallery',
  line: 'Coffee, food and moments around the table.',
  note: 'Sample photographs and captions — a taste of the atmosphere.',
  sample: true,
};

export const photos: GalleryPhoto[] = [
  { category: 'Coffee', image: espresso, position: 'center', alt: 'Espresso flows from a coffee machine.', title: 'The first pour', description: 'Espresso flows from the machine into a waiting cup.', sample: true },
  { category: 'Coffee', image: kaapi, position: 'center', alt: 'Frothy filter coffee in a brass tumbler and bowl.', title: 'Filter kaapi', description: 'A frothy tumbler with a little South Indian soul.', sample: true },
  { category: 'Coffee', image: icedCoffee, position: 'center', alt: 'A tall glass of iced coffee with milk swirling through it.', title: 'Over ice', description: 'Coffee and milk take the cool route.', sample: true },
  { category: 'Food', image: dosa, position: 'center', alt: 'A folded dosa on a banana leaf, with chutneys beside it.', title: 'Crisp and golden', description: 'A folded dosa with chutneys on the side.', sample: true },
  { category: 'Food', image: dosaLeaf, position: 'center', alt: 'A dosa with chutney and sambar on a banana leaf.', title: 'Around the leaf', description: 'Dosa, chutney and sambar, ready for the table.', sample: true },
  { category: 'Space', image: booth, position: 'center', alt: 'A row of round tables beside a leather bench and a timber wall.', title: 'A quiet corner', description: 'Round tables and a long bench invite a pause.', sample: true },
  { category: 'Space', image: room, position: 'top', alt: 'Green vines hang from timber shelves over a bright wall.', title: 'A little green', description: 'Green vines and timber bring warmth to the room.', sample: true },
  { category: 'People', image: hands, position: 'bottom', alt: 'A hand holds a cup of coffee under a pour of steamed milk.', title: 'Made by hand', description: 'A hand holds the cup for the next pour.', sample: true },
  { category: 'People', image: pour, position: 'center', alt: 'Hands pour steamed milk into a glass of coffee.', title: 'The finishing touch', description: 'Steamed milk meets coffee.', sample: true },
];
