export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site__header">
        <div className="ad">
          <img src="/age.png" alt="" />18 ans et plus. Jouez de manière responsable. Pour de l'aide, visitez <a target="blank" href="https://BeGambleAware.org">BeGambleAware.org</a> ou appelez le 0808 8020 133
        </div>
      </header>
      <main>{children}</main>
      <footer className="container">footer1</footer>
    </>
  );
}