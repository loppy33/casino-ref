export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container">header1</header>
      <main>{children}</main>
      <footer className="container">footer1</footer>
    </>
  );
}