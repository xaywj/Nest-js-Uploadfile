import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { File } from './file.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Folder, (folder) => folder.children)
  @JoinColumn({ name: 'parent_id' }) // Join column with name 'parent_id'
  parent: Folder;

  @OneToMany(() => Folder, (folder) => folder.parent)
  children: Folder[];

  @Column()
  folder_name: string;

  @OneToMany(() => File, (file) => file.folder)
  files: File[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
