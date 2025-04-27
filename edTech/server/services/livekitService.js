import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

class LiveKitService {
    constructor() {
        this.livekitHost = process.env.LIVEKIT_HOST;
        this.apiKey = process.env.LIVEKIT_API_KEY;
        this.apiSecret = process.env.LIVEKIT_API_SECRET;
        
        this.roomService = new RoomServiceClient(
            this.livekitHost,
            this.apiKey,
            this.apiSecret
        );
    }

    async createRoom(roomName) {
        try {
            // Check if room exists
            const rooms = await this.roomService.listRooms();
            const roomExists = rooms.some(room => room.name === roomName);

            if (!roomExists) {
                // Create new room
                await this.roomService.createRoom({
                    name: roomName,
                    emptyTimeout: 10 * 60, // 10 minutes
                    maxParticipants: 50,
                });
            }

            return true;
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }

    generateToken(roomName, participantName, isMentor = false) {
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: participantName,
        });

        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });

        if (isMentor) {
            at.addGrant({
                roomAdmin: true,
                roomCreate: true,
            });
        }

        return at.toJwt();
    }

    async deleteRoom(roomName) {
        try {
            await this.roomService.deleteRoom(roomName);
            return true;
        } catch (error) {
            console.error('Error deleting room:', error);
            throw error;
        }
    }
}

export default new LiveKitService(); 