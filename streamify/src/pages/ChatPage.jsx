// ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import ChatLoader from '../components/ChatLoader';
import CallButton from "../components/CallButton";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams(); // `id` must match your route param

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser, isLoading: isAuthLoading } = useAuthUser();

  const queryClient = useQueryClient();

  // Get Stream token
  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only run when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData) return;

      try {
        console.log("Initializing Stream Chat...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData
        );

        const channelId = [authUser._id, targetUserId].sort().join('-');
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = async () => {
    if (channel) {
      const videoCallUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text: `I have started a video call. Join me here: ${videoCallUrl}`
      })
      toast.success("Video call link send successfully!")
    }
  }

  if (loading || isAuthLoading || !authUser || !chatClient || !channel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
