export const metadata = {
  title: 'Spark Chicken Games',
  description: 'Descubra, avalie e compartilhe os melhores jogos indie e AAA. Sua plataforma definitiva de jogos.',
  keywords: ['jogos', 'games', 'indie', 'reviews', 'avaliações', 'steam', 'epic games', 'nintendo'],
  authors: [{ name: 'Spark Chicken Games' }],
  creator: 'Spark Chicken Games',
  publisher: 'Spark Chicken Games',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://sparkchickengames.com',
    title: 'Spark Chicken Games - Sua Plataforma de Jogos',
    description: 'Descubra, avalie e compartilhe os melhores jogos indie e AAA.',
    siteName: 'Spark Chicken Games',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spark Chicken Games',
    description: 'Descubra, avalie e compartilhe os melhores jogos.',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" class="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body class="min-h-screen bg-cyber-dark text-cyber-text antialiased">
        {children}
      </body>
    </html>
  );
}
