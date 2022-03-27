import React, { Fragment, useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
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

const Form = dynamic(() => import("../../../components/form"));
const HeadTag = dynamic(() => import("../../../components/layout/HeadTag"));
const Input = dynamic(() => import("./../../../components/UI/Input"));

import classes from "../../../utility/classes";
import { OrdersAdminContext } from "../../../utils/ordersAdminContext/ordersAdminContext";

const ProductEdit = ({ params }) => {
  const productId = params.id;
  const {
    loading,
    error,
    requestProductError,
    requestProductSuccess,
    requetProductStart,
    updateRequest,
    updateFail,
    updateSuccess,
    loadingUpdate,
    loadingUpload,
    uploadRequest,
    uploadSuccess,
    uploadFail,
  } = useContext(OrdersAdminContext);

  const { enqueueSnackbar } = useSnackbar();

  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    price: "",
    image: "",
    category: "",
    brand: "",
    countInStock: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        requetProductStart();
        const response = await fetch(`/api/admin/products/${productId}`);
        const { data } = await response.json();
        requestProductSuccess();
        setProductData({
          name: data.name,
          slug: data.slug,
          price: data.price,
          image: data.image,
          category: data.category,
          brand: data.brand,
          countInStock: data.countInStock,
          description: data.description,
        });
      } catch (error) {
        requestProductError(error);
      }
    };
    fetchData();
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    bodyFormData.append("upload_preset", "uploads");
    try {
      uploadRequest();
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dqzxpggzr/image/upload",
        {
          method: "POST",
          body: bodyFormData,
        }
      );

      const data = await response.json();
      uploadSuccess();
      setProductData({ ...productData, image: data.secure_url });
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (error) {
      uploadFail(error);
      enqueueSnackbar("Filed to upload", { variant: "error" });
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      updateRequest();
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ productData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      enqueueSnackbar(message, { variant: "success" });
      updateSuccess();
    } catch (error) {
      updateFail(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Fragment>
      <HeadTag title={`Edit Product ${productId}`} />

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
                <Typography component="h1" variant="h1">
                  Edit Product : {productId}
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
                      name="name"
                      variant="outlined"
                      id="name"
                      label="Name"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.name}
                    />

                    <Input
                      name="slug"
                      variant="outlined"
                      id="slug"
                      label="Slug"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.slug}
                    />

                    <Input
                      name="category"
                      variant="outlined"
                      id="category"
                      label="Category"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.category}
                    />

                    <Input
                      name="image"
                      variant="outlined"
                      id="image"
                      label="Image"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.image}
                    />

                    <ListItem>
                      <Button variant="contained" component="label">
                        Upload File
                        <input
                          type="file"
                          name="file"
                          onChange={uploadHandler}
                          hidden
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <Input
                      name="price"
                      variant="outlined"
                      id="price"
                      label="Price"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.price}
                    />

                    <Input
                      name="brand"
                      variant="outlined"
                      id="brand"
                      label="Brand"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.brand}
                    />

                    <Input
                      name="countInStock"
                      variant="outlined"
                      id="countInStock"
                      label="CountInStock"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.countInStock}
                    />

                    <Input
                      name="description"
                      variant="outlined"
                      id="description"
                      label="Description"
                      type={{ type: "text" }}
                      changeHandler={changeHandler}
                      value={productData.description}
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
