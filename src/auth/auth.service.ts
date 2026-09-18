import { Injectable, Inject } from '@nestjs/common';
import { LoginUserDto } from './dto/login-auth.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface KafkaAuthTopics {
  AUTH: {
    LOGIN: string;
    VERIFY: string;
  };
}

@Injectable()
export class AuthService {
  private readonly kafkaTopics: KafkaAuthTopics;

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientKafka,
    private configService: ConfigService,
  ) {
    this.kafkaTopics = this.configService.getOrThrow<KafkaAuthTopics>('kafka');
  }

  async onModuleInit() {
    const topics = Object.values(this.kafkaTopics.AUTH);
    topics.forEach((t) => this.authClient.subscribeToResponseOf(t));
    await this.authClient.connect();
  }

  login(loginAuthDto: LoginUserDto) {
    return this.authClient.send<any>(this.kafkaTopics.AUTH.VERIFY, {
      loginAuthDto,
    });
  }
}
