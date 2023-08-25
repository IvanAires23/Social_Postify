import { HttpException, HttpStatus } from "@nestjs/common";

export class PublicationForBidden extends HttpException {
    constructor(private id: number) {
        super(`publication with id ${id} has already been published`, HttpStatus.FORBIDDEN)
    }
}