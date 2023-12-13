import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

import { Language, ZodiacSign } from '../../common/constants';
import { AbstractDocument, defaultSchemaOptions } from '../../common/database';

export type UserDocument = User & mongoose.Document;

@Schema({ ...defaultSchemaOptions, collection: 'users' })
export class User extends AbstractDocument {
  @ApiProperty({ type: Date })
  @Prop({ type: Date, required: true })
  dateOfBirth: Date;

  @ApiProperty({ enum: Language })
  @Prop({ type: String, required: true, enum: Language })
  language: Language;

  @ApiProperty({ enum: ZodiacSign })
  @Prop({ type: String, required: true, enum: ZodiacSign })
  sign: ZodiacSign;

  @ApiProperty({ format: 'uuid' })
  @Prop({ unique: true, required: true })
  deviceUuid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
