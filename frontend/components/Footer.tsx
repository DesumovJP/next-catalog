"use client";


import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 12,
        backgroundColor: "#111111",
        color: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="inherit" align="center">
          {"© "} {new Date().getFullYear()} Krosifki. Всі права захищені.
        </Typography>
        <Typography variant="body2" color="inherit" align="center" mt={1}>
          <Link href="/privacy-policy" color="inherit" underline="hover">
            Політика конфіденційності
          </Link>{" "}
          |{" "}
          <Link href="/terms" color="inherit" underline="hover">
            Умови користування
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}