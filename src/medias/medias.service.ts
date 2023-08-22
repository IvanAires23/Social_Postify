import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediasService {
  private medias: Media[]

  constructor() {
    this.medias = []
  }

  create(createMediaDto: CreateMediaDto) {
    const { title, username } = createMediaDto
    return this.medias.push(new Media(title, username));
  }

  findAll() {
    return this.medias;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
