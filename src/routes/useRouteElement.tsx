import React, { useContext } from "react";
import { useRoutes, Outlet, Navigate } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";
import CartLayout from "src/layouts/CartLayout";
import MainLayout from "src/layouts/MainLayout";
import RegisterLayout from "src/layouts/RegisterLayout";
import Cart from "src/pages/Cart";
import Login from "src/pages/Login";
import NotFound from "src/pages/NotFound";
import ProductDetail from "src/pages/ProductDetail";
import ProductList from "src/pages/ProductList";
import Profile from "src/pages/Profile";
import Register from "src/pages/Register";
import UserLayout from "src/pages/User/layouts/UserLayout";
import ChangePassword from "src/pages/User/pages/ChangePassword";
import HistoryPurchase from "src/pages/User/pages/HistoryPurchase";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          ),
        },

        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />,
            },

            {
              path: path.changePassword,
              element: <ChangePassword />,
            },

            {
              path: path.historyPurchase,
              element: <HistoryPurchase />,
            },
          ],
        },
      ],
    },

    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          ),
        },

        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          ),
        },
      ],
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      ),
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      ),
    },
    {
      path: "*",
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      ),
    },
  ]);
  return routeElements;
}
