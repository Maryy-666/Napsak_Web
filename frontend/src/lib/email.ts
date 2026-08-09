import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "N'apsak? <onboarding@resend.dev>";

interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

/**
 * Builds a premium, responsive HTML email template for password reset requests.
 * Styled after modern Apple / Linear / Stripe transactional emails.
 */
function buildPasswordResetHtml(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifrenizi Sıfırlayın | N'apsak?</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F1115;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F8FAFC;
      padding: 40px 16px;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 30px rgba(15, 17, 21, 0.05);
      overflow: hidden;
    }
    .header {
      padding: 32px 32px 24px 32px;
      border-bottom: 1px solid #F1F5F9;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 800;
      color: #0A5C3A;
      letter-spacing: -0.5px;
      text-decoration: none;
    }
    .content {
      padding: 32px;
    }
    .h1 {
      font-size: 22px;
      font-weight: 700;
      color: #0F1115;
      margin: 0 0 12px 0;
      letter-spacing: -0.3px;
    }
    .p {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin: 0 0 24px 0;
    }
    .btn-container {
      margin: 28px 0;
    }
    .btn {
      display: inline-block;
      background-color: #0A5C3A;
      color: #FFFFFF !important;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(10, 92, 58, 0.2);
    }
    .fallback {
      background-color: #F8FAFC;
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;
      word-break: break-all;
      border: 1px solid #E2E8F0;
    }
    .fallback-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .fallback-url {
      font-size: 13px;
      color: #0A5C3A;
      text-decoration: underline;
    }
    .footer {
      padding: 24px 32px;
      background-color: #FAFAFA;
      border-top: 1px solid #F1F5F9;
      text-align: center;
    }
    .footer-text {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 8px 0;
      line-height: 1.5;
    }
    .footer-sub {
      font-size: 12px;
      color: #94A3B8;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="logo-text">N'apsak?</span>
      </div>
      <div class="content">
        <h1 class="h1">Şifre Sıfırlama Talebi</h1>
        <p class="p">
          Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
        </p>
        <div class="btn-container">
          <a href="${resetUrl}" class="btn" target="_blank">Şifremi Yenile</a>
        </div>
        <p class="p" style="margin-bottom: 0;">
          Bu talebi siz yapmadıysanız, bu e-postayı güvenle göz ardı edebilirsiniz. Hesabınız güvendedir.
        </p>
        <div class="fallback">
          <div class="fallback-label">Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza yapıştırın:</div>
          <a href="${resetUrl}" class="fallback-url" target="_blank">${resetUrl}</a>
        </div>
      </div>
      <div class="footer">
        <p class="footer-text">This link expires in 15 minutes. / Bu bağlantı 15 dakika içinde geçerliliğini yitirecektir.</p>
        <p class="footer-sub">© ${new Date().getFullYear()} N'apsak? Gençlik Topluluğu. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sends a password reset email using Resend API.
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.warn(`
======================================
RESEND_API_KEY not found.

Running in Development Mode.

Emails will NOT be sent.

The reset link will be printed below.
======================================

Reset URL:
${resetUrl}
`);
      return { success: true };
    }

    const resend = new Resend(apiKey);
    const htmlContent = buildPasswordResetHtml(resetUrl);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Şifrenizi Sıfırlayın | N'apsak?",
      html: htmlContent,
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send password reset email:", error);
      // In development, also log the URL so developer can proceed
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEV FALLBACK] Reset URL: ${resetUrl}`);
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[RESEND EXCEPTION] Unexpected error in sendPasswordResetEmail:", err);
    return { success: false, error: "E-posta gönderimi esnasında bir hata oluştu." };
  }
}
