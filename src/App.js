import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import SignIn from './pages/SignIn'
// @ts-ignore
import SignUp from './pages/SignUp';
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from './pages/CreateListing';
function App() {
  return (
    <>
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Offers' element={< Offers/>} />
        <Route path='/Profile' element={<PrivateRoute/>}>
        <Route path='/Profile' element={<Profile />} />
        </Route>
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/SignIn' element={< SignIn/>} />
        <Route path='/ForgotPassword' element={< ForgotPassword/>} />
        <Route path='/create-listing' element={<PrivateRoute/>}>
        <Route path='/create-listing' element={< CreateListing/>} />
        </Route>
      </Routes>
    </Router>
    <ToastContainer
position="bottom-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
    </>
  );
}

export default App;
