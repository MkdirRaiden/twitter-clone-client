import { useRef, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { get } from "@/lib/api";

const Search = ({ modalId, cls }) => {
  const inputRef = useRef(null);
  const searchValueRef = useRef("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const query = searchValueRef.current.trim();
    if (!query) return;

    setIsPending(true);
    try {
      const res = await get(`/users/search?search=${query}`);
      // console.log("Search API response:", res);
      setResults(Array.isArray(res.users) ? res.users : []);
    } catch {
      setResults([]);
    } finally {
      setIsPending(false);
    }
  };

  const handleClear = () => {
    searchValueRef.current = "";
    inputRef.current.value = "";
    setResults([]);
  };

  const handleModalClose = () => {
    handleClear();
    setIsSearchOpen(false);
  };

  const hasQuery = searchValueRef.current !== "";

  return (
    <div className="sm:w-full w-fit">
      {!isSearchOpen ? (
        <button
          className={cls}
          onClick={() => {
            setIsSearchOpen(true);
            document.getElementById(modalId).showModal();
          }}
        >
          <HiOutlineMagnifyingGlass className="w-7 h-7" />
          <span className="text-lg hidden md:block">Search</span>
        </button>
      ) : (
        <div className="sidebar-link h-11"></div>
      )}

      <dialog id={modalId} className="modal modal-top">
        <div className="modal-box md:w-1/2 w-full mx-auto relative border border-gray-900 top-4 max-h-[75%]">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-2 top-3 w-5 h-5 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search people..."
              className="input input-bordered w-full ps-10 pe-8"
              onChange={(e) => {
                searchValueRef.current = e.target.value;
                handleSearch();
              }}
            />
            {hasQuery && (
              <button className="absolute right-2 top-3" onClick={handleClear}>
                <RxCross1 />
              </button>
            )}
          </div>

          <div className="py-6">
            {!hasQuery && !isPending && (
              <p className="text-center">Search results...</p>
            )}

            {hasQuery && isPending && (
              <p className="flex justify-center items-center gap-2 text-xl">
                Loading <LoadingSpinner size="xs" />
              </p>
            )}

            {hasQuery && !isPending && results.length === 0 && (
              <p className="text-center">
                No results for "{searchValueRef.current}"
              </p>
            )}

            {Array.isArray(results) && results.length > 0 && (
              <ul className="mt-4 space-y-2">
                {results.map((user, i) => (
                  <Link
                    key={i}
                    to={`/profile/${user.username}`}
                    className="flex items-center justify-between gap-4 hover:bg-base-200 p-2 rounded"
                    onClick={handleModalClose}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={user.profileImg || "/avatar-placeholder.png"}
                            alt="User"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold truncate w-28">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-slate-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <MdOutlineArrowOutward />
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default" onClick={handleModalClose}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default Search;
