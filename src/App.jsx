import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavbarComponent from './components/navbar/Nav'
import { CiHome } from "react-icons/ci";
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Posts from './pages/Posts'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ProtectedRoutes from './utils/ProtectedRoutes'
import NotFound from './pages/NotFound'
import { MainUserContext } from './context/UserAuth'
import LoaderPage from './pages/Loader'
import Card from './components/Card/Card'
import PostDetails from './pages/PostDetails'
function MainApp() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
function App() {
  const { userState } = useContext(MainUserContext);
  const routes = createBrowserRouter([
    {
      path: '/', element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: '/posts', element: userState ? <Posts/>: <NotFound typeOfNotFound={"Please Register/Login"} />, children: [] },
        { path: 'posts/:id', element: userState ? <PostDetails /> : <NotFound typeOfNotFound="Please Register/Login" /> },
        { path: 'profile/:id', element: userState ? <PostDetails /> : <NotFound typeOfNotFound="Please Register/Login" /> },
        { path: '/login', element: <Login /> },
        { path: '/signup', element: <Signup /> },
        { path: '/profile', element: userState ? <Profile/>: <NotFound typeOfNotFound={"Please Register/Login"} /> }
      ]
    },
    { path: '*', element: <NotFound /> },
    { path: '/loader', element: <LoaderPage />},
    { path: '/card', element: userState ? <Card/>: <NotFound typeOfNotFound={"Please Register/Login"} />}
  ])
  return (
    <RouterProvider router={routes}>
    </RouterProvider>
  );
}
export default App
