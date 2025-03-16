import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { Login } from './interfaces/auth.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async validateUser(email: string, password: string) {
    const { data: user, error } = await this.supabaseService.client
      .from('users_profile')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(login: Login): Promise<AuthResponse> {
    const user = await this.validateUser(login.email, login.password);

    const payload = {
      sub: user.identification,
      email: user.email,
      rol: user.rol,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Actualizamos el token en la tabla de usuarios
    const { error } = await this.supabaseService.client
      .from('users_profile')
      .update({ token: access_token })
      .eq('identification', user.identification);

    if (error) {
      throw new UnauthorizedException('Error al actualizar el token');
    }

    return {
      access_token,
      user: {
        identification: user.identification,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async logout(userId: number): Promise<{ message: string }> {
    const { error } = await this.supabaseService.client
      .from('users_profile')
      .update({ token: null })
      .eq('identification', userId);

    if (error) {
      throw new UnauthorizedException('Error al cerrar sesión');
    }

    return {
      message: 'Sesión cerrada correctamente',
    };
  }
}
