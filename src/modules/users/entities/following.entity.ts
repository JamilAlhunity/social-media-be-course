import { Base } from 'shared/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Following extends Base {
  @ManyToOne(() => User, (user) => user.followings)
  author!: User;

  @Column('int')
  follower!: User;
}
