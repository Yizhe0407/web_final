"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { isLoggedIn, setLoggedIn } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const result = await api.auth.login(username, password);
            setLoggedIn(true); // 更新 Zustand 狀態
            router.push('/');
        } catch (err: any) {
            setError(err?.message || '登入失敗，請重試');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>登入</CardTitle>
                    <CardDescription>請輸入您的帳號密碼以登入系統。</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">帳號</Label>
                                <Input
                                    id="username"
                                    placeholder="請輸入帳號"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">密碼</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="請輸入密碼"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSubmit}>登入</Button>
                </CardFooter>
            </Card>
        </div>
    );
}