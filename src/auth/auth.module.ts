import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controllers";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwTStrategy } from "src/strategy/jwt.strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwTStrategy]
})
export class AuthModule{}