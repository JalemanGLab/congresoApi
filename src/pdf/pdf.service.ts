import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { QRService } from '../qr/qr.service';
import { TicketOptions } from './interfaces/pfd.interfaces';

@Injectable()
export class PDFService {
  constructor(private readonly qrService: QRService) {}

  async generateEventTicket(qrNumber: number, options: TicketOptions): Promise<Buffer> {
    try {
      const qrBuffer = await this.qrService.generateQR(qrNumber.toString());
      return await this.createTicketPDF(qrBuffer, options);
    } catch (error) {
      console.error('Error generando ticket:', error);
      throw error;
    }
  }

  private createTicketPDF(qrBuffer: Buffer, options: TicketOptions): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size: 'A4',
          margin: 0
        });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Franja negra superior
        doc.rect(0, 0, doc.page.width, 100).fill('#000000');

        // Texto en la franja negra
        doc.font('Helvetica').fontSize(12)
          .fill('#ffffff')
          .text('Confirmación de registro', 40, 20);

        doc.font('Helvetica-Bold').fontSize(24)
          .fill('#ffffff')
          .text(options.eventName, 40, 40);

        doc.fontSize(12)
          .text(`Fecha de emisión`, doc.page.width - 200, 20, { align: 'right' })
          .text(options.dateIssued, doc.page.width - 200, 40, { align: 'right' });

        // Información del evento
        doc.fill('#000000').fontSize(16)
          .text('Información del evento', 40, 120);

        // QR Code
        doc.image(qrBuffer, 40, 150, { width: 150 });
        doc.fontSize(12)
          .text(`#${options.registrationNumber}`, 40, 310, { width: 150, align: 'center' });

        // Detalles del evento (al lado del QR)
        const eventDetailsX = 230;
        let eventDetailsY = 150;

        doc.fontSize(12).font('Helvetica-Bold').text('Fecha', eventDetailsX, eventDetailsY);
        doc.font('Helvetica').text(options.eventInfo.date);
        eventDetailsY += 40;

        doc.font('Helvetica-Bold').text('Hora', eventDetailsX, eventDetailsY);
        doc.font('Helvetica').text(options.eventInfo.time);
        eventDetailsY += 40;

        doc.font('Helvetica-Bold').text('Ubicación', eventDetailsX, eventDetailsY);
        doc.font('Helvetica').text(options.eventInfo.location);

        // Información del asistente
        doc.fontSize(16).font('Helvetica-Bold')
          .text('Información del asistente', 40, 350);

        let attendeeY = 380;
        doc.fontSize(12).font('Helvetica-Bold').text('Nombre', 40, attendeeY);
        doc.font('Helvetica').text(options.attendeeInfo.name);
        attendeeY += 30;

        doc.font('Helvetica-Bold').text('Email', 40, attendeeY);
        doc.font('Helvetica').text(options.attendeeInfo.email);
        attendeeY += 30;

        doc.font('Helvetica-Bold').text('Identificación', 40, attendeeY);
        doc.font('Helvetica').text(options.attendeeInfo.identification);

        // Tipo de entrada (caja negra)
        doc.rect(400, 380, 170, 100).fill('#000000');
        doc.fill('#ffffff').fontSize(12)
          .text('Entrada completa', 420, 400)
          .fontSize(16).font('Helvetica-Bold')
          .text(options.ticketType.name, 420, 420)
          .fontSize(10).font('Helvetica')
          .text(options.ticketType.description, 420, 450, { width: 130 });

        // Información de pago
        doc.fill('#000000').fontSize(16).font('Helvetica-Bold')
          .text('Información de pago', 40, 500);

        let paymentY = 530;
        doc.fontSize(12).font('Helvetica-Bold')
          .text('Método de pago', 40, paymentY);
        doc.font('Helvetica').text(options.paymentInfo.method);
        paymentY += 30;

        doc.font('Helvetica-Bold').text('ID de transacción', 40, paymentY);
        doc.font('Helvetica').text(options.paymentInfo.transactionId);
        paymentY += 30;

        doc.font('Helvetica-Bold').text('Fecha de compra', 40, paymentY);
        doc.font('Helvetica').text(options.paymentInfo.purchaseDate);

        // Tabla de precios
        const priceX = 400;
        doc.fontSize(12).font('Helvetica')
          .text('Precio de entrada', priceX, 530)
          .text(`${options.paymentInfo.ticketPrice.toLocaleString()} ${options.paymentInfo.currency}`, priceX + 120, 530);

        doc.text('Tarifa de procesamiento', priceX, 550)
          .text(`${options.paymentInfo.processingFee.toLocaleString()} ${options.paymentInfo.currency}`, priceX + 120, 550);

        doc.font('Helvetica-Bold')
          .text('Total', priceX, 580)
          .text(`${options.paymentInfo.total.toLocaleString()} ${options.paymentInfo.currency}`, priceX + 120, 580);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}