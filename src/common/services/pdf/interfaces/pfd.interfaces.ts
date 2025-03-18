export interface EventInfo {
    name: string;
    date: string;
    time: string;
    location: string;
  }
  
  export interface AttendeeInfo {
    name: string;
    email: string;
    identification: string;
  }
  
  export interface PaymentInfo {
    method: string;
    transactionId: string;
    purchaseDate: string;
    ticketPrice: number;
    processingFee: number;
    total: number;
    currency: string;
  }
  
  export interface TicketOptions {
    eventName: string;
    registrationNumber: string;
    dateIssued: string;
    eventInfo: EventInfo;
    attendeeInfo: AttendeeInfo;
    paymentInfo: PaymentInfo;
    ticketType: {
      name: string;
      description: string;
    };
  }