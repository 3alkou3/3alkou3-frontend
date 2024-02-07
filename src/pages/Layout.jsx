import { Outlet } from "react-router-dom";
import heroImage from "../assets/HeroImage.jpg"

export default function Layout() {
  return (
    <>
      <header className="h-[100vh] bg-primary">
        <img src={heroImage} alt="Hero" className="w-full h-full" />
      </header>
      <Outlet />
    </>
  );
}
