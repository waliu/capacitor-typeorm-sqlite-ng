import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

/**
 * 用户表
 * @version 1.0.0
 */
@Entity('sys_user')
export class SysUser {
  /**
   * 用户ID
   * @version 1.0.0
   */
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'integer' })
  user_id!: number;
  /**
   * 用户名称
   * @version 1.0.0
   */
  @Column({ name: 'user_name', type: 'varchar', length: 32, nullable: false })
  user_name!: string;
  /**
   *  用户密码
   *  @version 1.0.0
   */
  @Column({ name: 'password', type: 'varchar', length: 256, nullable: false })
  password!: string;
}
