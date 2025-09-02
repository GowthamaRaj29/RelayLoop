import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VitalSignService } from './vital-sign.service';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { UpdateVitalSignDto } from './dto/update-vital-sign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Vital Signs')
// @ApiBearerAuth('JWT-auth')   // Temporarily disabled for testing
// @UseGuards(JwtAuthGuard, RolesGuard)   // Temporarily disabled for testing
@Controller('vital-signs')
export class VitalSignController {
  constructor(private readonly vitalSignService: VitalSignService) {}

  @Post()
  @ApiOperation({ summary: 'Record vital signs for a patient (Nurse access)' })
  @ApiResponse({ status: 201, description: 'Vital signs recorded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async create(@Body() createVitalSignDto: CreateVitalSignDto, @Request() req?) {
    console.log('POST /vital-signs called with data:', createVitalSignDto);
    console.log('Request user:', req?.user || 'No user (auth disabled)');
    
    const userDepartment = undefined;
    const vitalSign = await this.vitalSignService.create(createVitalSignDto, userDepartment);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Vital signs recorded successfully',
      data: vitalSign,
    };
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get vital signs for a specific patient' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return', type: 'number' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of records to skip', type: 'number' })
  @ApiResponse({ status: 200, description: 'Vital signs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async findByPatient(
    @Param('patientId') patientId: string,
    @Request() req?,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0
  ) {
    const userDepartment = undefined;
    const result = await this.vitalSignService.findByPatient(patientId, userDepartment, limit, offset);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Vital signs retrieved successfully',
      data: result.vitalSigns,
      meta: {
        total: result.total,
        limit,
        offset,
        hasMore: (offset + limit) < result.total
      }
    };
  }

  @Get('patient/:patientId/latest')
  @ApiOperation({ summary: 'Get latest vital signs for a patient' })
  @ApiResponse({ status: 200, description: 'Latest vital signs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found or no vital signs recorded' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async getLatestVitalSigns(@Param('patientId') patientId: string, @Request() req) {
    const userDepartment = req.user?.role === 'admin' ? undefined : req.user?.department;
    const latestVitalSigns = await this.vitalSignService.getLatestVitalSigns(patientId, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Latest vital signs retrieved successfully',
      data: latestVitalSigns
    };
  }

  @Get('stats')
  @Roles('admin', 'doctor')
  @ApiOperation({ summary: 'Get vital signs statistics (Admin and Doctor access)' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter stats by department' })
  @ApiResponse({ status: 200, description: 'Vital signs statistics retrieved successfully' })
  async getStats(@Query('department') department?: string, @Request() req?) {
    const userDepartment = req.user?.role === 'admin' ? department : req.user?.department;
    const stats = await this.vitalSignService.getVitalSignsStats(userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Vital signs statistics retrieved successfully',
      data: stats
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vital sign record by ID' })
  @ApiResponse({ status: 200, description: 'Vital sign retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vital sign not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async findOne(@Param('id') id: string, @Request() req?) {
    console.log('GET /vital-signs/:id called with ID:', id);
    
    const userDepartment = undefined;
    const vitalSign = await this.vitalSignService.findOne(id, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Vital sign retrieved successfully',
      data: vitalSign
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vital sign record (Nurse access)' })
  @ApiResponse({ status: 200, description: 'Vital sign updated successfully' })
  @ApiResponse({ status: 404, description: 'Vital sign not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async update(
    @Param('id') id: string, 
    @Body() updateVitalSignDto: UpdateVitalSignDto,
    @Request() req?
  ) {
    console.log('PATCH /vital-signs/:id called with ID:', id);
    console.log('Update data:', updateVitalSignDto);
    
    const userDepartment = undefined;
    const vitalSign = await this.vitalSignService.update(id, updateVitalSignDto, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Vital sign updated successfully',
      data: vitalSign
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vital sign record (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vital sign deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vital sign not found' })
  async remove(@Param('id') id: string, @Request() req?) {
    console.log('DELETE /vital-signs/:id called with ID:', id);
    
    const userDepartment = undefined;
    await this.vitalSignService.remove(id, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Vital sign deleted successfully'
    };
  }
}
