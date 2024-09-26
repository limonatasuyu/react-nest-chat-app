import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
//import { MessageModule } from './message/message.module';
//import { ConfigModule } from '@nestjs/config';
//import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './message/message.gateway';

@Module({
  imports: [
    //MessageModule,
    //ConfigModule.forRoot(),
    //MongooseModule.forRoot(
    //  process.env.NODE_ENV !== 'production'
    //    ? 'mongodb://127.0.0.1:27017/inventory?replicaSet=rs0'
    //    : process.env.DB_URL,
    //),
  ],
  //controllers: [],
  providers: [MessageGateway],
})
export class AppModule {}
