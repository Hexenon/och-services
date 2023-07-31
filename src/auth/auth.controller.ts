import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../schemas/user.schema";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() body: { email: string; password: string }
  ): Promise<User> {
    const { email, password } = body;

    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
    }

    return this.authService.createUser(email, password);
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string }
  ): Promise<{ accessToken: string }> {
    const { email, password } = body;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.authService.generateJwtToken(user);
    return { accessToken };
  }
}
