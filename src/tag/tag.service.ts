import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/Tag';
import { Repository } from 'typeorm';
import { AccountTag } from '../entities/AccountTag';
import { AccountService } from '../account/account.service';
import { Account } from '../entities/Account';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(AccountTag)
    private accountTagRepository: Repository<AccountTag>,
  ) {}
  /** StringTag To TagObject
   * getTagObjectByTagStrings와 형식이 다르다
   * [name...], [{name: ,,}...]**/
  async getTagObject(tags: string[]): Promise<Tag[]> {
    const tagObjs: Tag[] = [];
    await Promise.all(
      tags.map(async (tag) => {
        const isTag = await this.tagRepository.findOne({ name: tag });
        if (isTag) tagObjs.push(isTag);
      }),
    );
    return tagObjs;
  }
  /** Method | Tag name 배열을 받아서 해당 Tag 객체를 응답해주는 메서드 */
  async getTagObjectByTagStrings(newTags: string[]): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder()
      .select()
      .where(newTags)
      .getMany();
  }
  async setMyTags(tags: string[], account: Account) {
    /** Tag레포지토리에 태그 데이터를 삽입, 있는경우 무시
     *  우선 태그들 유무 판단 후, 없는 태그들 creat하여 한 번에 save
     * */
    const newTags = [];
    const newAccountTags = [];
    await Promise.all(
      tags.map(async (tag) => {
        const exTag = await this.tagRepository.findOne({
          where: { name: tag },
        });
        if (!exTag) newTags.push(this.tagRepository.create({ name: tag }));
        return null;
      }),
    );
    await this.tagRepository.save(newTags);

    /** 위에서 저장된 Entity를 받는 것은 이미 존재하는 태그는 받아오지 않는다.
     * 따라서 Tag레포에서 Entity를 모두 받아온다.*/
    const tagObj = await this.getTagObject(tags);

    /** 위에서 받아온 Tag Entity들과 account를 accountTag레퍼지토리에 넣는다.
     *  여기도 accountTag 존재 유무 판단 후, 없는 것들 create하여 한 번에 save */

    await Promise.all(
      tagObj.map(async (tag) => {
        const exTag = await this.accountTagRepository.findOne({
          where: { account, tag },
        });
        if (!exTag)
          newAccountTags.push(
            this.accountTagRepository.create(new AccountTag(account, tag)),
          );
        return null;
      }),
    );
    await this.accountTagRepository.save(newAccountTags);
  }

  async getMyTags(email): Promise<string[]> {
    const stringTags: string[] = [];
    const myTags = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.email =:email', { email: email })
      .leftJoinAndSelect('account.accountTags', 'accountTags')
      .leftJoinAndSelect('accountTags.tag', 'tags')
      .getOne();

    myTags.accountTags.map((tag) => {
      stringTags.push(tag.tag.name);
    });
    return stringTags;
  }

  async deleteAccountTags( deleteTagObjs: Tag[], account: Account ): Promise<void> {
    /// deleted tags
    await Promise.all(
      deleteTagObjs.map(async (tag) => {
        await this.accountTagRepository.delete({
          account: account,
          tag: tag,
        });
      }),
    );
  }
}
