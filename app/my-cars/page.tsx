'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, FileIcon, Edit2Icon, TrashIcon, ChevronDown, ChevronUp } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';

interface Vehicle {
  id: string;
  techPassport1: string;
  techPassport2: string;
  techPassport1Image: string | null;
  techPassport2Image: string | null;
  bodyType: string;
  capacity: string;
  volume: string;
  cmr: boolean;
  license: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  adr: boolean;
  dozvol: boolean;
  tir: boolean;
  licenseFile?: File;
}

type PartialVehicle = {
  id?: string;
  techPassport1?: string;
  techPassport2?: string;
  techPassport1Image?: string | null;
  techPassport2Image?: string | null;
  bodyType?: string;
  capacity?: string;
  volume?: string;
  cmr?: boolean;
  license?: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  adr?: boolean;
  dozvol?: boolean;
  tir?: boolean;
  licenseFile?: File;
};

const bodyTypes = [
  'Тент',
  'Рефрижератор',
  'Изотерм',
  'Контейнер',
  'Автовоз',
  'Бортовой',
];

const AddVehicleForm: React.FC<{ onSave: (vehicle: Vehicle) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<PartialVehicle>({
    dimensions: { length: '', width: '', height: '' },
    techPassport1Image: null,
    techPassport2Image: null
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1] as keyof typeof formData.dimensions;
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value as string
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'techPassport1Image' | 'techPassport2Image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({
            ...prev,
            [side]: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Vehicle);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Добавление машины</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Тех. паспорт (стр. 1)</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'techPassport1Image')}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.techPassport1Image && (
            <img
              src={formData.techPassport1Image}
              alt="Tech Passport Front"
              className="mt-2 max-h-40 rounded-lg shadow"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Тех. паспорт (стр. 2)</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'techPassport2Image')}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.techPassport2Image && (
            <img
              src={formData.techPassport2Image}
              alt="Tech Passport Back"
              className="mt-2 max-h-40 rounded-lg shadow"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Тип кузова</label>
        <Select onValueChange={(value) => handleInputChange('bodyType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип кузова" />
          </SelectTrigger>
          <SelectContent>
            {bodyTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Грузоподъемность (тонн)</label>
          <Input
            type="number"
            required
            onChange={(e) => handleInputChange('capacity', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Объем (м³)</label>
          <Input
            type="number"
            required
            onChange={(e) => handleInputChange('volume', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Лицензия</label>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(e, 'licenseFile')}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Внутренние габариты кузова (м)</label>
        <div className="grid grid-cols-3 gap-4">
          <Input
            placeholder="Длина"
            type="number"
            step="0.1"
            required
            onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
          />
          <Input
            placeholder="Ширина"
            type="number"
            step="0.1"
            required
            onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
          />
          <Input
            placeholder="Высота"
            type="number"
            step="0.1"
            required
            onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="adr"
            className="mr-2"
            onChange={(e) => handleInputChange('adr', e.target.checked)}
          />
          <label htmlFor="adr">АДР</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="dozvol"
            className="mr-2"
            onChange={(e) => handleInputChange('dozvol', e.target.checked)}
          />
          <label htmlFor="dozvol">Дозвол</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="tir"
            className="mr-2"
            onChange={(e) => handleInputChange('tir', e.target.checked)}
          />
          <label htmlFor="tir">ТИР</label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">
          Сохранить
        </Button>
      </div>
    </form>
  );
};

const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{vehicle.bodyType}</h3>
            <p className="text-sm text-gray-600">{vehicle.capacity} т / {vehicle.volume} м³</p>
          </div>
          <div className="flex space-x-2">
            {vehicle.adr && <Badge>АДР</Badge>}
            {vehicle.dozvol && <Badge>Дозвол</Badge>}
            {vehicle.tir && <Badge>ТИР</Badge>}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.techPassport1Image && (
                <img src={vehicle.techPassport1Image} alt="Tech Passport Front" className="max-h-40 rounded-lg shadow" />
              )}
              {vehicle.techPassport2Image && (
                <img src={vehicle.techPassport2Image} alt="Tech Passport Back" className="max-h-40 rounded-lg shadow" />
              )}
            </div>
            <p>Размеры: {vehicle.dimensions.length}x{vehicle.dimensions.width}x{vehicle.dimensions.height} м</p>
            {vehicle.licenseFile && (
              <p className="flex items-center">
                <FileIcon className="h-4 w-4 mr-2" />
                Лицензия
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {isExpanded ? 'Скрыть' : 'Подробнее'}
          </Button>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Edit2Icon className="h-4 w-4 mr-1" />
              Изменить
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              <TrashIcon className="h-4 w-4 mr-1" />
              Удалить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MyVehiclesPage() {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const handleSaveVehicle = (vehicle: Vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: Date.now().toString() }]);
    setIsAddingVehicle(false);
  };

  return (
    <div className="min-h-screen bg-blue-600 p-4 pb-20">
      <h1 className="text-2xl font-bold text-white text-center mb-6">
        Мои машины и заявки
      </h1>

      {!isAddingVehicle && vehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
          <Button 
            className="w-64 h-12"
            onClick={() => setIsAddingVehicle(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Добавить машину
          </Button>
          <Button className="w-64 h-12">
            <PlusIcon className="h-5 w-5 mr-2" />
            Добавить заявку
          </Button>
        </div>
      )}

      {isAddingVehicle && (
        <AddVehicleForm
          onSave={handleSaveVehicle}
          onCancel={() => setIsAddingVehicle(false)}
        />
      )}

      {vehicles.length > 0 && (
        <div className="space-y-4 mb-20">
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
          
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={() => setIsAddingVehicle(true)}>
              Добавить ещё
            </Button>
            <Button>
              Добавить заявку
            </Button>
          </div>
        </div>
      )}

      <NavigationMenu userRole="carrier" />
    </div>
  );
}