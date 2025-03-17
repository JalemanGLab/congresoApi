import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRService {
  async generateQR(text: string): Promise<Buffer> {
    try {
      return await QRCode.toBuffer(text, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
      });
    } catch (error) {
      console.error('Error generando QR:', error);
      throw error;
    }
  }
}