import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, User, UserType } from '@prisma/client';
import { ReturnUserDTO } from '../../Dto/user-dto';
import { AddUserDTO } from '../../Dto/add-user-dto';
import { plainToInstance } from 'class-transformer';
import { Logger } from '@nestjs/common';
import { UpdateUserDTO } from '../../Dto/update-user-dto';
import { passwordHash } from '../../../common/common';
@Injectable()
export class UserService {
  UserNotFound = new NotFoundException('User not found');
  async updateUser(userID: number, dto: UpdateUserDTO) {
    let password;
    const nickname = dto.nickname;
    if (dto.password) {
      password = await passwordHash(dto.password);
    }
    let updatedUser;
    try {
      updatedUser = await this.prisma.user.update({
        where: {
          id: userID,
        },
        data: { ...dto, nickname, password },
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2015') {
          throw this.UserNotFound;
        }
      }
      throw e;
    }
    return plainToInstance(ReturnUserDTO,updatedUser);

  }
  async deleteUser(id: number) {
    await this.prisma.user.deleteMany({ where: { id: id } });
  }
  async getUsers() {
    const users: User[] = await this.prisma.user.findMany();
    return users.map((user) => {
      return plainToInstance(ReturnUserDTO, user);
    });
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id: id } });
    if (!user) throw this.UserNotFound;
    return plainToInstance(ReturnUserDTO, user);
  }
  constructor(private prisma: PrismaService) {}

  async addUser(dto: AddUserDTO) {
    Logger.debug('Adding new user');
    const user = this.prisma.user
      .create({
        data: {
          email: dto.email,
          password: await passwordHash(dto.password),
          userType: UserType.USER,
          nickname: dto.nickname,
        },
      })
      .catch(() => {
        throw new HttpException(
          'User with defined email already exists',
          HttpStatus.CONFLICT
        );
      });
    return plainToInstance(ReturnUserDTO, user);
  }
}
