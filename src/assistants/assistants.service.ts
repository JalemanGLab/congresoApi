import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersService } from '../users/users.service';
import { Assistant } from './interfaces/assistants.interface';
import { AssistantResponse } from './interfaces/assistants-response.interface';

@Injectable()
export class AssistantsService {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
  ) {}

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

  async create(
    assistant: Omit<Assistant, 'id' | 'created_at'>,
  ): Promise<AssistantResponse> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('assistant')
        .insert([assistant])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          if (error.message.includes('assistant_phone_key')) {
            throw new ConflictException(
              'Ya hay un asistente con este número de teléfono',
            );
          }
          if (error.message.includes('assistant_email_key')) {
            throw new ConflictException(
              'Ya hay un asistente con este correo electrónico',
            );
          }
          if (error.message.includes('assistant_id_key')) {
            throw new ConflictException(
              'Ya hay un asistente con este número de identificación',
            );
          }
        }
        throw error;
      }

      // Creamos el usuario asociado al asistente
      try {
        await this.usersService.create({
          identification: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: data.email,
          password: data.id,
          rol: 'assistant',
          token: '',
        });

        return {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: data.email,
          city: data.city,
        };
      } catch (userError) {
        // Si falla la creación del usuario, eliminamos el asistente
        await this.supabaseService.client
          .from('assistant')
          .delete()
          .eq('id', data.id);
        throw userError;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al crear el asistente y su usuario asociado',
      );
    }
  }

  async update(
    id: number,
    assistant: Partial<Omit<Assistant, 'id' | 'created_at'>>,
  ): Promise<Assistant> {
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
