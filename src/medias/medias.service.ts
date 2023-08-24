import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';


@Injectable()
export class MediasService {

  constructor(private readonly repository: MediasRepository) { }

  async create(body: CreateMediaDto) {
    const { title, username } = body
    const repeat = await this.repository.findRepeatedMedia(title, username)
    if (repeat) throw new ConflictException('Esta media já existe')
    return await this.repository.createMedia(body)
  }

  async findAll() {
    return await this.repository.findAllMedias();
  }

  async findOne(id: number) {
    const mediaSingle = await this.repository.findOneMedia(id)
    if (!mediaSingle) throw new NotFoundException('Media não encontrada')
    return mediaSingle
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const { title, username } = updateMediaDto
    const repeat = await this.repository.findRepeatedMedia(title, username)
    const update = await this.repository.findOneMedia(id)
    if (repeat) throw new ConflictException()
    if (!update) throw new NotFoundException()
    return await this.repository.updateMedia(id, updateMediaDto)
  }

  async remove(id: number) {
    const exist = await this.repository.findOneMedia(id)
    if (!exist) throw new NotFoundException()
    return await this.repository.deleteMedia(id)
  }
}
