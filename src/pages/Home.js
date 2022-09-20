import { useTheme } from "@emotion/react";
import { Button, Grid, TextField } from "@mui/material";
import * as React from "react";
import CustomAppBar from "../components/CustomAppBar";

const Body = () => {
  const theme = useTheme();
  return (
    <>
      <Grid sx={{ paddingX: 3, paddingY: 10 }} container rowSpacing={3}>
        <Grid item container xs={12}>
          <Grid item xs={2}>
            <Button>{"Donate"}</Button>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label={"Amount"}
              variant="filled"
              focused
              sx={{ backgroundColor: theme.palette.primary }}
              value={0}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default function Home({ setIsOpened }) {
  return (
    <>
      <CustomAppBar setIsOpened={setIsOpened} title={"Serverless Chat"} />
      <Body />
    </>
  );
}
