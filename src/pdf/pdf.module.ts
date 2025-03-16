import { Module } from '@nestjs/common';
import { PDFService } from './pdf.service';
import { QRModule } from '../qr/qr.module';

@Module({
  imports: [QRModule],
  providers: [PDFService],
  exports: [PDFService]
})
export class PDFModule {}