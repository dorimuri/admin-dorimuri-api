import { Injectable, Inject } from '@nestjs/common';
import { LoginUserDto } from './dto/login-auth.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EauthTopics } from '../lib/enums/kafka/auth.enums';

interface KafkaAuthTopics {
  AUTH: {
    LOGIN: string;
    VERIFY: string;
  };
}

@Injectable()
export class AuthService {

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = Object.values(EauthTopics);
    topics.forEach((t) => this.authClient.subscribeToResponseOf(t));
    await this.authClient.connect();
  }

  login(loginAuthDto: LoginUserDto) {
    return this.authClient.send<any>(EauthTopics.AUTH_TOPIC_VERIFY, {
      loginAuthDto,
    });
  }
}
