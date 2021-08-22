export class NotificationDto {
  constructor(id: number, postId: number, title: string) {
    this.id = id;
    this.postId = postId;
    this.title = title;
  }

  id: number;
  postId: number;
  title: string;
}
