import React from "react";
import SignupForm from "../components/SignupForm";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";

const Signup = () => {
  const router = useRouter();

  const signupHandler = async (username, email, password) => {
    toast.dismiss();
    const toastId = toast.loading("Signing up...", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.successMessage) {
        toast.update(toastId, {
          render: data.successMessage,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        router.push("/");
      } else if (data.errorMessage) {
        toast.update(toastId, {
          render: data.errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Signup / Versus</title>
      </Head>
      <main className="min-h-screen flex flex-col justify-center items-center">
        <section className="bg-zinc-900 w-5/6 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/5 rounded-lg border-solid border border-gray-700 p-7 mt-20">
          <h1 className="leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-4xl font-bold text-center mb-3">
            Signup
          </h1>
          <SignupForm onSignup={signupHandler} />
        </section>
        <div className="bg-zinc-900 w-5/6 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/5 rounded-lg border-solid border border-gray-700 p-7 my-10">
          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-blue-500" href="/login">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      loggedIn: false,
    },
  };
};

export default Signup;
