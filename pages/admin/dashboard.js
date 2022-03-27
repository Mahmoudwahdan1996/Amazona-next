import React, { Fragment, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getSession } from "next-auth/react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";

import { AdminContext } from "../../utils/adminContext/AdminContext";
import classes from "../../utility/classes";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

const AdminDashboard = () => {
  const { loading, error, summary, requetStart, requestSuccess, requestError } =
    useContext(AdminContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        requetStart();
        const response = await fetch(`/api/admin/summary`);
        const { data } = await response.json();
        requestSuccess(data);
      } catch (error) {
        requestError(error.message);
        console.log(error.message);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Fragment>
      <HeadTag title="Admin Dashboard" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
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
                <ListItem button component="a">
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={classes.error}>{error}</Typography>
                ) : (
                  <Grid
                    container
                    spacing={5}
                    sx={{ margin: { xs: "0 auto", md: "intial" } }}
                  >
                    <Grid item md={3} xs={10} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            ${summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View sales
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={10} md={3} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View orders
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={10} md={3} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/products" passHref>
                            <Button size="small" color="primary">
                              View products
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={10} md={3} sm={6}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <Link href="/admin/users" passHref>
                            <Button size="small" color="primary">
                              View users
                            </Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Sales Chart
                </Typography>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

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
    },
  };
}
export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
