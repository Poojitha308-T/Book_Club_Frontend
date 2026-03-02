import ProgressBar from "../../progress/components/ProgressBar";

const GoalsSummary = ({ goals }) => {
  // Total completed books/pages
  const totalCompletedBooks = goals.reduce((sum, g) => sum + g.completed_books, 0);
  const totalTargetBooks = goals.reduce((sum, g) => sum + g.target_books, 0);

  const totalCompletedPages = goals.reduce((sum, g) => sum + g.completed_pages, 0);
  const totalTargetPages = goals.reduce((sum, g) => sum + g.target_pages, 0);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md space-y-4">
      <h3 className="font-semibold text-lg">Overall Progress</h3>

      <div>
        <p className="text-gray-500 text-sm">
          Books: {totalCompletedBooks}/{totalTargetBooks} completed
        </p>
        <ProgressBar progress={totalCompletedBooks} max={totalTargetBooks} label="Books" />
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          Pages: {totalCompletedPages}/{totalTargetPages} completed
        </p>
        <ProgressBar progress={totalCompletedPages} max={totalTargetPages} label="Pages" />
      </div>
    </div>
  );
};

export default GoalsSummary;