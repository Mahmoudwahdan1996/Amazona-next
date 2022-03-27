import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useSession, signOut } from "next-auth/react";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";

import classes from "../../utility/classes";

import { CartContext } from "../../utils/cartContext/CartContext";
import ColorModeContext from "./../../utils/colorModeContext/ColorModeContext";

const Navbar = () => {
  const router = useRouter();
  const { darkMode, setDarkMode } = useContext(ColorModeContext);
  const [categories, setCategories] = useState([]);

  const { cartItems, clearCartItems } = useContext(CartContext);

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [query, setQuery] = useState("");
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/products/categories`);
      const { data } = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const { data: session, status } = useSession();

  function darkModeChangeHandler() {
    setDarkMode(!darkMode);
  }

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event, redirect) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    if (redirect) {
      router.push(redirect);
    }

    setOpen(false);
  };
  const logoutClickHandler = async () => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    const data = await signOut({ redirect: false, callbackUrl: "/login" });
    router.push(data.url);
    clearCartItems();
    Cookies.remove("cartItems");
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const isDesktop = useMediaQuery("(min-width:650px)");

  return (
    <AppBar position="static" sx={classes.appbar}>
      <Toolbar sx={classes.toolbar}>
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={sidebarOpenHandler}
            sx={classes.menuButton}
          >
            <MenuIcon sx={classes.navbarButton} />
          </IconButton>
          <Link href="/" passHref>
            <MuiLink>
              <Typography sx={classes.brand}>Amasona</Typography>
            </MuiLink>
          </Link>
        </Box>
        <Drawer
          anchor="left"
          open={sidbarVisible}
          onClose={sidebarCloseHandler}
        >
          <List>
            <ListItem>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Shopping by category</Typography>
                <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                  <CancelIcon />
                </IconButton>
              </Box>
            </ListItem>
            <Divider light />
            {categories.map((category) => (
              <Link
                key={category}
                href={`/search?category=${category}`}
                passHref
              >
                <ListItem button component="a" onClick={sidebarCloseHandler}>
                  <ListItemText primary={category}></ListItemText>
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>

        {isDesktop && (
          <Box>
            <form onSubmit={submitHandler}>
              <Box className={classes.searchForm}>
                <InputBase
                  name="query"
                  sx={classes.searchInput}
                  placeholder="Search products"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  sx={classes.searchButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </form>
          </Box>
        )}
        <Box>
          <Switch
            checked={darkMode}
            onChange={darkModeChangeHandler}
            inputProps={{ "aria-label": "controlled" }}
          />
          <Link href="/cart" passHref>
            <MuiLink sx={{ marginLeft: "10px", color: "#fff" }}>
              <Typography component="span">
                {cartItems.length > 0 ? (
                  <Badge color="secondary" badgeContent={cartItems.length}>
                    Cart
                  </Badge>
                ) : (
                  "Cart"
                )}
              </Typography>
            </MuiLink>
          </Link>
          {!session && status === "unauthenticated" && (
            <Link href="/login" passHref>
              <MuiLink sx={{ marginLeft: "10px", color: "#fff" }}>
                <Typography component="span">Login</Typography>
              </MuiLink>
            </Link>
          )}
          {session && status === "authenticated" && (
            <>
              <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                {session.user.name}
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 100000 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          aria-haspopup="true"
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={(e) => handleClose(e, "/profile")}>
                            Profile
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => handleClose(e, "/order-history")}
                          >
                            Order Hisotry
                          </MenuItem>
                          {session.user.isAdmin && (
                            <MenuItem
                              onClick={(e) =>
                                handleClose(e, "/admin/dashboard")
                              }
                            >
                              Admin Dashboard
                            </MenuItem>
                          )}
                          <MenuItem onClick={logoutClickHandler}>
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
