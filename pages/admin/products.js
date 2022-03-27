import React, { Fragment, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

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

const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

import classes from "../../utility/classes";
import { OrdersAdminContext } from "../../utils/ordersAdminContext/ordersAdminContext";

const AdminProducts = ({ session }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    loadingProducts,
    error,
    products,
    loadingDelete,
    successDelete,
    requetProductsStart,
    requestProductsSuccess,
    requestProductsError,
    deleteRequest,
    deleteSuccess,
    deleteFail,
    deleteReset,
  } = useContext(OrdersAdminContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        requetProductsStart();
        const response = await fetch(`/api/admin/products`);
        const { data } = await response.json();
        requestProductsSuccess(data);
      } catch (error) {
        requestProductsError();
      }
    };
    if (successDelete) {
      deleteReset();
    } else {
      fetchProducts();
    }
  }, [successDelete]);

  const createHandler = () => {
    if (session.user.isAdmin) {
      router.push("/admin/addProduct");
    }
  };
  const deleteHandler = async (productId) => {
    if (session.user.isAdmin) {
      if (!window.confirm("Are you sure?")) {
        return;
      }

      try {
        deleteRequest();
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { message } = await response.json();

        deleteSuccess();
        enqueueSnackbar(message, { variant: "success" });
      } catch (error) {
        deleteFail(error);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    } else {
      router.push("/login");
    }
  };

  const Theme = useTheme();
  const isDesktop = useMediaQuery(Theme.breakpoints.up("md"));
  return (
    <Fragment>
      <HeadTag title="Products" />

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
                <ListItem selected button component="a">
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
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs={6}>
                    <Button
                      onClick={createHandler}
                      color="primary"
                      variant="contained"
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                {loadingProducts ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {isDesktop && (
                            <TableCell align="center">ID</TableCell>
                          )}
                          <TableCell align="center">NAME</TableCell>
                          <TableCell align="center">PRICE</TableCell>
                          {isDesktop && (
                            <TableCell align="center">CATEGORY</TableCell>
                          )}
                          <TableCell align="center">COUNT</TableCell>
                          {isDesktop && (
                            <TableCell align="center">RATING</TableCell>
                          )}
                          <TableCell align="center">ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            {isDesktop && (
                              <TableCell
                                align="center"
                                sx={{ padding: "10px" }}
                              >
                                {product._id.substring(20, 24)}
                              </TableCell>
                            )}
                            <TableCell align="center" sx={{ padding: "10px" }}>
                              {product.name}
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "10px" }}>
                              ${product.price}
                            </TableCell>
                            {isDesktop && (
                              <TableCell
                                align="center"
                                sx={{ padding: "10px" }}
                              >
                                {product.category}
                              </TableCell>
                            )}
                            <TableCell align="center" sx={{ padding: "10px" }}>
                              {product.countInStock}
                            </TableCell>
                            {isDesktop && (
                              <TableCell
                                align="center"
                                sx={{ padding: "10px" }}
                              >
                                {product.rating}
                              </TableCell>
                            )}
                            <TableCell align="center" sx={{ padding: "10px" }}>
                              <Link
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                >
                                  Edit
                                </Button>
                              </Link>{" "}
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => deleteHandler(product._id)}
                                color="error"
                              >
                                Delete
                              </Button>
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

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
