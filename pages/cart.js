import { useContext, Fragment } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";

import { CartContext } from "../utils/cartContext/CartContext";
const TotalCard = dynamic(() =>
  import("../components/productDetails/TotalCard")
);
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

const CartPage = () => {
  const router = useRouter();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const updateCartHandler = (product, quantity) => {
    if (product.countInStock < quantity) {
      window.alert("Soory , productis out of stock");
      return;
    }
    addToCart(product, quantity);
  };
  const removeHandler = (item) => {
    removeFromCart(item);
  };
  const checkOutHandler = () => {
    router.push("/shipping");
  };
  return (
    <Fragment>
      <HeadTag title="Shopping Cart" />
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Box>
          Cart is empty.{" "}
          <Link href="/" passHref>
            <MuiLink>Go shopping</MuiLink>
          </Link>
        </Box>
      ) : (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
          <Grid md={9} xs={12} item>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "block" } }}>
                      Name
                    </TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ padding: { xs: "6px", sm: "16px" } }}>
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
                        <Typography
                          sx={{ display: { xs: "block", sm: "none" } }}
                          variant="caption"
                          display="block"
                        >
                          {item.name}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "table-cell" },
                          padding: { xs: "6px", sm: "16px" },
                        }}
                      >
                        <Link href={`/product/${item.slug}`} passHref>
                          <MuiLink>
                            <Typography>{item.name}</Typography>
                          </MuiLink>
                        </Link>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ padding: { xs: "6px", sm: "16px" } }}
                      >
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ padding: { xs: "6px", sm: "16px" } }}
                      >
                        ${item.price}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ padding: { xs: "6px", sm: "16px" } }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <TotalCard
              textone="Subtotal"
              texttwo="items"
              textButton="Check Out"
              Price={cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
              handler={checkOutHandler}
              val={cartItems.reduce((a, c) => a + c.quantity, 0)}
            />
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
