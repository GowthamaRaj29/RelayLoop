import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VitalSign } from '../../vital-sign/entities/vital-sign.entity';
import { PatientNote } from './patient-note.entity';
import { Medication } from './medication.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  mrn: string; // Medical Record Number

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 100 })
  attending_doctor: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  insurance: string;

  @Column({ length: 20, nullable: true })
  room: string;

  @Column('text', { array: true, default: [] })
  medical_conditions: string[];

  @Column('text', { array: true, default: [] })
  allergies: string[];

  @Column({ type: 'date', nullable: true })
  last_admission: Date;

  @Column({ type: 'date', nullable: true })
  last_visit: Date;

  @Column({ length: 50, default: 'Active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Risk prediction fields
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  risk_score: number;

  @Column({ length: 50, nullable: true })
  risk_level: string; // Low, Medium, High

  @Column({ type: 'jsonb', nullable: true })
  prediction_factors: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => VitalSign, (vitalSign) => vitalSign.patient, { cascade: true })
  vital_signs: VitalSign[];

  @OneToMany(() => PatientNote, (note) => note.patient, { cascade: true })
  notes_history: PatientNote[];

  @OneToMany(() => Medication, (medication) => medication.patient, { cascade: true })
  medications: Medication[];

  // Virtual fields for frontend compatibility
  get vitals() {
    return this.vital_signs?.map(vs => ({
      id: vs.id,
      date: vs.recorded_at,
      temperature: vs.temperature,
      heartRate: vs.heart_rate,
      bloodPressure: `${vs.blood_pressure_systolic}/${vs.blood_pressure_diastolic}`,
      respiratoryRate: vs.respiratory_rate,
      oxygenSaturation: vs.oxygen_saturation,
      weight: vs.weight,
      height: vs.height,
      notes: vs.notes
    })) || [];
  }
}
