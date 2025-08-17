"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, Typography, Container, Box } from "@mui/material";

const SEGMENT_LABELS: Record<string, string> = {
  catalog: "Каталог",
  about: "Про нас",
  contact: "Контакти",
  cart: "Кошик",
};

function toLabel(segment: string, prevSegment?: string): string {
  if (prevSegment === "catalog" && /^\d+$/.test(segment)) {
    return `Товар ${segment}`;
  }
  return SEGMENT_LABELS[segment] ?? decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BreadcrumbsBar(): React.JSX.Element {
  const pathname = usePathname();
  const segments = React.useMemo(() => pathname.split("/").filter(Boolean), [pathname]);

  const crumbs = React.useMemo(() => {
    const acc: { href: string; label: string }[] = [];
    let href = "";
    segments.forEach((seg, idx) => {
      href += `/${seg}`;
      acc.push({ href, label: toLabel(seg, segments[idx - 1]) });
    });
    return acc;
  }, [segments]);


  return (
    <Box sx={{ py: 1 }}>
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" style={{ textDecoration: "none" }}>Головна</Link>
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return isLast ? (
              <Typography key={c.href} color="text.primary">{c.label}</Typography>
            ) : (
              <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
                {c.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Container>
    </Box>
  );
}


