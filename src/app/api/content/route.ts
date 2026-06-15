import { NextResponse } from 'next/server';
import { readSiteContent, writeSiteContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...init?.headers,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  const content = await readSiteContent();
  return jsonResponse(content);
}

export async function PUT(request: Request) {
  const payload = await request.json();
  const content = await writeSiteContent(payload);
  return jsonResponse(content);
}
