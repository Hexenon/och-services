import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { config } from "../config";
import { MAIL_QUEUE } from "../queues/queues";
import { BullModule } from "@nestjs/bull";
import { MailQueue } from "./mail.queue";

@Module({
  imports: [
    MailerModule.forRoot({
      //gmail transport
      transport: {
        service: "gmail",
        host: config.emailSender.host,
        port: config.emailSender.port,
        secure: false,
        tls: {
          rejectUnauthorized: false,
          ciphers: "SSLv3",
        },
        auth: {
          user: config.emailSender.username,
          pass: config.emailSender.password,
        },
      },
      defaults: {
        from: `"OCH" <${config.fromEmail}>`,
      },
      template: {
        dir: __dirname + "/../resources/email-templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailQueue, MailService],
  exports: [MailQueue, MailService],
})
export class MailModule {}
