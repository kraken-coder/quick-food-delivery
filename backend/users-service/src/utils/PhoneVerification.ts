import { Twilio } from 'twilio';

class Verification {
  constructor(private twilio: Twilio) {
    this.sendCode = this.sendCode.bind(this);
    this.createService = this.createService.bind(this);
  }

  async createService() {
    return await this.twilio.verify.services.create({
      friendlyName: 'Quick food Delivery',
    });
  }

  async sendCode(phone: string, sid: string) {
    return await this.twilio.verify
      .services(sid)
      .verifications.create({ to: phone, channel: 'sms' });
  }

  async verify(sid: string, code: string, phone: string): Promise<string> {
    try {
      const res = await this.twilio.verify
        .services(sid)
        .verificationChecks.create({ code, to: phone });
      return res?.status;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Verification;
