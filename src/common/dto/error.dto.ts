import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto implements Error {
  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string | string[] | any;

  @ApiProperty({
    default: HttpStatus.INTERNAL_SERVER_ERROR
  })
  status: number;
}
