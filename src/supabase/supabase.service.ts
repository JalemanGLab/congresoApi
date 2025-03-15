import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_ANON_KEY')!
    );
  }

  get client() {
    return this.supabase;
  }


  async testConnection() {
    try {
      // Intentamos obtener el conteo de usuarios
      const { count, error } = await this.supabase
        .from('user')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return {
          status: 'error',
          message: error.message,
          details: error
        };
      }

      return {
        status: 'success',
        message: 'Conexión exitosa con Supabase',
        details: {
          timestamp: new Date().toISOString(),
          totalUsers: count,
          tableAccessed: 'users'
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error al conectar con Supabase',
        details: error
      };
    }
  }

  
}