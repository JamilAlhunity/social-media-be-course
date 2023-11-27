"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(createPostDto) {
        Object.assign(this, createPostDto);
    }
    updateOne(updatePostDto) {
        Object.assign(this, { ...this, ...updatePostDto });
    }
    addAuthor(author) {
        this.author = author;
    }
}
exports.Post = Post;
//# sourceMappingURL=post.entity.js.map