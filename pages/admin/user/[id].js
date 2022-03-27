import React, { Fragment, useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useSnackbar } from "notistack";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import classes from "../../../utility/classes";
const Form = dynamic(() => import("../../../components/form"));
const HeadTag = dynamic(() => import("../../../components/layout/HeadTag"));
const Input = dynamic(() => import("./../../../components/UI/Input"));

import { OrdersAdminContext } from "../../../utils/ordersAdminContext/ordersAdminContext";

const ProductEdit = ({ params }) => {
  const userId = params.id;
  const {
    loading,
    error,
    fetchUserRequest,
    fetchUserFail,
    fetchUserSuccess,
    updateRequest,
    updateFail,
    updateSuccess,
    loadingUpdate,
  } = useContext(OrdersAdminContext);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [userData, setUserData] = useState({
    userName: "",
    isAdmin: false,
  });

  const changeHandler = (e) => {
    setUserData({
      ...userData,
      userName: e.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchUserRequest();
        const response = await fetch(`/api/admin/users/${userId}`);
        const { data } = await response.json();
        fetchUserSuccess();
        setUserData({
          userName: data.userName,
          isAdmin: data.isAdmin,
        });
      } catch (error) {
        fetchUserFail(error);
      }
    };
    fetchData();
  }, []);

  const formSubmitHandler = async (e) => {
    closeSnackbar();
    e.preventDefault();
    try {
      updateRequest();
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ userData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      updateSuccess();
      enqueueSnackbar(message, { variant: "success" });
      router.push("/admin/users");
    } catch (error) {
      updateFail(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Fragment>
      <HeadTag title={`Edit User ${userId}`} />

      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
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
                  Edit User : {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
                {error && <Typography sx={classes.error}>{error}</Typography>}
              </ListItem>
              <ListItem>
                <Form onSubmit={formSubmitHandler}>
                  <List>
                    <Input
                      name="userName"
                      variant="outlined"
                      id="userName"
                      label="userName"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={userData.userName}
                    />

                    <ListItem>
                      <FormControlLabel
                        label="Is Admin"
                        control={
                          <Checkbox
                            onClick={(e) =>
                              setUserData({
                                ...userData,
                                isAdmin: e.target.checked,
                              })
                            }
                            checked={userData.isAdmin}
                            name="isAdmin"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
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

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        premanent: false,
      },
    };
  }

  if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/",
        premanent: false,
      },
    };
  }

  return {
    props: {
      session,
      params: params,
    },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
