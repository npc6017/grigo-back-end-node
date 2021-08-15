import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { Notification } from './Notification';
import { Account } from './Account';
import { PostTag } from './PostTag';

@Index('post_pkey', ['id'], { unique: true })
@Entity('post', { schema: 'public' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', length: 100 })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('character varying', { name: 'boardType', length: 20 })
  boardType: string;

  @Column('timestamp with time zone', {
    name: 'time_stamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeStamp: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.post)
  notifications: Notification[];

  @ManyToOne(() => Account, (account) => account.posts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Account;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];
}
