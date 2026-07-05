import { Box, Paper, Stack, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function formatAmount(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Read-only live preview that mirrors the PDF layout.
 * Props:
 *  - receipt: { customerName, phone, workDetails, amount, receiptNumber?, date? }
 *  - settings: { businessName, ownerName, phone, address, upiId }
 */
export default function ReceiptPreview({ receipt, settings }) {
  const theme = useTheme();
  const receiptNumber = receipt.receiptNumber || 'RCPT-0001';
  const date = receipt.date ? new Date(receipt.date) : new Date();

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
          {settings.businessName || 'Your Business Name'}
        </Typography>
        {settings.ownerName && (
          <Typography variant="body2" color="text.secondary">
            {settings.ownerName}
          </Typography>
        )}
        {settings.phone && (
          <Typography variant="body2" color="text.secondary">
            {settings.phone}
          </Typography>
        )}
        {settings.address && (
          <Typography variant="body2" color="text.secondary">
            {settings.address}
          </Typography>
        )}
      </Box>

      <Box sx={{ bgcolor: theme.palette.primary.main, py: 1, px: 2.5 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: '#fff', letterSpacing: 1, fontWeight: 700 }}
        >
          SERVICE RECEIPT
        </Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Receipt No: <strong>{receiptNumber}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(date)}
          </Typography>
        </Stack>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Customer:</strong> {receipt.customerName || '—'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Phone:</strong> {receipt.phone || '—'}
          </Typography>
        </Stack>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Work Details
          </Typography>
          <Typography variant="body1">{receipt.workDetails || '—'}</Typography>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">Total Amount</Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
            {formatAmount(receipt.amount)}
          </Typography>
        </Stack>

        {settings.upiId && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            UPI ID: {settings.upiId}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, fontStyle: 'italic', textAlign: 'center' }}
        >
          Thank you for choosing our service
        </Typography>
      </Box>
    </Paper>
  );
}