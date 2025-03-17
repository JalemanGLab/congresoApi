// src/faq/faq.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../config/supabase/supabase.service';
import { FAQ } from './interfaces/faq.intercafes';

@Injectable()
export class FAQService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(active?: boolean): Promise<FAQ[]> {
    let query = this.supabaseService.client
      .from('faq')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Si se proporciona el parámetro active, filtramos por él
    if (active !== undefined) {
      query = query.eq('active', active);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async findOne(id: number): Promise<FAQ> {
    const { data, error } = await this.supabaseService.client
      .from('faq')
      .select('*')
      .eq('id', id)
      .single();

    if (!data) {
      throw new NotFoundException(`Pregunta frecuente con ID ${id} no encontrada`);
    }

    if (error) throw error;
    return data;
  }

  async create(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>): Promise<FAQ> {
    const { data, error } = await this.supabaseService.client
      .from('faq')
      .insert([{ ...faq }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, faq: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>): Promise<FAQ> {
    const { data, error } = await this.supabaseService.client
      .from('faq')
      .update(faq)
      .eq('id', id)
      .select()
      .single();

    if (!data) {
      throw new NotFoundException(`Pregunta frecuente con ID ${id} no encontrada`);
    }

    if (error) throw error;
    return data;
  }

  async toggleActive(id: number): Promise<FAQ> {
    // Primero obtenemos el estado actual
    const { data: currentFAQ } = await this.supabaseService.client
      .from('faq')
      .select('active')
      .eq('id', id)
      .single();

    if (!currentFAQ) {
      throw new NotFoundException(`Pregunta frecuente con ID ${id} no encontrada`);
    }

    // Luego actualizamos al estado opuesto
    const { data, error } = await this.supabaseService.client
      .from('faq')
      .update({ active: !currentFAQ.active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}