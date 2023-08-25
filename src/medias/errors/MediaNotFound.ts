import { HttpException, HttpStatus } from "@nestjs/common";

export class MediaNotFound extends HttpException {
    constructor(private id: number) {
        super(`Media with id ${id} not found`, HttpStatus.NOT_FOUND)
    }
}