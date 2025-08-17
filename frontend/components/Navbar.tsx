"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useCartStore, selectCartCount, selectCartTotal, type CartItem } from "../store/cartStore";

const pages = [
  { name: "Каталог", path: "/catalog" },
  { name: "Про нас", path: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false); 
  const cartCount = useCartStore(selectCartCount);
  const cartTotal = useCartStore(selectCartTotal);
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const handleToggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenCart = () => openCart();
  const handleCloseCart = () => closeCart();

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
         
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Krosifki
          </Typography>

       
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleToggleMobileMenu} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Krosifki
          </Typography>

         
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                href={page.path}
                color="inherit"
                sx={{ my: 2, display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

       
          <IconButton
            onClick={handleOpenCart}
            size="large"
            aria-label="кошик"
            color="inherit"
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>

      
      <Drawer anchor="left" open={mobileOpen} onClose={handleToggleMobileMenu}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleToggleMobileMenu}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Меню
          </Typography>
          <Divider />
          <List>
            {pages.map((page) => (
              <ListItem key={page.name} component={Link} href={page.path}>
                <ListItemText primary={page.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

     
      <Drawer anchor="right" open={isCartOpen} onClose={handleCloseCart}>
        <Box sx={{ width: { xs: "100%", sm: "100%" }, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Кошик
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ flex: 1 }}>
            {items.length === 0 ? (
              <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Кошик порожній
                </Typography>
              </Box>
            ) : (
              <List>
                {items.map((item: CartItem) => (
                  <ListItem key={item.id} disableGutters sx={{ alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.quantity} x ${item.price} грн`}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button size="small"
                        onClick={() => decrementItem(item.id)}
                        sx={{
                          minWidth: "auto",
                          padding: "2px 6px",
                          fontSize: "0.75rem",
                        }}>-</Button>
                      <Typography variant="body2" sx={{ width: 24, textAlign: "center" }}>{item.quantity}</Typography>
                      <Button size="small"
                        onClick={() => incrementItem(item.id)}
                        sx={{
                          minWidth: "auto",
                          padding: "2px 6px",
                          fontSize: "0.75rem",
                        }}>+</Button>
                    </Box>
                    <Button size="small" color="error" onClick={() => removeItem(item.id)} sx={{ ml: 1 }}>
                      Видалити
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

         
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle1">Всього:</Typography>
            <Typography variant="subtitle1" fontWeight={700}>{cartTotal} грн</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button fullWidth variant="outlined" onClick={handleCloseCart}>
              Продовжити покупки
            </Button>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              href="/cart"
              onClick={handleCloseCart}
            >
              Перейти в кошик
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
