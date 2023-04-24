import "./App.css";
import Layout from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
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
