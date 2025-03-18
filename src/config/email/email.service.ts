import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient, Attachment } from "mailersend";
import { PDFService } from '../../common/services/pdf/pdf.service';
import { TicketOptions } from '../../common/services/pdf/interfaces/pfd.interfaces';
import { EmailResponse } from './interfaces/email.interfaces';
import { NewAssistant } from 'src/common/types/assistants.type';
import { Transaction } from 'src/common/types/payment.type';
@Injectable()
export class EmailService {
  private mailerSend: MailerSend;
  private EmailSender = "MS_48jSWV@trial-k68zxl2jj3e4j905.mlsender.net"
  private EmailSenderName = "Sistema de Notificaciones"
  private ticketInfo= {
    date: '11 de Junio 2025',
    name: 'Evento de prueba',
    time: '8:00am',
    location: 'Maloka, Cra. 68d #24A - 51'
  };

  constructor(
    private readonly pdfService: PDFService // Inyectamos el PDFService
  ) {
    const apiKey = process.env.EMAIL_API_KEY;
    if (!apiKey) {
      throw new Error('EMAIL_API_KEY no está definido en las variables de entorno');
    }
    this.mailerSend = new MailerSend({
      apiKey: apiKey
    });
  }



  async sendTicketEmail(transaction: Transaction): Promise<EmailResponse> {
    try {

      const {assistant} = transaction;
      const pdfBuffer = await this.pdfService.generateEventTicket(transaction);
    
      const sentFrom = new Sender(this.EmailSender, this.EmailSenderName);
      const recipients = [new Recipient(assistant.email, assistant.first_name)];

      const attachments = [
        new Attachment(
          pdfBuffer.toString('base64'),
          'ticket-entrada.pdf',
          'attachment'
        )
      ];
      
     

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(`Entrada para  ${this.ticketInfo.name}`)
        .setHtml(`
          <h1>Tu entrada está lista</h1>
          <p>Hola ${assistant.first_name},</p>
          <p>Adjunto encontrarás tu entrada para ${this.ticketInfo.name}.</p>
          <p>Detalles del evento:</p>
          <ul>
            <li>Fecha: ${this.ticketInfo.date}</li>
            <li>Hora: ${this.ticketInfo.time}</li>
            <li>Lugar: ${this.ticketInfo.location}</li>
          </ul>
          <p>Por favor, presenta este documento (impreso o digital) en la entrada del evento.</p>
          <br>
          <p>¡Nos vemos pronto!</p>
        `)
        .setText(`Tu entrada para  ${this.ticketInfo.name} está lista. Por favor, revisa el archivo PDF adjunto.`)
        .setAttachments(attachments);

     
      const response = await this.mailerSend.email.send(emailParams);
      

      return {
        message: 'Email con entrada enviado exitosamente',
        details: {
          email: assistant.email,
          timestamp: new Date().toISOString(),
          apiResponse: response
        }
      };

    } catch (error) {
      console.error('Error en el proceso:', error);
      throw error;
    }
  }
}