import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('patient_notes')
export class PatientNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patient_id: string;

  @Column({ length: 100 })
  author: string;

  @Column({ enum: ['Observation', 'Assessment', 'Medication', 'General'], default: 'Observation' })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.notes_history)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
