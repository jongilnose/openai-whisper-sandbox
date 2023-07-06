import '../styles/main.css';

export default function RootLayout({ children }) {
    return (
      <html lang="ko">
        <body>{children}</body>
      </html>
    );
}
  