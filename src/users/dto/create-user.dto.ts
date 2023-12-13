import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsEnum } from 'class-validator';

import { Language } from '../../common/constants';
import { DeviceUuidDto } from '../../common/dto';

export class CreateUserDto extends DeviceUuidDto {
  @ApiProperty({
    type: Date,
    description: 'User date of birth',
    examples: ['1993-12-15', '1990-07-07T00:00:00.000+00:00']
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Preferred interface language',
    enum: Language
  })
  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}
