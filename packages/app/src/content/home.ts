// The words and the pictures of the home page.
// An entry with `sample: true` is not a confirmed fact of the cafe. No page prints the field.
import type { ImageMetadata } from 'astro';
import drinkFilterKaapi from '../assets/images/drink-filter-kaapi.jpg';
import drinkFlatWhite from '../assets/images/drink-flat-white.jpg';
import drinkIcedCoffee from '../assets/images/drink-iced-coffee.jpg';
import drinkSpicedLatte from '../assets/images/drink-spiced-latte.jpg';
import foodDosa from '../assets/images/food-dosa.jpg';
import heroEspresso from '../assets/images/hero-espresso.jpg';
import socialBooth from '../assets/images/social-booth.jpg';
import socialDosaLeaf from '../assets/images/social-dosa-leaf.jpg';
import socialEspresso from '../assets/images/social-espresso.jpg';
import socialIced from '../assets/images/social-iced.jpg';
import socialLattes from '../assets/images/social-lattes.jpg';
import socialPour from '../assets/images/social-pour.jpg';

export const hero = {
  flourish: 'Melbourne brewed',
  headline: 'South Indian soul. Melbourne coffee.',
  line: 'Specialty coffee and fusion food, served with colour, craft and a little nostalgia.',
  cta: { label: 'View Menu', href: '/menu/' },
  image: heroEspresso,
  alt: 'Espresso runs from the machine into a cup.',
  sample: true,
};

export type HighlightIcon = 'coffee' | 'bowl' | 'flame' | 'pin';

export interface Highlight {
  icon: HighlightIcon;
  title: string;
  text: string;
  sample: boolean;
}

// The titles use only what the site brief states of the cafe: specialty coffee, fusion food,
// South Indian, Melbourne. The line under each title is sample text for the cafe to replace.
// A card for late hours or for an address waits until the cafe confirms it.
export const highlights: Highlight[] = [
  { icon: 'coffee', title: 'Specialty Coffee', text: 'The reason most people walk in.', sample: true },
  { icon: 'bowl', title: 'Fusion Bites', text: 'Familiar plates with an unexpected twist.', sample: true },
  { icon: 'flame', title: 'South Indian Roots', text: 'South Indian flavour, all through the menu.', sample: true },
  { icon: 'pin', title: 'Melbourne Made', text: 'A cafe for a city that loves its coffee.', sample: true },
];

export interface Drink {
  name: string;
  description: string;
  image: ImageMetadata;
  alt: string;
  chip?: 'New' | 'Seasonal';
  sample: boolean;
}

// Sample drinks, with sample chips. The cafe replaces them with its own.
export const drinks: Drink[] = [
  {
    name: 'Filter Kaapi',
    description: 'Slow-dripped decoction, hot frothed milk, served the old way.',
    image: drinkFilterKaapi,
    alt: 'Frothy filter coffee in a brass tumbler and bowl.',
    sample: true,
  },
  {
    name: 'Jaggery Flat White',
    description: 'A double shot rounded out with a spoon of dark jaggery.',
    image: drinkFlatWhite,
    alt: 'A flat white with latte art on a round wooden board.',
    chip: 'New',
    sample: true,
  },
  {
    name: 'Iced Kaapi',
    description: 'Cold decoction over ice with a slow pour of milk.',
    image: drinkIcedCoffee,
    alt: 'A tall glass of iced coffee with milk swirling through it.',
    chip: 'Seasonal',
    sample: true,
  },
  {
    name: 'Masala Latte',
    description: 'Espresso with cinnamon, star anise and steamed milk.',
    image: drinkSpicedLatte,
    alt: 'A latte dusted with cinnamon and topped with star anise.',
    sample: true,
  },
];

export interface Dish {
  name: string;
  description: string;
  tag: string;
  sample: boolean;
}

// Sample dishes, a sample introduction and sample tags. The cafe replaces them with its own.
// A tag names a kind of dish. It makes no dietary claim.
export const food = {
  flourish: 'Chef’s pick',
  heading: 'Fusion food',
  intro: 'South Indian classics, borrowed and bent a little.',
  sample: true,
  image: foodDosa,
  alt: 'A crisp dosa folded into a cone on a banana leaf, with chutneys beside it.',
  dishes: [
    { name: 'Masala Dosa Toastie', description: 'Spiced potato and cheese, pressed until crisp.', tag: 'Toastie', sample: true },
    { name: 'Podi Fries', description: 'Hot chips tossed in gunpowder spice and ghee.', tag: 'Sides', sample: true },
    { name: 'Chilli Cheese Uttapam', description: 'A thick rice pancake with green chilli and melted cheese.', tag: 'Griddle', sample: true },
    { name: 'Curry Leaf Chicken Bao', description: 'Fried chicken, curry leaf mayo and a soft steamed bun.', tag: 'Bao', sample: true },
  ] satisfies Dish[],
};

export interface Moment {
  image: ImageMetadata;
  alt: string;
  caption: string;
  sample: boolean;
}

// Sample captions over stand-in photographs. The cafe replaces both.
export const moments = {
  flourish: 'Come hang out',
  heading: 'Teekaapi moments',
  tiles: [
    { image: socialLattes, alt: 'Four lattes with latte art on a round tray.', caption: 'Round for the table', sample: true },
    { image: socialDosaLeaf, alt: 'A dosa with chutney and sambar on a banana leaf.', caption: 'Crisp and golden', sample: true },
    { image: socialPour, alt: 'Hands pour steamed milk into a glass of coffee.', caption: 'The pour', sample: true },
    { image: socialBooth, alt: 'A row of round tables beside a leather bench and a timber wall.', caption: 'A quiet corner', sample: true },
    { image: socialEspresso, alt: 'Two espresso shots run into small glasses.', caption: 'Double trouble', sample: true },
    { image: socialIced, alt: 'A tall glass of iced coffee.', caption: 'Over ice', sample: true },
  ] satisfies Moment[],
};
