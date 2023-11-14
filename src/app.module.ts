import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';
import { PublicationsModule } from './publications/publications.module';
import { MediasModule } from './medias/medias.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    HealthModule,
    MediasModule,
    PostsModule,
    PublicationsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
