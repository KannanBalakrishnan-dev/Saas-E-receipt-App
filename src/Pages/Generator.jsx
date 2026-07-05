import { useState, useMemo } from 'react';
import { Box, Stack, Button, Snackbar, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ReceiptForm from '../components/ReceiptForm';
import ReceiptPreview from '../components/ReceiptPreview';
import { createPDF } from '../utils/generatePDF';
import { shareOnWhatsApp } from '../utils/shareWhatsApp';

const EMPTY_FORM = {
  customerName: '',
  phone: '',
  workDetails: '',
  amount: '',
};

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('settings')) || {};
  } catch {
    return {};
  }
}

function getReceipts() {
  try {
    return JSON.parse(localStorage.getItem('receipts')) || [];
  } catch {
    return [];
  }
}

function nextReceiptNumber() {
  const count = getReceipts().length;
  return `RCPT-${String(count + 1).padStart(4, '0')}`;
}

export default function Generator() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const settings = useMemo(() => getSettings(), [snackbar]);
  const receiptNumber = useMemo(() => nextReceiptNumber(), [snackbar]);

  const previewReceipt = {
    ...form,
    receiptNumber,
    date: new Date().toISOString(),
  };

  const validate = () => {
    if (!form.customerName.trim() || !form.phone.trim() || !form.workDetails.trim() || !form.amount.toString().trim()) {
      setSnackbar({ open: true, message: 'Please fill in all fields.', severity: 'error' });
      return false;
    }
    if (Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid amount.', severity: 'error' });
      return false;
    }
    return true;
  };

  const saveToHistory = (receipt) => {
    const receipts = getReceipts();
    receipts.unshift(receipt);
    localStorage.setItem('receipts', JSON.stringify(receipts));
  };

  const handleDownload = () => {
    if (!validate()) return;

    const receipt = {
      ...form,
      receiptNumber: nextReceiptNumber(),
      date: new Date().toISOString(),
    };

    saveToHistory(receipt);
    createPDF(receipt, settings);

    setSnackbar({ open: true, message: 'Receipt downloaded and saved to history.', severity: 'success' });
    setForm(EMPTY_FORM);
  };

  const handleShare = () => {
    if (!validate()) return;

    const receipt = {
      ...form,
      receiptNumber,
      date: new Date().toISOString(),
    };

    shareOnWhatsApp(receipt, settings);
    setSnackbar({ open: true, message: 'Opening WhatsApp…', severity: 'success' });
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Stack spacing={3}>
        <ReceiptForm values={form} onChange={setForm} />

        <ReceiptPreview receipt={previewReceipt} settings={settings} />

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<WhatsAppIcon />}
            onClick={handleShare}
          >
            Share
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}