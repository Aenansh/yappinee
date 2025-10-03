import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequests,
  getFriendRequests,
  rejectFriendRequests,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../../components/NoNotificationsFound";
import { Link } from "react-router";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptMutation, isPending: pendingAccept } = useMutation({
    mutationFn: acceptFriendRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectMutation, isPending: pendingReject } = useMutation({
    mutationFn: rejectFriendRequests,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] }),
  });

  const incomingRequests = data?.allRequests || [];
  const acceptedRequests = data?.acceptedRequests || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="size-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="avatar size-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2.5">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptMutation(request._id)}
                              disabled={pendingAccept}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => rejectMutation(request._id)}
                              disabled={pendingReject}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="size-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notifs) => (
                    <div
                      key={notifs._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-10 mt-1 rounded-full">
                            <img
                              src={notifs.recipient.profilePic}
                              alt={notifs.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notifs.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notifs.recipient.fullName} accepted your friend
                              request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="size-3 mr-1" /> Recently
                            </p>
                          </div>
                          <Link
                            to={`/chat/${notifs.recipient._id}`}
                            className="badge badge-success"
                          >
                            <MessageSquareIcon className="size-3 mr-1" />
                            New Friend
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
