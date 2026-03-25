import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Cloudflare 环境变量类型
 */
interface CloudflareEnv {
  DB: any; // D1Database 类型来自 @cloudflare/workers-types
}

/**
 * 获取 D1 数据库实例
 * 在 Cloudflare Pages 环境中，DB 通过 binding 注入
 */
export function getDB(env: CloudflareEnv) {
  if (!env.DB) {
    throw new Error('D1 数据库未绑定，请检查 wrangler.toml 配置');
  }
  
  return drizzle(env.DB, { schema });
}

// 导出 schema 方便其他地方使用
export { schema };
export * from './schema';
