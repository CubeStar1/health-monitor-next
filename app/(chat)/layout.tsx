import { Header } from "@/components/global/header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>
         <Header />
         <main className="mx-auto py-0 px-1 md:px-4 md:py-6">
          {children}
         </main>
        </>

  );
}
