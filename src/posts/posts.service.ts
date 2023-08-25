import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

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
    if (postSingle.length === 0) throw new NotFoundException('Post não encontrado')
    return postSingle
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id)
    if (post.length === 0) throw new NotFoundException()
    return await this.repository.updatePost(id, updatePostDto)
  }

  async remove(id: number) {
    const post = await this.findOne(id)
    if (post.length === 0) throw new NotFoundException()
    const publication = await this.repository.findPublicationForPost(id)
    if (publication) throw new ForbiddenException()
    return await this.repository.deletePost(id)
  }
}
