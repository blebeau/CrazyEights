import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	ActivityIndicator,
	StyleSheet,
	Image
} from "react-native";
import Pusher from 'pusher-js/react-native';
import { useNavigation } from '@react-navigation/native';
import {
	d2, d3, d4, d5, d6, d7, d8, d9, d10, jd, qd, kd, aced,
	h2, h3, h4, h5, h6, h7, h8, h9, h10, jh, qh, kh, aceh,
	s2, s3, s4, s5, s6, s7, s8, s9, s10, js, qs, ks, aces,
	c2, c3, c4, c5, c6, c7, c8, c9, c10, jc, qc, kc, acec
} from '../../assets/PNG-cards-1.3/index';

const deck = [
	d2, d3, d4, d5, d6, d7, d8, d9, d10, jd, qd, kd, aced,
	h2, h3, h4, h5, h6, h7, h8, h9, h10, jh, qh, kh, aceh,
	s2, s3, s4, s5, s6, s7, s8, s9, s10, js, qs, ks, aces,
	c2, c3, c4, c5, c6, c7, c8, c9, c10, jc, qc, kc, acec
]

const shuffle = (array) => {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

const Login = () => {
	const navigation = useNavigation();

	const [userName, setUserName] = useState('');
	const [joinUser, setJoinUser] = useState('');
	const [loading, setLoading] = useState(false);

	const userLogin = () => {
		if (userName !== '' && joinUser === '' || joinUser !== '' && userName !== '') {
			setLoading(true);

			const pusher = new Pusher(process.env.key, {
				authEndpoint: "NGROK URL",
				cluster: process.env.cluster,
				encrypted: true,
				auth: {
					params: {
						username: userName,
					}
				}
			});
			const my_channel = pusher.subscribe(`presence-game-${joinUser !== '' ? joinUser : userName}`)
			my_channel.bind("pusher:subscription_error", status => {
				console.log(JSON.stringify(status))
				Alert.alert(
					"Error",
					`${(status.error)}`
				);
				setLoading(false);
			});

			my_channel.bind("pusher:subscription_succeeded", data => {
				console.log('pusher:subscription_succeeded')

				console.log("subscription ok: ", data);

				my_channel.bind("opponent-found", data => {


					const opponent =
						userName == data.player_one ? data.player_two : data.player_one;
					const drawPile = shuffle(deck)

					Alert.alert("Opponent found!", `${opponent} will take you on!`);

					setLoading(false);
					setUserName('');

					console.log('my_channel name login', userName, my_channel.name)

					navigation.navigate("Game", {
						pusher: pusher,
						username: userName,
						opponent: opponent,
						my_channel: my_channel,
						joinUser: joinUser
					});
					// }
				});
			});
		}
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
				<Text>Join another user</Text>
				<TextInput
					style={styles.input}
					onChangeText={e => {
						setJoinUser(e);
					}}
					value={joinUser}
					placeHolder='Enter other players username'
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