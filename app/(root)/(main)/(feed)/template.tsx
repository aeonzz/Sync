import PageTransition from "@/components/animations/page-transition";

const Template = ({ children }: { children: React.ReactNode }) => {
  return <PageTransition>{children}</PageTransition>;
};

export default Template;
