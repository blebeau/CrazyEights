import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	ActivityIndicator,
	StyleSheet
} from "react-native";

// const Pusher = require("pusher");

const Login = () => {
	const [userName, setUserName] = useState('');
	const [loading, setLoading] = useState(false);
	const [channel, setChannel] = useState();
	const [pusher, setPusher] = useState(false);

	const userLogin = () => {
		if (userName !== '') {
			setLoading(true);
		}


		setPusher(new Pusher("", {
			authEndpoint: process.env.AUTH_END_POINT,
			cluster: process.env.APP_CLUSTER,
			encrypted: true,
			auth: {
				params: { username: userName }
			}
		}))

		setChannel(this.pusher.subscribe(`private-user-${userName}`))

		channel.bind("pusher:subscription_error", status => {
			Alert.alert(
				"Error",
				"Subscription error occurred. Please restart the app"
			);
		});

		channel.bind("pusher:subscription_succeeded", data => {
			console.log("subscription ok: ", data);

			channel.bind("opponent-found", data => {
				console.log("opponent found: ", data);

				let opponent =
					setUserName(data.player_one ? data.player_two : data.player_one)

				Alert.alert("Opponent found!", `${opponent} will take you on!`);

				setLoading(false);
				setUserName('');

				navigation.navigate("Game", {
					pusher: pusher,
					username: userName,
					opponent: opponent,
					my_channel: channel
				});
			});
		});
	}

	return (
		<View style={styles.container}>
			<View>
				<Text>Crazy Eights</Text>
			</View>
			<View>
				<Text>Username</Text>
				<TextInput
					style={styles.input}
					onChangeText={e => {
						setUserName(e);
					}}
					value={userName}
					placeHolder='Enter username'
					onPress
				/>
				{!loading && (
					<Button onPress={userLogin} title="Enter" />
				)}
				{loading && (
					<ActivityIndicator size="large" />
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		width: 200,
		height: 40,
		borderColor: "#bfbfbf",
		borderWidth: 1,
		padding: 10,
		marginBottom: 10
	}
})

export default Login;