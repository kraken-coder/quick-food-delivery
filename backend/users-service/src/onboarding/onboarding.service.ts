import { PhoneDto } from './dto/phoneVerification.dto';
import { Injectable, Logger } from '@nestjs/common';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PhoneUtil } from '../utils';
import { Twilio } from 'twilio';
import { Response } from 'express';

const twilioInstace = new Twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN,
);
@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);
  private twilioClient = new PhoneUtil(twilioInstace);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createOnboardingDto: CreateOnboardingDto): Promise<User> {
    try {
      const newUser = this.usersRepository.create(createOnboardingDto);
      await this.usersRepository.save(newUser);

      this.eventEmitter.emit('user.created', {
        userId: newUser.id,
        phone: newUser.phone,
      });

      return newUser;
    } catch (error) {
      this.logger.error('Something went wrong creating user', '' + error);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} onboarding`;
  }

  update(id: number, updateOnboardingDto: UpdateOnboardingDto) {
    return `This action updates a #${id} onboarding`;
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete({ id });
  }

  async verifyPhone(payload: PhoneDto, res: Response): Promise<void> {
    try {
      const { phone } = await this.usersRepository.findOne(payload.id);

      const sid: string = process.env.VERIFY_SID;

      const verificationResult = await this.twilioClient.verify(
        sid,
        payload.code,
        phone,
      );

      if (verificationResult === 'approved') {
        res.status(200).json({ message: 'Verification Successful' });
        this.eventEmitter.emit('verification.success', phone);
        return;
      } else {
        res.status(400).json({ message: 'Verification  was Unsuccessful' });
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  @OnEvent('user.created')
  async handleUserCreateEvent(payload: any) {
    const sid: string = process.env.VERIFY_SID;
    await this.twilioClient.sendCode(payload.phone, sid);
  }
  @OnEvent('verification.success')
  async handlePhoneVerficationEvent(payload: string) {
    await this.usersRepository.update(
      { phone: payload },
      { isVerifiedPhone: true },
    );
  }
}
