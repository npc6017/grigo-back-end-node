import { Injectable } from '@nestjs/common';
import { RequestPostDto } from './dto/request.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/Post';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { PostTag } from '../entities/PostTag';
import { AccountTag } from '../entities/AccountTag';
import { AccountService } from '../account/account.service';
import { Tag } from '../entities/Tag';
import { ResponsePostDTO } from './dto/response.post.dto';

@Injectable()
export class PostService {
  constructor(
    private tagService: TagService,
    private accountService: AccountService,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostTag) private postTagRepository: Repository<PostTag>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(AccountTag)
    private accountTagRepository: Repository<AccountTag>,
  ) {}
  async createPost(email: string, post: RequestPostDto): Promise<void> {
    // 계정 받아오기
    const account = await this.accountService.findByEmail(email);
    /** 태그 데이터를 제외 후, Post Repository에 저장 */
    const newPost = await this.postRepository.save({
      title: post.title,
      content: post.content,
      boardType: post.boardType,
      account,
    });

    /** PostTag에 추가, 게시글과 태그 연결 */
    /// 스트링 배열 태그로 디비에서 태크 데이터 가져오기
    const tagObjs = await Promise.all(
      post.tags.map((tag) => this.tagRepository.findOne({ name: tag })),
    );
    await Promise.all(
      tagObjs.map((tag) => {
        // 이번엔 한방쿼리 X 단일 쿼리 반복
        this.postTagRepository
          .save(new PostTag(newPost, tag))
          .catch((error) => {
            console.error(error);
          });
      }),
    );

    /** Tag와 관련된 계정의 알림 모두 설정 */
    /// 각 태그를 갖는 계정 모두 가져오기
    const accounts = await Promise.all(
      tagObjs.map(async (tag) => {
        const { accountTags: ac } = await this.tagRepository.findOne({
          where: tag,
          relations: ['accountTags', 'accountTags.account'],
        });
        return ac;
      }),
    );
    /// [[Account, Account], [Account, Account]] -> [Account, Account, Account, Account] 방식으로
    /// 탐색하며 accountId를 중복없이 꺼내온다.
    const accountIds: number[] = [];
    accounts.map((ac) => {
      ac.map((a) => {
        if (!accountIds.includes(a.account.id)) {
          accountIds.push(a.account.id);
        }
      });
    });
    /// 중복없이 찾아낸 계정의 알림 상태 변경
    await this.accountService.setAccountCheckNotice(accountIds);
  }
  /** 단일 게시글 조회 */
  async getMyPost(email: string, postId: number): Promise<ResponsePostDTO> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: [
        'account',
        'postTags',
        'postTags.tag',
        'comments',
        'comments.account',
      ],
    });
    return this.postToResponsePostDTO(post, email);
  }
  /** 게시글(여러개) 조회 */
  async getMyPosts(email: string, query): Promise<ResponsePostDTO[]> {
    const posts = await this.postRepository.find({
      skip: query.id - 1,
      take: query.size,
      where: { boardType: query.type },
      relations: [
        'account',
        'postTags',
        'postTags.tag',
        'comments',
        'comments.account',
      ],
      order: { id: 'DESC' },
    });
    const postDTOS = await Promise.all(
      posts.map((post) => this.postToResponsePostDTO(post, email)),
    );
    return postDTOS;
  }

  /** 단일 게시글 ResponsePostDTO 변환 */
  postToResponsePostDTO(post: Post, email: string): ResponsePostDTO {
    const {
      id,
      title,
      account,
      content,
      boardType,
      postTags,
      comments,
      timeStamp,
    } = post;
    const tags = postTags.map((tag) => tag.tag.name);
    const commentDTOS = comments.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        timeStamp: comment.timeStamp,
        userCheck: email == comment.account.email ? true : false,
      };
    });
    return new ResponsePostDTO(
      id,
      title,
      account.name,
      content,
      boardType,
      tags,
      commentDTOS,
      timeStamp,
      email == account.email ? true : false,
    );
  }
}