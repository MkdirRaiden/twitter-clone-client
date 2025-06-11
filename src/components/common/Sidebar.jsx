import XSvg from "@/components/svgs/X";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useGetData } from "@/hooks/customHooks.js";
import SidebarLinkData from "@/utils/sidebar/LinksData";
import Search from "@/components/common/Search";
import { useAuth } from "@/hooks/useAuth.js";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { authUser, logout } = useAuth();

  const { data: newNotifications, isLoading } = useGetData({
    qKey: ["newNotifications", authUser?.username],
    url: "/notifications/new",
  });

  if (!authUser) return null;

  return (
    <div className="sticky top-0 left-0 h-screen flex flex-col border-r-2 border-gray-700 w-20 md:w-full">
      <Link
        to="/"
        className="flex justify-center md:justify-start md:items-center w-fit px-4 pt-3"
      >
        <XSvg className="fill-white w-10" />
        <span className="font-bold font-mono text-xl md:inline hidden">
          TWITTER
        </span>
      </Link>

      <ul className="flex flex-col gap-1 mt-4">
        <li className="flex justify-center md:justify-start">
          <Search modalId="large-screen" cls="sidebar-link" />
        </li>

        {SidebarLinkData.map((link, index) => (
          <li key={index} className="flex justify-center md:justify-start">
            <Link
              to={link.path}
              className={`relative ${
                pathname === link.path ? "sidebar-active-link" : "sidebar-link"
              }`}
            >
              {link.icon}
              {!isLoading &&
                link.name === "Notifications" &&
                newNotifications?.length > 0 &&
                pathname !== "/notifications" && (
                  <div className="badge bg-red-500 text-white rounded-full text-xs absolute top-[0.5rem] left-8">
                    {newNotifications.length}
                  </div>
                )}
              <span className="text-lg hidden md:block">{link.name}</span>
            </Link>
          </li>
        ))}

        <li className="flex justify-center md:justify-start">
          <Link
            to={`/profile/${authUser.username}`}
            className={`relative ${
              pathname === `/profile/${authUser.username}`
                ? "sidebar-active-link"
                : "sidebar-link"
            }`}
          >
            <img
              className={`w-7 h-7 rounded-full ${
                pathname === `/profile/${authUser.username}` ? "border-2" : ""
              }`}
              src={authUser.profileImg || "/avatar-placeholder.png"}
              alt={`${authUser.fullName} avatar`}
            />
            <span className="text-lg hidden md:block">Profile</span>
          </Link>
        </li>
      </ul>

      <button
        className="mt-auto mb-5 sidebar-link"
        onClick={(e) => {
          e.preventDefault();
          logout();
        }}
      >
        <AiOutlineLogout className="w-7 h-7 cursor-pointer" />
        <div className="text-lg hidden md:block">Logout</div>
      </button>
    </div>
  );
};

export default Sidebar;
