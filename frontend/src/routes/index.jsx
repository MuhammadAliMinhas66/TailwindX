import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage';
import ComponentsPage from '../pages/ComponentsPage';
import TemplatesPage from '../pages/TemplatesPage';
import AdminPanel from '../pages/AdminPanel';
import ComponentDetailPage from '../pages/ComponentDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'components',
        element: <ComponentsPage />
      },
      {
        path: 'templates',
        element: <TemplatesPage />
      },
      {
  path: 'component/:id',
  element: <ComponentDetailPage />
},
      {
        path: 'admin',
        element: <AdminPanel />
      }
    ]
  }
]);