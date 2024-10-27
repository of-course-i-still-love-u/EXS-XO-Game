"use client";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const NavigationBar: React.FC = () => {
  const { data: session } = useSession();

  return session ? (
    <div className="z-10 relative w-full flex justify-end items-center p-8 space-x-4  ">
      <button
        className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl"
        onClick={() => signOut()}
      >
        signOut
      </button>
      <p>{session.user?.email}</p>

      <Image
        className=" rounded-full"
        src={session.user?.image ?? ""}
        width={36}
        height={36}
        alt="Picture of the author"
      />
    </div>
  ) : (
    <div className="z-10 relative w-full flex justify-end items-center p-8 ">
      <button
        className="py-2 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl"
        onClick={() => signIn("google")}
      >
        <span className="text-white text-base">Sign in with Google</span>
      </button>
    </div>
  );
};

export default NavigationBar;
