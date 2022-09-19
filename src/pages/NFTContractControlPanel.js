import * as React from "react";
import CustomAppBar from "../components/CustomAppBar";

export default function NFTContractControlPanel({ setIsOpened }) {
  return (
    <>
      <CustomAppBar
        setIsOpened={setIsOpened}
        title={"NFT Contract Control Panel"}
      />
    </>
  );
}
