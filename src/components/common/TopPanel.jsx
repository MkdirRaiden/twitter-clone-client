import { CiMenuKebab } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import Search from "@/components/common/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi2";
import SidebarLinkData from "@/utils/sidebar/LinksData";
import { AiOutlineLogout } from "react-icons/ai";
import { useGetData } from "@/hooks/customHooks.js";
import { useAuth } from "@/hooks/useAuth.js";

const TopPanel = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { authUser, logout } = useAuth(); // centralized access

  const { data: newNotifications, isLoading } = useGetData({
    qKey: ["newNotifications", authUser?.username],
    url: "/notifications/new",
  });

  if (!authUser) return null; // Don't render if user isn't ready

  return (
    <div className="p-4">
      <ul className="flex justify-between w-full">
        <li>
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="w-6 h-6 opacity-85" />
          </button>
        </li>

        <li>
          <ul className="flex items-center gap-4">
            <li>
              <Search modalId="small-screen" cls="w-6 h-6 opacity-85" />
            </li>

            <li>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button">
                  <CiMenuKebab className="w-6 h-6" />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                >
                  {SidebarLinkData.map((link, index) => (
                    <li key={index} className="flex justify-center">
                      <Link
                        to={link.path}
                        className={`relative ${
                          pathname === link.path
                            ? "sidebar-active-link"
                            : "sidebar-link"
                        }`}
                      >
                        {link.icon}
                        {!isLoading &&
                          link.name === "Notifications" &&
                          newNotifications?.length > 0 && (
                            <div className="badge bg-red-500 rounded-full badge-xs absolute top-[0.6rem] left-8"></div>
                          )}
                        <span className="text-lg">{link.name}</span>
                      </Link>
                    </li>
                  ))}

                  <li className="flex justify-center">
                    <Link
                      to="/all-suggested-users"
                      className={`relative ${
                        pathname === "/all-suggested-users"
                          ? "sidebar-active-link"
                          : "sidebar-link"
                      }`}
                    >
                      <HiOutlineUsers className="w-7 h-7" />
                      <span className="text-lg">Suggestions</span>
                    </Link>
                  </li>

                  <li className="flex justify-center">
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
                          pathname === `/profile/${authUser.username}`
                            ? "border-2"
                            : ""
                        }`}
                        src={authUser.profileImg || "/avatar-placeholder.png"}
                        alt={`${authUser.fullName} avatar`}
                      />
                      <span className="text-lg">Profile</span>
                    </Link>
                  </li>

                  <li className="flex justify-center">
                    <button
                      className="mt-auto mb-5 sidebar-link"
                      onClick={(e) => {
                        e.preventDefault();
                        logout(); // centralized logout
                      }}
                    >
                      <AiOutlineLogout className="w-7 h-7 cursor-pointer" />
                      <div className="text-lg">Logout</div>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default TopPanel;
