import { Link, useLocation } from "react-router";
import useAuthUser from "../src/hooks/auth.hook";
import { useSignOutUser } from "../src/hooks/signout.hook";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { mutate } = useSignOutUser();

  return (
    <>
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-4 lg:px-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end w-full">
            {isChatPage && (
              <div className="pl-5 hidden sm:inline-block">
                <Link to={"/"} className="flex items-center gap-2.5">
                  <ShipWheelIcon className="size-9 text-primary" />
                  <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Yappinee
                  </span>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <Link to={"/notifications"}>
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="size-7 text-base-content opacity-70" />
                </button>
              </Link>

              <ThemeSelector />

              <div className="avatar">
                <div className="w-7 rounded-full">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    rel="noreferrer"
                  />
                </div>
              </div>

              <button className="btn btn-ghost btn-circle" onClick={mutate}>
                <LogOutIcon className="size-7 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
