import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { QRService } from '../qr/qr.service';
import { TicketOptions } from './interfaces/pfd.interfaces';
import { Transaction } from 'src/common/types/payment.type';
@Injectable()
export class PDFService {
  private DataTicket={
    eventName: "nombre del evento",
    eventDate: "fecha del evento",
    eventTime: "hora del evento",
    eventLocation: "ubicación del evento",
    eventDescription: "descripción del evento",
    eventPrice: "precio del evento",
    eventCurrency: "moneda del evento",
    eventType: "tipo de evento",
    eventPaymentMethod: "método de pago",
    eventPaymentTransactionId: "id de transacción",
    eventPaymentPurchaseDate: "fecha de compra",
    amount: "cantidad",
    currency: "moneda",
    processingFee: "comisión de procesamiento",
    total: "total",
  }

  constructor(private readonly qrService: QRService) {}

  async generateEventTicket(transaction: Transaction): Promise<Buffer> {
    const {assistant} = transaction;
    
    try {
      const qrBuffer = await this.qrService.generateQR(assistant.identification.toString());
      return await this.createTicketPDF(qrBuffer, transaction);
    } catch (error) {
      console.error('Error generando ticket:', error);
      throw error;
    }
  }

  async generateEventTicket2(qrNumber: number, options: TicketOptions): Promise<Buffer> {
    
    try {
      const qrBuffer = await this.qrService.generateQR(qrNumber.toString());
      return await this.createTicketPDF(qrBuffer, options);
    } catch (error) {
      console.error('Error generando ticket:', error);
      throw error;
    }
  }

  private createTicketPDF(qrBuffer: Buffer, transaction): Promise<Buffer> {
    const {assistant} = transaction;
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
          .text(this.DataTicket.eventName, 40, 40);

        doc.fontSize(12)
          .text(`Fecha de emisión`, doc.page.width - 300, 20, { align: 'right' })
          .text('xxxx', doc.page.width - 300, 40, { align: 'right' });

        // Información del evento
        doc.fill('#000000').fontSize(16)
          .text('Información del evento', 40, 120);

        // QR Code
        doc.image(qrBuffer, 40, 150, { width: 150 });
        doc.fontSize(12)
          .text(`#${assistant.identification}`, 40, 310, { width: 150, align: 'center' });

        // Detalles del evento (al lado del QR)
        const eventDetailsX = 230;
        let eventDetailsY = 150;

        doc.fontSize(12).font('Helvetica-Bold').text('Fecha', eventDetailsX, eventDetailsY);
        doc.font('Helvetica').text(this.DataTicket.eventDate);
        eventDetailsY += 40;

        doc.font('Helvetica-Bold').text('Hora', eventDetailsX, eventDetailsY);
        doc.font('Helvetica').text(this.DataTicket.eventTime);
        eventDetailsY += 40;

        doc.font('Helvetica-Bold').text('Ubicación', eventDetailsX, eventDetailsY);
        doc.font('Helvetica').text(this.DataTicket.eventLocation);

        // Información del asistente
        doc.fontSize(16).font('Helvetica-Bold')
          .text('Información del asistente', 40, 350);

        let attendeeY = 380;
        doc.fontSize(12).font('Helvetica-Bold').text('Nombre', 40, attendeeY);
        doc.font('Helvetica').text(assistant.first_name);
        attendeeY += 30;

        doc.font('Helvetica-Bold').text('Email', 40, attendeeY);
        doc.font('Helvetica').text(assistant.email);
        attendeeY += 30;

        doc.font('Helvetica-Bold').text('Identificación', 40, attendeeY);
        doc.font('Helvetica').text(assistant.identification);

        // Tipo de entrada (caja negra)
        doc.rect(400, 380, 170, 100).fill('#000000');
        doc.fill('#ffffff').fontSize(12)
          .text('Entrada completa', 420, 400)
          .fontSize(16).font('Helvetica-Bold')
          .text(this.DataTicket.eventType, 420, 420)
          .fontSize(10).font('Helvetica')
          .text(this.DataTicket.eventDescription, 420, 450, { width: 130 });

        // Información de pago
        doc.fill('#000000').fontSize(16).font('Helvetica-Bold')
          .text('Información de pago', 40, 500);

        let paymentY = 530;
        doc.fontSize(12).font('Helvetica-Bold')
          .text('Método de pago', 40, paymentY);
        doc.font('Helvetica').text(this.DataTicket.eventPaymentMethod);
        paymentY += 30;

        doc.font('Helvetica-Bold').text('ID de transacción', 40, paymentY);
        doc.font('Helvetica').text(this.DataTicket.eventCurrency);
        paymentY += 30;

        doc.font('Helvetica-Bold').text('Fecha de compra', 40, paymentY);
        doc.font('Helvetica').text(this.DataTicket.eventCurrency);

        // Tabla de precios
        const priceX = 400;
        doc.fontSize(12).font('Helvetica')
          .text('Precio de entrada', priceX, 530)
          .text(`${this.DataTicket.amount.toLocaleString()} ${this.DataTicket.currency}`, priceX + 120, 530);

        doc.text('Tarifa de procesamiento', priceX, 550)
          .text(`${this.DataTicket.processingFee.toLocaleString()} ${this.DataTicket.currency}`, priceX + 120, 550);

        doc.font('Helvetica-Bold')
          .text('Total', priceX, 580)
          .text(`${this.DataTicket.total.toLocaleString()} ${this.DataTicket.currency}`, priceX + 120, 580);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}