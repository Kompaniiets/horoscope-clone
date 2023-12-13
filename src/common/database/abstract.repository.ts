import { NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  ClientSession,
  QueryOptions,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult
} from 'mongoose';

import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected constructor(
    protected readonly model: Model<TDocument>,
    protected readonly connection: Connection
  ) {
  }

  /** Create document block */

  async create(
    document: Partial<Omit<TDocument, '_id'>>,
    options?: SaveOptions
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId()
    });

    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  /** Find document block */

  async findById(id: Types.ObjectId): Promise<TDocument> {
    const document = await this.model.findById(id);

    if(!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery);

    if(!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery);
  }

  /** Update document block */

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, { new: true });

    if(!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model.findByIdAndUpdate(id, update, { new: true })

    if(!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>
  ): Promise<TDocument> {
    const options = { upsert: true, new: true };
    return this.model.findOneAndUpdate(filterQuery, document, options);
  }

  async updateMany(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TDocument> | null
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filterQuery, update, options);
  }

  /** Delete document block */

  async remove(id: Types.ObjectId): Promise<TDocument> {
    return this.model
      .findByIdAndDelete(id)
      .exec();
  }


  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();

    return session;
  }
}
