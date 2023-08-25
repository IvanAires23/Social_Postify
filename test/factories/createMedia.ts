import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export async function createMedia(prisma: PrismaService) {
    return await prisma.media.create({
        data: {
            title: faker.commerce.department(),
            username: faker.person.firstName()
        }
    })
}