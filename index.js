import {
	Pusher,
	PusherMember,
	PusherChannel,
	PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

await pusher.init({
	apiKey: process.env.API_KEY,
	cluster: process.env.APP_CLUSTER
});

await pusher.connect();
await pusher.subscribe({
	channelName: "my-channel",
	onEvent: (event) => {
		console.log(`Event received: ${event}`);
	}
});