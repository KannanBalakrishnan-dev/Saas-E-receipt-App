function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function buildMessage(receipt, settings) {
  const date = receipt.date ? new Date(receipt.date) : new Date();
  const receiptNumber = receipt.receiptNumber || 'RCPT-0001';
  const amount = Number(receipt.amount || 0).toLocaleString('en-IN');

  const lines = [
    settings.businessName || 'Your Business Name',
    `Receipt No: ${receiptNumber}`,
    `Date: ${formatDate(date)}`,
    '',
    `Customer: ${receipt.customerName || '-'}`,
    `Work: ${receipt.workDetails || '-'}`,
    `Amount: ₹${amount}`,
    '',
    'Thank you for choosing our service',
  ];

  return lines.join('\n');
}

/**
 * Opens WhatsApp with a pre-filled message.
 * If the receipt has a valid 10-digit Indian phone number, opens a direct
 * chat with that contact. Otherwise falls back to the generic share picker.
 */
export function shareOnWhatsApp(receipt, settings) {
  const message = buildMessage(receipt, settings);
  const encodedMessage = encodeURIComponent(message);

  const digitsOnly = (receipt.phone || '').replace(/\D/g, '');
  const isTenDigit = digitsOnly.length === 10;

  const url = isTenDigit
    ? `https://wa.me/91${digitsOnly}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}