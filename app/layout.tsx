import "./styles/index.sass";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
