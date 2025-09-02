import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private supabaseService: SupabaseService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      // Verify token with Supabase
      const user = await this.supabaseService.verifyToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Get user role and department
      const userRole = await this.supabaseService.getUserRole(user.id);
      
      // Attach user info to request
      request.user = {
        id: user.id,
        email: user.email,
        role: userRole?.role || null,
        department: userRole?.department || null,
        ...user
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
