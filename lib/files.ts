import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export class FileService {
  static async upload(
    file: File,
    type: string,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axios.post(`${API_URL}/upload/`, formData, {
      headers: {
        'ngrok-skip-browser-warning': '69420',

        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  static async delete(fileId: string): Promise<void> {
    await axios.delete(`${API_URL}/upload/${fileId}/`, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
  }

  static getFileType(file: File): string {
    if (file.type.startsWith('image/')) {
      return 'image';
    }
    if (file.type === 'application/pdf') {
      return 'pdf';
    }
    return 'document';
  }

  static validateFile(
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
    } = {}
  ): string | null {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    } = options;

    if (!allowedTypes.includes(file.type)) {
      return 'Неподдерживаемый тип файла';
    }

    if (file.size > maxSize) {
      return `Размер файла не должен превышать ${maxSize / (1024 * 1024)}MB`;
    }

    return null;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  static getFileIcon(file: File): string {
    const type = file.type;
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('document') || type.includes('word')) return '📝';
    return '📎';
  }
}
