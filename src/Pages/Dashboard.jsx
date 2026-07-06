import { useMemo } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import GroupsIcon from "@mui/icons-material/Groups";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

function getReceipts() {
  try {
    return JSON.parse(localStorage.getItem("receipts")) || [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const receipts = useMemo(() => getReceipts(), []);

  const totalAmount = receipts.reduce(
    (sum, item) => sum + Number(item.amount || 0),

    0,
  );

  const customers = new Set(receipts.map((r) => r.phone)).size;

  const today = new Date().toDateString();

  const todayAmount = receipts
    .filter((r) => new Date(r.date).toDateString() === today)
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const cards = [
    {
      title: "Today Income",
      value: `₹${todayAmount}`,
      icon: <CurrencyRupeeIcon />,
    },

    {
      title: "Total Receipts",
      value: receipts.length,
      icon: <ReceiptLongIcon />,
    },

    {
      title: "Customers",
      value: customers,
      icon: <GroupsIcon />,
    },

    {
      title: "Pending",
      value: "₹0",
      icon: <PendingActionsIcon />,
    },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 1,
        }}
      >
        Dashboard 📊
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        Business overview
      </Typography>

      <Grid container spacing={2}>
        {cards.map((item) => (
          <Grid item xs={6} key={item.title}>
            <Card
              sx={{
                borderRadius: 4,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{item.icon}</Avatar>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.title}
                    </Typography>

                    <Typography variant="h6" fontWeight={800}>
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          mt: 3,

          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography fontWeight={700} mb={2}>
            Monthly Target
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total income: ₹{totalAmount}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={70}
            sx={{
              height: 10,

              borderRadius: 5,
            }}
          />

          <Typography mt={1} variant="body2" color="text.secondary">
            70% completed
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          mt: 3,

          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography fontWeight={700} mb={1}>
            Recent Receipts
          </Typography>

          {receipts.slice(0, 5).map((r) => (
            <Box
              key={r.receiptNumber}
              sx={{
                py: 1,

                borderBottom: "1px solid #eee",
              }}
            >
              <Typography fontWeight={600}>{r.customerName}</Typography>

              <Typography variant="body2" color="text.secondary">
                {r.receiptNumber} • ₹{r.amount}
              </Typography>
            </Box>
          ))}

          {receipts.length === 0 && (
            <Typography color="text.secondary">No receipts yet</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
