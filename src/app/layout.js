import { Inter } from "next/font/google";
import "./css/acss/acss.css";
import "./css/bootstrap-5/css/bootstrap.css";
import "./css/fontawesome/css/all.min.css";
import "./css/animate.min.css";
import "./globals.css";
import Nav from "./nav.js"
import PopUp from "./pop.js"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Python 9ja",
  description: "Python 9ja Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-montserrat">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
        <Nav />
      {children}
      <Footer />
      </body>
    </html>
  );
}


function Footer(){
  return(
     <footer class="text-center text-black" >
    <div class="container">
      <section class="mt-5">
        <div class="row text-center d-flex justify-content-center pt-5">
                    <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <a href="#!" class="no-decoration color-p">About us</a>
            </h6>
          </div>

          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <a href="#!" class="no-decoration color-p">Resources</a>
            </h6>
          </div>

          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <a href="#!" class="no-decoration color-p">Awards</a>
            </h6>
          </div>
           <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <a href="#!" class="no-decoration color-p">Help</a>
            </h6>
          </div>
          <div class="col-md-2">
            <h6 class="text-uppercase font-weight-bold">
              <a href="#!" class="no-decoration color-p">Contact</a>
            </h6>
          </div>
          
        </div>
        
      </section>
      

      <section class="my-4 my-md-5 border-top pt-4">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-8 sz-20">
            <p>
              Python Nigeria
            </p>
          </div>
        </div>
      </section>
      

      <section class="text-center mb-3">
        <a href="" class=" me-4 color-p">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="" class=" me-4 color-p">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="" class=" me-4 color-p">
          <i class="fab fa-google"></i>
        </a>
        <a href="" class=" me-4 color-p">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="" class=" me-4 color-p">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="" class=" me-4 color-p">
          <i class="fab fa-github"></i>
        </a>
      </section>
      </div>
    <div class="text-center">
      © 2024 Copyright
      <a class="color-s no-decoration mx-2" href="https://pynigeria.vercel.app/"
         >Python-Nigeria.com</a
        >
    </div>
  </footer>
    )
}