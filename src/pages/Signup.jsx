import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as ZOD from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoaderPage from "./Loader";
import FadeContent from "../components/ui/animation/BlurFadeContent/BlurFadeContent";
const genders = [
    { key: "male", label: "Male" },
    { key: "female", label: "Female" },
];
export default function Signup() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const zodValidationSchema = ZOD.object({
    name: ZOD.string("Name is required").nonempty("Name is required to fill").min(3, "Name must be at least 3 characters"),
    email: ZOD.string("Email is required").nonempty("Email is required to fill").email("Email is invalid"),
    password: ZOD.string("Password is required").nonempty("Password is required to fill").min(6, "Password must be at least 6 characters"),
    rePassword: ZOD.string("rePassword is required").nonempty("rePassword is required to fill").min(6, "rePassword must be at least 6 characters"),
    gender: ZOD.enum(["male", "female"], { message: "Please select a gender" }),
    dateOfBirth: ZOD.coerce.date("Date of Birth is required").refine((date) => {
        const now = new Date();
        const birthDate = new Date(date);
        const diffMs = now - birthDate;
        const ageDate = new Date(diffMs);
        const years = ageDate.getUTCFullYear() - 1970; // Since 1970 (Unix epoch)
        return years >= 18;
    }, {
        message: "You must be at least 18 years old to register",
    }),
    }).refine((data) => data.password === data.rePassword, {
        message: "Passwords must match",
        path: ["rePassword"], // Ensure error is tied to rePassword field
    });
    const { handleSubmit, register, formState: { errors }, } = useForm({
    defaultValues: {
        name: "",
            email: "",
                password: "",
                    rePassword: "",
                        dateOfBirth: "1994-08-15",
                            gender: "",
    },
        mode: "all",
        resolver: zodResolver(zodValidationSchema),
    });
    function handleRegister(dataFromUser) {
        setErrorMessage(null);
        setIsLoading(true);
        const baseUrl = "https://linked-posts.routemisr.com/users/signup";
        console.log(dataFromUser);
        axios(baseUrl, { method: "POST", data: dataFromUser })
        .then((responce) => {
        console.log(responce.data);
        if (responce.data.message === "success") {
            toast.success("User registered successfully");
            navigate("/login"); //? redirect the user to the login page after successful registration
        } else {
            toast.error("Error in registering user");
        }
            setIsLoading(false);
        })
        .catch((error) => {
            setErrorMessage(error.response.data.error);
            toast.error(error.response.data.error);
            if (error.response.data.error === "user already exists.") {
            navigate("/login"); //? redirect the user to the login page after successful registration
        }
            setIsLoading(false);
        })
        .finally(() => {
            setIsLoading(false);
            toast.success("done!")
        });
    }
    return (
    <>
        {
            isLoading
            ? <LoaderPage typeOfLoader={"Redirect to Login"} />
            :
            <FadeContent blur={true} delay={200} duration={300} easing="ease-out" initialOpacity={0} className="lg:mt-[10vh] md:mt-[12vh] mt-[10vh]">
            <section className="mx-5">
        <form
            onSubmit={handleSubmit(handleRegister)}
            className="signup-section bg-blue-300 shadow-2xl rounded-2xl max-w-4xl w-full mx-auto mt-[5vh] sm:mt-6 md:mt-8 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6"
        >
        <FadeContent blur={true} delay={300} duration={500} easing="ease-out" initialOpacity={0}>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
            Sign Up Now!
        </h2>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5" blur={true} delay={400} duration={700} easing="ease-out" initialOpacity={0}>
            <div className="">
                <Input
                    label="Name"
                    name="name"
                    isInvalid={errors?.name?.message ? true : false}
                    errorMessage={errors?.name?.message}
                    type="text"
                    isRequired
                    className="w-full"
                    {...register("name")}
                />
            </div>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5" blur={true} delay={500} duration={700} easing="ease-out" initialOpacity={0}>
            <div className="">
            <Input
                label="Email"
                name="email"
                isRequired
                isInvalid={errors?.email?.message ? true : false}
                errorMessage={errors?.email?.message}
                type="email"
                className="w-full"
                {...register("email", { error: errors?.email?.message })}
            />
            </div>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5" blur={true} delay={600} duration={700} easing="ease-out" initialOpacity={0}>
            <div className="">
            <Input
                label="Password"
                name="password"
                isRequired
                isInvalid={errors?.password?.message ? true : false}
                errorMessage={errors?.password?.message}
                type="password"
                className="w-full"
                {...register("password")}
            />
            </div>
        </FadeContent>
            
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5" blur={true} delay={700} duration={700} easing="ease-out" initialOpacity={0}>
            <div className="">
            <Input
                label="rePassword"
                name="rePassword"
                isInvalid={errors?.rePassword?.message ? true : false}
                errorMessage={errors?.rePassword?.message}
                isRequired
                type="password"
                className="w-full"
                {...register("rePassword")}
            />
            </div>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-col gap-3 sm:gap-4 md:gap-5" blur={true} delay={800} duration={700} easing="ease-out" initialOpacity={0}>
            <div className="">
            <Input
                label="Date Of Birth"
                name="dateOfBirth"
                isRequired
                isInvalid={errors?.dateOfBirth?.message ? true : false}
                errorMessage={errors?.dateOfBirth?.message}
                type="date"
                className="w-full"
                {...register("dateOfBirth")}
            />
            </div>
        </FadeContent>
        <FadeContent className="w-[90%]" blur={true} delay={900}  duration={700} easing="ease-out" initialOpacity={0}>
            <Select
            {...register("gender")}
            isInvalid={errors?.gender?.message ? true : false}
            errorMessage={errors?.gender?.message}
            className=""
            label="Select Gender"
            isRequired
        >
            {genders.map((gender) => (
                <SelectItem key={gender.key}>{gender.label}</SelectItem>
            ))}
            </Select>
        </FadeContent>
        <FadeContent className="w-[90%] flex flex-row gap-5 sm:gap-4 md:gap-5" blur={true} delay={1000}  duration={700} easing="ease-out" initialOpacity={0}>
            <div className="w-[90%] flex flex-row gap-5 sm:gap-4 md:gap-5">
            <Button
                color="primary"
                type="submit"
                size="md"
                radius="md"
                isLoading={isLoading}
                className="w-fit"
            >
            Sign Up
            </Button>
            <Button
                color="primary"
                variant="light"
                as={NavLink}
                size="md"
                to={"/login"}
                radius="md"
                isLoading={isLoading}
                className="w-fit"
            >
            Already Has An Account?
            </Button>
            </div>
        </FadeContent>
        </form>
            </section>
            </FadeContent>
        }
    </>
    );
}