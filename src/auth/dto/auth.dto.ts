import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsEmail({}, { message: 'O e-mail inserido não é válido.' })
    @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
    email: string;

    @IsString({ message: 'A senha deve ser uma string.' })
    @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
    password: string;
}
