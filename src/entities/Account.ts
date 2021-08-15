import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountTag } from './AccountTag';
import { Comment } from './Comment';
import { Notification } from './Notification';
import { Post } from './Post';

@Index('account_email_key', ['email'], { unique: true })
@Index('account_pkey', ['id'], { unique: true })
@Index('account_student_id_key', ['studentId'], { unique: true })
@Entity('account', { schema: 'public' })
export class Account {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'email', unique: true, length: 50 })
  email: string;

  @Column('character varying', { name: 'password', length: 100 })
  password: string;

  @Column('character varying', { name: 'name', length: 30 })
  name: string;

  @Column('integer', { name: 'student_id', unique: true })
  studentId: number;

  @Column('character varying', { name: 'phone', nullable: true, length: 50 })
  phone: string | null;

  @Column('character varying', { name: 'birth', nullable: true, length: 50 })
  birth: string | null;

  @Column('character varying', { name: 'sex', nullable: true, length: 20 })
  sex: string | null;

  @Column('boolean', {
    name: 'check_notice',
    nullable: true,
    default: () => 'false',
  })
  checkNotice: boolean | null;

  @OneToMany(() => AccountTag, (accountTag) => accountTag.account)
  accountTags: AccountTag[];

  @OneToMany(() => Comment, (comment) => comment.account)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.account)
  notifications: Notification[];

  @OneToMany(() => Post, (post) => post.account)
  posts: Post[];
}
