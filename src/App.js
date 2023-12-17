import "./App.css";
import Book from "./pages/Book";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Order from "./pages/Order";
import User from "./pages/User";
import Dashboard from "./pages/Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "user",
          element: <User />,
        },
        {
          path: "book",
          element: <Book />,
        },
        {
          path: "order",
          element: <Order />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
