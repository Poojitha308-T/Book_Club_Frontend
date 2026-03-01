const AchievementCard = ({ achievement }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
      <img src={achievement.icon_url} alt={achievement.title} className="mx-auto w-16 h-16 mb-2" />
      <h3 className="font-semibold">{achievement.title}</h3>
      <p className="text-gray-500 text-sm">{achievement.description}</p>
      <p className="text-xs text-gray-400 mt-1">Earned on: {new Date(achievement.earned_at).toLocaleDateString()}</p>
    </div>
  );
};

export default AchievementCard;