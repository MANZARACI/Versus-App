import React from "react";
import Link from "next/link";
import LoginForm from "../components/LoginForm";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";

const Login = () => {
  const router = useRouter();

  const loginHandler = async (email, password) => {
    toast.dismiss();
    const toastId = toast.loading("Logging you in...", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result.error && result.ok) {
      toast.update(toastId, {
        render: "Successfully logged in",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      router.push("/");
    } else if (result.error) {
      toast.update(toastId, {
        render: result.error,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login / Versus</title>
      </Head>
      <main className="min-h-screen flex flex-col justify-center items-center pt-20 pb-10">
        <section className="bg-zinc-900 w-5/6 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/5 rounded-lg border-solid border border-gray-700 p-7">
          <h1 className="leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-4xl font-bold text-center mb-3">
            Login
          </h1>
          <LoginForm onLogin={loginHandler} />
        </section>
        <div className="bg-zinc-900 w-5/6 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/5 rounded-lg border border-gray-700 p-7 mt-10">
          <p className="text-center">
            Don't have an account?{" "}
            <Link className="text-blue-500" href="/signup">
              Signup
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

export default Login;
