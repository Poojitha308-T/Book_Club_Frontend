const StarRating = ({ rating = 0, max = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars).fill(0).map((_, idx) => (
        <span key={`full-${idx}`} className="text-yellow-400">★</span>
      ))}
      {halfStar && <span className="text-yellow-400">⯨</span>}
      {Array(emptyStars).fill(0).map((_, idx) => (
        <span key={`empty-${idx}`} className="text-gray-300">★</span>
      ))}
    </div>
  );
};

export default StarRating;