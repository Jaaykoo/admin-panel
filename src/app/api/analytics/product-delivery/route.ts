import { NextResponse } from 'next/server';
import { getProductDeliveries } from '@/services/AnalyticService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

    const data = await getProductDeliveries(limit);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erreur API product-delivery:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les livraisons', itemsShipped: 0, deliveries: [] },
      { status: 500 },
    );
  }
}
