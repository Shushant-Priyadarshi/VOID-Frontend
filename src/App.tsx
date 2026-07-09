import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ProfileProvider } from "@/context/ProfileContext";
import { PostDrawerProvider } from "./context/PostDrawerContext";
import { NotificationProvider } from "@/context/NotificationProvider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {" "}
      <ProfileProvider>
        <PostDrawerProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </PostDrawerProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
