import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env['RESEND_API_KEY']);
  }

  async sendClientPassword(
    clientEmail: string,
    password: string
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env['MAIL_FROM'] || 'onboarding@resend.dev',
        to: clientEmail,
        subject: 'Your Account Password',
        html: `
          <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #52525B;">
            <h2 style="font-size: 1.5rem; line-height: 1.2; color: #282828; margin-bottom: 1rem;">Welcome to Forma</h2>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">Your account has been created successfully.</p>
            <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">Here are your login credentials:</p>
            <div style="background-color: #FAFAFA; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; border: 1px solid #D4D4D8;">
              <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 0.5rem;"><strong style="color: #282828;">Email:</strong> ${clientEmail}</p>
              <p style="font-size: 1rem; line-height: 1.5; margin: 0;"><strong style="color: #282828;">Password:</strong> ${password}</p>
            </div>
            <p style="font-size: 0.875rem; line-height: 1.5; color: #A1A1AA; margin-bottom: 1.5rem;">Please change your password after your first login for security purposes.</p>
            <p style="font-size: 1rem; line-height: 1.5; margin: 0;">Best regards,<br/><strong style="color: #33A52F;">The Forma Team</strong></p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send password email');
    }
  }
}
