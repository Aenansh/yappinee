import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/auth.hook";
import { getAllFriends } from "../lib/api";
import FriendCard2 from "../../components/FriendCard2";

const FriendsPage = () => {
  const { authUser } = useAuthUser();

  const { data: allFriends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getAllFriends,
  });
  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8 gap-4">
      {allFriends.map((friend) => (
        <FriendCard2 key={friend._id} friend={friend} />
      ))}
    </div>
  );
};

export default FriendsPage;
