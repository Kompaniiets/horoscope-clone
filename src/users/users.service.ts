import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, SaveOptions } from 'mongoose';

import { AbstractRepository } from '../common/database';
import { CreateUserDto } from './dto';
import { User } from './schema/user.schema';
import { ZodiacSign } from '../common/constants';

@Injectable()
export class UsersService extends AbstractRepository<User> {
  constructor(
    @InjectConnection() connection: Connection,
    @InjectModel(User.name) model: Model<User>
  ) {
    super(model, connection);
  }

  async create(
    createUserDto: CreateUserDto & { sign: ZodiacSign },
    options?: SaveOptions
  ): Promise<User> {
    const user: User = await this.findByDeviceUuid(createUserDto.deviceUuid);
    if(user) {
      return user;
    }

    return super.create(createUserDto, options);
  }

  async findByDeviceUuid(deviceUuid: string): Promise<User> {
    return this.model
      .findOne({ deviceUuid })
      .exec();
  }
}
