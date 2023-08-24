import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";

@Injectable()
export class PublicationsRepository {

    constructor(private readonly prisma: PrismaService) { }

    createPublication(data: CreatePublicationDto) {
        return this.prisma.publication.create({ data })
    }

    findPublication() {
        return this.prisma.publication.findMany()
    }

    findOnePublication(id: number) {
        return this.prisma.publication.findMany({ where: { id } })
    }

    updatePublication(id: number, data: UpdatePublicationDto) {
        return this.prisma.publication.update({
            where: { id },
            data
        })
    }

    deletePublication(id: number) {
        return this.prisma.publication.delete({ where: { id } })
    }

}