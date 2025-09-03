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
    // Debug logging
    console.log('Auth Profile - Full User Object:', req.user);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          department: req.user.department
        }
      }
    };
  }

  @Get('debug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Debug current user info' })
  @ApiResponse({ status: 200, description: 'Debug info retrieved successfully' })
  async debugUser(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Debug info retrieved successfully',
      data: {
        user: req.user,
        timestamp: new Date().toISOString()
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
