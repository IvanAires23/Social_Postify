import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export async function createPost(prisma: PrismaService) {
    return await prisma.post.create({
        data: {
            title: faker.word.words(5),
            text: faker.internet.url(),
            image: faker.image.url()
        }
    })
}