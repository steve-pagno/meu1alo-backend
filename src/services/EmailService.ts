import nodemailer from 'nodemailer';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    private static getLogoUrl(): string {
        const port = process.env.SERVER_PORT || 8101;
        const baseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;

        return `${baseUrl.replace(/\/$/, '')}/public/logo_branca.png`;
    }

    private static getTemplate(title: string, content: string): string {
        const primaryColor = "#5D307A";
        const logoUrl = this.getLogoUrl();

        return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 40px 0; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <div style="background-color: ${primaryColor}; padding: 30px; text-align: center;">
            <img src="${logoUrl}" alt="Meu Primeiro Alô" style="max-height: 60px; width: auto;" />
            <h1 style="color: #ffffff; font-size: 20px; margin: 10px 0 0 0; font-weight: normal;">${title}</h1>
          </div>

          <div style="padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px;">
            ${content}
          </div>

          <div style="background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Meu Primeiro Alô. Todos os direitos reservados.</p>
            <p style="margin: 5px 0 0 0;">Não responda a este e-mail.</p>
          </div>
        </div>
      </div>
    `;
    }

    static async sendRecoveryEmail(email: string, newPass: string, ipAddress: string, name?: string) {
        try {
            const safeName = String(name ?? "").trim();
            const greeting = safeName ? `Olá, ${safeName}!` : "Olá,";


            const safeIp =
                (ipAddress ?? "").trim() && ipAddress !== "IP não identificado"
                    ? ipAddress
                    : "Não identificado";

            const htmlContent = `
        <h2 style="color: #5D307A; margin-top: 0;">${greeting}</h2>
        <p>Recebemos uma solicitação para redefinir sua senha no <b>Meu Primeiro Alô</b>.</p>
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          A solicitação foi feita a partir do endereço IP: <strong>${safeIp}</strong>
        </p>
        <p>Sua nova senha temporária é:</p>
        <div style="background: #f8f9fa; border: 2px dashed #5D307A; padding: 15px; border-radius: 8px; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 3px; color: #333; margin: 30px 0;">
          ${newPass}
        </div>
        <p>Por questões de segurança, recomendamos que você faça login e altere esta senha imediatamente na área "Meu Perfil".</p>
      `;

            await this.transporter.sendMail({
                from: '"Meu Primeiro Alô" <noreply@meuprimeiroalo.com.br>',
                to: email,
                subject: "Recuperação de Senha - Meu Primeiro Alô",
                html: this.getTemplate("Recuperação de Senha", htmlContent)
            });

            console.log(`Email de recuperação enviado para ${email}`);
            return true;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return false;
        }
    }

    static async sendWelcomeEmail(email: string, name: string) {
        try {
            const htmlContent = `
        <h2 style="color: #5D307A; margin-top: 0;">Bem-vindo, ${name}! 🎉</h2>
        <p>Estamos muito felizes em ter você conosco no <b>Meu Primeiro Alô</b>.</p>
        <p>Seu cadastro foi realizado com sucesso.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="meuprimeiroalo.com.br" style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
            Acessar Minha Conta
          </a>
        </div>
      `;

            await this.transporter.sendMail({
                from: '"Meu Primeiro Alô" <noreply@meuprimeiroalo.com.br>',
                to: email,
                subject: "Bem-vindo ao Meu Primeiro Alô!",
                html: this.getTemplate("Bem-vindo!", htmlContent)
            });

            console.log(`Email de boas-vindas enviado para ${name}`);
            return true;
        } catch (error) {
            console.error("Erro ao enviar email de boas-vindas:", error);
            return false;
        }
    }
}
