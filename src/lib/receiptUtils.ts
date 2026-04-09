export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Health', 'Utilities', 'Rent', 'Entertainment', 'Education', 'Other'];

export const mapTagsToCategory = (tags: string[]): string => {
  const mapping: Record<string, string> = {
    'food': 'Food',
    'restaurant': 'Food',
    'cafe': 'Food',
    'fast food': 'Food',
    'dining': 'Food',
    'grocery': 'Shopping',
    'supermarket': 'Shopping',
    'mall': 'Shopping',
    'clothing': 'Shopping',
    'fashion': 'Shopping',
    'electronics': 'Shopping',
    'travel': 'Travel',
    'transport': 'Travel',
    'flight': 'Travel',
    'hotel': 'Travel',
    'taxi': 'Travel',
    'medicine': 'Health',
    'hospital': 'Health',
    'pharmacy': 'Health',
    'wellness': 'Health',
    'utility': 'Utilities',
    'electricity': 'Utilities',
    'water': 'Utilities',
    'internet': 'Utilities',
    'rent': 'Rent',
    'housing': 'Rent',
    'movie': 'Entertainment',
    'game': 'Entertainment',
    'concert': 'Entertainment',
    'book': 'Education',
    'school': 'Education',
    'course': 'Education'
  };

  for (const tag of tags) {
    const lowercaseTag = tag.toLowerCase();
    for (const [key, category] of Object.entries(mapping)) {
      if (lowercaseTag.includes(key)) return category;
    }
  }
  return 'Other';
};

