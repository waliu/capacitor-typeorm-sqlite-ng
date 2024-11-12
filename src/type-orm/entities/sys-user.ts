import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('sys_user')
export class SysUser {

  @PrimaryGeneratedColumn({name: 'user_id', type: 'integer'})
  user_id!: number;

  @Column({name: 'user_name', type: 'varchar', length: 32, nullable: false})
  user_name!: string;

  @Column({name: 'password', type: 'varchar', length: 256, nullable: false})
  password!: string;
}
