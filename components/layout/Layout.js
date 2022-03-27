import { Fragment } from "react";
import dynamic from "next/dynamic";

import { SnackbarProvider } from "notistack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import classes from "../../utility/classes";

const Navbar = dynamic(() => import("./Navbar"));

const Layout = ({ children }) => {
  return (
    <Fragment>
      <SnackbarProvider>
        <Navbar />
        <Container sx={classes.main}>{children}</Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>All Right Reserved</Typography>
        </Box>
      </SnackbarProvider>
    </Fragment>
  );
};

export default Layout;
