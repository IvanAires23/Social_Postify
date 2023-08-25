import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";
import { createMedia } from "./createMedia";
import { createPost } from "./createPosts";

export async function createPublication(prisma: PrismaService) {
    const media = await createMedia(prisma)
    const post = await createPost(prisma)
    return await prisma.publication.create({
        data: {
            date: faker.date.future(),
            mediaId: media.id,
            postId: post.id
        }
    })
}