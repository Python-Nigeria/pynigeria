import { Inter } from "next/font/google";
import "./css/acss/acss.css";
import "./css/bootstrap-5/css/bootstrap.css";
import "./css/fontawesome/css/all.min.css";
import "./css/animate.min.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pyton Nigeria",
  description: "Python Nigeria Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-montserrat">
        <nav class="container-fluid sz-14 sticky-top color-bg-p color-white" style={{zIndex:'20'}}>
        <div class="row">
          <div class="col-8 color-white p-4 ">
            <i class="fab fa-python"></i> Python Nigeria 
          </div>
          <div class="col font-poppins p-4 right display-sm-none"> 
            membership 
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            about us
          </div>
        </div>
      </nav>

      {children}

      </body>
    </html>
  );
}
