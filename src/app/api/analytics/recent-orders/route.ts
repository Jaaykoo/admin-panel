import { NextResponse } from 'next/server';
import { getRecentOrders } from '@/services/AnalyticService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

    const data = await getRecentOrders(limit);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erreur API recent-orders:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les commandes récentes', orders: [] },
      { status: 500 },
    );
  }
}
