import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
// @ts-ignore
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import CreateMarketplaceListing from "./pages/CreateMarketplaceListing";
import FindFlatmate from "./pages/FindFlatmate";
import Listing from "./pages/Listing";
import Category from "./pages/Category";
import ChatList from "./pages/ChatList";
// @ts-ignore
import ShowProfile from "./pages/ShowProfile";
import MarketplaceListing from "./pages/MarketplaceListing";
import Marketplace from "./pages/Marketplace";
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
        <Route path="/chats" element={<PrivateRoute />}>
        <Route path="/chats/" element={<ChatList />} />
        <Route path="/chats/:chatId" element={<ChatList />} />
        </Route>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<FindFlatmate />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/Profile" element={<PrivateRoute />}>
            <Route path="/Profile" element={<Profile />} />
          </Route>
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/create-marketplacelisting" element={<PrivateRoute />}>
            <Route path="/create-marketplacelisting" element={<CreateMarketplaceListing />} />
          </Route>
          <Route path="/marketplace" element={<PrivateRoute />}>
            <Route path="/marketplace" element={<Marketplace />} />
          </Route>
          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/show/:userId" element={<ShowProfile />} />
          <Route path="/marketplace/:itemId" element={<MarketplaceListing />} />
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
