import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publication.repository';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicationsService {

  constructor(
    private readonly repository: PublicationsRepository,
    private readonly mediasSevice: MediasService,
    private readonly postsSevice: PostsService
  ) { }

  async create(createPublicationDto: CreatePublicationDto) {
    await this.mediasSevice.findOne(createPublicationDto.mediaId)
    await this.postsSevice.findOne(createPublicationDto.postId)
    return await this.repository.createPublication(createPublicationDto);
  }

  async findAll() {
    return await this.repository.findPublication();
  }

  async findOne(id: number) {
    const publication = await this.repository.findOnePublication(id);
    if (publication.length === 0) throw new NotFoundException()
    return publication
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    await this.mediasSevice.findOne(updatePublicationDto.mediaId)
    await this.postsSevice.findOne(updatePublicationDto.postId)
    const publicationExist = await this.repository.findOnePublication(id)
    if (publicationExist.length === 0) throw new NotFoundException()
    return await this.repository.updatePublication(id, updatePublicationDto);
  }

  async remove(id: number) {
    const publicationExist = await this.repository.findOnePublication(id)
    if (publicationExist.length === 0) throw new NotFoundException()
    return await this.repository.deletePublication(id);
  }
}
