import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as yup from 'yup';

@Injectable()
export class UserService {
  phoneSchema = yup
    .string()
    .matches(/^\+[0-9]{3}(\d+)\d{3}\d{2}\d{2}/g)
    .required()
    .max(12);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findAdminByChatId(user: any) {
    if (user?.chatId == process.env.ADMIN_USER_ID?.split(',')) {
      return true;
    }
    let is_admin = false;
    process.env.ADMIN_USER_ID?.split(',').forEach((admin) => {
      if (user?.chatId == admin) {
        is_admin = true;
      }
    });
    return is_admin;
  }

  async findUserByChatId(chatId: number) {
    return await this.userRepository.findOne({ where: { chatId: chatId } });
  }

  async findUser(phone: string) {
    return await this.userRepository.findOne({ where: { phone: phone } });
  }

  async saveUser(dto: CreateUserDto) {
    await this.userRepository.save(dto);
  }
}
