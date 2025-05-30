import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/global/theme-provider"
import QueryProvider from "@/components/global/query-provider";
import { Toaster } from "@/components/global/toaster";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Health Monitor',
  description: 'Health Monitor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <QueryProvider>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="">
            {children}
          </main>
          <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script> 
        <Analytics />
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
      </body>
    </html>
  )
}
