import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Permission } from './entities/permission.entity';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
// import * as crypto from 'crypto';

// const md5 = (str: string) => {
//   const _hash = crypto.createHash('md5');
//   _hash.update(str);
//   return _hash.digest('hex');
// };

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async initData() {
    const permission1 = new Permission();
    permission1.name = 'create_aaa';
    permission1.desc = '新增 aaa';

    const permission2 = new Permission();
    permission2.name = 'update_aaa';
    permission2.desc = '修改 aaa';

    const permission3 = new Permission();
    permission3.name = 'remove_aaa';
    permission3.desc = '删除 aaa';

    const permission4 = new Permission();
    permission4.name = 'query_aaa';
    permission4.desc = '查询 aaa';

    const permission5 = new Permission();
    permission5.name = 'create_bbb';
    permission5.desc = '新增 bbb';

    const permission6 = new Permission();
    permission6.name = 'update_bbb';
    permission6.desc = '修改 bbb';

    const permission7 = new Permission();
    permission7.name = 'remove_bbb';
    permission7.desc = '删除 bbb';

    const permission8 = new Permission();
    permission8.name = 'query_bbb';
    permission8.desc = '查询 bbb';

    const user1 = new User();
    user1.username = '东东';
    user1.password = 'aaaaaa';
    user1.permissions = [permission1, permission2, permission3, permission4];

    const user2 = new User();
    user2.username = '光光';
    user2.password = 'bbbbbb';
    user2.permissions = [permission5, permission6, permission7, permission8];

    await this.entityManager.save([
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ]);
    await this.entityManager.save([user1, user2]);
  }

  async login(user: LoginDto) {
    const _foundedUser = await this.entityManager.findOneBy(User, {
      username: user.username,
    });
    if (!_foundedUser)
      throw new HttpException('用户未注册', HttpStatus.NOT_ACCEPTABLE);
    if (_foundedUser.password !== user.password)
      throw new HttpException('密码错误', HttpStatus.NOT_ACCEPTABLE);
    return _foundedUser;
  }

  async register(user: RegisterDto) {
    const _foundedUser = await this.entityManager.findOneBy(User, {
      username: user.username,
    });

    if (_foundedUser)
      throw new HttpException('注册用户已存在', HttpStatus.NOT_ACCEPTABLE);
    const _newUser = new User();
    [_newUser.username, _newUser.password] = [user.username, user.password];
    try {
      await this.entityManager.save(_newUser);
      return new HttpException('注册成功', HttpStatus.ACCEPTED);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('注册失败', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async findByUsername(username: string) {
    const _foundedUser = await this.entityManager.findOne(User, {
      where: { username },
      relations: { permissions: true },
    });
    return _foundedUser;
  }
}
