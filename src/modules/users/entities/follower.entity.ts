import { Base } from 'shared/entities/base.entity';
import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follower extends Base {
  @ManyToOne(() => User, (user) => user.followers)
  author!: User;

  @OneToOne(() => User)
  following!: User;
}
