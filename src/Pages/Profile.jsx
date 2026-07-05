import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Button,
  Divider,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem("settings")) || {};
  } catch {
    return {};
  }
}

function getReceipts() {
  try {
    return JSON.parse(localStorage.getItem("receipts")) || [];
  } catch {
    return [];
  }
}

export default function Profile() {
  const settings = getSettings();

  const receipts = getReceipts();

  const totalAmount = receipts.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0,
  );

  return (
    <Box>
      <Card
        sx={{
          borderRadius: 5,

          textAlign: "center",
        }}
      >
        <CardContent>
          <Avatar
            sx={{
              width: 90,

              height: 90,

              mx: "auto",

              mb: 2,
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" fontWeight={800}>
            {settings.ownerName || "Business Owner"}
          </Typography>

          <Typography color="text.secondary">Free Plan</Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          mt: 3,

          borderRadius: 4,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>
              <StoreIcon />
            </Avatar>

            <Box>
              <Typography fontWeight={700}>Business</Typography>

              <Typography color="text.secondary">
                {settings.businessName || "Not added"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Row name="Total Receipts" value={receipts.length} />

          <Row name="Total Income" value={`₹${totalAmount}`} />
        </CardContent>
      </Card>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<LogoutIcon />}
        sx={{
          mt: 3,

          borderRadius: 3,
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

function Row({ name, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" mb={1}>
      <Typography color="text.secondary">{name}</Typography>

      <Typography fontWeight={800}>{value}</Typography>
    </Stack>
  );
}
