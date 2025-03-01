'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/lib/api';

export type LocationItem = {
  id: number;
  name: string;
  level: number;
  full_name?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
};

interface LocationComboboxProps {
  value?: number;
  placeholder?: string;
  onChange: (value: number | undefined, location?: LocationItem) => void;
  error?: string;
  disabled?: boolean;
}

export function LocationCombobox({
  value,
  onChange,
  placeholder = 'Выберите город...',
  error,
  disabled = false,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [locations, setLocations] = React.useState<LocationItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<
    LocationItem | undefined
  >();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Fetch selected location details on mount if value exists
  React.useEffect(() => {
    if (value && !selectedLocation) {
      fetchLocationDetails(value);
    }
  }, [value]);

  const fetchLocationDetails = async (locationId: number) => {
    try {
      const data = await api.getLocation(locationId);
      setSelectedLocation(data);
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  const fetchLocations = async (query: string) => {
    if (!query || query.length < 2) {
      setLocations([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.searchLocations(query);
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length >= 2) {
        fetchLocations(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Get location type label
  const getLocationType = (level: number) => {
    switch (level) {
      case 1:
        return '(Страна)';
      case 2:
        return '(Регион)';
      case 3:
        return '(Город)';
      default:
        return '';
    }
  };

  return (
    <div className='relative w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              error ? 'border-red-500' : '',
              !selectedLocation && 'text-muted-foreground'
            )}
            disabled={disabled}
            onClick={() => {
              setOpen(true);
              // Focus the input after a short delay to ensure it's ready
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 50);
            }}
          >
            {selectedLocation ? (
              <span className='truncate'>
                {selectedLocation.full_name || selectedLocation.name}
              </span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0' align='start'>
          <Command shouldFilter={false}>
            <CommandInput
              ref={inputRef}
              placeholder='Поиск города...'
              value={inputValue}
              onValueChange={(text) => {
                setInputValue(text);
              }}
              className='h-9'
              autoFocus
              // This prevents the popover from closing when clicking inside the input
              onClick={(e) => e.stopPropagation()}
            />

            {loading && (
              <div className='py-2 text-center'>
                <Loader2 className='h-5 w-5 mx-auto animate-spin text-muted-foreground' />
              </div>
            )}

            <CommandEmpty>
              {inputValue.length < 2
                ? 'Введите минимум 2 символа для поиска'
                : 'Ничего не найдено'}
            </CommandEmpty>

            <CommandGroup heading='Результаты поиска'>
              {locations.map((location) => (
                <CommandItem
                  key={location.id}
                  value={location.id.toString()}
                  onSelect={() => {
                    // Prevent triggering select unintentionally during input
                    setSelectedLocation(location);
                    onChange(location.id, location);
                    setOpen(false);
                  }}
                >
                  <div className='flex items-start space-x-2 w-full'>
                    <MapPin className='h-4 w-4 mt-0.5 flex-shrink-0' />
                    <div className='flex flex-col w-full'>
                      <div className='flex justify-between'>
                        <span className='font-medium'>{location.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          {getLocationType(location.level)}
                        </span>
                      </div>
                      {location.full_name && (
                        <span className='text-xs text-muted-foreground truncate'>
                          {location.full_name}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        location.id === value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
  );
}
