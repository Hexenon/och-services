import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User, UserSchema } from "../schemas/user.schema";
import { config } from "../config";
import { AuthCodes, AuthCodesSchema } from "../schemas/auth-codes";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthCodes.name, schema: AuthCodesSchema },
    ]),
    MailModule,
    JwtModule.register({
      secret: config.appKey,
      signOptions: { expiresIn: "99d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
