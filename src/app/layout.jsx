import "./globals.css";

export const metadata = {
  title: "My App",
  description: "Log Viewer + Config Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-slate-50">
        {children}
      </body>
    </html>
  );
}
