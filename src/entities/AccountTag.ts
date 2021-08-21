import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { Tag } from './Tag';

@Index('account_tag_pkey', ['id'], { unique: true })
@Index('account_tag_composite_pkey', ['account', 'tag'], { unique: true })
@Entity('account_tag', { schema: 'public' })
export class AccountTag {
  constructor(account: Account, tag: Tag) {
    this.account = account;
    this.tag = tag;
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Account, (account) => account.accountTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Account;

  @ManyToOne(() => Tag, (tag) => tag.accountTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tag: Tag;
}
