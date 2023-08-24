import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publication.repository';
import { PostsModule } from '../posts/posts.module';
import { MediasModule } from '../medias/medias.module';

@Module({
  imports: [MediasModule, PostsModule],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
})
export class PublicationsModule { }
