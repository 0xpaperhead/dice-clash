import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { SolanaProvider } from "@/components/solana-provider" // Will be removed
import CPrivyProvider from "@/providers/privy"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dice Clash",
  description: "A fast-paced prediction dice game",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CPrivyProvider>
          {/* <SolanaProvider>{children}</SolanaProvider> */} {/* Will be removed */}
          {children} {/* Children directly under CPrivyProvider now */}
        </CPrivyProvider>
      </body>
    </html>
  )
}
