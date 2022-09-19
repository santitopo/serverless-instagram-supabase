import * as React from "react";
import CustomAppBar from "../components/CustomAppBar";

export default function LoanContractControlPanel({ setIsOpened }) {
  const { loanContract, loanContractAddr } = {
    loanContract: null,
    loanContractAddr: null,
  };
  return (
    <>
      <CustomAppBar
        setIsOpened={setIsOpened}
        title={"Loan Contract Control Panel"}
      />
    </>
  );
}
