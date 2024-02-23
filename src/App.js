import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword';
import './App.css';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Offers' element={< Offers/>} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/SignIn' element={< SignIn/>} />
        <Route path='/ForgotPassword' element={< ForgotPassword/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
