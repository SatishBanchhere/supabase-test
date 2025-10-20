'use client';
import { useAuth } from '@/context/authContext';
import React, { useState, useEffect } from 'react';

export default function Instruments() {
    const {user, loading} = useAuth();

    return (
        <pre>{JSON.stringify(user?.user_metadata.email, null, 2)}</pre>
    );
}