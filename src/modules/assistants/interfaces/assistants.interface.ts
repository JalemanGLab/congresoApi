import { Payment } from "src/modules/payment/interfaces/payment.interface";
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
export interface Assistant {
  identification: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  distributor: string;
  main_procedure: string;
  product_brand: string;
  weekly_procedure: string;
  contact: boolean;
  payment: string;
  payment_update: string;
  payment_ref: string;
  entry: boolean;
  entry_datetime: string;
  created_at: string;
}
export class NewAssistant {
  @IsNotEmpty()
  @IsNumber()
  identification: number;
  @IsNotEmpty()
  @IsString()
  first_name: string;
  @IsNotEmpty()
  @IsString()
  last_name: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  city: string;
  distributor: string;
  @IsNotEmpty()
  @IsString()
  main_procedure: string;
  @IsNotEmpty()
  @IsString()
  product_brand: string;
  @IsNotEmpty()
  @IsString()
  weekly_procedure: string;
  @IsNotEmpty()
  @IsBoolean()
  contact: boolean;
}

export interface AssistantResponse {

  identification: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
};







export interface CreateAssistantResponse {
  status: boolean;
  message: string;
  data?: AssistantResponse[];
  error?: any;
}

export interface CreateAssistantRequest {
  assistant: NewAssistant;
  payment: Payment;
}

