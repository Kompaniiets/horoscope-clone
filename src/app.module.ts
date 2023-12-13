import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import configuration from './config/configuration';
import { databaseAsyncConfig } from './config/database.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PredictionsModule } from './predictions/predictions.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/'
    }),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    MongooseModule.forRootAsync(databaseAsyncConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PredictionsModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
