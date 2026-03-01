import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const DiscussionCard = ({ thread }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/discussions/${thread.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent>
        <h3 className="font-semibold text-lg">{thread.title}</h3>
        <p className="text-gray-500 text-sm mt-1">Created by: {thread.created_by_name}</p>
        <p className="text-gray-400 text-xs mt-1">{new Date(thread.created_at).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-gray-600">
          <Users size={16} />
          <span>{thread.comments_count} comments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiscussionCard;