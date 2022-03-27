import { Fragment, useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MuiLink from "@mui/material/Link";

const Form = dynamic(() => import("../components/form"));
const Input = dynamic(() => import("./../components/UI/Input"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
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

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <Fragment>
      <HeadTag title="Login" />
      <Form onSubmit={submitHandler}>
        <Typography variant="h1" component="h1">
          Login
        </Typography>
        <List>
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

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don{`'`}t have an acount ? &nbsp;
            <Link href="/register" passHref>
              <MuiLink>Register</MuiLink>
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

export default LoginPage;
