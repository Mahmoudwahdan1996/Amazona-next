import React, { Fragment, useState, useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useSnackbar } from "notistack";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

const Input = dynamic(() => import("./../../components/UI/Input"), {
  ssr: false,
});

import { OrdersAdminContext } from "../../utils/ordersAdminContext/ordersAdminContext";

const AddProduct = () => {
  const {
    loadingCreate,
    error,
    loadingUpload,
    uploadRequest,
    uploadSuccess,
    uploadFail,
    createRequest,
    createSuccess,
    createFail,
  } = useContext(OrdersAdminContext);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    price: "",
    image: "",
    category: "",
    brand: "",
    countInStock: "",
    description: "",
    reviews: [],
  });

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
    } catch (error) {
      uploadFail(error);
      console.log(error);
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      createRequest();
      const response = await fetch(`/api/admin/products`, {
        method: "Post",
        body: JSON.stringify({
          productData: { ...productData, price: Number(productData.price) },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      createSuccess();
      enqueueSnackbar(message, { variant: "success" });
      router.push("/admin/products");
    } catch (error) {
      createFail(error);
      enqueueSnackbar("Faield To create  Product", { variant: "error" });
    }
  };

  return (
    <Fragment>
      <HeadTag title="Add Product" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={{ my: "20px" }}>
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
          <Card sx={{ my: "20px" }}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Add Product
                </Typography>
              </ListItem>
              <ListItem>{error && <Typography>{error}</Typography>}</ListItem>
              <ListItem>
                <Box sx={{ width: 800, margin: "0 auto" }}>
                  <form onSubmit={formSubmitHandler}>
                    <List>
                      <Input
                        name="name"
                        variant="outlined"
                        id="name"
                        label="Name"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.name}
                        placeholder="ex: sample name"
                      />

                      <Input
                        name="slug"
                        variant="outlined"
                        id="slug"
                        label="Slug"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.slug}
                        placeholder={`sample-slug- ${Math.random()} `}
                      />

                      <Input
                        name="category"
                        variant="outlined"
                        id="category"
                        label="Category"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.category}
                        placeholder="ex: sample category"
                      />

                      <Input
                        name="image"
                        variant="outlined"
                        id="image"
                        label="Image"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.image}
                        placeholder="/images/shirt1.jpg"
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
                        placeholder="0"
                      />

                      <Input
                        name="brand"
                        variant="outlined"
                        id="brand"
                        label="Brand"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.brand}
                        placeholder="sample brand"
                      />

                      <Input
                        name="countInStock"
                        variant="outlined"
                        id="countInStock"
                        label="CountInStock"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.countInStock}
                        placeholder="0"
                      />

                      <Input
                        name="description"
                        variant="outlined"
                        id="description"
                        label="Description"
                        type={{ type: "text" }}
                        changeHandler={changeHandler}
                        value={productData.description}
                        placeholder="sample description"
                      />

                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          Add Product
                        </Button>
                        {loadingCreate && <CircularProgress />}
                      </ListItem>
                    </List>
                  </form>
                </Box>
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
export default dynamic(() => Promise.resolve(AddProduct), { ssr: false });
