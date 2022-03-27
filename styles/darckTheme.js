import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const darkTheme = createTheme({
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
  },

  typography: {
    h1: {
      fontSize: "1.6rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
    h2: {
      fontSize: "1.4rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#f0c000",
      light: "#f1f5f9",
    },
    secondary: {
      main: "#208080",
    },

    background: {
      default: "#121212",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
});

export default darkTheme;
