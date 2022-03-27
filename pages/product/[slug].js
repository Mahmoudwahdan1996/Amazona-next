import React, { Fragment, useContext, useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Rating from "@mui/material/Rating";
import MuiLink from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { getProduct } from "../../utils/helpers";
import { CartContext } from "../../utils/cartContext/CartContext";
import classes from "./../../utility/classes";

const Form = dynamic(() => import("../../components/form"));
const TotalCard = dynamic(() =>
  import("../../components/productDetails/TotalCard")
);
const HeadTag = dynamic(() => import("../../components/layout/HeadTag"));

const ProductPage = (props) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { data: session, status } = useSession();

  const { product } = props;
  const router = useRouter();

  const { cartItems, addToCart } = useContext(CartContext);

  function addToCartHandler() {
    const existItem = cartItems.find((item) => product.id === item.id);

    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock <= quantity) {
      window.alert("Soory , productis out of stock");
      return;
    }
    addToCart(product, quantity);
    router.push("/cart");
  }

  const submitHandler = async (e) => {
    closeSnackbar();
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      setLoading(false);
      enqueueSnackbar("Review submitted successfully", { variant: "success" });
      fetchReviews();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`);
      const data = await res.json();
      setReviews(data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [reviews, product]);

  if (!product) {
    return <Box>Product Not Found</Box>;
  }

  return (
    <Fragment>
      <HeadTag title={product.name} description={product.description} />
      <Head>
        <title>Next Amazona</title>
        <title>
          {product.name ? `${product.name} - Next Amazona` : "Next Amazona"}
        </title>
        {product.description && (
          <meta name="description" content={product.description}></meta>
        )}
      </Head>

      <Box sx={classes.section}>
        <Link href="/" passHref>
          <MuiLink>back to products</MuiLink>
        </Link>
      </Box>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <Link href="#reviews" passHref>
                <Typography>({product.numReviews} reviews)</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <TotalCard
            textone="Price"
            texttwo="Status"
            textButton="Add to cart"
            Price={product.price}
            handler={addToCartHandler}
            val={product.countInStock > 0 ? "In stock" : "Unavailable"}
          />
        </Grid>
      </Grid>

      <List>
        <ListItem>
          {session && status === "authenticated" ? (
            <Form onSubmit={submitHandler}>
              <List>
                <ListItem>
                  <Typography variant="h2">Leave your review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Enter comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>

                  {loading && <CircularProgress></CircularProgress>}
                </ListItem>
              </List>
            </Form>
          ) : (
            <Typography variant="h2">
              Please{" "}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                login
              </Link>{" "}
              to write a review
            </Typography>
          )}
        </ListItem>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>No review</ListItem>}
        {reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item sx={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt.substring(0, 10)}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params.slug;

  const product = await getProduct(slug);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: product,
    },
  };
}

export default ProductPage;
