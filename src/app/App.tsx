import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppProvider";
import PrivateRouter from "./routers/PrivateRouter";
import PublicRouter from "./routers/PublicRouter";

// Entrypoint of the application.
// We provide two main routers, one for the public routes, and one for the private routes.
function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/*" element={<PublicRouter />} />
        <Route path="/user/*" element={<PrivateRouter />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
