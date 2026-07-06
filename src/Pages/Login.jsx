import { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Login
 * Two-step real mobile OTP flow using Firebase Phone Auth:
 *   1) Enter phone number -> Firebase sends a real SMS OTP.
 *   2) Enter the 6-digit code -> Firebase verifies it and signs the user in.
 *
 * On success, calls onLoginSuccess() so the parent (App.jsx) can flip into
 * the authenticated app shell. Firebase persists the session in the browser
 * automatically, so a refresh stays logged in until sign-out.
 */
export default function Login({ onLoginSuccess }) {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  const ensureRecaptcha = () => {
    // Firebase requires an invisible reCAPTCHA to prove a real browser is
    // sending the request (spam/abuse prevention). It renders invisibly
    // into the div below — no UI change for the user in normal cases.
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        { size: "invisible" }
      );
    }
    return recaptchaVerifierRef.current;
  };

  const normalizePhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    // Assume India (+91) for a 10-digit number; otherwise trust what's typed
    // (allows entering a full international number with country code).
    if (digits.length === 10) return `+91${digits}`;
    if (raw.trim().startsWith("+")) return raw.trim();
    return `+${digits}`;
  };

  const handleSendOtp = async () => {
    setError("");
    const formatted = normalizePhone(phone);
    if (!/^\+\d{10,15}$/.test(formatted)) {
      setError("Enter a valid mobile number.");
      return;
    }

    setLoading(true);
    try {
      const verifier = ensureRecaptcha();
      const result = await signInWithPhoneNumber(auth, formatted, verifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      console.error("OTP send failed:", err);
      setError(
        err?.code === "auth/invalid-phone-number"
          ? "That phone number looks invalid."
          : err?.code === "auth/too-many-requests"
          ? "Too many attempts. Please wait a bit and try again."
          : "Could not send OTP. Please try again."
      );
      // Reset the reCAPTCHA widget so a retry doesn't reuse a spent token.
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      onLoginSuccess?.();
    } catch (err) {
      console.error("OTP verify failed:", err);
      setError(
        err?.code === "auth/invalid-verification-code"
          ? "That code is incorrect."
          : err?.code === "auth/code-expired"
          ? "That code expired. Please request a new one."
          : "Could not verify the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep("phone");
    setOtp("");
    setConfirmationResult(null);
    setError("");
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
      {/* Invisible reCAPTCHA mount point — required by Firebase, renders nothing visible */}
      <div ref={recaptchaContainerRef} />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 380,
          p: 3.5,
          borderRadius: 4,
          border: "1px solid #E2E8F0",
        }}
      >
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Daddy e-Receipt
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step === "phone"
            ? "Sign in with your mobile number"
            : `Enter the code sent to ${normalizePhone(phone)}`}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === "phone" ? (
          <>
            <TextField
              fullWidth
              label="Mobile Number"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputProps={{ inputMode: "tel", maxLength: 15 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />
            <Button
              id="send-otp-button"
              fullWidth
              size="large"
              variant="contained"
              disabled={loading || !phone}
              onClick={handleSendOtp}
              sx={{ py: 1.4, borderRadius: 3 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="6-digit OTP"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputProps={{ inputMode: "numeric", maxLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={loading || otp.length !== 6}
              onClick={handleVerifyOtp}
              sx={{ py: 1.4, borderRadius: 3, mb: 1.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Verify & Sign In"}
            </Button>
            <Button fullWidth variant="text" onClick={handleChangeNumber} disabled={loading}>
              Use a different number
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}