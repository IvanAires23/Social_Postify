import { HttpException, HttpStatus } from '@nestjs/common';

export class MediaConflict extends HttpException {
  constructor(
    private title: string,
    private username: string,
  ) {
    super(
      `the ${username} is already associated with the ${title}`,
      HttpStatus.CONFLICT,
    );
  }
}
