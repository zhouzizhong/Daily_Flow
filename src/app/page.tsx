'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { logout } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, Utensils, Calendar, CheckSquare, Heart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">DailyFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              欢迎，{user?.name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span className="ml-2">登出</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 今日吃什么 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                今日吃什么
              </CardTitle>
              <CardDescription>随机推荐健康食谱</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meals" className="block">
                <Button className="w-full">查看推荐</Button>
              </Link>
            </CardContent>
          </Card>

          {/* 时间规划 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                今日时间规划
              </CardTitle>
              <CardDescription>安排一天的时间块</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/schedule" className="block">
                <Button className="w-full" variant="outline">管理时间</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Todo + 习惯 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Todo + 习惯
              </CardTitle>
              <CardDescription>追踪待办事项和习惯打卡</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/todos" className="block">
                <Button className="w-full" variant="outline">查看清单</Button>
              </Link>
            </CardContent>
          </Card>

          {/* 习惯打卡 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                习惯打卡
              </CardTitle>
              <CardDescription>培养良好习惯</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/habits" className="block">
                <Button className="w-full" variant="outline">开始打卡</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
