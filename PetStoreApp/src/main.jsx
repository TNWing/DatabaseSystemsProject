import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Router
} from "react-router-dom"
import Resources from './Resources.jsx'
import Donate from './Donate.jsx'
import Volunteer from './Volunteer.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "resources",
    element: <Resources/>
  },
  {
    path: "donate",
    element: <Donate/>
  },
  {
    path: "volunteer",
    element: <Volunteer/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
