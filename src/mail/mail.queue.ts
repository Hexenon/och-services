import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MAIL_QUEUE } from '../queues/queues';
import { MailService } from './mail.service';

export interface IMailMessage {
  template: string;
  to: string;
  context: Record<string, unknown>;
  subject: string;
}

@Processor(MAIL_QUEUE)
export class MailQueue {
  constructor(private readonly _mailService: MailService) {}

  @Process('sendMail')
  async finish(job: Job<IMailMessage>) {
    try {
      await this._mailService.sendMail(job.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
