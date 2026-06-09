import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm/browser';

@Entity('<%= tableName %>')
export class <%= className %>TypeormEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 128, nullable: false })
  name!: string;
}
