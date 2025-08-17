// app/catalog/[productId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Card,
  CardContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { fetchSneakers, Sneaker } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    if (!productId) return;
    fetchSneakers().then((items) => {
      const found = items.find((s) => s.documentId === productId);
      setProduct(found ?? null);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Завантаження...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Товар не знайдено</Typography>
        <Button variant="outlined" component={Link} href="/catalog" sx={{ mt: 2 }}>
          ⟵ Повернутися
        </Button>
      </Container>
    );
  }

  const imgSrc =
    product.image?.url?.startsWith("http")
      ? product.image.url
      : product.image?.url
      ? `http://localhost:1337${product.image.url}`
      : "";

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card
        sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            border: "1px solid #ddd",
            borderRadius: 2,
            overflow: "hidden",
            width: "100%",
            minHeight: { xs: 500, md: 600 },
        }}
      >
        
        <Box
          sx={{
            flex: { md: "0 0 50%" },
            backgroundColor: "#f7f7f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: { xs: 280, md: 420 },
          }}
        >
          {imgSrc ? (
            <Box
              component="img"
              src={imgSrc}
              alt={product.title ?? product.name ?? "Кросівки"}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Немає зображення
            </Typography>
          )}
        </Box>

        
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {product.name ?? product.title}
          </Typography>

          {product.brand && (
            <Typography variant="body1" color="text.secondary">
              Бренд: {product.brand}
            </Typography>
          )}

          {Array.isArray(product.sneaker) && product.sneaker.length > 0 && (
            <Typography variant="body1" color="text.secondary">
              Розміри:{" "}
              {product.sneaker
                .map((s) => s.value)
                .sort((a, b) => Number(a) - Number(b))
                .join(", ")}
            </Typography>
          )}

          <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
            {product.price} ₴
          </Typography>

          <Typography
                variant="body1"
                sx={{
                    mt: 3,               
                    mb: 3,               
                    fontSize: "1.1rem",   
                    lineHeight: 1.6,      
                    fontWeight: 500,      
                    color: "text.primary" 
                }}
            >
                {product.description ?? "Опис відсутній"}
            </Typography>

          <Box sx={{ mt: "auto", display: "flex", gap: 2 }}>
            <Button variant="outlined" component={Link} href="/catalog">
              ⟵ До каталогу
            </Button>
            
            <Button
                        fullWidth
                        sx={{
                          backgroundColor: "#000",
                          color: "#fff",
                          textTransform: "uppercase",
                          "&:hover": { backgroundColor: "#333" },
                        }}
                        onClick={() => {
                          addItem({
                            id: product.documentId,
                            name: product.title ?? "Кросівки",
                            price: product.price,
                          });
                          openCart();
                        }}
                      >
                        В кошик
                      </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
