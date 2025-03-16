import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async passwordRecovery(email: string): Promise<{ message: string }> {
    const { data, error } = await this.supabaseService.client
      .from('users_profile')
      .select('identification, email')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new BadRequestException('Correo electrónico no encontrado');
    }

    // Generar código OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Establecer fecha de expiración (5 minutos desde ahora)
    const otpExpired = new Date();
    otpExpired.setMinutes(otpExpired.getMinutes() + 5);

    // Actualizar en la base de datos
    const { error: updateError } = await this.supabaseService.client
      .from('users_profile')
      .update({
        otp: otp,
        otp_expired: otpExpired.toISOString(),
      })
      .eq('email', email)
      .select()
      .single();

    if (updateError) {
      throw new BadRequestException(
        'Error al generar el código de recuperación',
      );
    }

    // TODO: Aquí se debería implementar el envío del código por correo

    return {
      message: 'Se ha enviado un código de verificación a tu correo',
    };
  }

  async validateOtp(email: string, otp: string): Promise<{ message: string }> {
    const { data: user, error } = await this.supabaseService.client
      .from('users_profile')
      .select('otp, otp_expired')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new BadRequestException('Correo electrónico no encontrado');
    }

    // Verificar si el código ha expirado
    const now = new Date();
    const expiration = new Date(user.otp_expired);

    if (now > expiration) {
      throw new BadRequestException('El código ha expirado, por favor solicite un nuevo código');
    }

    // Verificar si el código coincide
    if (user.otp !== otp) {
      throw new BadRequestException('Código no válido, por favor ingrese un código valido');
    }

    return {
      message: 'Código válido',
    };
  }
}
