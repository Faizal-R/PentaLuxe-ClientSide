import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { pentaluxeTheme } from "@/theme";

const MainLayout = () => {
  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={{ backgroundColor: pentaluxeTheme.background }}
    >
      {/* Header is sticky, so it manages its own space in the flex flow. */}
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
