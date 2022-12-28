import React from "react";
import NewVersusForm from "../../components/NewVersusForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Head from "next/head";

const NewVersus = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const saveVersusHandler = async (formData) => {
    toast.dismiss();
    const toastId = toast.loading("Saving versus...", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    try {
      const response = await fetch("/api/versus", {
        method: "POST",
        body: formData,
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

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <>
      <Head>
        <title>New / Versus</title>
      </Head>
      <main className="min-h-screen flex justify-center items-center">
        <section className="bg-zinc-900 w-5/6 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 rounded-lg border-solid border border-gray-700 p-7 my-20">
          <h1 className="leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-4xl font-bold text-center mb-6">
            New Versus
          </h1>
          <NewVersusForm onSaveVersus={saveVersusHandler} />
        </section>
      </main>
    </>
  );
};

export default NewVersus;
