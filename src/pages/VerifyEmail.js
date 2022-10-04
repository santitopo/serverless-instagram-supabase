import { Grid, Typography } from "@mui/material";
import React from "react";

const VerifyEmailPage = () => {
  return (
    <Grid
      sx={{ paddingX: 50, paddingY: 20 }}
      style={{ height: "100vh" }}
      container
      rowSpacing={3}
    >
      <Grid item xs={12}>
        <Typography fontSize={24} style={{ textAlign: "center" }}>
          {`Debes verificar tu email. Recargue la página cuando lo hayas hecho.`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default function VerifyEmail() {
  return <VerifyEmailPage />;
}

const styles = {
  text: { fontSize: 20 },
};
