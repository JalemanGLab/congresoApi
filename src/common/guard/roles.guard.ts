import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const hasRole = roles.includes(user.rol);
    
    if (!hasRole) {
      throw new ForbiddenException({
        message: 'No tienes los permisos necesarios para acceder a este recurso',
        error: 'FORBIDDEN',
        statusCode: 403
      });
    }
    
    return hasRole;
  }
}