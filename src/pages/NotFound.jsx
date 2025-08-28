import { NavLink } from "react-router-dom";
import FadeContent from "../components/ui/animation/BlurFadeContent/BlurFadeContent";
const NotFound = ({typeOfNotFound}) => {
  return (
    <FadeContent blur={true} duration={300} easing="ease-in-out" initialOpacity={0} >
      <main className="h-screen w-full flex flex-col justify-center items-center bg-black">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
        <h3 className="text-3xl font-extrabold text-white tracking-widest">{ typeOfNotFound }</h3>
      <button className="mt-5">
        <a
          className="relative inline-block text-sm font-medium text-[#e30052] group active:text-orange-500 focus:outline-none focus:ring"
        >
          <span
            className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"
          ></span>
          <span className="relative block px-8 py-3 bg-[#fafbfd] border">
            <NavLink to="/">Back To Main Page</NavLink>
          </span>
        </a>
      </button>
      </main>
    </FadeContent>
  );
};

export default NotFound;