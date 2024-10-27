"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginButton: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const checkAuth = () => {
    if (!session) {
      signIn();
    } else {
      router.push("en/xo");
    }
  };
  return (
    <button onClick={checkAuth}>
      <span className=" text-white text-4xl font-bold hover:text-red-700">
        Start
      </span>
    </button>
  );
};

export default LoginButton;
