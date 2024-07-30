import { NextAuthProvider } from "@/lib/providers";

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <NextAuthProvider><div className="min-h-screen">{children}</div></NextAuthProvider>
}
