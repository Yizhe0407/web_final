"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react';

export default function Navigation() {
  const router = useRouter();
  const { isLoggedIn, setLoggedIn } = useAuthStore();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.auth.me();
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      }
    };
    checkToken();
  }, [setLoggedIn]);

  const handleLogout = async () => {
    await api.auth.logout(); // 呼叫後端清除 cookie
    setLoggedIn(false);
    router.push('/login');
  };

  return (
    <div className="flex justify-between gap-4 items-center my-2 mx-6">
      <Link href="/">
        <h1 className="text-xl font-bold">預約檢查系統</h1>
      </Link>

      {isLoggedIn ? (
        <Button onClick={handleLogout}>登出</Button>
      ) : (
        <Button onClick={() => router.push('/login')}>登入</Button>
      )}
    </div>
  );
}
