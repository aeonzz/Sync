export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="w-full pr-4">{children}</section>;
}
