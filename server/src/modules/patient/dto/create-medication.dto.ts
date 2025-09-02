import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Medication name', example: 'Metoprolol' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Dosage', example: '50mg' })
  @IsNotEmpty()
  @IsString()
  dosage: string;

  @ApiProperty({ description: 'Frequency', example: 'Twice daily' })
  @IsNotEmpty()
  @IsString()
  frequency: string;

  @ApiProperty({ description: 'Start date', example: '2023-09-01' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({ description: 'End date', example: '2023-12-01' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Instructions', example: 'Take with food' })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({ description: 'Added by', enum: ['Doctor', 'Nurse'], example: 'Doctor' })
  @IsNotEmpty()
  @IsEnum(['Doctor', 'Nurse'])
  added_by: string;

  @ApiPropertyOptional({ description: 'Status', enum: ['Active', 'Discontinued', 'Completed'], default: 'Active' })
  @IsOptional()
  @IsEnum(['Active', 'Discontinued', 'Completed'])
  status?: string;
}

export class CreatePatientNoteDto {
  @ApiProperty({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  patient_id: string;

  @ApiProperty({ description: 'Author of the note', example: 'Dr. Smith' })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ description: 'Note type', enum: ['Observation', 'Assessment', 'Medication', 'General'], example: 'Observation' })
  @IsNotEmpty()
  @IsEnum(['Observation', 'Assessment', 'Medication', 'General'])
  type: string;

  @ApiProperty({ description: 'Note content', example: 'Patient appears stable and responsive' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Date of the note', example: '2023-12-01' })
  @IsOptional()
  @IsString()
  date?: string;
}
