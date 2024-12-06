import { Inter } from "next/font/google";
import "./css/acss/acss.css";
import "./css/bootstrap-5/css/bootstrap.css";
import "./css/fontawesome/css/all.min.css";
import "./css/animate.min.css";
import "./globals.css";
import Nav from "./nav.js"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Python Nigeria",
  description: "Python Nigeria Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-montserrat">
        <Nav />
      {children}
      </body>
    </html>
  );
}
