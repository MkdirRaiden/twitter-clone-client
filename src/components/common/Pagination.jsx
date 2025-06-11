import { LiaArrowRightSolid, LiaArrowLeftSolid } from "react-icons/lia";

const Pagination = ({ pageNo, setPageNo, page, isPlaceholderData }) => {
  if (!page?.totalPages || page.totalPages <= 1) return null;

  return (
    <div className="join py-6">
      <div className="join gap-1">
        {pageNo > 1 && (
          <button
            onClick={() => setPageNo((old) => Math.max(old - 1, 1))}
            className="btn rounded-full w-12 h-12"
          >
            <LiaArrowLeftSolid />
          </button>
        )}

        {Array.from({ length: page.totalPages }).map((_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={index}
              disabled={isPlaceholderData || pageNo === pageIndex}
              onClick={() => setPageNo(pageIndex)}
              className={`rounded-full w-12 h-12 ${
                pageIndex === pageNo ? "pagination-btn-active" : "btn"
              }`}
            >
              {pageIndex}
            </button>
          );
        })}

        {page?.users && pageNo < page.totalPages && (
          <button
            onClick={() =>
              setPageNo((old) => Math.min(old + 1, page.totalPages))
            }
            className="btn rounded-full w-12 h-12"
          >
            <LiaArrowRightSolid />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
