import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";
import { CreateMedia } from "./createMedia";
import { createPost } from "./createPosts";

export async function createPublication(prisma: PrismaService, date?: Date) {
    const media = await new CreateMedia(prisma).create()
    const post = await createPost(prisma)
    return await prisma.publication.create({
        data: {
            date: date ? date : faker.date.future(),
            mediaId: media.id,
            postId: post.id
        }
    })
}