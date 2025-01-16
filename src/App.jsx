import { AuthContextProvider } from "./context/AuthContext";
import MainRouter from "./MainRouter";


function App() {

  return (
    <AuthContextProvider>
      <MainRouter />

    </AuthContextProvider>

  );
}

export default App;
