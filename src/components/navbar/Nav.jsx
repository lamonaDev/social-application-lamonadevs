import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { NavLink } from "react-router-dom";
import { TbWorldLongitude } from "react-icons/tb";
import { useContext } from "react";
import { MainUserContext } from "../../context/UserAuth";
import toast from "react-hot-toast";
import BlurText from "../ui/animation/blurText/BlurText";
import FadeContent from "../ui/animation/BlurFadeContent/BlurFadeContent";
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavComponent() {
  const { userState, setUserState } = useContext(MainUserContext);
  function handleLogOut() {
    setUserState(null)
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("id");
    toast.success("log out successfully!")
  }
  return (
    <Navbar className="shadow-2xl">
      <NavbarBrand>
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <TbWorldLongitude className="text-2xl mt-0.5" />
        </FadeContent>
        <NavLink
          className="font-bold text-inherit ms-3 cursor-pointer"
          to={"/"}
        >
          <BlurText text="SOCIAL" delay={50} animateBy="words" direction="top"/>
        </NavLink>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-10" justify="center">
        <NavbarItem isActive>
          <NavLink to="/"><BlurText text="Home" delay={50} animateBy="words" direction="top"/></NavLink>
        </NavbarItem>
        {userState ? (
          <>
            <NavbarItem isActive>
              <NavLink to="/posts"><BlurText text="Posts" delay={50} animateBy="words" direction="top"/></NavLink>
            </NavbarItem>
            <NavbarItem isActive>
              <NavLink to="/profile"><BlurText text="Profile" delay={70} animateBy="words" direction="top"/></NavLink>
            </NavbarItem>
          </>
        ) : (
          <></>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {userState ? (
          <>
            <FadeContent blur={true} duration={500} easing="ease-out" initialOpacity={0}>
            <Button onClick={() => handleLogOut()} as={NavLink} color="primary" to="/login" variant="flat">
              Log out
            </Button>
            </FadeContent>
          </>
        ) : (
          <>
              <NavbarItem className="hidden lg:flex">
                <FadeContent blur={true} duration={700} easing="ease-out" initialOpacity={0}>
                  <NavLink to="/login" className="text-foreground">
                    Login
                  </NavLink>
                </FadeContent>
            </NavbarItem>
              <NavbarItem>
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                  <Button  as={NavLink} color="primary" to="/signup" variant="flat">
                    Sign Up
                  </Button>
                </FadeContent>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}