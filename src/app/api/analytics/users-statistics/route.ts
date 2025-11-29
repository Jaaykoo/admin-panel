import { NextResponse } from 'next/server';
import { getUsersStatistics } from '@/services/AnalyticService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as 'PARTICULIER' | 'ENTREPRISE' | null;

    const data = await getUsersStatistics(role || undefined);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erreur API users-statistics:', error);
    return NextResponse.json(
      {
        error: 'Impossible de récupérer les statistiques',
        total: 0,
        active: 0,
        verified: 0,
        inactive: 0,
      },
      { status: 500 },
    );
  }
}
