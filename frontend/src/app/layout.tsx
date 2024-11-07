"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Nav from '../components/Nav'
import { UserProvider } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
 
  return (
    <AuthProvider>
      <UserProvider>
        <html lang="en">
          <body className="w-screen h-screen">
            <div className="w-full h-full flex items-center">
              <NavWrapper/>
              {children}
            </div>
          </body>
        </html>
      </UserProvider>
    </AuthProvider>
  );
}
function NavWrapper() {
  const [isClient, setIsClient] = useState(false);
  const currentPath = usePathname();
 
  useEffect(() => {
    setIsClient(true);
  }, []);
 
  if (!isClient || currentPath !== '/chat') {
    return null;
  }
 
  return <Nav />;
}
