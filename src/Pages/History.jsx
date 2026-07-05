import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { shareOnWhatsApp } from '../utils/shareWhatsApp';

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('settings')) || {};
  } catch {
    return {};
  }
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function History() {
  const [receipts, setReceipts] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const settings = useMemo(() => getSettings(), []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('receipts')) || [];
      setReceipts(stored);
    } catch {
      setReceipts([]);
    }
  }, []);

  const handleShareAgain = (receipt) => {
    shareOnWhatsApp(receipt, settings);
  };

  const confirmDelete = (receipt) => setPendingDelete(receipt);

  const handleDelete = () => {
    if (!pendingDelete) return;
    const updated = receipts.filter((r) => r !== pendingDelete);
    setReceipts(updated);
    localStorage.setItem('receipts', JSON.stringify(updated));
    setPendingDelete(null);
  };

  if (receipts.length === 0) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1.5}
        sx={{ py: 10, color: 'text.secondary' }}
      >
        <ReceiptLongOutlinedIcon sx={{ fontSize: 56, opacity: 0.5 }} />
        <Typography variant="subtitle1" color="text.primary">
          No receipts found
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: 260, textAlign: 'center' }}>
          Receipts you download will show up here for quick access and re-sharing.
        </Typography>
      </Stack>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {receipts.map((receipt, idx) => (
          <Card key={`${receipt.receiptNumber}-${idx}`} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2" color="primary.main">
                    {receipt.receiptNumber}
                  </Typography>
                  <Typography variant="subtitle1">{receipt.customerName}</Typography>
                </Stack>
                <IconButton
                  aria-label="delete receipt"
                  onClick={() => confirmDelete(receipt)}
                  size="small"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {receipt.workDetails}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {formatDate(receipt.date)}
                </Typography>
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 700 }}>
                  ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<WhatsAppIcon />}
                sx={{ mt: 1.5 }}
                onClick={() => handleShareAgain(receipt)}
              >
                Share Again
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete this receipt?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will remove {pendingDelete?.receiptNumber} for{' '}
            {pendingDelete?.customerName} from your history. This can't be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}