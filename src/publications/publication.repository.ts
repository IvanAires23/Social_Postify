import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPublication(data: CreatePublicationDto) {
    return this.prisma.publication.create({ data });
  }

  findPublication() {
    return this.prisma.publication.findMany();
  }

  findPublicationForPublished(time: Date) {
    return this.prisma.publication.findMany({
      where: { date: { lt: time } },
    });
  }

  findPublicationAfterTime(time: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: { gt: time },
      },
    });
  }

  findPublicationAfterTimeAndPublished(timeNow: Date, timeAfter: Date) {
    return this.prisma.publication.findMany({
      where: {
        date: {
          lt: timeNow,
          gte: timeAfter,
        },
      },
    });
  }

  findOnePublication(id: number) {
    return this.prisma.publication.findMany({ where: { id } });
  }

  updatePublication(id: number, data: UpdatePublicationDto) {
    return this.prisma.publication.update({
      where: { id },
      data,
    });
  }

  deletePublication(id: number) {
    return this.prisma.publication.delete({ where: { id } });
  }
}
