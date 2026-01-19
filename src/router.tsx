import { createBrowserRouter } from 'react-router-dom'
import AppHome from './pages/AppHome'
import SiteHome from './pages/Home'

export const router = createBrowserRouter([
  { path: '/', element: <SiteHome /> },
  { path: '/app', element: <AppHome /> }
])
