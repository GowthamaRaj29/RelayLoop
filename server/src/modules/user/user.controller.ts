import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getStats() {
    const stats = await this.userService.getUserStats();
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User statistics retrieved successfully',
      data: stats
    };
  }
}
