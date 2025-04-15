// src/PaymentStepper.js
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
    'pk_live_51LuFRIKOjy0CYDjIjQFC6WgjRiPE8b1WjsuQzjQU20Nxf7gYcr7IS8Gt7LLOo4nRNH07Plu35hkgC9depcBKy1Mm00lsz07drp'
);

const steps = ['Check Login', 'Review Last Payment', 'Make Payment'];

const PaymentStepper = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            // Handle Stripe Checkout
            const stripe = await stripePromise;

            const response = await fetch('http://localhost:8000/create-checkout-session', {
                method: 'POST'
            });
            const session = await response.json();

            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                console.error(result.error.message);
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Pay' : 'Next'}</Button>
                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
};

export default PaymentStepper;
