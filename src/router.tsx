import { createBrowserRouter } from 'react-router-dom'
import AppHome from './pages/AppHome'
import SiteHome from './pages/AppHomePage'  // Alterado para AppHomePage

export const router = createBrowserRouter([
  { path: '/', element: <SiteHome /> },
  { path: '/app', element: <AppHome /> }
])