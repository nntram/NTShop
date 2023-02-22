import "./App.css";
import Layout from "./components/layout/Layout";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

 // Create a client
 const queryClient = new QueryClient()

function App() {
  return (
     // Provide the client to your App
     <QueryClientProvider client={queryClient}>
       <Layout />
     </QueryClientProvider>
   )
}

export default App;
