import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { Login } from './interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthResponse } from './interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() login: Login): Promise<AuthResponse> {
    return this.authService.login(login);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Post('recovery')
  async passwordRecovery(@Body() body: { email: string }) {
    
    return this.authService.passwordRecovery(body.email);
  }

  @Post('validate-otp')
  async validateOtp(@Body() body: { email: string, otp: string }) {
    return this.authService.validateOtp(body.email, body.otp);
  }
}
