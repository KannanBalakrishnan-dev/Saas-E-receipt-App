import { useState, useEffect } from 'react';
import { Box, Stack, TextField, Button, Snackbar, Alert, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const EMPTY_SETTINGS = {
  businessName: '',
  ownerName: '',
  phone: '',
  address: '',
  upiId: '',
};

export default function Settings() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('settings'));
      if (stored) setSettings({ ...EMPTY_SETTINGS, ...stored });
    } catch {
      // ignore malformed data
    }
  }, []);

  const handleField = (field) => (e) => {
    setSettings((s) => ({ ...s, [field]: e.target.value }));
  };

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    setSnackbar({ open: true, message: 'Settings saved.', severity: 'success' });
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Business Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This information appears on every PDF receipt and WhatsApp message.
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Business Name"
          placeholder="e.g. Kumar AC Services"
          value={settings.businessName}
          onChange={handleField('businessName')}
          fullWidth
        />
        <TextField
          label="Owner Name"
          placeholder="e.g. Ramesh Kumar"
          value={settings.ownerName}
          onChange={handleField('ownerName')}
          fullWidth
        />
        <TextField
          label="Phone"
          placeholder="e.g. 9876543210"
          value={settings.phone}
          onChange={handleField('phone')}
          fullWidth
          inputMode="tel"
        />
        <TextField
          label="Address"
          placeholder="e.g. 12 Gandhi Road, Coimbatore"
          value={settings.address}
          onChange={handleField('address')}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="UPI ID"
          placeholder="e.g. ramesh@upi"
          value={settings.upiId}
          onChange={handleField('upiId')}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
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