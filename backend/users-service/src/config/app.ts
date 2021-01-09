import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  PORT: parseInt(process.env.PORT) || 3001,
}));
