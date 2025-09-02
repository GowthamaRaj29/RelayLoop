import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  patient_id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100 })
  dosage: string;

  @Column({ length: 100 })
  frequency: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ length: 100, default: 'Doctor' })
  added_by: string; // Doctor, Nurse

  @Column({ length: 50, default: 'Active' })
  status: string; // Active, Discontinued, Completed

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.medications)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
