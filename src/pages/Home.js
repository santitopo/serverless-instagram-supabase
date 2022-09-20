import * as React from "react";
import CustomAppBar from "../components/CustomAppBar";

export default function Home({ setIsOpened }) {
  return (
    <>
      <CustomAppBar setIsOpened={setIsOpened} title={"Serverless Chat"} />
    </>
  );
}
