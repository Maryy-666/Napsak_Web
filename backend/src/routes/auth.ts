import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { Resend } from "resend";

console.log("🔥🔥🔥 AUTH.TS YÜKLENDİ 🔥🔥🔥");

const router = Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Resend hesabı/API key yoksa backend yine çalışır.
// Reset linki terminale yazılır.
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "N'apsak? <onboarding@resend.dev>";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_DURATION = 15 * 60 * 1000;

/* =====================================================
   REGISTER
===================================================== */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Ad, email ve şifre zorunludur.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Bu email zaten kayıtlı.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: "USER",
      },
    });

    return res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      error: "Kayıt sırasında hata oluştu.",
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email ve şifre zorunludur.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Email veya şifre hatalı.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Email veya şifre hatalı.",
      });
    }

    // Eski sessionları temizle
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Yeni session oluştur
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + SESSION_DURATION
    );

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return res.json({
      message: "Giriş başarılı.",
      token,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      error: "Giriş sırasında hata oluştu.",
    });
  }
});

/* =====================================================
   ME - OTURUM KONTROLÜ
===================================================== */

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Oturum bulunamadı.",
      });
    }

    const token = authHeader.substring(7);

    const session = await prisma.session.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "Geçersiz oturum.",
      });
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return res.status(401).json({
        error: "Oturumun süresi dolmuş.",
      });
    }

    return res.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(500).json({
      error: "Oturum kontrol edilemedi.",
    });
  }
});

/* =====================================================
   LOGOUT
===================================================== */

router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        message: "Çıkış yapıldı.",
      });
    }

    const token = authHeader.substring(7);

    await prisma.session.deleteMany({
      where: {
        token,
      },
    });

    return res.json({
      message: "Çıkış başarılı.",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      error: "Çıkış yapılamadı.",
    });
  }
});

/* =====================================================
   FORGOT PASSWORD
===================================================== */
console.log("🔥 FORGOT PASSWORD ROUTE TANIMLANIYOR");
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Email yoksa bile kullanıcı var/yok bilgisini açıklama.
    if (!email || typeof email !== "string") {
      return res.json({
        success: true,
        message:
          "Eğer bu email kayıtlıysa şifre sıfırlama bağlantısı gönderildi.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Kullanıcı bulunamazsa yine aynı cevabı veriyoruz.
    if (!user) {
      return res.json({
        success: true,
        message:
          "Eğer bu email kayıtlıysa şifre sıfırlama bağlantısı gönderildi.",
      });
    }

    // Kullanıcının eski reset tokenlarını temizle.
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Gerçek token oluştur.
    const plainToken = crypto
      .randomBytes(32)
      .toString("hex");

    // DB'de gerçek token yerine hash sakla.
    const tokenHash = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + PASSWORD_RESET_DURATION
    );

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    // Frontend adresi
    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    const resetUrl =
      `${frontendUrl}/reset-password/${plainToken}`;

    /* ---------------------------------------------
       DEVELOPMENT MODE
    --------------------------------------------- */

    if (!resend) {
      console.log(`
========================================
PASSWORD RESET - DEVELOPMENT MODE
========================================

Email:
${user.email}

Reset URL:
${resetUrl}

This link expires in 15 minutes.

========================================
`);
    }

    /* ---------------------------------------------
       RESEND
    --------------------------------------------- */

    if (resend) {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Şifrenizi Sıfırlayın | N'apsak?",
        html: `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifrenizi Sıfırlayın | N'apsak?</title>
</head>

<body style="
  margin: 0;
  padding: 40px 16px;
  background-color: #F8FAFC;
  font-family: Arial, sans-serif;
  color: #0F1115;
">

  <div style="
    max-width: 520px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 32px;
  ">

    <h2 style="color: #0A5C3A;">
      N'apsak?
    </h2>

    <h3>
      Şifre Sıfırlama Talebi
    </h3>

    <p>
      Hesabınız için bir şifre sıfırlama talebinde bulundunuz.
    </p>

    <p>
      Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.
    </p>

    <p>
      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          padding: 14px 24px;
          background: #0A5C3A;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
        "
      >
        Şifremi Yenile
      </a>
    </p>

    <p>
      Bu bağlantı 15 dakika içinde geçerliliğini yitirecektir.
    </p>

    <p>
      Bu talebi siz yapmadıysanız bu e-postayı güvenle
      göz ardı edebilirsiniz.
    </p>

  </div>

</body>
</html>
        `,
      });

      if (error) {
        console.error(
          "PASSWORD RESET EMAIL ERROR:",
          error
        );

        // Mail gönderilemese bile development ortamında
        // linki terminalde göstermek faydalı.
        if (process.env.NODE_ENV !== "production") {
          console.log(
            `[DEV FALLBACK] Reset URL: ${resetUrl}`
          );
        }
      }
    }

    return res.json({
      success: true,
      message:
        "Eğer bu email kayıtlıysa şifre sıfırlama bağlantısı gönderildi.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Şifre sıfırlama işlemi sırasında hata oluştu.",
    });
  }
});

/* =====================================================
   RESET PASSWORD - GET
   Token geçerliliğini kontrol eder.
===================================================== */

router.get("/reset-password", async (req, res) => {
  try {
    const token = req.query.token;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        valid: false,
        reason: "INVALID",
      });
    }

    // Gelen tokenı hashle.
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!resetToken) {
      return res.status(400).json({
        valid: false,
        reason: "INVALID",
      });
    }

    if (resetToken.used) {
      return res.status(400).json({
        valid: false,
        reason: "USED",
      });
    }

    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({
        valid: false,
        reason: "EXPIRED",
      });
    }

    return res.json({
      valid: true,
    });
  } catch (error) {
    console.error(
      "VERIFY RESET TOKEN ERROR:",
      error
    );

    return res.status(500).json({
      valid: false,
      reason: "INVALID",
    });
  }
});

/* =====================================================
   RESET PASSWORD - POST
===================================================== */

router.post("/reset-password", async (req, res) => {
  console.log("🔥 FORGOT PASSWORD BACKEND'E GELDİ");

  try {
    const {
      token,
      password,
      confirmPassword,
    } = req.body;

    /* ---------------------------------------------
       Token kontrolü
    --------------------------------------------- */

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        error:
          "Geçersiz şifre sıfırlama bağlantısı.",
      });
    }

    /* ---------------------------------------------
       Şifre alanları
    --------------------------------------------- */

    if (
      !password ||
      typeof password !== "string" ||
      !confirmPassword ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Şifre alanları zorunludur.",
      });
    }

    /* ---------------------------------------------
       Şifre eşleşmesi
    --------------------------------------------- */

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error:
          "Girdiğiniz şifreler uyuşmamaktadır.",
      });
    }

    /* ---------------------------------------------
       Şifre güvenliği
    --------------------------------------------- */

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (
      !hasMinLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasDigit ||
      !hasSpecial
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Şifre tüm güvenlik gereksinimlerini karşılamalıdır.",
      });
    }

    /* ---------------------------------------------
       Token hash
    --------------------------------------------- */

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    /* ---------------------------------------------
       Token DB'den bul
    --------------------------------------------- */

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        error:
          "Geçersiz şifre sıfırlama bağlantısı.",
      });
    }

    /* ---------------------------------------------
       Daha önce kullanılmış mı?
    --------------------------------------------- */

    if (resetToken.used) {
      return res.status(400).json({
        success: false,
        error:
          "Bu bağlantı daha önce kullanılmış.",
      });
    }

    /* ---------------------------------------------
       Süresi geçmiş mi?
    --------------------------------------------- */

    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error:
          "Bağlantının süresi dolmuş.",
      });
    }

    /* ---------------------------------------------
       Yeni şifreyi hashle
    --------------------------------------------- */

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    /* ---------------------------------------------
       Şifre + token güncellemesi
    --------------------------------------------- */

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash: hashedPassword,
        },
      }),

      prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          used: true,
        },
      }),
    ]);

    /* ---------------------------------------------
       Eski oturumları kapat
    --------------------------------------------- */

    await prisma.session.deleteMany({
      where: {
        userId: resetToken.userId,
      },
    });

    return res.json({
      success: true,
      message:
        "Şifreniz başarıyla güncellendi.",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Şifre sıfırlama sırasında hata oluştu.",
    });
  }
});

export default router;