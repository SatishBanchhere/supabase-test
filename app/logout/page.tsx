'use client';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function LogoutPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    }

    if(loading){
        return <div>
            Loading...
        </div>
    }

    if(!user){
        return <div>
            No user logged in
            <Link href={"/login"}>Go to Login</Link>
        </div>
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}