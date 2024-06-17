import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileValidatorService {
  isValidFile(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type) || file.size > maxSize) {
      console.error('Invalid file type or size.');
      return false;
    }
    return true;
  }
}