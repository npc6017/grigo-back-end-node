import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountTag } from './AccountTag';
import { PostTag } from './PostTag';

@Index('tag_pkey', ['id'], { unique: true })
@Index('tag_name_key', ['name'], { unique: true })
@Entity('tag', { schema: 'public' })
export class Tag {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', unique: true, length: 30 })
  name: string;

  @Column('character varying', { name: 'category', nullable: true, length: 30 })
  category: string | null;

  @OneToMany(() => AccountTag, (accountTag) => accountTag.tag)
  accountTags: AccountTag[];

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
