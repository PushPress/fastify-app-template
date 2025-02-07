import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";

/**
 * Defines the routes for the application.
 * https://reactrouter.com/start/library/routing
 */
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
