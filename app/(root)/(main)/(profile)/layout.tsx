
export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex space-x-3 pt-5 pr-2 h-auto">
      {children}
    </section>
  );
}
