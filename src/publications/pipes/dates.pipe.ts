/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';

export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string, metadata: ArgumentMetadata): Date {
    if (!value) return undefined;

    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime()))
      throw new HttpException(`Invalid date: ${value}`, HttpStatus.BAD_REQUEST);

    return parsedDate;
  }
}
