import { useContext } from "react";
import dynamic from "next/dynamic";

import getProducts from "../utils/helpers";
import Grid from "@mui/material/Grid";

const ProductItem = dynamic(() => import("../components/ProductItem"));

import { CartContext } from "../utils/cartContext/CartContext";
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

export default function Home(props) {
  const { cartItems, addToCart } = useContext(CartContext);

  const addToCartHandler = (product) => {
    const existItem = cartItems.find((item) => product.id === item.id);

    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      window.alert("Soory , productis out of stock");
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <>
      <HeadTag description="Next Amazona e-commerce website by next.js " />
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {props.products.map((product) => (
            <Grid item sm={6} xs={12} md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const products = await getProducts();

  return {
    props: {
      products: products,
    },
  };
}
