import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class CreateMedia {
  private prisma: PrismaService;
  private title: string;
  private username: string;

  constructor(prisma: PrismaService, title?: string, username?: string) {
    this.prisma = prisma;
    this.title = title;
    this.username = username;
  }

  async create() {
    return this.prisma.media.create({
      data: {
        title: this.title ? this.title : faker.lorem.word(),
        username: this.username ? this.username : faker.person.firstName(),
      },
    });
  }
}
