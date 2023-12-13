import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const databaseAsyncConfig = {
  useFactory: async(configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
    const uri = configService.get('database.uri');
    const database = configService.get('database.database');

    return {
      uri,
      dbName: database
    };
  },
  inject: [ConfigService]
};
