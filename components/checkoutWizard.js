import React from "react";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {["Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
};

export default CheckoutWizard;
