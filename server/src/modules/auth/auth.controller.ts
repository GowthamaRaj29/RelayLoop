import { Controller, Get, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    const profile = await this.authService.getUserProfile(req.user.id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User profile retrieved successfully',
      data: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        ...profile
      }
    };
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validate current authentication token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Token is invalid' })
  async validateToken(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Token is valid',
      data: {
        valid: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          department: req.user.department
        }
      }
    };
  }
}
