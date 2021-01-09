import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PhoneDto } from './dto/phoneVerification.dto';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { Response } from 'express';
import { User } from './entities/User.entity';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('register')
  async create(
    @Body() createOnboardingDto: CreateOnboardingDto,
  ): Promise<User> {
    return await this.onboardingService.create(createOnboardingDto);
  }

  @Get('users')
  async findAll(): Promise<User[]> {
    return await this.onboardingService.findAll();
  }

  @Post('verify')
  async verifyPhone(
    @Body() body: PhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.onboardingService.verifyPhone(body, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onboardingService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ) {
    return this.onboardingService.update(+id, updateOnboardingDto);
  }

  @Delete('user/:id')
  remove(@Param('id') id: string) {
    return this.onboardingService.remove(id);
  }
}
