import { Fragment, useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const HeadTag = dynamic(() => import("../components/layout/HeadTag"));
const CheckoutWizard = dynamic(() => import("../components/checkoutWizard"));
const Form = dynamic(() => import("./../components/form"), {
  ssr: false,
});
const Input = dynamic(() => import("./../components/UI/Input"), {
  ssr: false,
});

import { CartContext } from "../utils/cartContext/CartContext";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const { shipingAddress, saveShipingAddress } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {
    if (shipingAddress) {
      setShippingInfo({ ...shipingAddress });
    }
  }, [shipingAddress]);

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    saveShipingAddress(shippingInfo);
    Cookies.set("shipingAddress", JSON.stringify({ ...shippingInfo }));
    router.push("/payment");
  };

  return (
    <Fragment>
      <HeadTag title="Shipping Address" />
      <CheckoutWizard activeStep={1} />
      <Form onSubmit={submitHandler}>
        <Typography variant="h1" component="h1">
          Shipping Address
        </Typography>
        <List>
          <Input
            name="fullName"
            variant="outlined"
            id="fullName"
            label="Full Name"
            type={{ type: "text" }}
            changeHandler={changeInputHandler}
            value={shippingInfo.fullName}
          />
          <Input
            name="address"
            variant="outlined"
            id="address"
            label="Address"
            type={{ type: "text" }}
            changeHandler={changeInputHandler}
            value={shippingInfo.address}
          />
          <Input
            name="city"
            variant="outlined"
            id="city"
            label="City"
            type={{ type: "text" }}
            changeHandler={changeInputHandler}
            value={shippingInfo.city}
          />

          <Input
            name="postalCode"
            variant="outlined"
            id="postalCode"
            label="Postal Code"
            type={{ type: "text" }}
            changeHandler={changeInputHandler}
            value={shippingInfo.postalCode}
          />
          <Input
            name="country"
            variant="outlined"
            id="country"
            label="Country"
            type={{ type: "text" }}
            changeHandler={changeInputHandler}
            value={shippingInfo.country}
          />

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
        </List>
      </Form>
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

export default Shipping;
