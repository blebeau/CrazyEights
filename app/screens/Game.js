import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	Alert,
	ActivityIndicator,
	StyleSheet,
	Image,
	TouchableOpacity
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import {
	d2, d3, d4, d5, d6, d7, d8, d9, d10, jd, qd, kd, aced,
	h2, h3, h4, h5, h6, h7, h8, h9, h10, jh, qh, kh, aceh,
	s2, s3, s4, s5, s6, s7, s8, s9, s10, js, qs, ks, aces,
	c2, c3, c4, c5, c6, c7, c8, c9, c10, jc, qc, kc, acec,
	backOfCard
} from '../../assets/PNG-cards-1.3/index';

const deck = [
	d2, d3, d4, d5, d6, d7, d8, d9, d10, jd, qd, kd, aced,
	h2, h3, h4, h5, h6, h7, h8, h9, h10, jh, qh, kh, aceh,
	s2, s3, s4, s5, s6, s7, s8, s9, s10, js, qs, ks, aces,
	c2, c3, c4, c5, c6, c7, c8, c9, c10, jc, qc, kc, acec
]

const Game = ({ route }) => {
	const username = route.params.username
	const opponentName = route.params.opponent
	const navigation = useNavigation();
	const pusher = route.params.pusher;
	const my_channel = route.params.my_channel;
	const joinUser = route.params.joinUser;

	const player1Hand = route.params.player1Hand;
	const player2Hand = route.params.player2Hand;

	const startingDeck = route.params.drawPile;

	const [playerHand, setPlayerHand] = useState(player1Hand);
	const [opponentHand, setOpponentHand] = useState(player2Hand);
	const [drawPile, setDrawPile] = useState(startingDeck);
	const [discardPile, setDiscardPile] = useState([]);
	const [gameStarted, setGameStarted] = useState(false);

	console.log('username', username)
	console.log('opponentName', opponentName)
	console.log('joinUser', joinUser)
	console.log('playerHand', playerHand)
	console.log('opponentHand', opponentHand)

	// set user hands
	useEffect(() => {
		my_channel.bind("client-draw-card", data => {

			setPlayerHand([...data.playerHand, data.card]);
		});

		my_channel.bind("client-game-state", data => {
			console.log('client-game-state data', data)

			setOpponentHand(data.opponentHand);
			setPlayerHand(data.playerHand);
			setDrawPile(data.drawPile);
			setDiscardPile(data.discardPile);
		})
	}, [])

	useEffect(() => {
		console.log('useEffect draw pile', drawPile)
	}, [drawPile])

	useEffect(() => {
		console.log('useEffect playerHand', playerHand)
	}, [playerHand])

	useEffect(() => {
		console.log('useEffect opponentHand', opponentHand)
	}, [opponentHand])

	useEffect(() => {
		console.log('useEffect discardPile', discardPile)
	}, [discardPile])

	const playCard = (card) => {
		if (playerHand && playerHand.length === 0) {
			setCardsInHand(8);
			my_channel.trigger("client-opponent-won", {
				username: this.username
			});
		}
	}

	const drawCard = async () => {
		const card = drawPile[0]

		const removeTop = drawPile.shift()

		setDrawPile(removeTop)

		console.log('drawpile', drawPile)

		await my_channel.trigger("client-draw-card", {
			card: card,
			playerHand: playerHand
		})

		setDrawPile()

		if (joinUser !== '') {
			setOpponentHand([...opponentHand, card]);
		} else {
			setPlayerHand([...playerHand, card]);

		}
		console.log('opp hand', opponentHand)
		console.log('player hand', playerHand)
	}

	return (
		<ScrollView>
			<Text style={{
				// flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}>
				{username}
			</Text>
			<Text style={{
				// flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}>
				opponent: {opponentName}
			</Text>
			{<View
				style={styles.hand}
			>
				{joinUser !== '' && opponentHand && opponentHand.length > 0 ? (
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
					: null}
				{playerHand && playerHand.length > 0 ?
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
					) : null
				}
			</View>}
			{/* <Button
				disabled={joinUser === '' || gameStarted}
				onPress={() => startGame()} title="Start Game"
			/> */}
			<TouchableOpacity
				onPress={() => drawCard()}
			// disabled={!gameStarted}
			>
				<Image
					style={styles.card}
					source={backOfCard}
					key={`${backOfCard}`}
					alt={`${backOfCard}`}
				/>
			</TouchableOpacity>
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