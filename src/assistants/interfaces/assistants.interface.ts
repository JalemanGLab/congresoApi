export interface Assistant {
  id: number;
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
  entry: boolean;
  entry_datetime: string;
  created_at: string;
}

export interface AssistantResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
}