interface Coordinates {
  lat: number;
  lng: number;
}

interface GeocodingCache {
  [key: string]: Coordinates;
}

// Простой кэш для координат
const coordinatesCache: GeocodingCache = {
  москва: { lat: 55.7558, lng: 37.6173 },
  'санкт-петербург': { lat: 59.9343, lng: 30.3351 },
  ташкент: { lat: 41.2995, lng: 69.2401 },
  самарканд: { lat: 39.627, lng: 66.975 },
  бухара: { lat: 39.768, lng: 64.421 },
};

export async function getCoordinates(
  city: string
): Promise<Coordinates | null> {
  const normalizedCity = city.toLowerCase().trim();

  // Проверяем кэш
  if (coordinatesCache[normalizedCity]) {
    return coordinatesCache[normalizedCity];
  }

  // В реальном приложении здесь был бы запрос к геокодинг сервису
  // например, Google Maps Geocoding API или OpenStreetMap Nominatim

  return null;
}

export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Радиус Земли в километрах

  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function isWithinRadius(
  point: Coordinates,
  center: Coordinates,
  radius: number
): boolean {
  const distance = calculateDistance(point, center);
  return distance <= radius;
}

export function findNearestCities(
  city: string,
  radius: number = 100
): string[] {
  const coordinates = coordinatesCache[city.toLowerCase()];
  if (!coordinates) return [];

  return Object.entries(coordinatesCache)
    .filter(([name, coords]) => {
      if (name === city.toLowerCase()) return false;
      return isWithinRadius(coords, coordinates, radius);
    })
    .map(([name]) => name);
}

export function getRegionForCity(city: string): string {
  // В реальном приложении здесь был бы более полный справочник регионов
  const regions: Record<string, string> = {
    москва: 'Московская область',
    'санкт-петербург': 'Ленинградская область',
    ташкент: 'Ташкентская область',
    самарканд: 'Самаркандская область',
    бухара: 'Бухарская область',
  };

  return regions[city.toLowerCase()] || 'Неизвестный регион';
}
