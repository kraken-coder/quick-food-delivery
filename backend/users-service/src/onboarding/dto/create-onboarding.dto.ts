export class CreateOnboardingDto {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  isVerifiedPhone?: boolean;
  email?: string;
}
