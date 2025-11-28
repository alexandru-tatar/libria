import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { ProtectedRoute } from '../auth/ProtectedRoute';

const LoginPage = lazy(() => import('../pages/Login'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        ),
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
