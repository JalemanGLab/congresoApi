import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './interfaces/user.interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const { data, error } = await this.supabaseService.client
      .from('users_profile')
      .select('identification, first_name, last_name, phone, email, rol, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findOne(identification: number): Promise<Omit<User, 'password'>> {
    const { data, error } = await this.supabaseService.client
      .from('users_profile')
      .select('identification, first_name, last_name, phone, email, rol, created_at')
      .eq('identification', identification)
      .single();

    if (!data) {
      throw new NotFoundException(`Usuario con ID ${identification} no encontrado`);
    }

    if (error) throw error;
    return data;
  }

  async create(user: Omit<User, 'identification' | 'created_at'>): Promise<Omit<User, 'password'>> {
    // Verificar si el email ya existe
    const { data: existingUser } = await this.supabaseService.client
      .from('users_profile')
      .select('email')
      .eq('email', user.email)
      .single();

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const { data, error } = await this.supabaseService.client
      .from('users_profile')
      .insert([{
        ...user,
        password: hashedPassword
      }])
      .select('identification, first_name, last_name, phone, email, rol, created_at')
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    identification: number,
    updateData: Partial<Omit<User, 'identification' | 'created_at'>>
  ): Promise<Omit<User, 'password'>> {
    // Si se está actualizando la contraseña, encriptarla
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { data, error } = await this.supabaseService.client
      .from('users_profile')
      .update(updateData)
      .eq('identification', identification)
      .select('identification, first_name, last_name, phone, email, rol, created_at')
      .single();

    if (!data) {
      throw new NotFoundException(`Usuario con ID ${identification} no encontrado`);
    }

    if (error) throw error;
    return data;
  }
}