import { Link } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {


  return (
    <nav className="flex gap-5">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>

     <ModeToggle/>
    </nav>
  )
}