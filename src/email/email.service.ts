import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient, Attachment } from "mailersend";
import { PDFService } from '../pdf/pdf.service';
import { TicketOptions } from '../pdf/interfaces/pfd.interfaces';
import { EmailResponse } from './interfaces/email.interfaces';

@Injectable()
export class EmailService {
  private mailerSend: MailerSend;

  constructor(
    private readonly pdfService: PDFService // Inyectamos el PDFService
  ) {
    //const apiKey = process.env.EMAIL_API_KEY;
    const apiKey = 'mlsn.5d154dfae3f85787915e229a904f7d3c146eab812b096afe8bacfe770cc7621e';
    if (!apiKey) {
      throw new Error('EMAIL_API_KEY no está definido en las variables de entorno');
    }
    this.mailerSend = new MailerSend({
      apiKey: apiKey
    });
  }

  async sendTicketEmail(email: string, ticketNumber: number, ticketOptions: TicketOptions): Promise<EmailResponse> {
    try {

      
      // Usamos el PDFService que ya tiene toda la lógica
      const pdfBuffer = await this.pdfService.generateEventTicket(ticketNumber, ticketOptions);

      const sentFrom = new Sender("MS_2SqPkt@trial-0p7kx4x7zk7l9yjr.mlsender.net", "Sistema de Notificaciones");
      const recipients = [new Recipient(email, ticketOptions.attendeeInfo.name)];
      
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
        .setSubject(`Entrada para ${ticketOptions.eventName} - #${ticketOptions.registrationNumber}`)
        .setHtml(`
          <h1>Tu entrada está lista</h1>
          <p>Hola ${ticketOptions.attendeeInfo.name},</p>
          <p>Adjunto encontrarás tu entrada para ${ticketOptions.eventName}.</p>
          <p>Detalles del evento:</p>
          <ul>
            <li>Fecha: ${ticketOptions.eventInfo.date}</li>
            <li>Hora: ${ticketOptions.eventInfo.time}</li>
            <li>Lugar: ${ticketOptions.eventInfo.location}</li>
          </ul>
          <p>Por favor, presenta este documento (impreso o digital) en la entrada del evento.</p>
          <br>
          <p>¡Nos vemos pronto!</p>
        `)
        .setText(`Tu entrada para ${ticketOptions.eventName} está lista. Por favor, revisa el archivo PDF adjunto.`)
        .setAttachments(attachments);

     
      const response = await this.mailerSend.email.send(emailParams);
      

      return {
        message: 'Email con entrada enviado exitosamente',
        details: {
          email: email,
          timestamp: new Date().toISOString(),
          apiResponse: response
        }
      };

    } catch (error) {
      console.error('Error en el proceso:', error);
      return {
        message: 'Error al enviar el email con la entrada',
        error: {
          type: error.name,
          message: error.message,
          details: error.response || 'No hay detalles adicionales',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}