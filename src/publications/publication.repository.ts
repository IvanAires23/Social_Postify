import { Injectable } from "@nestjs/common";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdatePublicationDto } from "./dto/update-publication.dto";

@Injectable()
export class PublicationRepository {

    constructor(private readonly prisma: PrismaService) { }

}