import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      // gerando hash na senha
      const hash = await argon.hash(dto.password);
      // salvando novo usuario no banco de dados
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      //excluindo a senha do retorno, por segurança
      delete user.hash;

      // retornando o usuario salvo
      return user;
    } catch (error) {
      //  tratamento de erro para evitar dados duplicados
      if (error instanceof PrismaClientKnownRequestError) {
        //cod prisma p dado exclusivo duplicado
        if (error.code === 'P2002') {
          throw new ForbiddenException('E-mail já cadastrado!');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //encontrar o usuario pelo email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //se o user nao existir lançar um trow exception CONDIÇÃO DE GUARDA
    if (!user) throw new ForbiddenException('E-mail incorreto!');

    //comparar a senha
    const pwMatches = await argon.verify(user.hash, dto.password);
    
    //se a senha nao existir mandar um throw exception
    if (!pwMatches) 
    throw new ForbiddenException(
      'Senha incorreta!'
    );

    //se estiver correto, mandar o usuario de volta
    delete user.hash;
    return user;
  }
}
