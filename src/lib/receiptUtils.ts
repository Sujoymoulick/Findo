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
    // Check for partial matches too
    for (const [key, category] of Object.entries(mapping)) {
      if (lowercaseTag.includes(key)) return category;
    }
  }
  return 'Other';
};

export const parseOCRReceipt = (text: string) => {
  console.log('Raw OCR Text:', text);
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  console.log('OCR Lines:', lines);
  let amount = '';
  let merchant = lines[0] || ''; 
  let date = new Date().toISOString().split('T')[0];
  let transactionId = '';

  // Regex patterns
  const amountRegex = /(?:₹|rs\.?|inr)?\s*([0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?)/i;
  const dateRegex = /(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}\s[A-Za-z]+\s\d{4})/;
  const txnRegex = /(?:transaction id|txn id|ref no|rrn)[:\s]*([A-Z0-9]+)/i;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Merchant detection: skip generic headers, look for "Paid to" or "To"
    if (lowerLine.startsWith('paid to') || lowerLine.startsWith('to:')) {
      const parts = line.split(/to:? /i);
      if (parts[1]) {
        merchant = parts[1].trim();
      } else {
        // Use next line if available
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine && !amountRegex.test(nextLine)) {
          merchant = nextLine;
        }
      }
    }

    // Look for Total or Amount keyword
    if (lowerLine.includes('total') || lowerLine.includes('net') || lowerLine.includes('amount') || lowerLine.includes('paid') || lowerLine.includes('₹')) {
      const match = line.match(amountRegex);
      if (match && match[1]) {
          const val = match[1].replace(/,/g, '');
          if (!amount || Number(val) > Number(amount)) {
            amount = val;
          }
      }
    }
    
    // Look for date
    if (!date || date === new Date().toISOString().split('T')[0]) {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            date = dateMatch[0];
        }
    }

    // Look for transaction id
    if (!transactionId) {
        const txnMatch = line.match(txnRegex);
        if (txnMatch && txnMatch[1]) {
            transactionId = txnMatch[1];
        }
    }
  }

  // Fallback: If no amount found with keyword, look for any number that looks like an amount
  if (!amount) {
    const allAmounts = text.match(/(?:₹|rs\.?|inr)?\s*([0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?)/gi);
    if (allAmounts) {
      const numbers = allAmounts.map(a => {
        const m = a.match(/([0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?)/);
        return m ? Number(m[0].replace(/,/g, '')) : 0;
      });
      const maxAmount = Math.max(...numbers);
      if (maxAmount > 0) amount = maxAmount.toString();
    }
  }

  // Refine Merchant: Skip generic headers, allow shorter names (especially for regional text)
  const skipKeywords = ['transfer', 'details', 'transaction', 'transaction id', 'paid to', 'payment', 'success', 'history', 'phonepe', 'gpay', 'google pay', 'paytm'];
  if (skipKeywords.some(k => merchant.toLowerCase().includes(k))) {
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      const isGeneric = skipKeywords.some(k => lowerLine.includes(k));
      const looksLikeLabel = lowerLine.endsWith(':') || lowerLine.length < 2;
      
      if (!isGeneric && !looksLikeLabel && !amountRegex.test(line) && !dateRegex.test(line)) {
        merchant = line;
        break;
      }
    }
  }

  return { amount, merchant, date };
};
