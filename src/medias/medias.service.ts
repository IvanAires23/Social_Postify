import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { MediaNotFound } from './errors/MediaNotFound';
import { MediaConflict } from './errors/MediaConflict';
import { MediaForbidden } from './errors/MediaForBidden';


@Injectable()
export class MediasService {

  constructor(
    private readonly repository: MediasRepository) { }


  async create(body: CreateMediaDto) {
    const { title, username } = body
    const repeat = await this.repository.findRepeatedMedia(title, username)
    if (repeat) throw new MediaConflict(title, username)
    return await this.repository.createMedia(body)
  }

  async findAll() {
    return await this.repository.findAllMedias();
  }

  async findOne(id: number) {
    const mediaSingle = await this.repository.findOneMedia(id)
    if (mediaSingle.length === 0) throw new MediaNotFound(id)
    return mediaSingle
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const { title, username } = updateMediaDto
    await this.findOne(id)
    const repeat = await this.repository.findRepeatedMedia(title, username)
    if (repeat) throw new MediaConflict(title, username)
    return await this.repository.updateMedia(id, updateMediaDto)
  }

  async remove(id: number) {
    const exist = await this.repository.findOneMedia(id)
    if (exist.length === 0) throw new MediaNotFound(id)
    const publication = await this.repository.findPublicationForMedia(id)
    if (publication.length >= 1) throw new MediaForbidden(id)
    return await this.repository.deleteMedia(id)
  }
}
