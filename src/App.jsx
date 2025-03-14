import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import BackToTop from "./components/backToTop/BackToTop";
import Details from "./components/details/Details";
import NotFound from "./components/notFound/NotFound";
import Home from "./components/home/Home";
import { BagProvider } from "./context/bagContext";
import ProductLists from "./components/productsList/ProductsList";
import Checkout from "./components/checkout/Checkout";
import { AuthProvider } from "./context/authContext";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import AuthGuard from "./components/guards/authGuard";
import AuthUserGuard from "./components/guards/authUserGuard";
import Profile from "./components/profile/Profile";
import Orders from "./components/orders/Orders";
import WishList from "./components/wishList/WishList";
import { WishProvider } from "./context/wishContext";
import ContactUs from "./components/contactUs/ContactUs";
import AboutUs from "./components/aboutUs/AboutUs";
import useScrollToTop from "./hooks/useScrollToTop";
import ErrorBoundary from "./components/errorBoudaty/ErrorBoudaty";

function App() {
  useScrollToTop();
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WishProvider>
          <BagProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductLists />} />
              <Route path="/products/:category" element={<ProductLists />} />
              <Route path="/details/:_id" element={<Details />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route element={<AuthUserGuard />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>
              <Route element={<AuthGuard />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishes-list" element={<WishList />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <BackToTop />
          </BagProvider>
        </WishProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
