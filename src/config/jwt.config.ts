import { ConfigService } from '@nestjs/config';

export default {
  useFactory: async(configService: ConfigService) => ({
    global: true,
    secret: configService.get('jwt.secret')
  }),
  inject: [ConfigService]
};
