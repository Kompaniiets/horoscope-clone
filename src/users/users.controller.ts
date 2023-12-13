import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './schema/user.schema';
import { AuthGuard } from '../common/guards';
import { UserInfo } from '../common/decorators';
import { getZodiacSign } from '../common/helpers';
import { ErrorDto } from '../common/dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiOperation({ summary: 'Create new user in the system' })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const sign = getZodiacSign(createUserDto.dateOfBirth);
    return this.usersService.create({
      ...createUserDto,
      sign
    });
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user personal data' })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async update(@UserInfo() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const sign = getZodiacSign(updateUserDto.dateOfBirth);
    return this.usersService.findByIdAndUpdate(user._id, { ...updateUserDto, sign });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user personal data' })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async findOne(@UserInfo() user: User): Promise<User> {
    return this.usersService.findById(user._id);
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'User account deleted successfully' })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async delete(@UserInfo() user: User): Promise<void> {
    await this.usersService.remove(user._id);
  }
}
