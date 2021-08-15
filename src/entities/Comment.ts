import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { Post } from './Post';

@Index('comment_pkey', ['id'], { unique: true })
@Entity('comment', { schema: 'public' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @Column('timestamp with time zone', {
    name: 'time_stamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeStamp: Date;

  @ManyToOne(() => Account, (account) => account.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Account;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;
}
