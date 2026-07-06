import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

/**
 * Register
 * Shown exactly once, right after a brand-new phone number completes OTP
 * verification in Login.jsx. Collects the business profile (the same shape
 * Settings.jsx edits later) and writes it to localStorage["settings"], then
 * marks this Firebase user as registered so future logins skip straight to
 * the main app.
 *
 * Props:
 *  - user: the Firebase user object (gives us the verified phone number)
 *  - onComplete(profile): called after saving, so App.jsx can flip into the
 *    authenticated app shell without requiring another login.
 */
const EMPTY_PROFILE = {
  businessName: "",
  ownerName: "",
  address: "",
  upiId: "",
};

export default function Register({ user, onComplete }) {
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [error, setError] = useState("");

  const handleField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.businessName.trim() || !form.ownerName.trim()) {
      setError("Business name and owner name are required.");
      return;
    }

    const profile = {
      ...form,
      phone: user?.phoneNumber || "",
    };

    localStorage.setItem("settings", JSON.stringify(profile));
    if (user?.uid) {
      localStorage.setItem(`registered_${user.uid}`, "1");
    }

    onComplete?.(profile);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 3.5,
          borderRadius: 4,
          border: "1px solid #E2E8F0",
        }}
      >
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Set up your business
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          One-time setup — this appears on every receipt you generate.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            required
            label="Business Name"
            placeholder="e.g. Kumar Electricals"
            value={form.businessName}
            onChange={handleField("businessName")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StoreIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            required
            label="Owner Name"
            placeholder="e.g. Ramesh Kumar"
            value={form.ownerName}
            onChange={handleField("ownerName")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Phone"
            value={user?.phoneNumber || ""}
            disabled
            helperText="Verified via OTP"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Address"
            placeholder="Shop address"
            value={form.address}
            onChange={handleField("address")}
            multiline
            minRows={2}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.2 }}>
                  <HomeIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="UPI ID"
            placeholder="example@upi"
            value={form.upiId}
            onChange={handleField("upiId")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 3, py: 1.4, borderRadius: 3 }}
        >
          Continue
        </Button>
      </Paper>
    </Box>
  );
}