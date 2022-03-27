import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utility/createEmotionCache";
import { useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Layout = dynamic(() => import("../components/layout/Layout"));

import { CartProvider } from "./../utils/cartContext/CartProvider";
import { ProviderOrder } from "./../utils/orderContext/ProviderOrder";
import { OrderHistoryProvider } from "./../utils/orderHistor/orderHistoryProvider";
import { AdminProvider } from "./../utils/adminContext/AdminProvider";
import { OrdersAdminProvider } from "./../utils/ordersAdminContext/ordersAdminProvider";
import theme from "../styles/theme";
import darkTheme from "./../styles/darckTheme";

import ColorModeContext from "../utils/colorModeContext/ColorModeContext";

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    session,
  } = props;

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  useEffect(() => {
    const mode = localStorage.getItem("mode") === "true";
    setDarkMode(mode);
  }, []);

  const _setDarkMode = (newmode) => {
    localStorage.setItem("mode", newmode);
    setDarkMode(newmode);
  };

  return (
    <CacheProvider value={emotionCache}>
      <SessionProvider session={session}>
        <CartProvider>
          <ProviderOrder>
            <OrderHistoryProvider>
              <PayPalScriptProvider deferLoading={true}>
                <AdminProvider>
                  <OrdersAdminProvider>
                    <ColorModeContext.Provider
                      value={{ darkMode, setDarkMode: _setDarkMode }}
                    >
                      <ThemeProvider theme={darkMode ? darkTheme : theme}>
                        <CssBaseline />
                        <Layout>
                          <Component {...pageProps} />
                        </Layout>
                      </ThemeProvider>
                    </ColorModeContext.Provider>
                  </OrdersAdminProvider>
                </AdminProvider>
              </PayPalScriptProvider>
            </OrderHistoryProvider>
          </ProviderOrder>
        </CartProvider>
      </SessionProvider>
    </CacheProvider>
  );
};

export default MyApp;
