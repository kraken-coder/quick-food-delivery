import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';

@Module({
  controllers: [OnboardingController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [OnboardingService],
})
export class OnboardingModule {}
