import "./styles/index.sass";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <header className="container">
                    header
                </header>
                <main>{children}</main>
                <footer className="container">
                    footer
                </footer>
            </body>
        </html>
    );
}
