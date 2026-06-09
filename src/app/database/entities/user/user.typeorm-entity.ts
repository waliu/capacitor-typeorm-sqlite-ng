import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm/browser';

@Entity('sys_user')
export class UserTypeormEntity {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'integer' })
  userId!: number;

  @Column({ name: 'user_name', type: 'varchar', length: 32, nullable: false })
  userName!: string;

  @Column({ name: 'password', type: 'varchar', length: 256, nullable: false })
  password!: string;
}
