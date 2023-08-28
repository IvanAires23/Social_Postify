import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export class CreatePost {
    private prisma: PrismaService

    constructor(prisma: PrismaService) {
        this.prisma = prisma
    }

    async create() {
        return this.prisma.post.create({
            data: {
                title: faker.word.words(5),
                text: faker.internet.url(),
                image: faker.image.url()
            }
        })
    }
}