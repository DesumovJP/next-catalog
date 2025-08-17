"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";
import { useCartStore } from "../store/cartStore";

type ProductCardProps = {
  price: number;
  image?: { url: string };
  documentId?: string;
  title?: string;
};

export default function ProductCard({ price, image, documentId, title }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const imageUrl = image?.url ? 
    (image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`) : 
    '/default-image.svg';

  const handleAddToCart = () => {
    if (documentId && title) {
      addItem({ 
        id: parseInt(documentId) || 0, // Конвертуємо string в number
        name: title, 
        price: price 
      });
      openCart();
    }
  };

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col h-full">
      <Image
        src={imageUrl}
        alt={title || "Sneaker"}
        width={400}
        height={300}
        className="w-full h-48 object-cover mb-2"
        unoptimized 
        onError={(e) => {
          
          const target = e.target as HTMLImageElement;
          target.src = '/default-image.svg';
        }}
      />
      
      <div className="flex-grow">
        {title && (
          <Typography variant="h6" className="mb-2">
            {title}
          </Typography>
        )}
        <Typography variant="h6" className="font-semibold mb-4">
          {price} грн
        </Typography>
      </div>

      <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
        {documentId && (
          <Button
            component={Link}
            href={`/catalog/${documentId}`}
            variant="outlined"
            fullWidth
          >
            Детальніше
          </Button>
        )}
        {documentId && title && (
          <Button
            variant="contained"
            onClick={handleAddToCart}
            fullWidth
          >
            В кошик
          </Button>
        )}
      </Box>
    </div>
  );
}