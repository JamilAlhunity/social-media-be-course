import { Base } from 'shared/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PostMediaType } from '../enums/post-media-type.enum';
import { Post } from './post.entity';

@Entity()
export class PostMedia extends Base {
  @ManyToOne(() => Post, (post) => post.postMedias)
  post!: Post;

  @Column({ type: 'enum', enum: PostMediaType })
  postMediaType!: PostMediaType;

  @Column({ type: 'varchar', length: 2048 })
  media!: string;
}
