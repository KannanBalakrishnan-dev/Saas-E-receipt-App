import { useState } from "react";

import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Fade,
  Paper,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import theme from "./theme";

import Generator from "./pages/Generator";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

const PAGES = [
  {
    label: "Home",
    icon: <DashboardIcon />,
    Component: Dashboard,
  },

  {
    label: "Create",
    icon: <ReceiptLongIcon />,
    Component: Generator,
  },

  {
    label: "History",
    icon: <HistoryIcon />,
    Component: History,
  },

  {
    label: "Customers",
    icon: <PeopleIcon />,
    Component: Customers,
  },

  {
    label: "Settings",
    icon: <SettingsIcon />,
    Component: Settings,
  },

  {
    label: "Profile",
    icon: <AccountCircleIcon />,
    Component: Profile,
  },
];

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [tab, setTab] = useState(0);

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Register setUser={setUser} />
      </ThemeProvider>
    );
  }

  const ActivePage = PAGES[tab].Component;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          height: "100dvh",

          display: "flex",

          flexDirection: "column",

          bgcolor: "background.default",

          overflow: "hidden",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            bgcolor: "primary.main",

            color: "#fff",

            borderBottomLeftRadius: 22,

            borderBottomRightRadius: 22,

            pt: "calc(env(safe-area-inset-top) + 20px)",

            pb: 2.5,

            px: 3,
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            e-Receipt
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Fast receipts, straight to WhatsApp
          </Typography>
        </Box>

        {/* CONTENT */}

        <Container
          maxWidth="sm"
          sx={{
            flex: 1,

            overflowY: "auto",

            pt: 3,

            pb: "140px",
          }}
        >
          <Fade key={tab} in timeout={250}>
            <Box>
              <ActivePage />
            </Box>
          </Fade>
        </Container>

        {/* Bottom Navbar */}

        <Paper
          elevation={5}
          sx={{
            position: "fixed",

            bottom: 0,

            left: 0,

            right: 0,

            borderTopLeftRadius: 20,

            borderTopRightRadius: 20,

            pb: "calc(env(safe-area-inset-bottom) + 8px)",

            zIndex: 2000,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons={false}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                minWidth: 90,

                minHeight: 70,

                fontSize: 12,

                textTransform: "none",
              },
            }}
          >
            {PAGES.map((page) => (
              <Tab key={page.label} icon={page.icon} label={page.label} />
            ))}
          </Tabs>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
