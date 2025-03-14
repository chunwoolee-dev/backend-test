import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from '@nestjs/class-validator';
import { BadRequestException } from '@nestjs/common';

@ValidatorConstraint({ async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  private rules: [RegExp, string][] = [
    [/.{8,}/, 'Password must be at least 8 characters long'],
    [/[A-Z]/, 'Password must contain at least one uppercase letter'],
    [/[a-z]/, 'Password must contain at least one lowercase letter'],
    [/\d/, 'Password must contain at least one number'],
  ];

  validate(password: string): boolean {
    for (const [regexp, reason] of this.rules) {
      if (regexp.test(password)) continue;
      throw new BadRequestException({ statusCode: 400, message: reason });
    }
    return true;
  }
}

export function IsPassword() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
