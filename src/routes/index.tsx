import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';

const LoginPage = lazy(() => import('../pages/login'));
const DashboardPage = lazy(() => import('../pages/dashboard'));


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
        path: '/login',
        element: (
          <Suspense fallback={null}>
            <LoginPage />
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
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
