import type { Metadata } from "next";
import "@/styles/globals.css";

const title = "Robotik Control Center";
const description =
  "Dashboard sederhana untuk memantau status robot dan aktivitas terkini.";

export const metadata: Metadata = {
  title,
  description,
  icons: "/api/favicon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
