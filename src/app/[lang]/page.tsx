import { NextPage } from "next";
import LoginButton from "./components/LoginButtonComponents/LoginButton";
import SplineTableBG from "./components/SplineComponents/SplineTableBG";

const Page: NextPage = async () => {
  return (
    <div className="  flex justify-center items-center w-full">
      <div className="z-10 space-y-4 mt-[20vh]">
        <h1 className="text-white text-9xl font-bold hover:text-red-700 ">
          XO Game
        </h1>
        <h3 className="text-white text-4xl font-bold hover:text-red-700">
          Player VS Bot
        </h3>
        <LoginButton />
      </div>
      <SplineTableBG />
    </div>
  );
};

export default Page;
