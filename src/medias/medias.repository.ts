import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Injectable()
export class MediasRepository {

    constructor(private readonly prisma: PrismaService) { }

    createMedia(data: CreateMediaDto) {
        return this.prisma.media.create({ data })
    }

    findRepeatedMedia(title: string, username: string) {
        return this.prisma.media.findUnique({
            where: {
                username_title: {
                    title, username
                }
            }
        })
    }

    findOneMedia(id: number) {
        return this.prisma.media.findFirst({
            where: {
                id
            }
        })
    }

    findAllMedias() {
        return this.prisma.media.findMany()
    }

    findPublicationForMedia(id: number) {
        return this.prisma.media.findFirst({
            where: {
                id
            }, include: {
                Publication: true
            }
        })
    }

    updateMedia(id: number, data: UpdateMediaDto) {
        return this.prisma.media.update({
            where: { id },
            data
        })
    }

    deleteMedia(id: number) {
        return this.prisma.media.delete({ where: { id } })
    }

}