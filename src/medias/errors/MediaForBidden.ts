import { HttpException, HttpStatus } from '@nestjs/common';

export class MediaForbidden extends HttpException {
  constructor(private mediaId: number) {
    super(`Media ${mediaId} cannot be deleted`, HttpStatus.FORBIDDEN);
  }
}
