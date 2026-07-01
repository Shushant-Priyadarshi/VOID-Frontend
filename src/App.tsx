import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ProfileProvider } from "@/context/ProfileContext"


export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {" "}
       <ProfileProvider>
      <RouterProvider router={router} />
      </ProfileProvider>
    </ThemeProvider>
  );
}
