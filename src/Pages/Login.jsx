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

import LoginIcon from "@mui/icons-material/Login";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const login = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      setUser(user);
    } else {
      alert("Invalid login");
    }
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
              <LoginIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={800} textAlign="center">
              Login
            </Typography>

            <TextField
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" size="large" onClick={login}>
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
