export interface EmailResponse {
    message: string;
    details?: {
      messageId?: string;
      email: string;
      timestamp: string;
      apiResponse?: any;
    };
    error?: {
      type: string;
      message: string;
      details: string;
      timestamp: string;
    };
  }