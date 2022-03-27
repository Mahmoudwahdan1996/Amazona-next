import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MuiLink from "@mui/material/Link";

const HeadTag = dynamic(() => import("../components/layout/HeadTag"));
const Form = dynamic(() => import("./../components/form"), {
  ssr: false,
});
const Input = dynamic(() => import("./../components/UI/Input"), {
  ssr: false,
});

const RegisterPage = () => {
  const [userCredentiales, setUserCredentials] = useState({
    userName: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const router = useRouter();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentiales, [name]: value });
  };

  const createUser = async (userCredentiales) => {
    closeSnackbar();

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ ...userCredentiales, isAdmin: true }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wronge");
      }
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    await createUser(userCredentiales);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: userCredentiales.email,
        password: userCredentiales.password,
      });
      if (!result.ok) {
        throw new Error(result.message || "Something went wronge");
      }

      if (!result.error) {
        if (
          window.history.length > 1 &&
          document.referrer.indexOf(window.location.host) !== -1
        ) {
          router.back();
        } else {
          router.replace("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <HeadTag title="Register" />
      <Form onSubmit={formSubmitHandler}>
        <Typography variant="h1" component="h1">
          Register
        </Typography>
        <List>
          <Input
            name="userName"
            variant="outlined"
            id="name"
            label="Name"
            type={{ type: "text" }}
            changeHandler={changeHandler}
          />

          <Input
            name="email"
            variant="outlined"
            id="email"
            label="Email"
            type={{ type: "email" }}
            changeHandler={changeHandler}
          />

          <Input
            name="password"
            variant="outlined"
            id="password"
            label="Password"
            type={{ type: "password" }}
            changeHandler={changeHandler}
          />

          <Input
            name="confirmpassword"
            variant="outlined"
            id="confirmpassword"
            label="Confirm Password"
            type={{ type: "password" }}
            changeHandler={changeHandler}
          />

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an acount ? &nbsp;
            <Link href="/login" passHref>
              <MuiLink>Login</MuiLink>
            </Link>
          </ListItem>
        </List>
      </Form>
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: "/",
        premanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default RegisterPage;
