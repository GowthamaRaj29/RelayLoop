import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('vital_signs')
export class VitalSign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patient_id: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number; // Celsius

  @Column({ type: 'int', nullable: true })
  heart_rate: number; // beats per minute

  @Column({ type: 'int', nullable: true })
  blood_pressure_systolic: number; // mmHg

  @Column({ type: 'int', nullable: true })
  blood_pressure_diastolic: number; // mmHg

  @Column({ type: 'int', nullable: true })
  respiratory_rate: number; // breaths per minute

  @Column({ type: 'int', nullable: true })
  oxygen_saturation: number; // percentage

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number; // kg

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number; // cm

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  blood_glucose: number; // mg/dL

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 100 })
  recorded_by: string; // nurse name/ID

  @CreateDateColumn()
  recorded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.vital_signs)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
