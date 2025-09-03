import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    console.log('Roles Guard - Required Roles:', requiredRoles);
    console.log('Roles Guard - User Object:', user);
    console.log('Roles Guard - User Role:', user?.role);
    
    if (!user || !user.role) {
      throw new ForbiddenException('User role is required');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    
    console.log('Roles Guard - Has Required Role:', hasRole);
    
    if (!hasRole) {
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
