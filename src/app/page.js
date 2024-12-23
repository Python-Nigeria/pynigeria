"use client"
import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import {animate,motion} from "motion/react";


export default function Home() {

  React.useEffect(()=>{
    // animate("#hero",{opacity:0.5})
  },[])

  return (
    <div class="sz-14">        
      <motion.div id="hero" class="container-fluid color-bg-white py-1 my-md-0" animate={{scale:1}}>
        <div class="row vh-100 justify-content-center align-items-center cente">
          <div class="col-md col-sm-12 color-p sz-30  sz-md-48" style={{marginTop:'-90px'}}>
            <div class="row borde p-3 px-md-5 mx-md-5">
              <div class="col-12" >
                Welcome to the <br /> <b class="color-s font-montserrat-bold sz-36 sz-md-48"> Python Community </b>
              </div>
              <div class="sz-16 sz-md-20 col-12 pt-3">
                A space for python enthusiasts to share knowledge, tackle projects together and advance in various fields.
              </div>
              <div class="col-12 pt-4">
                <div class="row">
                <Link class="button color-bg-p color-white rounded-4 mx-2 mx-md-2 col col-md-5 my-3 p-3 p-md-4  sz-16 sz-md-18 color-bg-t-hover color-hover no-decoration" ef="https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43" href="/account/signup">
                  Join the Community
                </Link>
                <Link class="button bg-danger color-white rounded-4 mx-1 mx-md-1 col col-md-5  my-3 p-3 p-md-4  sz-16 sz-md-18 color-bg-t-hover color-white-hover no-decoration" href="/wrapped">
                  2024 Wrapped
                </Link>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md col-sm-12 center display-sm-noe d-none d-md-block center" style={{marginTop:'-50px'}}>
            <div class="row">
              <div class="col">
                <img id="logo" class="img-fluid cover col-10" src="/hero.png"  style={{height:'450px',width:'auto'}} ></img>
              </div> 
            </div>
          </div>
          <div class="col-md col-sm-12 center display-md-none d-md-none">
            <div class="row" >
              <div class="col" >
                <img class="img-fluid cover col-10" src="/hero.png"  style={{height:'380px',width:'auto',marginTop:'-200px'}} ></img>
              </div> 
            </div>
          </div>
        </div>
      </motion.div>

      <section class="container-fluid background d-flex justify-content-center align-items-center vh-md-100 flex-column p-4 py-5 p-md-5">
      <br class="display-md-none" />
      <br class="display-md-none"/>
      <br class="display-md-none" />
        <div class="row my-4">
          <div class="col sz-30 sz-md-36 bold color-white center font-montserrat-bold"> What Makes Our Community Unique </div>
        </div>
        <br />
        <div class="row">
          <div class="col">
            <div class="rounded  p-5 color-bg-white center my-2">
              
              <div class="row">
                <div class="col sz-20 color-p"> <i class="fas fa-pen"></i> </div>
              </div>

              <div class="row">
                <div class="col sz-20 bold"> Learn From the Best </div>
              </div>

               <div class="row">
                <div class="col"> Get personalized guidance from experienced python developers to accelerate your growth and achieve yor goals </div>
              </div>

            </div>
          </div>

          <div class="col">
            <div class="rounded  p-5 color-bg-white center my-2">
              
              <div class="row">
                <div class="col sz-24 color-p"> <i class="fas fa-users"></i> </div>
              </div>

              <div class="row">
                <div class="col sz-20 bold"> Join the conversation </div>
              </div>

               <div class="row">
                <div class="col">Engage in lively discussions share insights and solve problems with fellow python enthusiasts in a supportive forum </div>
              </div>

            </div>
          </div>

          <div class="col">
            <div class="rounded  p-5 color-bg-white center my-2">
            <div class="row">
                <div class="col sz-24 color-p"> <i class="fas fa-check"></i> </div>
              </div>

              <div class="row">
                <div class="col sz-20 bold"> Python Job Opportunies </div>
              </div>

               <div class="row">
                <div class="col"> Explore curated Job postings tailored to Python developers, data scientists , and machine Learning experts. </div>
              </div>

            </div>
          </div>

        </div>
        <br class="display-md-none" />
      <br class="display-md-none"/>
      <br class="display-md-none" />

      </section>
        

        <section class="container-fluid d-flex align-items-center p-4 p-md-5 color-black vh-md-100 flex-column">
          <div class="row my-4">
            <div class="col sz-30 color-p sz-md-36 center font-montserrat-bold"> <span class="border-5"> About Our Community </span> </div>
          </div>

          <div class="row sz-16 sz-md-18 mb-5">
          <div class="col center">
            <p>Our Python community is a vibrant group of developers and enthusiasts  dedicated to exploring the latest in Python programming language Whether you are an expert or a newbie, you will find a supportive environment to grow and collaborate</p>
            <p> Our Vision is to empower Python developers to connect , grow and make a meaningful impact in tech </p>
            <p> 
              <div> Our Core Values are ;  Collaboration: together we solve problems and create Opportunies .
               Inclusivity : A welcoming space for all skill levels ,
               Innovation : Pushing boundaries with Python ,
               Growth : Supporting personal and professional development </div>
            </p>
          </div>
          </div>
          
          <div class="row justify-content-center m-2 mb-3">
            <div class="col-md-3 col-sm-12 rounded center p-4 sz-18 m-2 color-bg-p color-white"> Web Development </div>
            <div class="col-md-3  col-sm-12 rounded center p-4 sz-18 m-2 color-bg-p color-white"> Data Science & Analysis </div>
            <div class="col-md-3  col-sm-12 rounded center p-4 sz-18 m-2 color-bg-p color-white"> Machine Learning </div>
            <div class="col-md-3  col-sm-2 rounded center p-4 sz-18 m-2 color-bg-p color-white"> Job Updates </div>
            <div class="col-md-3  col-sm-12 rounded center p-4 sz-18 m-2 color-bg-p color-white"> Learning </div>
          </div>

        </section>

        

        <section class='container-fluid d-flex justify-content-center align-items-center vh-100 flex-column background color-white'>
        
        
        <div class="row mb-4">
            <img src="/logo.svg" class="img-fluid rounded" />
        </div>

        <div class="row">
          <div class="col-12 center sz-24 sz-md-36 color-white">
           Join us on various platforms
          </div>
        </div>


          <div class="row center sz-18">
            <div class="col-12 p-3">  Whatsapp <i class="fab fa-whatsapp p-2 color-p"></i> </div>
            <div class="col-12 p-3">   Telegram <i class="fab fa-telegram p-2 color-p"></i> </div>
            <div class="col-12 p-3">  Discord <i class="fab fa-discord p-2 color-p"></i> </div>
          </div>

          <div class="row mt-4 ">
            <div class="col hide">
              <Link class="button color-bg-p color-white rounded-4 mx-2 mx-md-2 col col-md-5 my-3 p-3 p-md-4  sz-16 sz-md-18 color-bg-t-hover color-hover no-decoration" href="https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43">
                  Join the Community
                </Link>
            </div>
          </div>
        </section>

    </div>
   
  );
}
