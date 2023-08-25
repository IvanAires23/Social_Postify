import { HttpException, HttpStatus } from "@nestjs/common";

export class PublicationNotFound extends HttpException {
    constructor(private id: number) {
        super(`publication with id ${id} not found`, HttpStatus.NOT_FOUND)
    }
}