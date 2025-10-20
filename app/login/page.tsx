'use client';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { user, loading, signInWithGoogle } = useAuth();

    useEffect(()=>{
        if(user){
            router.push("/instruments")
        }
    }, [])

    if(loading){
        return <div>
            Loading...
        </div>
    }

    if(user){
        return <div>
            User already exists go to instruments
            <Link href={"/instruments"}>click me</Link>
        </div>
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <button
                onClick={signInWithGoogle}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
            >
                Sign in with Google
            </button>
        </div>
    );
}