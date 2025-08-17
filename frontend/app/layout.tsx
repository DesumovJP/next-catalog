import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { PageTitleProvider } from "./PageTitleContext";
import ThemeRegistry from "@/components/ThemeRegistry";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <ThemeRegistry>
          <PageTitleProvider>
            <Navbar />
            <BreadcrumbsBar />
            <main style={{ flexGrow: 1 }}>{children}</main>
            <Footer />
          </PageTitleProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}