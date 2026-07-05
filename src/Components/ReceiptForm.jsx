import { Stack, TextField, InputAdornment } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

/**
 * Pure controlled form for entering receipt details.
 * Validation (blocking submit) lives in Generator.jsx, not here.
 */
export default function ReceiptForm({ values, onChange }) {
  const handleField = (field) => (e) => {
    onChange({ ...values, [field]: e.target.value });
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Customer Name"
        placeholder="e.g. Ramesh Kumar"
        value={values.customerName}
        onChange={handleField('customerName')}
        required
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Phone Number"
        placeholder="e.g. 9876543210"
        value={values.phone}
        onChange={handleField('phone')}
        required
        fullWidth
        inputMode="tel"
        inputProps={{ maxLength: 15 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIphoneIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Work Details"
        placeholder="e.g. AC gas refill and service"
        value={values.workDetails}
        onChange={handleField('workDetails')}
        required
        fullWidth
        multiline
        minRows={3}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
              <BuildOutlinedIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Amount"
        placeholder="e.g. 500"
        value={values.amount}
        onChange={handleField('amount')}
        required
        fullWidth
        inputMode="decimal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CurrencyRupeeIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}