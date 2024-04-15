import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // gerar a senha com hash
     const hash = argon.hash(dto.password)

    // salvar new user no banco

    //retornar novo usuario

    return { msg: 'signup' };
  }
  signin() {
    return { msg: 'signin' };
  }
}
