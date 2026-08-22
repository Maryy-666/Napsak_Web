import rateLimit from "express-rate-limit";

const createStandardResponse = (message: string) => ({
  success: false,
  error: message,
});

// 1. Global Limiter (15 minutes, default 300 requests per IP)
export const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: () => Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: createStandardResponse(
    "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin."
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// 2. Auth Limiter (Login, Register, Forgot Password, Reset Password)
export const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: () => Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: createStandardResponse(
    "Giriş ve doğrulama denemeleriniz aşırıya kaçtı. Lütfen 15 dakika sonra tekrar deneyin."
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// 3. Public Form Submission Limiter (Event Applications, Messages)
export const formLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: () => Number(process.env.APPLICATION_RATE_LIMIT_MAX) || 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: createStandardResponse(
    "Kısa sürede çok fazla başvuru/mesaj gönderildi. Lütfen bir süre bekleyip tekrar deneyin."
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});
