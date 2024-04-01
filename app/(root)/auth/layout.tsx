import BackButton from "@/components/ui/back-button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center space-y-3">
      <BackButton className="absolute left-5 top-5 z-50" />
      {children}
    </section>
  );
}
