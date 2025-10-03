import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getAllFriends,
  getOutGoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import FriendCard, { getLanguageFlag } from "../../components/FriendCard";
import NoFriendsFound from "../../components/NoFriendsFound";
import NoUsersFound from "../../components/NoUsersFound";
import { capitalize } from "../lib/utils";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingRequestsIds, setOutGoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getAllFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outGoingRequests = [] } = useQuery({
    queryKey: ["outGoingRequests"],
    queryFn: getOutGoingFriendRequests,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["outGoingRequests"]})
  });

  useEffect(() => {
    const outGoingIds = new Set();
    if (outGoingIds && outGoingRequests.length > 0) {
      outGoingRequests.forEach((req) => {
        outGoingIds.add(req.recipient._id);
      });
      setOutGoingRequestsIds(outGoingIds);
    }
  }, [outGoingRequests]);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to={"/notifications"} className="btn btn-outline btn-sm">
            <UserIcon className="size-4 mr-2" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <>
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          </>
        ) : friends.length === 0 ? (
          <>
            <NoFriendsFound />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          </>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <>
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            </>
          ) : recommendedUsers.length === 0 ? (
            <>
              <NoUsersFound />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedUsers.map((user) => {
                  const hasRequestSent = outGoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p5 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="avatar rounded-full size-16">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitalize(user.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline">
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitalize(user.learningLanguage)}
                          </span>
                        </div>

                        {user.bio && (
                          <p className="text-sm opacity-70">{user.bio}</p>
                        )}

                        <button
                          className={`btn w-full mt-2 ${
                            hasRequestSent ? "btn-disabled" : "btn-primary"
                          }`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestSent || isPending}
                        >
                          {hasRequestSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
