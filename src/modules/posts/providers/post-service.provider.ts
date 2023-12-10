import { PostsService } from '../posts.service';

export const POST_SERVICE_PROVIDER = Symbol('postService');

export const postServiceProvider = {
  provide: POST_SERVICE_PROVIDER,
  useClass: PostsService,
};
