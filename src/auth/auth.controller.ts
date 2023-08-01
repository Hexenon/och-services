import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ForgotPasswordDTO } from "../dto/validation/forgot-password";
import { LoginEmailDTO } from "../dto/validation/login-email";
import { RegisterDTO } from "../dto/validation/register";
import { ResetPasswordDTO } from "../dto/validation/reset-password";
import { VerifyEmailDTO } from "../dto/validation/verify-email";
import { ThrottlerBehindProxyGuard } from "../resources/guards/throttler-behind-proxy-guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterDTO) {
    const { email, password } = body;
    await this.authService.register(email, password);
    return { success: true };
  }

  @Post("verifyEmail")
  async verifyEmail(@Body() body: VerifyEmailDTO) {
    const { code, email } = body;
    await this.authService.verifyEmail(code, email);
    return { success: true };
  }

  @Post("loginEmail")
  async loginWithEmail(@Body() body: LoginEmailDTO) {
    const { email, password } = body;
    const token = await this.authService.loginWithEmail(email, password);
    return { success: true, token };
  }

  @Get("/checkEmail/:email")
  async checkEmail(@Param("email") email: string) {
    const exists = await this.authService.checkEmail(email);
    return { success: true, exists };
  }

  @Post("/forgotPassword")
  @UseGuards(ThrottlerBehindProxyGuard)
  @Throttle(1, 60)
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    await this.authService.forgotPassword(body.email);
    return { success: true };
  }

  @Post("/resetPassword")
  async resetPassword(@Body() body: ResetPasswordDTO) {
    const { code, email, password } = body;
    await this.authService.resetPassword(code, email, password);

    return { success: true };
  }
}
