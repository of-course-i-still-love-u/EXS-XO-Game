import { NextPage } from "next";
import XoGameBoard from "./components/XoGameBoardComponents/XoGameBoard";

const Page: NextPage = () => {
  return (
    <div className="mx-auto w-full  px-4  pb-8 md:max-w-7xl md:px-0">
      <XoGameBoard />
    </div>
  );
};

export default Page;
