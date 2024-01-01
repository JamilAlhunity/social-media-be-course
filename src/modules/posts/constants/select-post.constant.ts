import { FindOptionsSelect } from 'typeorm';
import { Post } from '../entities/post.entity';

export const selectPost: string[] | FindOptionsSelect<Post> = [
  'id',
  'createdAt',
  'text',
  'postMedias',
];

export const relationSelectPost: FindOptionsSelect<Post> = {
  id: true,
  createdAt: true,
  text: true,
  postMedias: true,
};
