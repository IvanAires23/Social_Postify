import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { PostNotFound } from './errors/PostNotFound';
import { PostForbidden } from './errors/PostForbidden';

@Injectable()
export class PostsService {

  constructor(private readonly repository: PostsRepository) { }

  async create(createPostDto: CreatePostDto) {
    return await this.repository.createPost(createPostDto)
  }

  async findAll() {
    return await this.repository.findPost();
  }

  async findOne(id: number) {
    const postSingle = await this.repository.findOnePost(id)
    if (postSingle.length === 0) throw new PostNotFound(id)
    return postSingle
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id)
    if (post.length === 0) throw new PostNotFound(id)
    return await this.repository.updatePost(id, updatePostDto)
  }

  async remove(id: number) {

    const post = await this.findOne(id)
    if (post.length === 0) throw new PostNotFound(id)
    const publication = await this.repository.findPublicationForPost(id)
    if (publication.Publication.length > 0) throw new PostForbidden(id)
    return await this.repository.deletePost(id)
  }
}
