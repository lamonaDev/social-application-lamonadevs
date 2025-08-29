import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import * as ZOD from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { MainUserContext } from "../context/UserAuth";
import LoaderPage from "./Loader";
import FadeContent from "../components/ui/animation/BlurFadeContent/BlurFadeContent";
export default function Signup() {
    const { userData } = useContext(MainUserContext)
    const {setUserState, userState} = useContext(MainUserContext)
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const zodValidationSchema = ZOD.object(
        {
            email: ZOD.string("Email is required").nonempty("Email is required to fill").email("Email is invalid"),
            password: ZOD.string("Password is required").nonempty("Password is required to fill").min(6, "Password must be at least 6 characters") 
        }
    )
    const { handleSubmit, register, formState: {errors} } = useForm(
        {
            defaultValues: {
                email: "",
                password: "",
            },
            mode: 'all',
            resolver: zodResolver(zodValidationSchema)
        }
    )
    function handleLogin(dataFromUser) {
            setErrorMessage(null);
            setIsLoading(true);
            const baseUrl = "https://linked-posts.routemisr.com/users/signin";
            console.log(dataFromUser);
            axios(baseUrl, { method: 'POST', data: dataFromUser }).then((responce) => {
                console.log(responce.data);
                if (responce.data.message === "success") {
                    toast.success("login successfully")
                    setUserState(true);
                    window.localStorage.setItem("token", responce.data.token);
                    setUserState(responce.data.token);
                    navigate("/"); //? redirect the user to the login page after successful registration
                } else {
                    toast.error("Error in registering user");
                }
                setIsLoading(false);
            }).catch((error) => { 
                setErrorMessage(error.response.data.error);
                toast.error(error.response.data.error);
                if (error.response.data.error === 'user already exists.') {
                    toast.error("user already exists.");
                    navigate("/login"); //? redirect the user to the login page after successful registration
                }
                setIsLoading(false);
            }).finally(() => { setIsLoading(false); });
        }
    return (
        <>
            {
                isLoading
                ? <LoaderPage typeOfLoader={"Redirect to Home Page"} />
                :
                <>
                <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0} className="lg:mt-[25vh] md:mt-[25vh] mt-[25vh]">
            
        <section className="mx-5">
        <form onSubmit={handleSubmit(handleLogin)} className="signup-section bg-blue-300 shadow-2xl rounded-2xl max-w-4xl w-full mx-auto mt-[5vh] sm:mt-6 md:mt-8 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <FadeContent blur={true} duration={500} easing="ease-out" initialOpacity={0}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">Log in</h2>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5 mx-auto shadow-2xl rounded-2xl p-5" blur={true} duration={700} easing="ease-out" initialOpacity={0}>
            <div className="">
                <Input
                    label="Email"
                    name="email"
                    isRequired
                    isInvalid={errors?.email?.message ? true : false}
                    errorMessage={errors?.email?.message}
                    type="email"
                    className="w-full bg-blue-300"
                    {...register("email")}
                />
            </div>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5 mx-auto shadow-2xl rounded-2xl p-5" blur={true} duration={900} easing="ease-out" initialOpacity={0}>
            <div className="">
                <Input
                    label="Password"
                    name="password"
                    isRequired
                    isInvalid={errors?.password?.message ? true : false}
                    errorMessage={errors?.password?.message}
                    {...register("password")}
                    type="password"
                    className="w-full"
                />
            </div>
        </FadeContent>
        <div className="flex flex-row gap-3">
        <FadeContent className="w-[90%] flex flex-row gap-3 sm:gap-4 md:gap-5" blur={true} duration={1100} easing="ease-out" initialOpacity={0}>
            <div className="">
                <Button
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                    size="md"
                    radius="md"
                    className="w-fit shadow-2xl"
                >Login</Button>
            </div>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-row gap-3 sm:gap-4 md:gap-5" blur={true} duration={1100} easing="ease-out" initialOpacity={0}>
            <div className="">
                <Button
                color="primary"
                variant="light"
                as={NavLink}
                size="md"
                to={"/signup"}
                radius="md"
                isLoading={isLoading}
                className="w-fit"
            >
            Dont Have An Account?
            </Button>
            </div>
        </FadeContent>
        </div>
        </form>
        </section>
                </FadeContent>
                </>
            }
        </>
    );
}