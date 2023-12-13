import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaTypes, Types } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';

export const defaultSchemaOptions = {
  versionKey: false,
  virtuals: true,
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

@Schema(defaultSchemaOptions)
export class AbstractDocument {
  @Exclude()
  @Type(() => String)
  @Prop({ type: SchemaTypes.ObjectId })
  @ApiProperty({ name: 'id', type: String })
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
