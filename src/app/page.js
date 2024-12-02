import Image from "next/image";
import styles from "./page.module.css";
import logo from "./logo.svg";
import Link from "next/link"

export default function Home() {
  return (
    <div class="sz-14">

      <nav class="container-fluid d-none hide color-bg-p sticky-top" style={{margi:'0'}} >
        <div class="row color-bg-p sz-16 color-white p-2 py-4 align-items-center">
          <div class="col bold">
            <i class="fab fa-python p-1 rounded color-s sz-18"></i> Python Nigeria
          </div>
          <div class="col right">
            <i class="fas fa-bars sz-24"></i>
          </div>
        </div>
      </nav>
        
      <section class="container-fluid color-bg-t py-1 my-md-0">
        <div class="row vh-100 justify-content-center align-items-center cente">
          <div class="col-md col-sm-12 color-p sz-30  sz-md-48" style={{marginTop:'-90px'}}>
            <div class="row borde p-3 px-md-5 mx-md-5">
              <div class="col-12" >
                Welcome to the <br /> <b> Python Community </b>
              </div>
              <div class="sz-16 sz-md-20 col-12 pt-3">
                A space for python enthusiasts to share knowledge, tackle projects together and advance in various fields.
              </div>
              <div class="col-12 pt-4">
                <div class="row">
                <Link class="button bg-warning color-black rounded-4 mx-2 mx-md-2 col col-md-5 my-3 p-3 p-md-4  sz-16 sz-md-18 color-bg-t-hover color-white-hover no-decoration" href="/">
                  Become a member
                </Link>
                <Link class="button bg-danger color-white rounded-4 mx-1 mx-md-1 col col-md-5  my-3 p-3 p-md-4  sz-16 sz-md-18 color-bg-t-hover color-white-hover no-decoration" href="/wrapped">
                  2024 Wrapped
                </Link>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md col-sm-12 center display-sm-noe d-none d-md-block color-bg-t center" style={{marginTop:'-50px'}}>
            <div class="row">
              <div class="col">
                <Image class="img-fluid cover col-10" src={logo}  style={{height:'350px',width:'auto'}} ></Image>
              </div> 
            </div>
          </div>
          <div class="col-md col-sm-12 center display-md-none d-md-none">
            <div class="row" >
              <div class="col" >
                <Image class="img-fluid cover col-10" src={logo}  style={{height:'250px',width:'auto',marginTop:'-150px'}} ></Image>
              </div> 
            </div>
          </div>
        </div>
      </section>

        

        <section class="container-fluid p-4 color-bg-p color-white">
        <div class="row vh-md-100 justify-content-center align-items-center">
          <div style={{}}>
          <div class="row my-5">
            <div class="col sz-24 color-white sz-md-36 center"> <span class="border-bottom border-5"> About us </span> </div>
          </div>

          <div class="row sz-18 sz-md-24 my-5">
          <div class="col center">
            Our whatsapp Python community is a vibrant group of developers and enthusiasts  dedicated to exploring the latest in Python programming languageWhether you are an expert or a newbie, you will find a supportive environment to grow and collaborate
          </div>
          </div>
          
          <br />
          <div class="row justify-content-center m-2 my-5">
            <div class="col-md-3 col-sm-12 rounded center p-4 sz-18 m-2 color-bg-s color-white"> Web Development </div>
            <div class="col-md-3  col-sm-12 rounded center p-4 sz-18 m-2 color-bg-s color-white"> Data Science & Analysis </div>
            <div class="col-md-3  col-sm-12 rounded center p-4 sz-18 m-2 color-bg-s color-white"> Machine Learning </div>
            <div class="col-md-3  col-sm-2 rounded center p-4 sz-18 m-2 color-bg-s color-white"> Job Updates </div>
            <div class="col-md-3  col-sm-12 rounded center p-4 sz-18 m-2 color-bg-s color-white"> Learning </div>
          </div>
          </div>
          </div>

        </section>

        

        <section class='container-fluid'>
        <br />
        <div class="row vh-md-100 background justify-content-center align-items-center p-3" style={{backgroundSize:'cover',backgroundPosition:'center'}}>
        <div style={{maginTop:'-100px'}}>
          <div class="col-12 sz-24 sz-md-36 color-p">
           Join us on
          </div>
          <div class="col sz-18 sz-md-24">

          <div class="row">
            <div class="col-12 p-3"> <i class="fab fa-whatsapp p-2 color-s"></i> Whatsapp </div>
            <div class="col-12 p-3"> <i class="fab fa-telegram p-2 color-s"></i>  Telegram </div>
            <div class="col-12 p-3"><i class="fab fa-discord p-2 color-s"></i>  Discord </div>
          </div>
          <div class="row">
            <div class="col"> Stay updated with the latest Python topics and connect with fellow Python enthusiasts </div>
          </div>

          </div>
        </div>
        </div>
        </section>

        

        <section class="container-fluid hide">
        <div class="row py-2">
          <div class="col sz-14 color- justify-content-center center"> Python Nigeria 2024 </div>
          </div>
        </section>

    </div>
   
  );
}
