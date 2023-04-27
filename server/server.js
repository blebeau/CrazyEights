const express = require("express");
const bodyParser = require("body-parser");
const Pusher = require("pusher");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("dotenv").config();

const users = [];

const pusher = new Pusher({
	// connect to pusher
	appId: process.env.appId,
	key: process.env.key,
	secret: process.env.secret,
	cluster: process.env.cluster
});

app.get("/", function (req, res) {
	// for testing if the server is running
	res.send("all green...");
});

function randomArrayIndex(max) {
	return Math.floor(Math.random() * max);
}

app.post("/pusher/auth", function (req, res) {
	const username = req.body.username;

	if (users.indexOf(username) === -1) {
		users.push(username);

		if (users.length >= 2 && users.length % 2 === 0) {
			console.log('users', users)
			// const player_one_index = randomArrayIndex(users.length);
			// const player_one = users.splice(player_one_index, 1)[0];

			// const player_two_index = randomArrayIndex(users.length);
			// const player_two = users.splice(player_two_index, 1)[0];
			// console.log("prive user 1", "private-user-" + player_one)

			// trigger a message to player one and player two on their own channels
			pusher.trigger(
				["private-user-" + users[users.length - 2]],
				"opponent-found",
				{
					player_one: users[users.length - 2],
					player_two: users[users.length - 1]
				}
			);
		}
		const socketId = req.body.socket_id;
		const channel = req.body.channel_name;
		const auth = pusher.authenticate(socketId, channel);

		res.send(auth);
	} else {
		res.status(400);
	}
});

const port = 3000;
app.listen(port);