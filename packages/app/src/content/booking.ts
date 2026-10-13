// Sample choices for a local preview; these are not confirmed cafe services.
export const booking = {
  flourish: 'Make a little plan',
  heading: 'Order / Book preview',
  line: 'Try the steps for a pickup or a table reservation. Services and availability are still to be confirmed.',
  notice: 'Preview only. Nothing is sent or saved. This is not a booking or an order.',
  fallback: 'Turn on JavaScript to try the preview. Nothing can be sent from this page.',
  timeNote: 'Times are shown for Melbourne. This preview does not check opening hours or availability.',
  sample: true,
};

export const services = [
  { value: 'pickup', label: 'Pickup', description: 'A sample pickup flow. No food is ordered.', sample: true },
  { value: 'dine-in', label: 'Dine-in reservation', description: 'A sample table request. No table is reserved.', sample: true },
] as const;

export const errors = {
  date: 'Choose a date.',
  pastDate: 'Choose today or a later date in Melbourne.',
  time: 'Choose a time.',
  service: 'Choose a service.',
};
