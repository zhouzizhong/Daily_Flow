import { auth } from '@/lib/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Better Auth 与 Next.js 的适配器
export const { GET, POST } = toNextJsHandler(auth);
