import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Assistant } from './interfaces/assistants.interface';

@Injectable()
export class AssistantsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<Assistant[]> {
    const { data, error } = await this.supabaseService.client
      .from('assistant')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findOne(id: number): Promise<Assistant> {
    const { data, error } = await this.supabaseService.client
      .from('assistant')
      .select('*')
      .eq('id', id)
      .single();

    if (!data) {
      throw new NotFoundException(`Asistente con ID ${id} no encontrado`);
    }

    if (error) throw error;
    return data;
  }

  async create(assistant: Omit<Assistant, 'id' | 'created_at'>): Promise<Assistant> {
    const { data, error } = await this.supabaseService.client
      .from('assistant')
      .insert([assistant])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, assistant: Partial<Omit<Assistant, 'id' | 'created_at'>>): Promise<Assistant> {
    const { data, error } = await this.supabaseService.client
      .from('assistant')
      .update(assistant)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}