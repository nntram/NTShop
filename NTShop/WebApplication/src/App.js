import "./App.css";
import Layout from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect } from "react";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    const rememberLogin = localStorage.getItem("remember");
    if (rememberLogin) {
      const token = localStorage.getItem("userAuth");
      const user = localStorage.getItem("currentUser");
      try {
        const userObj = JSON.parse(user);
        if (token && user && userObj.RefreshTokenExpire <= Date.now()) {
          sessionStorage.setItem("currentUser", user);
          sessionStorage.setItem("userAuth", token);
        }
      } catch (error) {

      }
    }
  }, []);
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      language="vi"

    >
      <QueryClientProvider client={queryClient}>
        <Layout />
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      </QueryClientProvider>

    </GoogleReCaptchaProvider>
  );
}

export default App;
