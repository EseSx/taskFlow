const { Resend } = require("resend");
const { RESEND_API_KEY, APP_URL } = require("../config/env");

const resend = new Resend(RESEND_API_KEY);

// ── Enviar email de verificación ──────────────────────────────────
const sendVerificationEmail = async ({ name, email, token }) => {
  // El link apunta al frontend, que llama al backend con el token
  const verifyUrl = `${APP_URL}/verify-email/confirm?token=${token}`;

  const { error } = await resend.emails.send({
    from: "TaskFlow <onboarding@resend.dev>", // Dominio de prueba de Resend
    to:
      process.env.NODE_ENV === "production"
        ? process.env.RESEND_TEST_EMAIL || email // variable para el email de prueba
        : email,
    subject: "Verifica tu cuenta de TaskFlow",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0"
                style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#3b82f6;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-weight:700;font-size:14px;">TF</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="color:#fff;font-weight:600;font-size:16px;">TaskFlow</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 12px;">
                      Hola, ${name} 👋
                    </h1>
                    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin:0 0 28px;">
                      Gracias por registrarte en TaskFlow. Para activar tu cuenta y empezar a organizar tus tareas, hace clic en el botón de abajo.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                      <tr>
                        <td style="background:#3b82f6;border-radius:12px;">
                          <a href="${verifyUrl}"
                            style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">
                            Verificar mi cuenta
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color:rgba(255,255,255,0.3);font-size:13px;line-height:1.5;margin:0 0 16px;">
                      Este link expira en <strong style="color:rgba(255,255,255,0.5);">24 horas</strong>.
                      Si no creaste una cuenta en TaskFlow, podes ignorar este email.
                    </p>

                    <!-- Link fallback -->
                    <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                      Si el botón no funciona, copia este link en tu navegador:<br>
                      <a href="${verifyUrl}" style="color:#60a5fa;word-break:break-all;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
                    <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;text-align:center;">
                      © 2026 TaskFlow · Este email fue enviado a ${email}
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("Error al enviar email:", error);
    throw new Error("No se pudo enviar el email de verificación");
  }
};

module.exports = { sendVerificationEmail };
