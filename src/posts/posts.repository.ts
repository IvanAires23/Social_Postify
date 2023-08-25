import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsRepository {

    constructor(private readonly prisma: PrismaService) { }

    createPost(data: CreatePostDto) {
        return this.prisma.post.create({ data })
    }

    findPost() {
        return this.prisma.post.findMany()
    }

    findOnePost(id: number) {
        return this.prisma.post.findMany({ where: { id } })
    }

    findPublicationForPost(id: number) {
        return this.prisma.publication.findFirst({
            where: {
                postId: id
            }
        })
    }

    updatePost(id: number, updatePostDto: UpdatePostDto) {
        return this.prisma.post.update({
            where: { id },
            data: updatePostDto
        })
    }

    deletePost(id: number) {
        return this.prisma.post.delete({ where: { id } })
    }

}