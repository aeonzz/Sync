import EventMenu from "@/components/shared/event-menu";

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { eventId: string };
}>) {
  return (
    <section className="pr-2 w-full">
      <EventMenu eventId={params.eventId} />
      {children}
    </section>
  );
}
