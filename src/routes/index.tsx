import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { ProtectedRoute } from '../auth/ProtectedRoute';

const HomePage = lazy(() => import('../pages/landing/Home'));
const LoginPage = lazy(() => import('../pages/login'));
const DashboardPage = lazy(() => import('../pages/dashboard'));


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={null}>
            <HomePage />
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
