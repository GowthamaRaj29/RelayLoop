import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async validateUser(token: string) {
    try {
      const user = await this.supabaseService.verifyToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const userRole = await this.supabaseService.getUserRole(user.id);
      
      return {
        id: user.id,
        email: user.email,
        role: userRole?.role || null,
        department: userRole?.department || null,
        ...user
      };
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async getUserProfile(userId: string) {
    try {
      const userRole = await this.supabaseService.getUserRole(userId);
      return userRole;
    } catch (error) {
      this.logger.error(`Failed to get user profile: ${error.message}`);
      return null;
    }
  }
}
