import { useContext, useEffect, useState } from "react"
import { MainUserContext } from "../context/UserAuth"
import { Button } from "@heroui/react";
import { NavLink } from "react-router-dom";
import LogoLoop from "../components/ui/animation/logosAnimaiton/Logos";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import SplitText from "../components/ui/animation/splitWordAnimation/splitWordAnimation";
import BlurText from "../components/ui/animation/blurText/BlurText";
import FadeContent from "../components/ui/animation/BlurFadeContent/BlurFadeContent";
import DarkVeil from "../components/ui/Background/Background";
const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];
export default function Home() {
    const { userState, userData } = useContext(MainUserContext);
    console.log(userData);
    const plainText = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis, doloremque maxime! Quasi saepe ducimus, assumenda necessitatibus rerum voluptate doloremque eaque, cupiditate libero officiis et sapiente aliquam eius voluptatibus ratione sit pariatur sed temporibus tenetur. Commodi sunt velit voluptatum quae placeat!`
  useEffect(() => {
    window.document.title = `${userState ? "Home" : "LogIn | Sign-up"}`;
    })
  return (
      <>
        <FadeContent
          blur={true}
          duration={300}
          easing="ease-out"
          initialOpacity={0}
        >
          <section className="home-section w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="home-section-user-card w-full min-h-[45vh] max-w-3xl bg-blue-200 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 md:mb-7 ms-0 sm:ms-4 md:ms-6">
                {/* <SplitText
                text={userState ? `Welcome ${userData.name},` : "SignUp Now! | LogIn"}
                className=""
                delay={70}
                duration={2}
                ease="elastic.out(1, 0.3)"
                splitType="words"
                from={{ opacity: 0, y: 8 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
              /> */}
                <BlurText
                  text={
                    userState
                      ? `Welcome ${userData?.name},`
                      : "SignUp Now! | LogIn"
                  }
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className=""
                />
              </h1>
              <p className="text-sm sm:text-base md:text-lg px-0 sm:px-4 md:px-6 leading-relaxed">
                <BlurText
                  text={plainText}
                  className=""
                  delay={17}
                  duration={2}
                  ease="elastic.out(1, 0.3)"
                  splitType="words"
                  from={{ opacity: 0, y: 8 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                />
              </p>
              <Button
                as={NavLink}
                to={"/posts"}
                className="w-fit mt-8 lg:ms-5 md:ms-5"
                color="primary"
                variant="flat"
              >
                {/* <SplitText
                text="See Our Community!"
                className="text-center"
                delay={70}
                duration={2}
                ease="elastic.out(1, 0.3)"
                splitType="words"
                from={{ opacity: 0, y: 8 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              /> */}
                <BlurText
                  text="See Our Community!"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className=""
                />
              </Button>
            </div>
          </section>
        </FadeContent>
        {/* <div
          style={{ height: "100px", position: "realtive", overflow: "hidden" }}
        >
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="transparent"
            ariaLabel="Technology partners"
          />
        </div> */}
      </>
    );
}