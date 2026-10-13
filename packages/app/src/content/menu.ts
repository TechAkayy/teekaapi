// The menu of the menu page.
// Every category, group, item, price and dietary mark here is sample content: `sample: true`
// means that the cafe has not confirmed it. No page prints the field. The cafe replaces all of it.

export type DietaryMark = 'V' | 'VG' | 'GF' | 'S';

export const dietaryKey: { mark: DietaryMark; meaning: string }[] = [
  { mark: 'V', meaning: 'Vegetarian' },
  { mark: 'VG', meaning: 'Vegan' },
  { mark: 'GF', meaning: 'Gluten free' },
  { mark: 'S', meaning: 'Spicy' },
];

export interface MenuItem {
  name: string;
  description: string;
  // In Australian dollars.
  price: number;
  marks: DietaryMark[];
  sample: boolean;
}

export interface MenuGroup {
  name: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  name: string;
  line: string;
  groups: MenuGroup[];
  sample: boolean;
}

const item = (name: string, description: string, price: number, marks: DietaryMark[] = []): MenuItem => ({
  name,
  description,
  price,
  marks,
  sample: true,
});

export const special = {
  label: 'Today’s Special',
  ...item('Ghee Roast Dosa Waffle', 'A crisp dosa-batter waffle with ghee, podi and coconut chutney.', 16, ['V', 'GF']),
};

export const categories: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    line: 'Pulled, dripped and frothed to order.',
    sample: true,
    groups: [
      {
        name: 'Classics',
        items: [
          item('Espresso', 'A short, syrupy double shot.', 4, ['VG', 'GF']),
          item('Flat White', 'Double shot with silky steamed milk.', 5, ['V', 'GF']),
          item('Long Black', 'Double shot over hot water.', 4.5, ['VG', 'GF']),
          item('Cappuccino', 'Foam, chocolate dust and a double shot.', 5, ['V', 'GF']),
        ],
      },
      {
        name: 'House Signatures',
        items: [
          item('Filter Kaapi', 'Slow-dripped decoction with hot frothed milk, served in a tumbler.', 5.5, ['V', 'GF']),
          item('Jaggery Flat White', 'A flat white rounded out with dark jaggery.', 6, ['V', 'GF']),
          item('Masala Latte', 'Espresso with cinnamon, star anise and steamed milk.', 6, ['V', 'GF']),
        ],
      },
    ],
  },
  {
    id: 'cold',
    name: 'Cold Brew & Specials',
    line: 'For warm days and second rounds.',
    sample: true,
    groups: [
      {
        name: 'Cold Brew',
        items: [
          item('Classic Cold Brew', 'Steeped overnight, poured over ice.', 6, ['VG', 'GF']),
          item('Iced Kaapi', 'Cold decoction over ice with a slow pour of milk.', 6.5, ['V', 'GF']),
          item('Coconut Cold Brew', 'Cold brew with coconut water and lime.', 7, ['VG', 'GF']),
        ],
      },
      {
        name: 'Specials',
        items: [
          item('Rose Cardamom Iced Latte', 'Rose syrup, cardamom, espresso and milk over ice.', 7.5, ['V', 'GF']),
          item('Tamarind Tonic', 'Espresso over tonic with a tamarind twist.', 7.5, ['VG', 'GF']),
        ],
      },
    ],
  },
  {
    id: 'bites',
    name: 'Fusion Bites',
    line: 'South Indian classics, borrowed and bent a little.',
    sample: true,
    groups: [
      {
        name: 'Small Plates',
        items: [
          item('Podi Fries', 'Hot chips tossed in gunpowder spice and ghee.', 11, ['V', 'GF', 'S']),
          item('Masala Dosa Toastie', 'Spiced potato and cheese, pressed until crisp.', 14, ['V']),
          item('Medu Vada Bites', 'Crisp lentil doughnuts with coconut chutney.', 12, ['VG', 'GF']),
        ],
      },
      {
        name: 'Bigger Plates',
        items: [
          item('Chilli Cheese Uttapam', 'A thick rice pancake with green chilli and melted cheese.', 18, ['V', 'GF', 'S']),
          item('Curry Leaf Chicken Bao', 'Fried chicken, curry leaf mayo and a soft steamed bun.', 19, ['S']),
          item('Sambar Shakshuka', 'Eggs baked in sambar, with toasted sourdough.', 21, ['V']),
        ],
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    line: 'Something sweet with the last sip.',
    sample: true,
    groups: [
      {
        name: 'Sweet Plates',
        items: [
          item('Filter Kaapi Tiramisu', 'Decoction-soaked sponge with mascarpone.', 13, ['V']),
          item('Payasam Panna Cotta', 'Set cream with cardamom, cashew and raisin.', 12, ['V', 'GF']),
        ],
      },
      {
        name: 'Scoops',
        items: [
          item('Mint Kulfi', 'Dense, slow-frozen milk ice with fresh mint.', 8, ['V', 'GF']),
          item('Jaggery Coconut Sorbet', 'Coconut milk, dark jaggery and a pinch of salt.', 8, ['VG', 'GF']),
        ],
      },
    ],
  },
];

export const formatPrice = (price: number): string => `$${Number.isInteger(price) ? price : price.toFixed(2)}`;
