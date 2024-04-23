
export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex space-x-4 pt-4">
      {children}
      <div className="w-16 rounded-md bg-card"></div>
    </section>
  );
}
