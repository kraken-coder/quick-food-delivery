import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config';
import { OnboardingModule } from './onboarding/onboarding.module';
import { Connection } from 'typeorm';
import { User } from './onboarding/entities/User.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

const envConfig = ConfigModule.forRoot({
  load: [appConfig],
});

const typeOrmConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
});

const eventEmitterConfig = EventEmitterModule.forRoot();

@Module({
  imports: [envConfig, OnboardingModule, typeOrmConfig, eventEmitterConfig],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
