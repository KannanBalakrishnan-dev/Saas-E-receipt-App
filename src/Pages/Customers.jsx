import { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Avatar,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

function getReceipts() {
  try {
    return JSON.parse(localStorage.getItem("receipts")) || [];
  } catch {
    return [];
  }
}

export default function Customers() {
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    const receipts = getReceipts();

    const data = {};

    receipts.forEach((r) => {
      if (!data[r.phone]) {
        data[r.phone] = {
          name: r.customerName,

          phone: r.phone,

          count: 0,

          total: 0,
        };
      }

      data[r.phone].count += 1;

      data[r.phone].total += Number(r.amount || 0);
    });

    return Object.values(data);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name

        .toLowerCase()

        .includes(search.toLowerCase()) || c.phone.includes(search),
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} mb={2}>
        Customers 👥
      </Typography>

      <TextField
        fullWidth
        label="Search customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 3,
        }}
      />

      <Stack spacing={2}>
        {filtered.map((customer) => (
          <Card
            key={customer.phone}
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>
                  <PersonIcon />
                </Avatar>

                <Box flex={1}>
                  <Typography fontWeight={700}>{customer.name}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {customer.phone}
                  </Typography>

                  <Typography variant="body2">
                    Receipts : {customer.count}
                  </Typography>
                </Box>

                <Typography fontWeight={800}>₹{customer.total}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Typography textAlign="center" color="text.secondary">
            No customers found
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
