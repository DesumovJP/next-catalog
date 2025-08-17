const BASE_URL = "http://localhost:1337/graphql";

export type Sneaker = {
  documentId: string;
  title?: string;
  name?: string;
  brand?: string;
  price: number;
  description?: string;
  image?: { url: string };

  // Нове поле для масиву розмірів
  sneaker?: { value: string; size: number }[];
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: any;
};

const SIMPLE_QUERY = `
  query Sneakers {
    sneakers {
      documentId
      brand
      name
      price
      description
      image {
        url
      }
      sneaker {
        value
        size
      }
    }
  }
`;

const STRAPI_V4_QUERY = `
  query SneakersV4 {
    sneakers {
      data {
        id
        attributes {
          documentId
          brand
          name
          price
          description
          image {
            data {
              attributes {
                url
              }
            }
          }
          sneaker {
            value
            size
          }
        }
      }
    }
  }
`;

function pickImageUrl(img: any): string | undefined {
  if (!img) return undefined;

  if (Array.isArray(img)) {
    const first = img[0];
    if (!first) return undefined;
    return first?.url ?? first?.attributes?.url;
  }

  if (img.url) return img.url;

  const data = img.data;
  if (!data) return undefined;

  if (Array.isArray(data)) {
    return data[0]?.attributes?.url;
  }

  return data?.attributes?.url;
}

function normalizeSimpleItem(item: any, index: number): Sneaker {
  const url = pickImageUrl(item.image);
  const priceNum =
    typeof item.price === "number" ? item.price : Number(item.price ?? 0);

  return {
    documentId: String(item.documentId ?? item.id ?? index),
    title: item.name || "Кросівки",
    name: item.name || "Кросівки",
    brand: item.brand ?? undefined,
    description: item.description ?? undefined,
    price: Number.isFinite(priceNum) ? priceNum : 0,
    image: url ? { url } : undefined,
    sneaker: Array.isArray(item.sneaker) ? item.sneaker : [],
  };
}

function normalizeV4Item(node: any, index: number): Sneaker {
  const id = node.id ?? index;
  const a = node.attributes ?? {};
  const url = pickImageUrl(a.image);
  const priceNum =
    typeof a.price === "number" ? a.price : Number(a.price ?? 0);

  return {
    documentId: String(a.documentId ?? id),
    title: a.name || "Кросівки",
    name: a.name || "Кросівки",
    brand: a.brand ?? undefined,
    description: a.description ?? undefined,
    price: Number.isFinite(priceNum) ? priceNum : 0,
    image: url ? { url } : undefined,
    sneaker: Array.isArray(a.sneaker) ? a.sneaker : [],
  };
}

async function postQuery<T>(query: string): Promise<GraphQLResponse<T>> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export async function fetchSneakers(): Promise<Sneaker[]> {
  try {
    
    const simple = await postQuery<{ sneakers?: any[] }>(SIMPLE_QUERY);

    if (simple.data?.sneakers && Array.isArray(simple.data.sneakers)) {
      return simple.data.sneakers.map(normalizeSimpleItem);
    }

    // Fallback to Strapi v4 GraphQL shape
    const v4 = await postQuery<{ sneakers?: { data?: any[] } }>(
      STRAPI_V4_QUERY
    );

    if (v4.data?.sneakers?.data && Array.isArray(v4.data.sneakers.data)) {
      return v4.data.sneakers.data.map(normalizeV4Item);
    }

    return [];
  } catch (error) {
    console.error("Error fetching sneakers:", error);
    return [];
  }
}
