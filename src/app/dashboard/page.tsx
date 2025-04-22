"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        // Check authentication status (example: check for a token in localStorage)
        const isAuthenticated = localStorage.getItem('isLoggedIn');

        if (!isAuthenticated) {
            // If not authenticated, redirect to the login page
            router.push('/login');
        }
    }, [router]);
    return (
        
            
                
                    Dashboard
                
                
                    Welcome to your dashboard!
                
            
        
    );
};

export default DashboardPage;
