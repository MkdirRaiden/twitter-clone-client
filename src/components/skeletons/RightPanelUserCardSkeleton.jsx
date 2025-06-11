const RightPanelUserCardSkeleton = () => {
  return (
    <div className="card pt-6 flex justify-center items-center shadow-md rounded-xs">
      <div className="skeleton w-16 h-16 rounded-full"></div>
      <div className="card-body">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-6 w-full rounded-full"></div>
      </div>
    </div>
  );
};

export default RightPanelUserCardSkeleton;
