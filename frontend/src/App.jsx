import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/Signup'
import Home from './pages/Home'
import Login from './pages/Login'
import Video from './pages/Video'
import ChannelPage from './pages/ChannelPage'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import ChannelStats from './components/Dashboard/ChannelStats'
import ChannelContents from './components/Dashboard/ChannelContents'
import PlaylistPage from './pages/PlaylistPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import ChannelVideos from './components/Channel/ChannelVideos'
import Layout from './components/Layout';

function App() {

  return (

    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/signup' element={<SignUp />} ></Route>
        <Route path='/Login' element={<Login />} ></Route>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} ></Route>
          <Route path='/watchpage/:videoId' element={<Video />} ></Route>
          <Route path='/channel/:username' element={<ChannelPage />}>
            <Route index element={<Navigate to="videos" replace />} />
            <Route path='videos' element={<ChannelVideos />} />
          </Route>
          <Route path='/history' element={<History />} ></Route>
          <Route path='/dashboard' element={<Dashboard />}>
            <Route index element={<ChannelStats />} />
            <Route path='stats' element={<ChannelStats />} />
            <Route path='content' element={<ChannelContents />} />
          </Route>
          <Route path='/playlist' element={<PlaylistPage />} />
          <Route path='/playlist/:playlistId' element={<PlaylistDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
