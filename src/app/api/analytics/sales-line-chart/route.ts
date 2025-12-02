import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api, attachCookie } from '@/libs/api-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const periodDays = searchParams.get('period_days') || '30';

    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const data = await api.get(
      `/analytics/dashboard/sales-line-chart/?period_days=${periodDays}`,
      attachCookie(cookie),
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erreur API sales-line-chart:', error);
    return NextResponse.json(
      {
        title: 'Sales This Month',
        value: 0,
        objectiveMessage: 'Target: $0',
        labels: [],
        dataset: [],
      },
      { status: error?.response?.status || 500 },
    );
  }
}
