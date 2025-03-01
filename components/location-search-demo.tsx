'use client';

import React, { useState } from 'react';
import {
  LocationCombobox,
  LocationItem,
} from '@/components/ui/location-combobox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { api } from '@/lib/api';

export function LocationSearchDemo() {
  const [selectedLocation, setSelectedLocation] = useState<
    LocationItem | undefined
  >();
  const [nearbyLocations, setNearbyLocations] = useState<LocationItem[]>([]);
  const [radius, setRadius] = useState<number>(100);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (
    id: number | undefined,
    location?: LocationItem
  ) => {
    setSelectedLocation(location);
    setNearbyLocations([]);
  };

  const searchNearby = async () => {
    if (!selectedLocation?.latitude || !selectedLocation?.longitude) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.getNearestLocations(
        selectedLocation.latitude,
        selectedLocation.longitude,
        radius
      );

      setNearbyLocations(response);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Поиск локаций</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Найти город
            </label>
            <LocationCombobox
              onChange={handleLocationSelect}
              placeholder='Введите название города'
            />
          </div>

          {selectedLocation && (
            <div className='border-t pt-4 space-y-4'>
              <div className='flex items-center'>
                <MapPin className='h-5 w-5 mr-2 text-blue-500' />
                <div>
                  <p className='font-medium'>{selectedLocation.name}</p>
                  {selectedLocation.full_name && (
                    <p className='text-sm text-gray-500'>
                      {selectedLocation.full_name}
                    </p>
                  )}
                  {selectedLocation.latitude && selectedLocation.longitude && (
                    <p className='text-xs text-gray-400'>
                      Координаты: {selectedLocation.latitude.toFixed(6)},{' '}
                      {selectedLocation.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex space-x-2'>
                <div className='flex-grow'>
                  <Input
                    type='number'
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    placeholder='Радиус (км)'
                    min='1'
                    max='500'
                  />
                </div>
                <Button
                  onClick={searchNearby}
                  disabled={
                    loading ||
                    !selectedLocation.latitude ||
                    !selectedLocation.longitude
                  }
                >
                  <Search className='h-4 w-4 mr-2' />
                  Искать рядом
                </Button>
              </div>

              {nearbyLocations.length > 0 && (
                <div className='border rounded-md p-3 mt-4'>
                  <h3 className='font-medium mb-2'>
                    Города в радиусе {radius} км:
                  </h3>
                  <ul className='space-y-2 max-h-60 overflow-y-auto'>
                    {nearbyLocations.map((location) => (
                      <li
                        key={location.id}
                        className='text-sm flex items-start'
                      >
                        <MapPin className='h-4 w-4 mr-2 mt-0.5 text-gray-400' />
                        <div>
                          <p>{location.name}</p>
                          {location.distance && (
                            <p className='text-xs text-gray-500'>
                              {location.distance.toFixed(1)} км
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
