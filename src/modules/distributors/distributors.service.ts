import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../config/supabase/supabase.service';
import { Distributor } from './interfaces/distributor.interface';

@Injectable()
export class DistributorsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(active?: boolean): Promise<Distributor[]> {
    let query = this.supabaseService.client
      .from('distributors')
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

  async findOne(id: number): Promise<Distributor> {
    const { data, error } = await this.supabaseService.client
      .from('distributors')
      .select('*')
      .eq('id', id)
      .single();
    // Si no hay error pero tampoco datos, significa que no se encontró el distribuidor
    if (!data) {
      throw new NotFoundException(`Distribuidor con ID ${id} no encontrado`);
      // O si prefieres devolver null en lugar de lanzar error:
      // return null;
      // O un array vacío:
      // return [];
    }

    if (error) {
      // Aquí puedes manejar otros tipos de errores si ocurren
      throw error;
    }

    return data;
  }

  async create(distributor: Omit<Distributor, 'id' | 'created_at' | 'update_at'>): Promise<Distributor> {
    const { data, error } = await this.supabaseService.client
      .from('distributors')
      .insert([{ ...distributor }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: number, distributor: Partial<Omit<Distributor, 'id' | 'created_at' | 'update_at'>>): Promise<Distributor> {
    const { data, error } = await this.supabaseService.client
      .from('distributors')
      .update(distributor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}