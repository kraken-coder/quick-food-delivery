import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  password: string;

  @Column({ type: 'varchar', unique: true })
  phone: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column({ type: 'boolean', default: false })
  isVerifiedPhone: boolean;

  @Column({ type: 'int', nullable: true })
  lat: number;

  @Column({ type: 'int', nullable: true })
  lng: number;
}
