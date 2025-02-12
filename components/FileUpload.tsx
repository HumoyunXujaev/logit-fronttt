'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileService } from '@/lib/files';
import { X, Upload, FileIcon } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload: (file: any) => void;
  // type: string;
  maxSize?: number;
  allowedTypes?: string[];
  label?: string;
}

export function FileUpload({
  onUpload,
  // type,
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  label = 'Загрузить файл',
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const error = FileService.validateFile(selectedFile, {
      maxSize,
      allowedTypes,
    });
    if (error) {
      toast.error(error);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // const result = await FileService.upload(file, type, setProgress);
      onUpload(file);
      // onUpload(result);
      toast.success('Файл успешно загружен');
      setFile(null);
      setProgress(0);
    } catch (error) {
      toast.error('Ошибка при загрузке файла');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <input
          type='file'
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          className='hidden'
          ref={fileInputRef}
        />
        <Button
          variant='outline'
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className='h-4 w-4 mr-2' />
          {label}
        </Button>
        {file && (
          <Button
            variant='destructive'
            size='sm'
            onClick={handleClear}
            disabled={isUploading}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {file && (
        <div className='bg-muted p-4 rounded-lg'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <FileIcon className='h-5 w-5' />
              <span className='font-medium truncate'>{file.name}</span>
            </div>
            <span className='text-sm text-muted-foreground'>
              {FileService.formatFileSize(file.size)}
            </span>
          </div>

          {isUploading ? (
            <div className='space-y-2'>
              <Progress value={progress} className='h-2' />
              <p className='text-sm text-center text-muted-foreground'>
                {progress}%
              </p>
            </div>
          ) : (
            <Button className='w-full mt-2' onClick={handleUpload}>
              Загрузить
            </Button>
          )}
        </div>
      )}

      <div className='text-sm text-muted-foreground'>
        <p>Поддерживаемые форматы: {allowedTypes.join(', ')}</p>
        <p>Максимальный размер: {FileService.formatFileSize(maxSize)}</p>
      </div>
    </div>
  );
}
