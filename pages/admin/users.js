import React, { Fragment, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession } from "next-auth/react";
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
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import classes from "../../utility/classes";
import { OrdersAdminContext } from "../../utils/ordersAdminContext/ordersAdminContext";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

const AdminProducts = ({ session }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    error,
    successDelete,
    users,
    loadingDeleteUser,
    loadingUsers,
    fetchUsersRequest,
    fetchUsersFail,
    fetchUsersSuccess,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    deleteUserReset,
  } = useContext(OrdersAdminContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        fetchUsersRequest();
        const response = await fetch(`/api/admin/users`);
        const { data } = await response.json();
        fetchUsersSuccess(data);
      } catch (error) {
        fetchUsersFail(error);
        console.log(error);
      }
    };
    if (successDelete) {
      deleteUserReset();
    } else {
      fetchUsers();
    }
  }, [successDelete]);

  const deleteHandler = async (userId) => {
    if (session.user.isAdmin) {
      if (!window.confirm("Are you sure?")) {
        return;
      }

      try {
        deleteUserRequest();
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { message } = await response.json();

        deleteUserSuccess();
        enqueueSnackbar(message, { variant: "success" });
      } catch (error) {
        deleteUserFail(error);
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
      <HeadTag title="Users" />

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
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Users
                    </Typography>
                    {loadingDeleteUser && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                {loadingUsers ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {isDesktop && (
                            <>
                              <TableCell align="center">ID</TableCell>
                              <TableCell align="center">NAME</TableCell>
                            </>
                          )}
                          <TableCell align="center">EMAIL</TableCell>
                          <TableCell align="center">ISADMIN</TableCell>
                          <TableCell align="center">ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            {isDesktop && (
                              <>
                                <TableCell align="center">
                                  {user._id.substring(20, 24)}
                                </TableCell>
                                <TableCell align="center">
                                  {user.userName}
                                </TableCell>
                              </>
                            )}
                            <TableCell align="center">{user.email}</TableCell>
                            <TableCell align="center">
                              {user.isAdmin ? "YES" : "NO"}
                            </TableCell>
                            <TableCell align="center">
                              <Link href={`/admin/user/${user._id}`} passHref>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{ my: 1, mx: 1 }}
                                >
                                  Edit
                                </Button>
                              </Link>{" "}
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => deleteHandler(user._id)}
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
