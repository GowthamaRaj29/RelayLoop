import { IsNotEmpty, IsOptional, IsString, IsEmail, IsEnum, IsArray, IsDateString, IsPhoneNumber, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePatientDto {
  @ApiProperty({ description: 'Medical Record Number', example: 'MRN12345' })
  @IsNotEmpty()
  @IsString()
  mrn: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Date of birth', example: '1980-05-15' })
  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @ApiProperty({ description: 'Gender', enum: ['Male', 'Female', 'Other'], example: 'Male' })
  @IsNotEmpty()
  @IsEnum(['Male', 'Female', 'Other'])
  gender: string;

  @ApiProperty({ description: 'Department', example: 'Cardiology' })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({ description: 'Attending doctor', example: 'Dr. Smith' })
  @IsNotEmpty()
  @IsString()
  attending_doctor: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '(555) 123-4567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value?.trim() === '' ? undefined : value)
  email?: string;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main St, Anytown, CA' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Insurance provider', example: 'Blue Cross Blue Shield' })
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiPropertyOptional({ description: 'Room number', example: '205-A' })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiPropertyOptional({ 
    description: 'Medical conditions', 
    type: [String], 
    example: ['Hypertension', 'Diabetes'] 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  medical_conditions?: string[];

  @ApiPropertyOptional({ 
    description: 'Allergies', 
    type: [String], 
    example: ['Penicillin', 'Latex'] 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  allergies?: string[];

  @ApiPropertyOptional({ description: 'Last admission date', example: '2023-07-20' })
  @IsOptional()
  @IsDateString()
  last_admission?: string;

  @ApiPropertyOptional({ description: 'Last visit date', example: '2023-08-20' })
  @IsOptional()
  @IsDateString()
  last_visit?: string;

  @ApiPropertyOptional({ description: 'Patient status', example: 'Active', default: 'Active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'General notes', example: 'Patient reports chest pain during physical activity.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
