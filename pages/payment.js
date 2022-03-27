import React, { Fragment, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RadioGroup from "@mui/material/RadioGroup";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const CheckoutWizard = dynamic(() => import("../components/checkoutWizard"));
const Form = dynamic(() => import("../components/form"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

import { CartContext } from "../utils/cartContext/CartContext";

const PaymentPage = () => {
  const [paymentmethod, setPaymentMethod] = useState("");
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { shipingAddress, paymentMethod, savePaymentMethod } =
    useContext(CartContext);

  useEffect(() => {
    if (!shipingAddress.address) {
      router.push("/shipping");
    } else {
      setPaymentMethod(paymentMethod || "");
    }
  }, [shipingAddress]);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentmethod) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
    } else {
      savePaymentMethod(paymentmethod);
      Cookies.set("paymentMethod", JSON.stringify(paymentmethod));
      router.push("/placeorder");
    }
  };
  return (
    <Fragment>
      <HeadTag title="Payment" />
      <CheckoutWizard activeStep={2} />
      <Form onSubmit={submitHandler}>
        <Typography variant="h1" component="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentmethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              onClick={() => router.push("/placeorder")}
            >
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </Form>
    </Fragment>
  );
};

export default PaymentPage;
