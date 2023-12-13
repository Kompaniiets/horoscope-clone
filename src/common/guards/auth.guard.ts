import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { User } from '../../users/schema/user.schema';
import { UsersService } from '../../users/users.service';

const ERROR_MESSAGE = 'Invalid authentication credentials';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let user: User;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    try {
      const { id } = await this.jwtService.verifyAsync(token);
      user = await this.usersService.findById(id);
    } catch(error) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    if(!user) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    // Assign user data to the request object
    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
