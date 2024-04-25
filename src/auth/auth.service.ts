import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // gerar a senha com hash
    const hash = await argon.hash(dto.password);

    // salvar new user no banco
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // nao retornar a senha.
      delete user.hash;

      //retornar novo usuario
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError){
        // olhando se o erro é de duplicaçao de usuarios
        if( error.code === 'P2002'){
          throw new ForbiddenException('E-mail já cadastrado!')
        }
      }
      throw error
    }

  }
  async signin(dto: AuthDto) {
    // encontrar o usuario pelo email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    })
    // se usuario nao existir throw exception
    if (!user) throw new ForbiddenException('Usuário não encontrado!')
    
    // verificar senha
    const pwMatches = await argon.verify(user.hash, dto.password)

    // se senha incorreta throw exception
    if (!pwMatches) throw new ForbiddenException('Senha incorreta')

    // se td ocorrer bem, retornar o usuário
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string; email: string }> {
    const payload = {
      sub: userId,
      email
    };
    const secret = this.config.get('JWT_SECRET');
  
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      }
    );
  
    return {
      email: email,
      access_token: token,
    };
  }
  
}
