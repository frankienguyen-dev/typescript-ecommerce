import React, { useContext, lazy, Suspense } from "react";
import { useRoutes, Outlet, Navigate } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";
import CartLayout from "src/layouts/CartLayout";
import MainLayout from "src/layouts/MainLayout";
import RegisterLayout from "src/layouts/RegisterLayout";
// import Cart from "src/pages/Cart";
// import Login from "src/pages/Login";
// import NotFound from "src/pages/NotFound";
// import ProductDetail from "src/pages/ProductDetail";
// import ProductList from "src/pages/ProductList";
// import Profile from "src/pages/Profile";
// import Register from "src/pages/Register";
import UserLayout from "src/pages/User/layouts/UserLayout";
// import ChangePassword from "src/pages/User/pages/ChangePassword";
// import HistoryPurchase from "src/pages/User/pages/HistoryPurchase";

// Lazy load
const Login = lazy(() => import("src/pages/Login"));
const NotFound = lazy(() => import("src/pages/NotFound"));
const ProductDetail = lazy(() => import("src/pages/ProductDetail"));
const ProductList = lazy(() => import("src/pages/ProductList"));
const Profile = lazy(() => import("src/pages/Profile"));
const Register = lazy(() => import("src/pages/Register"));
const Cart = lazy(() => import("src/pages/Cart"));
const ChangePassword = lazy(
  () => import("src/pages/User/pages/ChangePassword")
);
const HistoryPurchase = lazy(
  () => import("src/pages/User/pages/HistoryPurchase")
);

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
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          ),
        },

        {
          path: path.user,
          element: (
            <MainLayout>
              <Suspense>
                <UserLayout />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              ),
            },

            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              ),
            },

            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              ),
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
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          ),
        },

        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
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
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      ),
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      ),
    },
    {
      path: "*",
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      ),
    },
  ]);
  return routeElements;
}
