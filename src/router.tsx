import { createBrowserRouter } from 'react-router-dom'
import SiteHome from './pages/AppHomePage'

export const router = createBrowserRouter([
  { path: '/', element: <SiteHome /> },
  { path: '/app', element: <SiteHome /> }
])