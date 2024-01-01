import { Base } from 'shared/entities/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Following extends Base {
  @ManyToOne(() => User, (user) => user.followings)
  author!: User;

  @ManyToOne(() => User)
  follower!: User;
}
