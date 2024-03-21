import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Error from "./pages/Error";
import OrderStatus from "./pages/OrderStatus";
import Checkout from "./pages/Checkout/index";
import MejaList from "./pages/Meja";
import PemesananList from "./pages/Pemesanan";
import ProductList from "./pages/Product";
import Login from "./pages/Login";
import Discount from "./pages/Discount";
import Dashboard from "./pages/dashboard";
import Invoice from "./pages/Pemesanan/invoice";
import Akun from "./pages/Akun";
import RiwayatPemesananList from "./pages/Pemesanan/riwayatpemesanan";
import NotifTransaction from "./pages/Notifpemesanan";
import DiscountDetail from "./pages/DiscountDetail";

const router = createBrowserRouter([
  {
    path: "/order/:id",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/order-status",
    element: <OrderStatus />,
  },
  {
    path: "/meja",
    element: <MejaList />,
  },
  {
    path: "/pemesanan",
    element: <PemesananList />,
  },
  {
    path: "/product",
    element: <ProductList />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/discount",
    element: <Discount />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/invoice/:id",
    element: <Invoice />,
  },
  {
    path: "/akun",
    element: <Akun />,
  },
  {
    path: "/riwayatpemesanan",
    element: <RiwayatPemesananList />,
  },
  {
    path: "/notifpemesanan",
    element: <NotifTransaction />,
  },
  {
    path: "/discountdetail",
    element: <DiscountDetail />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;