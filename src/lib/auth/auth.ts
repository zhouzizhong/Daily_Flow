import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDB } from '@/lib/db';
import * as schema from '@/lib/db/schema';

/**
 * Better Auth 配置
 * 使用 D1 数据库作为存储，支持 Edge Runtime
 */
export const auth = betterAuth({
  // 数据库配置
  database: drizzleAdapter(getDB, {
    provider: 'sqlite',
    schema: {
      user: schema.users,
      session: schema.sessions,
      verification: schema.verifications,
    },
  }),

  // 邮箱/密码认证
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // 生产环境建议开启
    minPasswordLength: 6,
    maxPasswordLength: 32,
  },

  // 会话配置
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 1 天
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 分钟
    },
  },

  // Cookie 配置（Cloudflare Pages 兼容）
  trustedOrigins: [
    'http://localhost:3000',
    'https://daily-flow.pages.dev',
    process.env.BETTER_AUTH_URL!,
  ].filter(Boolean),

  // 用户配置
  user: {
    additionalFields: {
      name: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'string',
        required: false,
      },
    },
  },

  // 安全配置
  rateLimit: {
    enabled: true,
    window: 60, // 1 分钟
    max: 10, // 最多 10 次请求
  },

  // 日志配置（开发环境开启）
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  },
});

// 导出类型
export type Session = typeof auth.$Infer.Session;
