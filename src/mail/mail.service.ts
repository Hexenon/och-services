import { config } from "../config";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { IMailMessage } from "./mail.queue";
import { InjectQueue } from "@nestjs/bull";
import { MAIL_QUEUE } from "../queues/queues";
import Bull, { Queue } from "bull";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService, // private loginCodesService: LoginCodeService,
    @InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue
  ) {}

  async queueMail(data: IMailMessage, options?: Bull.JobOptions) {
    await this.mailQueue.add("sendMail", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      ...options,
    });
  }

  async sendMail(data: IMailMessage) {
    await this.mailerService.sendMail(data);
    console.log(`Mail send to ${data.to}`);

    // await Promise.all([
    //   await this.loginCodesService.createCode({
    //     code,
    //     email: email,
    //   }),

    //   // sqs.sendSqsMessage({
    //   //   queueUrl,
    //   //   message: {
    //   //     template: emailTemplate,
    //   //   },
    //   // }),
    // ]);
  }
}
