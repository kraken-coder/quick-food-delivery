import { Injectable, Logger } from '@nestjs/common';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PhoneUtil } from '../utils';
import { Twilio } from 'twilio';

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

  remove(id: number) {
    return `This action removes a #${id} onboarding`;
  }

  @OnEvent('user.created')
  async handleUserCreateEvent(payload: any) {
    const service = await this.twilioClient.createService();
    await this.twilioClient.sendCode(payload.phone, service.sid);
  }
}
