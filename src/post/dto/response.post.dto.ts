export class ResponsePostDTO {
  constructor(id: number, title: string, writer: string, content: string, boardType: string, tags: string[], comments: any[], timeStamp: Date, userCheck: boolean) {
    this.id = id;
    this.title = title;
    this.writer = writer;
    this.content = content;
    this.boardType = boardType;
    this.tags = tags;
    this.comments = comments;
    this.timeStamp = timeStamp;
    this.userCheck = userCheck;
  }
  id: number;
  title: string;
  writer: string;
  content: string;
  boardType: string;
  tags: string[];
  comments: any[]; // Comment 작성 단계에서 ResponseCommentDTO[] 타입으로 변경 예정
  timeStamp: Date;
  userCheck: boolean;
}