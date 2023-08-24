import { PrismaService } from "../prisma/prisma.service";
import { CreateMediaDto } from "./dto/create-media.dto";

export class MediasRepository {

    constructor(private readonly prisma: PrismaService) { }

    createMedia(title: string, username: string) {
        return this.prisma.media.create({
            data: {
                title,
                username
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

    async findAllMedias() {
        return await this.prisma.media.findMany()
    }
}