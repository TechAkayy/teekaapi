// Confirmed cafe facts have not been supplied. Keep unknowns explicit.
export const visit = {
  flourish: 'Find your way',
  heading: 'Visit Us',
  line: 'The details for your next visit, as soon as they are confirmed.',
  sample: true,
};

export const facts: { label: string; value: string | null }[] = [
  { label: 'Address', value: null },
  { label: 'Opening hours', value: null },
  { label: 'Phone', value: null },
];

export const travelNotes: { label: string; value: string | null }[] = [
  { label: 'Parking', value: null },
  { label: 'Public transport', value: null },
  { label: 'Nearby landmarks', value: null },
];

export const unknownFact = 'To be confirmed';
export const unknownTravel = 'Details will be added when the location is confirmed.';
export const mapCaption = 'Illustrative map — location to be confirmed';
export const actionsNotice = 'These actions will be available when the cafe confirms its visit details.';
