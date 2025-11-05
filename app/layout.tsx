import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"
import "reactflow/dist/style.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Manager ZuckZapGo - Gerenciamento de Instâncias WhatsApp",
  description:
    "Sistema de gerenciamento premium para instâncias WhatsApp Business API via ZuckZapGo Gateway",
  keywords: ["whatsapp", "api", "zuckzapgo", "business", "manager"],
  authors: [{ name: "Setup Automatizado" }],
  openGraph: {
    title: "Manager ZuckZapGo",
    description: "Gerenciamento de Instâncias WhatsApp Business",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="zuckzapgo-theme"
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
