import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import { AppProvider } from "./AppProvider";
import { Routes, Route } from "react-router-dom";
import PublicRouter from "./routers/PublicRouter";
import PrivateRouter from "./routers/PrivateRouter";
import { LogoutButton, UnconnectButton } from "@jhnnsrs/arkitekt";

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
