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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreateMedicationDto, CreatePatientNoteDto } from './dto/create-medication.dto';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Patients')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Patient with MRN already exists' })
  async create(@Body() createPatientDto: CreatePatientDto, @Request() req) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Patient created successfully',
      data: await this.patientService.create(createPatientDto),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor', 'nurse')
  async findAll(
    @Query() query: PaginationDto,
    @Request() req: any,
  ) {
    const { department, search, limit = 20, page = 1 } = query;
    const offset = (page - 1) * limit;
    
    console.log('GET /patients called with params:', {
      department,
      search,
      limit,
      offset,
      page
    });
    console.log('Request user:', req.user);

    const result = await this.patientService.findAll(
      req.user.role === 'nurse' || req.user.role === 'doctor' ? req.user.department : department,
      search,
      Number(limit),
      Number(offset),
    );

    console.log('Service result:', result);
    return result;
  }

  @Get('stats')
  @Roles('admin', 'doctor')
  @ApiOperation({ summary: 'Get patient statistics (Admin and Doctor access)' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter stats by department' })
  @ApiResponse({ status: 200, description: 'Patient statistics retrieved successfully' })
  async getStats(@Request() req, @Query('department') department?: string) {
    // For admins, allow filtering by any department or no department for global stats
    // For doctors, restrict to their department unless admin
    const userDepartment = req.user.role === 'admin' ? department : req.user.department;
    
    const stats = await this.patientService.getPatientStats(userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient statistics retrieved successfully',
      data: stats
    };
  }

  @Get(':id')
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async findOne(@Param('id') id: string, @Request() req) {
    console.log('GET /patients/:id called with ID:', id);
    console.log('Request user:', req.user);
    
    // Admin can access any patient, others restricted to their department
    const userDepartment = req.user.role === 'admin' ? undefined : req.user.department;
    const patient = await this.patientService.findOne(id, userDepartment);
    
    console.log('Retrieved patient:', { 
      id: patient.id, 
      name: `${patient.first_name} ${patient.last_name}`, 
      department: patient.department 
    });
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient retrieved successfully',
      data: patient
    };
  }

  @Patch(':id')
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async update(
    @Param('id') id: string, 
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req
  ) {
    console.log('PATCH /patients/:id called with ID:', id);
    console.log('Update data:', updatePatientDto);
    console.log('Request user:', req.user);
    
    // Admin can update any patient, others restricted to their department
    const userDepartment = req.user.role === 'admin' ? undefined : req.user.department;
    const patient = await this.patientService.update(id, updatePatientDto, userDepartment);
    
    console.log('Updated patient:', { 
      id: patient.id, 
      name: `${patient.first_name} ${patient.last_name}` 
    });
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: patient
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a patient (Admin only)' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async remove(@Param('id') id: string) {
    await this.patientService.remove(id);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Patient deleted successfully'
    };
  }

  // Medication endpoints
  @Post(':id/medications')
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Add medication to a patient' })
  @ApiResponse({ status: 201, description: 'Medication added successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async addMedication(
    @Param('id') patientId: string,
    @Body() createMedicationDto: CreateMedicationDto,
    @Request() req
  ) {
    createMedicationDto.patient_id = patientId;
    const userDepartment = req.user.role === 'admin' ? undefined : req.user.department;
    
    const medication = await this.patientService.addMedication(createMedicationDto, userDepartment);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Medication added successfully',
      data: medication
    };
  }

  // Patient notes endpoints
  @Post(':id/notes')
  @Roles('admin', 'doctor', 'nurse')
  @ApiOperation({ summary: 'Add a note to a patient' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Access denied - wrong department' })
  async addNote(
    @Param('id') patientId: string,
    @Body() createPatientNoteDto: CreatePatientNoteDto,
    @Request() req
  ) {
    createPatientNoteDto.patient_id = patientId;
    const userDepartment = req.user.role === 'admin' ? undefined : req.user.department;
    
    const note = await this.patientService.addNote(createPatientNoteDto, userDepartment);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Note added successfully',
      data: note
    };
  }

  // ML Prediction endpoints
  @Post(':id/predictions')
  @ApiOperation({ summary: 'Create ML prediction for patient' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async createPrediction(
    @Param('id') id: string,
    @Body() predictionData: CreatePredictionDto,
    @Request() req
  ) {
    console.log('POST /patients/:id/predictions called for patient:', id);
    console.log('Prediction data received:', predictionData);
    console.log('Request user:', req?.user || 'No user (auth disabled)');
    
    const result = await this.patientService.createPrediction(id, predictionData);
    
    return {
      success: true,
      message: 'Prediction created successfully',
      data: result
    };
  }

  @Get(':id/predictions')
  @ApiOperation({ summary: 'Get all predictions for a patient' })
  @ApiResponse({ status: 200, description: 'Predictions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientPredictions(
    @Param('id') patientId: string,
    @Request() req?
  ) {
    const userDepartment = req?.user?.role === 'admin' ? undefined : req?.user?.department;
    
    const predictions = await this.patientService.getPatientPredictions(patientId, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Predictions retrieved successfully',
      data: predictions
    };
  }

  @Get(':id/predictions/latest')
  @ApiOperation({ summary: 'Get latest prediction for a patient' })
  @ApiResponse({ status: 200, description: 'Latest prediction retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No predictions found for this patient' })
  async getLatestPrediction(
    @Param('id') patientId: string,
    @Request() req?
  ) {
    const userDepartment = req?.user?.role === 'admin' ? null : req?.user?.department;
    
    const prediction = await this.patientService.getLatestPrediction(patientId, userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Latest prediction retrieved successfully',
      data: prediction
    };
  }

  @Get('predictions/department')
  @ApiOperation({ summary: 'Get all predictions for a department' })
  @ApiResponse({ status: 200, description: 'Department predictions retrieved successfully' })
  @ApiQuery({ name: 'department', required: false, description: 'Department name' })
  async getDepartmentPredictions(
    @Query('department') department?: string,
    @Request() req?
  ) {
    const userDepartment = req?.user?.role === 'admin' ? department : req?.user?.department;
    
    const predictions = await this.patientService.getDepartmentPredictions(userDepartment);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Department predictions retrieved successfully',
      data: predictions
    };
  }
}
