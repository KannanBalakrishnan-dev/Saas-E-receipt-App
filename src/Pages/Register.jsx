import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    password: "",
  });

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));

    setUser(form);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 5,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Avatar sx={{ mx: "auto" }}>
              <PersonAddIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={800} textAlign="center">
              Create Account
            </Typography>

            <TextField
              label="Owner Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <TextField
              label="Business Name"
              value={form.business}
              onChange={(e) =>
                setForm({
                  ...form,
                  business: e.target.value,
                })
              }
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <Button variant="contained" size="large" onClick={handleRegister}>
              Register
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
