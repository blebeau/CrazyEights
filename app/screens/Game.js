import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
// import { shuffle } from '../../shuffle';
import { ScrollView } from 'react-native-gesture-handler';
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

function shuffle(array) {
	console.log('in the shuffle')
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
	console.log('in the shuffle array', array)

	return array;
}

const Game = ({ route }) => {
	const username = route.params.username
	const opponentName = route.params.opponent
	const navigation = useNavigation();
	const pusher = route.params.pusher;
	const my_channel = route.params.my_channel;
	const playerHandInitial = route.params.playerHand;
	const opponentHandInitial = route.params.opponentHand;
	const drawPileInitial = route.params.drawPile;

	const discardPileInitial = route.params.discardPile;
	let opponent_channel = null;

	const [playerHand, setPlayerHand] = useState(playerHandInitial);
	const [opponentHand, setOpponentHand] = useState(opponentHandInitial);
	const [drawPile, setDrawPile] = useState(drawPileInitial);
	const [discardPile, setDiscardPile] = useState(discardPileInitial);

	// set user hands
	useEffect(() => {
		const drawPile = shuffle(deck)

		my_channel.bind("initiate-game", data => {
			setPlayerHand(data.playerHand);
			setOpponentHand(data.opponentHand);
			setDiscardPile(data.discardPile);
			setDrawPile(drawPile);
		});

		console.log('discardPile', discardPile);
		console.log('playerHand', playerHand);
		console.log('opponentHand', opponentHand);

		my_channel.bind("draw-card", data => {
			setPlayerHand(...playerHand, data.card);
		});

		my_channel.bind("winner", data => {
			setPlayerHand(...playerHand, data.card);
		});

		console.log('my_channel after bindingings', my_channel)

		console.log('username', username)
		console.log('opponentName', opponentName)
		my_channel.trigger(`client-private-user-${username !== opponentName ? username : opponentName}`,
			"client-set-deck", {
			drawPile: drawPile,
		});

		my_channel.trigger("client-initiate-game", {
			playerHand: playerHand,
			opponentHand: opponentHand,
			discardPile: discardPile,
			playerHand: playerHand,
		});

		my_channel.trigger("client-set-deck", {
			playerHand: playerHand,
			opponentHand: opponentHand,
			discardPile: discardPile,
			drawPile: drawPile,
		});

		my_channel.trigger("client-set-player-hand", {
			hand: playerHand,
		});
	}, [])

	const playCard = (card) => {
		if (playerHand && playerHand.length === 0) {
			setCardsInHand(8);
			my_channel.trigger("client-opponent-won", {
				username: this.username
			});
		}
	}

	return (
		<ScrollView>
			<Text style={{
				// flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}>
				{route.params.username}
			</Text>
			{<View
				style={styles.hand}
			>
				{opponentName && opponentHand.length > 0 ? (
					opponentHand.map(
						(image) =>
							<Image
								style={styles.card}
								source={image}
								key={`${image}`}
								alt={`${image}`}
							/>
					)
				)
					:
					(
						playerHand.map(
							(image) =>
								<Image
									style={styles.card}
									source={image}
									key={`${image}`}
									alt={`${image}`}
								/>
						)
					)
				}
			</View>}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	card: {
		height: 50,
		width: 35,
		margin: 5,
	},
	hand: {
		flexDirection: 'row',

	}
})

export default Game;