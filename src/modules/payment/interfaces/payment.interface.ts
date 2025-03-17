// Tipos para las tarjetas
export interface Card {
    name: string;
    number: string;
    expiration_date: string;
    cvv: string;
  }
  
// Tipos para PSE
export interface PSE {
    bank: string;
    type_person: 'natural' | 'juridica';
}

export interface Payment {
    type: 'PSE';
    value: number;
    pse?: PSE;
    card?: Card;
}
