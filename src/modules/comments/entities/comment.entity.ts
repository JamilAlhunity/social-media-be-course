import { Post } from 'modules/posts/entities/post.entity';
import { User } from 'modules/users/entities/user.entity';

export class Comment {
  id: number;
  text!: string;
  author!: User;
  post!: Post;

  replyToComment?: Comment | undefined = undefined;

  comments!: Comment[];

  constructor(
    text: string,
    author: User,
    post: Post,
    id: number,
    replyToComment?: Comment | undefined,
  ) {
    this.text = text;
    this.author = author;
    this.post = post;
    this.id = id;
    this.replyToComment = replyToComment;
  }

  addReply(comment: Comment) {
    this.comments.push(comment);
  }

  reply(comment: Comment) {
    this.replyToComment = comment;
  }
}
