import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';


@Injectable()
export class MediasService {

  constructor(private readonly mediasRepository: MediasRepository) { }

  async create(body: CreateMediaDto) {
    const { title, username } = body
    return await this.mediasRepository.createMedia(title, username)
  }

  async findAll() {
    return await this.mediasRepository.findAllMedias();
  }

  async findOne(id: number) {
    return await this.mediasRepository.findOneMedia(id)
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
