'use server';

import { auth } from '@/lib/auth/auth';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 用户登录
 */
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    // 设置会话 cookie
    const cookieStore = await cookies();
    cookieStore.set('better-auth.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 重定向到首页
    redirect('/');
  } catch (error) {
    console.error('登录失败:', error);
    throw new Error('邮箱或密码错误');
  }
}

/**
 * 用户注册
 */
export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });

    // 自动登录
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    // 设置会话 cookie
    const cookieStore = await cookies();
    cookieStore.set('better-auth.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect('/');
  } catch (error) {
    console.error('注册失败:', error);
    throw new Error('注册失败，邮箱可能已被使用');
  }
}

/**
 * 用户登出
 */
export async function logout() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    // 清除 cookie
    const cookieStore = await cookies();
    cookieStore.delete('better-auth.session_token');

    redirect('/login');
  } catch (error) {
    console.error('登出失败:', error);
    throw new Error('登出失败');
  }
}

/**
 * 获取当前会话
 */
export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    return null;
  }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
