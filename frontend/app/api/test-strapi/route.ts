import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    const results = {
      timestamp: new Date().toISOString(),
      strapiUrl: BASE_URL,
      tests: {}
    };

    // Тест базового API
    try {
      const baseRes = await fetch(`${BASE_URL}/api`);
      results.tests.baseApi = {
        status: baseRes.status,
        ok: baseRes.ok,
        data: baseRes.ok ? await baseRes.json() : null
      };
    } catch (error) {
      results.tests.baseApi = { error: error instanceof Error ? error.message : String(error) };
    }

    // Тест sneakers API
    try {
      const sneakersRes = await fetch(`${BASE_URL}/api/sneakers`);
      results.tests.sneakersApi = {
        status: sneakersRes.status,
        ok: sneakersRes.ok,
        data: sneakersRes.ok ? await sneakersRes.json() : null
      };
    } catch (error) {
      results.tests.sneakersApi = { error: error instanceof Error ? error.message : String(error) };
    }

    // Тест GraphQL
    try {
      const graphqlRes = await fetch(`${BASE_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "{ __schema { types { name } } }" })
      });
      results.tests.graphql = {
        status: graphqlRes.status,
        ok: graphqlRes.ok,
        data: graphqlRes.ok ? await graphqlRes.json() : null
      };
    } catch (error) {
      results.tests.graphql = { error: error instanceof Error ? error.message : String(error) };
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

