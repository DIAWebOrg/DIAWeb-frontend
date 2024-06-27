import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileValidatorService {
  isValidFile(file: File): { isValid: boolean; message: string } {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return { isValid: false, message: 'Invalid file type.' };
    }
    if (file.size > maxSize) {
      return { isValid: false, message: 'File size exceeds the maximum limit.' };
    }
    return { isValid: true, message: 'File is valid.' };
  }
}