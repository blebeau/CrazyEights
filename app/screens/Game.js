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
	const joinUser = route.params.joinUser;

	// const [cardsInHand, setCardsInHand] = useState(8);
	const [playerHand, setPlayerHand] = useState([]);
	const [opponentHand, setOpponentHand] = useState([]);
	const [drawPile, setDrawPile] = useState([]);
	const [discardPile, setDiscardPile] = useState([]);
	const [gameStarted, setGameStarted] = useState(false);

	const startGame = () => {
		console.log('pressed 1')
		const drawPileInitial = shuffle(deck)
		console.log('pressed 2', drawPileInitial)

		const playerHandInitial = drawPileInitial.splice(0, 8);

		const opponentHandInitial = drawPileInitial.splice(0, 8);

		const discardPileInitial = drawPileInitial.splice(0, 1);

		console.log('pressed - username', username)
		// console.log('pressed - pusher', pusher)
		my_channel.trigger(
			"client-game-state",
			{
				playerHand: playerHandInitial,
				opponentHand: opponentHandInitial,
				discardPile: discardPileInitial,
				drawPile: drawPileInitial,
			}
		);
		console.log('drawPile - after state set trigger', drawPile)
		console.log('opponentHand - after state set trigger', opponentHand)
		console.log('discardPile - after state set trigger', discardPile)
		console.log('opponentHand - after state set trigger', opponentHand)

		setGameStarted(true)

	}

	// set user hands
	useEffect(() => {
		// const opponent = joinUser !== '' ? joinUser : userName
		const drawPile = shuffle(deck)

		my_channel.bind("client-draw-card", data => {
			console.log('client-draw-card card', data.card)
			console.log('client-draw-card playerHand', data.playerHand)
			console.log('playerHand', playerHand)

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
		console.log('draw pile top', drawPile[0])


		const card = drawPile[0]

		console.log('draw pile removeTop before', drawPile)

		const removeTop = drawPile.shift()

		console.log('draw pile removeTop after', drawPile)


		console.log('removeTop', removeTop)

		setDrawPile(removeTop)

		console.log('draw pile after', drawPile)


		await my_channel.trigger("client-draw-card", {
			card: card,
			playerHand: playerHand
		})
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
				{opponentName && opponentHand && opponentHand.length > 0 ? (
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
			<Button
				disabled={joinUser === '' || gameStarted}
				onPress={() => startGame()} title="Start Game"
			/>
			<TouchableOpacity
				onPress={() => drawCard()}
				disabled={!gameStarted}
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