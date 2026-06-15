import { NextResponse } from 'next/server';
import { createLead, readLeads } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
  const leads = await readLeads();
  return jsonResponse(leads);
}

export async function POST(request: Request) {
  try {
    const lead = await createLead(await request.formData());
    return jsonResponse(lead, { status: 201 });
  } catch (error) {
    return jsonResponse({
      message: error instanceof Error ? error.message : 'Unable to create lead',
    }, { status: 400 });
  }
}
