"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("userRole");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const roleBasedRedirects: { [key: string]: string } = {
      administrator: "/admin", // Example redirect
      operator: "/operator", // Example redirect
    };
    if (userRole && roleBasedRedirects[userRole]) {
      router.push(roleBasedRedirects[userRole]);
    }
  }, [router]);

  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>      
    </div>
  );
};

export default DashboardPage;
