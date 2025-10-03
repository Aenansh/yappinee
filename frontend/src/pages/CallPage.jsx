import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/auth.hook";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import CallContent from "../../components/CallContent";

const streamAPIKey = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["token"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;

      try {
        console.log("Initializing stream calling...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: streamAPIKey,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully!");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log("Error joining call", error);
        toast.error("Couldn't join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <Loading />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <>
          <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent/>
          </StreamCall>
          </StreamVideo>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-full">
              <p>
                Could not initialize call. Please refresh or try again later.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CallPage;
