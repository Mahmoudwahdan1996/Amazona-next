import React, { Fragment, useContext, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";
import { useSnackbar } from "notistack";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import MuiLink from "@mui/material/Link";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const CheckoutWizard = dynamic(() => import("../../components/checkoutWizard"));

import classes from "../../utility/classes";
import { ContextOrder } from "../../utils/orderContext/ContextOrder";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

const Order = (props) => {
  const id = props.params.id;
  const router = useRouter();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { enqueueSnackbar } = useSnackbar();

  const {
    loading,
    error,
    order,
    successPay,
    loadingDeliver,
    successDeliver,
    requetStart,
    requestSuccess,
    requestError,
    payRest,
    payFail,
    paySuccess,
    payRequest,
    deliverRest,
    deliverSuccess,
    deliverFail,
    deliverRequest,
  } = useContext(ContextOrder);

  const {
    orderItems,
    shipingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isDelivered,
    isPaid,
    deliveredAt,
  } = order;

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      return router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        requetStart();
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        const orderinfo = await data.data;
        requestSuccess(orderinfo);
      } catch (err) {
        requestError(err.message);
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== id)
    ) {
      fetchOrder();
      if (successPay) {
        payRest();
      }
      if (successDeliver) {
        deliverRest();
      }
    } else {
      const loadpaypalScript = async () => {
        const response = await fetch("/api/keys/paypal");
        const { clientId } = await response.json();
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      loadpaypalScript();
    }
  }, [order, id, successPay, successDeliver]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        payRequest();
        const response = await fetch(`/api/orders/${order._id}/pay`, {
          method: "PATCH",
          body: JSON.stringify(details),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { data, message } = await response.json();
        paySuccess(data);
        enqueueSnackbar(message, { variant: "success" });
      } catch (error) {
        payFail(error);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    });
  }

  async function deliverOrderHandler() {
    try {
      deliverRequest();
      const response = await fetch(`/api/orders/${order._id}/deliver`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { data, message } = await response.json();
      deliverSuccess(data);
      enqueueSnackbar(message, { variant: "success" });
    } catch (error) {
      deliverFail(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }

  return (
    <Fragment>
      <HeadTag title={`Order ${id}`} description="order details" />
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component="h1" variant="h1">
        Order {id}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography sx={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shipingAddress.fullName}, {shipingAddress.address},{" "}
                  {shipingAddress.city}, {shipingAddress.postalCode},{" "}
                  {shipingAddress.country}
                </ListItem>
                <ListItem>
                  Status:{" "}
                  {isDelivered
                    ? `delivered ${new Date(deliveredAt).toLocaleString()}`
                    : "not delivered"}
                </ListItem>
              </List>
            </Card>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status:{" "}
                  {isPaid
                    ? `paid at ${new Date(order.paidAt).toLocaleString()}`
                    : "not paid"}
                </ListItem>
              </List>
            </Card>
            <Card ssx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Link href={`/product/${item.slug}`} passHref>
                                <MuiLink>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </MuiLink>
                              </Link>
                            </TableCell>

                            <TableCell>
                              <Link href={`/product/${item.slug}`} passHref>
                                <MuiLink>
                                  <Typography>{item.name}</Typography>
                                </MuiLink>
                              </Link>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <Box sx={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                        ></PayPalButtons>
                      </Box>
                    )}
                  </ListItem>
                )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress />}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </Button>
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
