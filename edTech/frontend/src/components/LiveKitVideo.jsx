import { useState, useEffect, useRef } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMonitor, FiLogOut, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function LiveKitVideo({ roomName, participantName, isMentor }) {
  const [room, setRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  
  const localVideoRef = useRef(null);
  const participantsAreaRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        // Get token from backend
        const response = await api.post('/api/livekit/token', {
          roomName,
          participantName,
          isMentor
        });
        const token = response.data.token;

        // Create and connect to room
        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        // Set up event listeners
        newRoom.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        newRoom.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        newRoom.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        newRoom.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        newRoom.on(RoomEvent.Disconnected, handleDisconnected);

        // Connect to LiveKit server
        await newRoom.connect(process.env.REACT_APP_LIVEKIT_SERVER_URL, token);
        setRoom(newRoom);
        setIsConnected(true);

        // Set up local video
        if (localVideoRef.current) {
          newRoom.localParticipant.videoTracks.forEach((track) => {
            track.attach(localVideoRef.current);
          });
        }
      } catch (error) {
        console.error('Error connecting to room:', error);
        toast.error('Failed to connect to video room');
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, participantName, isMentor]);

  const handleParticipantConnected = (participant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const handleParticipantDisconnected = (participant) => {
    setParticipants((prev) => prev.filter((p) => p !== participant));
  };

  const handleTrackSubscribed = (track, publication, participant) => {
    if (track.kind === 'video') {
      const element = document.createElement('video');
      element.autoplay = true;
      element.playsInline = true;
      track.attach(element);
      participantsAreaRef.current?.appendChild(element);
    }
  };

  const handleTrackUnsubscribed = (track) => {
    track.detach();
  };

  const handleDisconnected = () => {
    setIsConnected(false);
    setRoom(null);
    setParticipants([]);
  };

  const toggleMute = async () => {
    if (room) {
      await room.localParticipant.setMicrophoneEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (room) {
      await room.localParticipant.setCameraEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    if (room) {
      if (!isScreenSharing) {
        await room.localParticipant.setScreenShareEnabled(true);
      } else {
        await room.localParticipant.setScreenShareEnabled(false);
      }
      setIsScreenSharing(!isScreenSharing);
    }
  };

  const leaveRoom = async () => {
    if (room) {
      await room.disconnect();
      handleDisconnected();
    }
  };

  const sendMessage = () => {
    if (room && newMessage.trim()) {
      room.localParticipant.publishData(newMessage);
      setChatMessages((prev) => [...prev, { sender: participantName, message: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video Container */}
      <div className="relative w-full h-[calc(100%-80px)]">
        <div ref={participantsAreaRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 flex justify-center items-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 transition-all`}
        >
          {isMuted ? <FiMicOff className="h-6 w-6" /> : <FiMic className="h-6 w-6" />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 transition-all`}
        >
          {isVideoEnabled ? <FiVideo className="h-6 w-6" /> : <FiVideoOff className="h-6 w-6" />}
        </button>
        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-white/20'} hover:bg-white/30 transition-all`}
        >
          <FiMonitor className="h-6 w-6" />
        </button>
        <button
          onClick={() => setIsChatCollapsed(!isChatCollapsed)}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all"
        >
          <FiMessageSquare className="h-6 w-6" />
        </button>
        <button
          onClick={leaveRoom}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all"
        >
          <FiLogOut className="h-6 w-6" />
        </button>
      </div>

      {/* Chat */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-80 bg-black/50 backdrop-blur-sm border-l border-white/10 transition-transform duration-300 ${
          isChatCollapsed ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-semibold">Chat</h3>
          <button onClick={() => setIsChatCollapsed(true)}>
            <FiChevronDown className="h-5 w-5" />
          </button>
        </div>
        <div ref={chatMessagesRef} className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
          {chatMessages.map((msg, index) => (
            <div key={index} className="bg-white/10 p-2 rounded-lg">
              <p className="font-semibold">{msg.sender}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 