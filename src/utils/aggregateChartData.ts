/**
 * Agrège les données de ventes par période
 */

export type Period = '28days' | '1year' | 'years';

/**
 * Agrège les données par jour, mois ou année selon la période
 */
export function aggregateChartData(
  labels: string[],
  dataset: number[],
  period: Period,
): { labels: string[]; dataset: number[] } {
  if (labels.length === 0 || dataset.length === 0) {
    return { labels: [], dataset: [] };
  }

  // Pour 28 jours : afficher les jours
  if (period === '28days') {
    return aggregateByDay(labels, dataset);
  }

  // Pour 1 année : afficher les mois
  if (period === '1year') {
    return aggregateByMonth(labels, dataset);
  }

  // Pour années : afficher les années
  if (period === 'years') {
    return aggregateByYear(labels, dataset);
  }

  return { labels, dataset };
}

/**
 * Agrège par jour (format: "Lun 23", "Mar 24", etc.)
 */
function aggregateByDay(labels: string[], dataset: number[]): { labels: string[]; dataset: number[] } {
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const aggregated: { [key: string]: number } = {};

  labels.forEach((label, index) => {
    const date = new Date(label);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const key = `${dayName} ${day}`;

    if (!aggregated[key]) {
      aggregated[key] = 0;
    }
    aggregated[key] += dataset[index] || 0;
  });

  return {
    labels: Object.keys(aggregated),
    dataset: Object.values(aggregated),
  };
}

/**
 * Agrège par mois (format: "Jan", "Fév", "Mar", etc.)
 */
function aggregateByMonth(labels: string[], dataset: number[]): { labels: string[]; dataset: number[] } {
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const aggregated: { [key: string]: number } = {};
  const monthOrder: { [key: string]: number } = {};

  labels.forEach((label, index) => {
    const date = new Date(label);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const key = `${monthNames[monthIndex]} ${year}`;

    if (!aggregated[key]) {
      aggregated[key] = 0;
      monthOrder[key] = year * 12 + monthIndex;
    }
    aggregated[key] += dataset[index] || 0;
  });

  // Trier par ordre chronologique
  const sortedKeys = Object.keys(aggregated).sort((a, b) => (monthOrder[a] ?? 0) - (monthOrder[b] ?? 0));

  return {
    labels: sortedKeys.map(key => key.split(' ')[0] ?? ''), // Enlever l'année pour l'affichage
    dataset: sortedKeys.map(key => aggregated[key] ?? 0),
  };
}

/**
 * Agrège par année (format: "2023", "2024", "2025")
 */
function aggregateByYear(labels: string[], dataset: number[]): { labels: string[]; dataset: number[] } {
  const aggregated: { [key: string]: number } = {};

  labels.forEach((label, index) => {
    const date = new Date(label);
    const year = date.getFullYear().toString();

    if (!aggregated[year]) {
      aggregated[year] = 0;
    }
    aggregated[year] += dataset[index] || 0;
  });

  // Trier par année
  const sortedKeys = Object.keys(aggregated).sort();

  return {
    labels: sortedKeys,
    dataset: sortedKeys.map(key => aggregated[key] ?? 0),
  };
}
