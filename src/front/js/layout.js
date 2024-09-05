import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { Favorites } from "./pages/favorites";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { UserProfile } from "./pages/UserProfile";

import { Navbar } from "./component/navbar";
// import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<Favorites />} path="/favorites" />
                        <Route element={<ForgotPassword />} path="/forgot-password" />
                        <Route element={<ResetPassword />} path="/reset_password/:token" />
                        <Route element={<SignUp />} path="/sign-up" />
                        <Route element={<UserProfile />} path="/UserProfile" />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
