const EmptyState = ({ message = "Nothing to display" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0H5m4-6h6"
        />
      </svg>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
