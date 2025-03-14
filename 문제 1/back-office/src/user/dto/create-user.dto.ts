import { IsEmail, Length } from '@nestjs/class-validator';
import { IsPassword } from 'src/decorators/class-validator.decorator';
export class CreateUserDto {
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsPassword()
  password: string;
}
