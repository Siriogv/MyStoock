"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Redirect based on user role (example)
      switch (userRole) {
        case 'administrator':
          // Additional admin-specific logic
          break;
        case 'operator':
          // Additional operator-specific logic
          break;
        default:
          // Default user logic
          break;
      }
    }
  }, [router]);

  return (
    
      
        
          Dashboard
        
        
          Welcome to your dashboard!
        
      
    
  );
};

export default DashboardPage;
