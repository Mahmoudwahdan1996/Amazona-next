import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSnackbar } from "notistack";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ListItemText from "@mui/material/ListItemText";

import classes from "../utility/classes";
const Form = dynamic(() => import("../components/form"));
const Input = dynamic(() => import("./../components/UI/Input"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [userCredentiales, setUserCredentials] = useState({
    userName: "",
    email: "",
    password: "",
    newpassword: "",
    confirmpassword: "",
  });

  useEffect(() => {
    if (!session) {
      return router.push("/login");
    }
    setUserCredentials({
      ...userCredentiales,
      email: session.user.email,
      userName: session.user.name,
    });
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentiales, [name]: value });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    closeSnackbar();

    if (
      userCredentiales.newpassword !== userCredentiales.confirmpassword ||
      userCredentiales.password === userCredentiales.confirmpassword
    ) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...userCredentiales }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }

    try {
      signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <HeadTag title="Profile" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <Form onSubmit={formSubmitHandler}>
                  <List>
                    <Input
                      name="userName"
                      variant="outlined"
                      id="userName"
                      label="Name"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={userCredentiales.userName}
                    />

                    <Input
                      name="email"
                      variant="outlined"
                      id="email"
                      label="Email"
                      type={{ type: "email" }}
                      changeHandler={changeHandler}
                      value={userCredentiales.email}
                    />

                    <Input
                      name="password"
                      variant="outlined"
                      id="password"
                      label="Password"
                      type={{ type: "password" }}
                      changeHandler={changeHandler}
                      value={userCredentiales.password}
                    />

                    <Input
                      name="newpassword"
                      variant="outlined"
                      id="newpassword"
                      label="New Password"
                      type={{ type: "password" }}
                      changeHandler={changeHandler}
                      value={userCredentiales.newpassword}
                    />

                    <Input
                      name="confirmpassword"
                      variant="outlined"
                      id="confirmpassword"
                      label="Confirm Password"
                      type={{ type: "password" }}
                      changeHandler={changeHandler}
                      value={userCredentiales.confirmpassword}
                    />

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </Form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
