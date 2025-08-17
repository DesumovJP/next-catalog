"use client";

import * as React from "react";
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { fetchSneakers, Sneaker } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";


type CatalogClientProps = {
  initialSneakers: Sneaker[];
};

type SortKey = "default" | "priceAsc" | "priceDesc";

export default function CatalogClient({ initialSneakers }: CatalogClientProps) {
  const [sneakers, setSneakers] = React.useState<Sneaker[]>(initialSneakers);
  const [query, setQuery] = React.useState("");
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<SortKey>("default");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchSneakers();
      if (mounted && Array.isArray(data)) setSneakers(data);
    })();
    return () => {
      mounted = false;
    };
  }, []);


  const allBrands = React.useMemo(() => {
    const list = sneakers
      .map((s) => (s.brand || "").trim())
      .filter((b) => b.length > 0);
    return Array.from(new Set(list)).sort();
  }, [sneakers]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return sneakers.filter((s) => {
      const title = (s.title || "").toLowerCase();
      const brand = (s.brand || "").toLowerCase();
      const matchesQuery = q === "" || title.includes(q) || brand.includes(q);
      const matchesBrand =
        selectedBrands.length === 0 || (s.brand ? selectedBrands.includes(s.brand) : false);
      return matchesQuery && matchesBrand;
    });
  }, [query, selectedBrands, sneakers]);


  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "priceAsc":
        return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "priceDesc":
        return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        return arr;
    }
  }, [filtered, sortBy]);


  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleMobileBrandsChange = (
    e: React.ChangeEvent<{ value: unknown }> | any 
  ) => {
    const value = e.target.value as string[] | string;
    setSelectedBrands(Array.isArray(value) ? value : value ? value.split(",") : []);
  };

  const formatSizes = (sneaker: any) => {
    if (!Array.isArray(sneaker.sneaker) || sneaker.sneaker.length === 0) {
      return "Немає в наявності";
    }
    return sneaker.sneaker
      .map((s: any) => s.value)
      .sort((a: string, b: string) => Number(a) - Number(b))
      .join(", ");
  };

  console.log(sneakers)

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={3} alignItems="flex-start">
        
        <Grid
          size={{ xs: 12, md: 3 }}
          sx={{
            maxWidth: { md: 260 },
            flexShrink: 0,
          }}
        >
          {!isMobile && (
            <>
              <TextField
                fullWidth
                label="Пошук за назвою"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mb: 3 }}
              />
  
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Бренди
              </Typography>
              <FormGroup>
                {allBrands.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                    }
                    label={brand}
                  />
                ))}
              </FormGroup>
            </>
          )}
        </Grid>
  
        
        <Grid size={{ xs: 12, md: 9 }}>
          
          
          {isMobile && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Пошук за назвою"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                  <Select
                    multiple
                    value={selectedBrands}
                    onChange={handleMobileBrandsChange}
                    displayEmpty
                    renderValue={(selected) =>
                      (selected as string[]).length === 0
                        ? "Бренди"
                        : (selected as string[]).join(", ")
                    }
                  >
                    <MenuItem disabled value="">
                      Бренди
                    </MenuItem>
                    {allBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        <Checkbox checked={selectedBrands.includes(brand)} />
                        <Typography>{brand}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
  
                <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    displayEmpty
                  >
                    <MenuItem value="default">Сортування</MenuItem>
                    <MenuItem value="priceAsc">Ціна ↑</MenuItem>
                    <MenuItem value="priceDesc">Ціна ↓</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
  
          
          {!isMobile && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  displayEmpty
                >
                  <MenuItem value="default">Сортування</MenuItem>
                  <MenuItem value="priceAsc">Ціна ↑</MenuItem>
                  <MenuItem value="priceDesc">Ціна ↓</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
  
          
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {sorted.map((sneaker) => {
              const rawUrl = sneaker.image?.url ?? "";
              const src = rawUrl.startsWith("http")
                ? rawUrl
                : rawUrl
                ? `http://localhost:1337${rawUrl}`
                : "";
  
              return (
                <Grid
                  key={sneaker.documentId}
                  size={{ xs: 12, sm: 6, md: 4 }}
                  display="flex"
                >
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      overflow: "hidden",
                      maxHeight: { xs: 405, sm: 405, md: 450 },
                    }}
                  >
                   
                      <Box
                        sx={{
                          flex: "0 0 50%",                
                          maxHeight: "50%",              
                          minHeight: "50%",               
                          backgroundColor: "#f7f7f7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {src ? (
                          <Box
                            component="img"
                            src={src}
                            alt={sneaker.title ?? "Кросівки"}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: "center", p: 2 }}
                          >
                            Немає зображення
                          </Typography>
                        )}
                      </Box>

  
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        p:2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {sneaker.title}
                      </Typography>
                      <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Бренд: {sneaker.brand}
                        </Typography>
                                              
                     
                      {Array.isArray(sneaker.sneaker) && sneaker.sneaker.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                        Розміри в наявності: {formatSizes(sneaker)}
                      </Typography>
                      )}
  
                          <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, mt: "auto", fontSize: "1.2rem" }} // ~24px
                        >
                          {sneaker.price} ₴
                        </Typography>
                    </CardContent>
  
                    <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ textTransform: "uppercase" }}
                      component={Link}
                      href={`/catalog/${encodeURIComponent(sneaker.documentId)}`}
                    >
                      Детальніше
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
                            id: sneaker.documentId,
                            name: sneaker.title ?? "Кросівки",
                            price: sneaker.price,
                          });
                          openCart();
                        }}
                      >
                        В кошик
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
  