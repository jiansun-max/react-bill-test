import { createBrowserRouter } from 'react-router-dom'

import Layout from '@/page/Layout'
import Month from '@/page/Month'
import New from '@/page/New'
import Year from '@/page/Year'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'month',
        element: <Month />,
      },
      {
        path: 'year',
        element: <Year />,
      },
    ],
  },
  {
    path: 'new',
    element: <New />,
  },
])

export default router
