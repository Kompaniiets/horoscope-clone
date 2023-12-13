import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongooseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if(!validObjectId) {
      throw new BadRequestException('Invalid object ID');
    }

    return <Types.ObjectId>Types.ObjectId.createFromHexString(value);
  }
}
