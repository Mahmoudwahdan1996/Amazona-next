import React, { Fragment, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getSession } from "next-auth/react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import classes from "../utility/classes";
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

import { ContextHistoryOrder } from "./../utils/orderHistor/orderHistoryContext";

const OrderHistory = () => {
  const { loading, error, orders, requetStart, requestSuccess, requestError } =
    useContext(ContextHistoryOrder);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        requetStart();
        const response = await fetch(`/api/orders/history`);
        const { ordersInfo } = await response.json();

        requestSuccess(ordersInfo);
      } catch (err) {
        requestError(err);
      }
    };
    fetchOrders();
  }, []);

  const Theme = useTheme();
  const isDesktop = useMediaQuery(Theme.breakpoints.up("md"));

  return (
    <Fragment>
      <HeadTag title="Order History" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/order-history" passHref>
                <ListItem selected button component="a">
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
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          {isDesktop && <TableCell>DATE</TableCell>}
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          {isDesktop && <TableCell>DELIVERED</TableCell>}

                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(18, 24)}</TableCell>
                            {isDesktop && (
                              <>
                                <TableCell>
                                  {new Date(order.createdAt).toDateString()}
                                </TableCell>
                              </>
                            )}
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : "not paid"}
                            </TableCell>
                            {isDesktop && (
                              <TableCell>
                                {order.isDelivered
                                  ? `${new Date(
                                      order.deliveredAt
                                    ).toUTCString()} `
                                  : "not delivered"}
                              </TableCell>
                            )}
                            <TableCell sx={{ justifyContent: "center" }}>
                              <Link href={`/orders/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
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

  return {
    props: {
      session,
    },
  };
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
