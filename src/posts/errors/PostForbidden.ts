import { HttpException, HttpStatus } from "@nestjs/common";

export class PostForbidden extends HttpException {
    constructor(private postId: number) {
        super(`Post ${postId} cannot be deleted`, HttpStatus.FORBIDDEN)
    }
}