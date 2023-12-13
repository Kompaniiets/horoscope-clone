import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto } from '../dto';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { status, message, name, response: exceptionResponse } = exception;

    let error: ErrorDto = {
      name,
      message,
      status: status || HttpStatus.INTERNAL_SERVER_ERROR
    };

    switch(exception.constructor) {
      case BadRequestException: {
        error.message = exceptionResponse?.message || 'Validation error';
        break;
      }
      default: {
        // Default error implementation
      }
    }

    this.logger.error(error.message, exception?.stack);

    response
      .status(error.status)
      .json(error);
  }
}
