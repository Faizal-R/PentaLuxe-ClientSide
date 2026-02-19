import Header from "@/layout/Header";
import { pentaluxeTheme } from "@/theme";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
interface IStateUser {
  user: {
    user: boolean | null;
  };
}
const UserProtectedRoutes = () => {
  const user = useSelector((state: IStateUser) => state.user.user);
  return user ? (
    <div 
         className="min-h-screen flex flex-col" 
         style={{ backgroundColor: pentaluxeTheme.background }}
       >
         {/* Header is sticky, so it manages its own space in the flex flow. */}
         <Header />
         
         <main className="flex-grow">
           <Outlet />
         </main>
       </div>
  ) : (
    <Navigate to="/" />
  );
};

export default UserProtectedRoutes;
