import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateMedia } from './createMedia';
import { CreatePost } from './createPosts';

export class CreatePublication {
  private prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async create(date?: Date) {
    const media = await new CreateMedia(this.prisma).create();
    const post = await new CreatePost(this.prisma).create();
    return this.prisma.publication.create({
      data: {
        date: date ? date : faker.date.future(),
        mediaId: media.id,
        postId: post.id,
      },
    });
  }
}
