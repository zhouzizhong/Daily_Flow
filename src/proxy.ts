import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路由
const protectedRoutes = ['/', '/meals', '/schedule', '/habits', '/todos'];

// 认证相关路由（已登录用户不能访问）
const authRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 获取会话 token
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 检查是否是认证路由
  const isAuthRoute = authRoutes.includes(pathname);

  // 如果没有会话 token 且访问受保护路由，重定向到登录页
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 如果已有会话 token 且访问认证路由，重定向到首页
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
