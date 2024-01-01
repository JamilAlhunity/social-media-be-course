import { User } from 'modules/users/entities/user.entity';
import { Base } from 'shared/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PostMedia } from './post-media.entity';

@Entity()
export class Post extends Base {
  @ManyToOne(() => User, (author) => author.posts)
  author!: User;

  @Column({ type: 'varchar', length: 2200, nullable: true })
  text?: string;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.post)
  postMedias!: PostMedia[];
}
