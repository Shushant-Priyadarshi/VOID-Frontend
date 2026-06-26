import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/authClient";

export default function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() =>
        signIn.social({
          provider: "google",
          callbackURL: import.meta.env.VITE_BASE_URL,
        })
      }
    >
      Continue with Google
    </Button>
  );
}
