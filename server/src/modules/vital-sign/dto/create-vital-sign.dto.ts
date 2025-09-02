import { IsNotEmpty, IsOptional, IsNumber, IsString, IsUUID, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVitalSignDto {
  @ApiProperty({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsUUID()
  patient_id: string;

  @ApiPropertyOptional({ description: 'Temperature in Celsius', example: 37.2 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  temperature?: number;

  @ApiPropertyOptional({ description: 'Heart rate in beats per minute', example: 72 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  heart_rate?: number;

  @ApiPropertyOptional({ description: 'Systolic blood pressure in mmHg', example: 120 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  blood_pressure_systolic?: number;

  @ApiPropertyOptional({ description: 'Diastolic blood pressure in mmHg', example: 80 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  blood_pressure_diastolic?: number;

  @ApiPropertyOptional({ description: 'Respiratory rate in breaths per minute', example: 16 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  respiratory_rate?: number;

  @ApiPropertyOptional({ description: 'Oxygen saturation percentage', example: 98 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  oxygen_saturation?: number;

  @ApiPropertyOptional({ description: 'Weight in kg', example: 70.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  weight?: number;

  @ApiPropertyOptional({ description: 'Height in cm', example: 175.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  height?: number;

  @ApiPropertyOptional({ description: 'Blood glucose in mg/dL', example: 95.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  blood_glucose?: number;

  @ApiPropertyOptional({ description: 'Notes about the vital signs', example: 'Patient appears stable' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Name of the person recording the vitals', example: 'Nurse Johnson' })
  @IsNotEmpty()
  @IsString()
  recorded_by: string;
}
