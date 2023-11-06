import "./globals.css";

import { ToasterProvider } from "@/providers/toast-provider";

export const metadata = {
  title: "Clurrs Store Server",
  description: "Clurrs Store Backend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
