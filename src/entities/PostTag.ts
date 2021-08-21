import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { Tag } from './Tag';

@Index('post_tag_pkey', ['id'], { unique: true })
@Index('post_tag_composite_pkey', ['post', 'tag'], { unique: true })
@Entity('post_tag', { schema: 'public' })
export class PostTag {
  constructor(newPost: Post, tag: Tag) {
      this.post = newPost,
      this.tag = tag
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Post, (post) => post.postTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tag: Tag;
}
