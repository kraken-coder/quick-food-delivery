import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config';
import { Connection } from 'typeorm';

const envConfig = ConfigModule.forRoot({
  load: [appConfig],
});

const typeOrmConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'listing-service-db', //process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: true,
});

@Module({
  imports: [envConfig, typeOrmConfig],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
