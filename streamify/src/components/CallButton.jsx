import { VideoIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function CallButton({handleVideoCall}) {
    const { id: callId } = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);


    const { authUser, isLoading } = useAuthUser(true);
    const { data: tokenData } = useQuery({
        queryKey: ["call"],
        queryFn: getStreamToken,
        enabled: !!authUser
    });

    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.token || !authUser || !callId) {
                return;
            }

            setIsConnecting(true);

            try {
                console.log("Initializing the stream video call...");

                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic,
                };

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                });

                const callInstance = videoClient.call("default", callId);
                await callInstance.join({ create: true }); // ✅ use await to ensure joining is completed

                console.log("Joined call successfully");
                setClient(videoClient);
                setCall(callInstance);

            } catch (error) {
                console.error("Error joining call: ", error);
                toast.error("Could not join the call. Please try again!");
            } finally {
                setIsConnecting(false);
            }
        };

        initCall(); // 

    }, [tokenData, authUser, callId]);


    if (isLoading || isConnecting) return <PageLoader />;

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Could not initialize call. Please refresh or try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// added controls
const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    if (callingState === callingState.LEFT) return navigate('/');

    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    );
};


export default CallButton;