import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOTPEmail(email: string, otp: string, userName?: string): Promise<void> {
    try {
      const htmlContent = this.getOTPEmailTemplate(otp, userName);

      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'E-Commerce Support'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Code de vérification - Réinitialisation de mot de passe',
        html: htmlContent,
      });

      console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  private getOTPEmailTemplate(otp: string, userName?: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0174D8 0%, #0156A8 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                Réinitialisation de mot de passe
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${userName ? `<p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Bonjour ${userName},</p>` : ''}

                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code de vérification ci-dessous pour continuer :
                            </p>

                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #f8f9fa; border: 2px dashed #0174D8; border-radius: 8px; padding: 30px; display: inline-block;">
                                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                                                Votre code de vérification
                                            </p>
                                            <p style="color: #0174D8; font-size: 42px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                ${otp}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                                ⏱️ Ce code expirera dans <strong>15 minutes</strong>
                            </p>

                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
                                    <strong>⚠️ Note de sécurité :</strong><br>
                                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                                Cet email a été envoyé depuis E-Commerce
                            </p>
                            <p style="color: #6c757d; font-size: 12px; margin: 0;">
                                &copy; ${new Date().getFullYear()} E-Commerce. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  async sendOrderCancellationEmailToAdmin(
    adminEmail: string,
    orderDetails: {
      orderNumber: string;
      clientName: string;
      clientEmail: string;
      total: number;
      cancelledAt: Date;
    }
  ): Promise<void> {
    try {
      const htmlContent = this.getOrderCancellationEmailTemplate(orderDetails);

      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'E-Commerce Support'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `❌ Commande annulée - ${orderDetails.orderNumber}`,
        html: htmlContent,
      });

      console.log(`✅ Order cancellation email sent to admin ${adminEmail}`);
    } catch (error) {
      console.error('❌ Error sending order cancellation email:', error);
      throw new Error('Failed to send order cancellation email');
    }
  }

  async sendOrderShippedEmailToClient(
    clientEmail: string,
    orderDetails: {
      orderNumber: string;
      clientName: string;
      total: number;
      estimatedDelivery?: Date | null;
      shippedAt: Date;
    }
  ): Promise<void> {
    try {
      const htmlContent = this.getOrderShippedEmailTemplate(orderDetails);

      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'E-Commerce Support'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: clientEmail,
        subject: `📦 Votre commande ${orderDetails.orderNumber} a été expédiée !`,
        html: htmlContent,
      });

      console.log(`✅ Order shipped email sent to client ${clientEmail}`);
    } catch (error) {
      console.error('❌ Error sending order shipped email:', error);
      throw new Error('Failed to send order shipped email');
    }
  }

  private getOrderCancellationEmailTemplate(orderDetails: {
    orderNumber: string;
    clientName: string;
    clientEmail: string;
    total: number;
    cancelledAt: Date;
  }): string {
    const formattedDate = new Date(orderDetails.cancelledAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Commande annulée</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                ❌ Commande annulée
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Bonjour Administrateur,
                            </p>

                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Un client a annulé sa commande. Voici les détails :
                            </p>

                            <!-- Order Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Numéro de commande :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${orderDetails.orderNumber}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Client :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${orderDetails.clientName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Email :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${orderDetails.clientEmail}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Montant total :</strong>
                                                </td>
                                                <td style="color: #dc2626; font-size: 18px; font-weight: bold; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${orderDetails.total.toLocaleString()} Ar
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px;">
                                                    <strong>Annulée le :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right;">
                                                    ${formattedDate}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
                                    <strong>📊 Action requise :</strong><br>
                                    Le stock des produits a été automatiquement restauré. Vérifiez le statut de la commande dans le tableau de bord administrateur.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                                Cet email a été envoyé automatiquement depuis E-Commerce
                            </p>
                            <p style="color: #6c757d; font-size: 12px; margin: 0;">
                                &copy; ${new Date().getFullYear()} E-Commerce. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  private getOrderShippedEmailTemplate(orderDetails: {
    orderNumber: string;
    clientName: string;
    total: number;
    estimatedDelivery?: Date | null;
    shippedAt: Date;
  }): string {
    const formattedShippedDate = new Date(orderDetails.shippedAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const estimatedDeliveryText = orderDetails.estimatedDelivery
      ? new Date(orderDetails.estimatedDelivery).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Non spécifiée';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Commande expédiée</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0174D8 0%, #0156A8 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                📦 Votre commande est en route !
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Bonjour ${orderDetails.clientName},
                            </p>

                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Bonne nouvelle ! Votre commande a été expédiée et est en route vers vous.
                            </p>

                            <!-- Order Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #f8f9fa; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Numéro de commande :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${orderDetails.orderNumber}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Montant total :</strong>
                                                </td>
                                                <td style="color: #0174D8; font-size: 18px; font-weight: bold; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${orderDetails.total.toLocaleString()} Ar
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; border-bottom: 1px solid #dee2e6;">
                                                    <strong>Expédiée le :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #dee2e6;">
                                                    ${formattedShippedDate}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666666; font-size: 14px;">
                                                    <strong>Livraison estimée :</strong>
                                                </td>
                                                <td style="color: #333333; font-size: 14px; text-align: right;">
                                                    ${estimatedDeliveryText}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <div style="background-color: #d1ecf1; border-left: 4px solid #0174D8; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #0c5460; font-size: 14px; margin: 0; line-height: 1.6;">
                                    <strong>📍 Suivi de commande :</strong><br>
                                    Vous pouvez suivre l'état de votre commande depuis votre espace client dans l'application mobile.
                                </p>
                            </div>

                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                                Merci pour votre confiance ! 🎉
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                                Cet email a été envoyé automatiquement depuis E-Commerce
                            </p>
                            <p style="color: #6c757d; font-size: 12px; margin: 0;">
                                &copy; ${new Date().getFullYear()} E-Commerce. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  // Test de connexion SMTP
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}
