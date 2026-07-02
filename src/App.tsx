import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ProfileProvider } from "@/context/ProfileContext";
import { PostDrawerProvider } from "./context/PostDrawerContext";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {" "}
      <ProfileProvider>
        <PostDrawerProvider>
          <RouterProvider router={router} />
        </PostDrawerProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
