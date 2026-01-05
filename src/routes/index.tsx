import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

const LoginPage = lazy(() => import('../pages/login'));
const LogoutPage = lazy(() => import('../pages/logout'));
const DashboardPage = lazy(() => import('../pages/dashboard'));
const ProfilePage = lazy(() => import('../pages/profile'));
const AdminPage = lazy(() => import('../pages/admin'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/suche',
        element: <SearchPage />,
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/logout',
        element: (
          <Suspense fallback={null}>
            <LogoutPage />
          </Suspense>
        ),
      },
      {
        path: '/app',
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          // child routing ..
        ],
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
