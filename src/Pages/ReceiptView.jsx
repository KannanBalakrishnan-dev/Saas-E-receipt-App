import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { createPDF } from "../utils/generatePDF";
import { shareOnWhatsApp } from "../utils/shareWhatsApp";

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem("settings")) || {};
  } catch {
    return {};
  }
}

export default function ReceiptView({ receipt }) {
  const settings = getSettings();

  if (!receipt) {
    return <Typography>No receipt selected</Typography>;
  }

  return (
    <Box>
      <Card
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={800} textAlign="center">
            {settings.businessName || "e-Receipt"}
          </Typography>

          <Typography textAlign="center" color="text.secondary">
            {receipt.receiptNumber}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>
            <Row title="Customer" value={receipt.customerName} />

            <Row title="Phone" value={receipt.phone} />

            <Row title="Work" value={receipt.workDetails} />

            <Row
              title="Date"
              value={new Date(receipt.date).toLocaleDateString()}
            />

            <Divider />

            <Typography variant="h4" fontWeight={900} textAlign="center">
              ₹{receipt.amount}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={() => createPDF(receipt, settings)}
            >
              PDF
            </Button>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => shareOnWhatsApp(receipt, settings)}
            >
              Share
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function Row({ title, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{title}</Typography>

      <Typography fontWeight={700}>{value}</Typography>
    </Stack>
  );
}
