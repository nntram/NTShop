import "./App.css";
import Layout from "./components/layout/Layout";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

 // Create a client
 const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000,
    },
  },
})

function App() {
  return (
     // Provide the client to your App
     <QueryClientProvider client={queryClient}>
       <Layout />
       <ReactQueryDevtools initialIsOpen={true} />
     </QueryClientProvider>
   )
}

export default App;
