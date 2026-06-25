import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/common/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import RedirectIfAuthed from "@/components/common/RedirectIfAuthed";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Search from "@/pages/Search";
import Message from "@/pages/Message";
import CreatePost from "@/pages/CreatePost";
import Mentor from "@/pages/Mentor";
import DetailPost from "@/pages/DetailPost";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerificationSent from "./pages/EmailVerificationSent";
import EmailVerified from "./pages/EmailVerified";
import Profile from "./pages/Profile";
import PublicProfile from "@/pages/PublicProfile"
import MentorProfilePage from "@/pages/MentorProfile"

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // public — viewable by anyone
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/mentor-find", element: <Mentor /> },
      { path: "/u/:id", element: <PublicProfile /> },
      { path: "/mentor-find/:userId", element: <MentorProfilePage /> },

      // requires auth
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/create-post", element: <CreatePost /> },
          { path: "/message", element: <Message /> },
          { path: "/post/:id", element: <DetailPost /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // auth pages — no shell, redirect away if already logged in
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/login", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/email-verification-sent", element: <EmailVerificationSent /> },
      { path: "/email-verified", element: <EmailVerified /> },
    ],
  },
]);
