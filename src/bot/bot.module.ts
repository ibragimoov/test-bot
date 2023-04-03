import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { UserModule } from 'src/user/user.module';
import LoginScene from './scenes/login.scene';

@Module({
  imports: [UserModule],
  providers: [BotService, BotUpdate, LoginScene],
})
export class BotModule {}
