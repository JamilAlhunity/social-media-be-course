import { Post } from 'modules/posts/entities/post.entity';
import { Base } from 'shared/entities/base.entity';
import { Gender } from 'shared/enums/gender.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { AccountStatus } from '../enums/account-status.enum';
import { ProfileStatus } from '../enums/profile-status.enum';
import { Follower } from './follower.entity';
import { Following } from './following.entity';

@Entity()
export class User extends Base {
  @Column({ type: 'varchar', length: 30, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ type: 'varchar', length: 29 })
  birthday!: string;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus!: AccountStatus;

  @Column({ type: 'enum', enum: ProfileStatus, default: ProfileStatus.PUBLIC })
  profileStatus!: ProfileStatus;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @OneToMany(() => Follower, (follower) => follower.author)
  followers!: Follower[];

  @OneToMany(() => Following, (following) => following.author)
  followings!: Following[];
}
