import "./App.css";
import Layout from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000,
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
        console.log(userObj.RefreshTokenExpire)
        console.log(Date.now()/1000)

        if (token && user && userObj.RefreshTokenExpire <= Date.now()) {
          sessionStorage.setItem("currentUser", user);
          sessionStorage.setItem("userAuth", token);
        }
      } catch (error) {

      }
      
    }
    console.log("app effect");
  });
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Layout />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
