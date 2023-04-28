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
	appIs: process.env.APP_ID,
	Key: process.env.APP_KEY,
	Secret: process.env.APP_SECRET,
	Cluster: process.env.APP_CLUSTER,
	useTLS: true,
});

app.get("/", function (req, res) {
	// for testing if the server is running
	res.send("all green...");
});

app.post("/pusher/auth", function (req, res) {
	const username = req.body.username;

	const presenceData = {
		user_id: Math.floor(Math.random() * 100),
		user_info: { name: username },
	};

	const socketId = req.body.socket_id;
	const channel = req.body.channel_name;

	const auth = pusher.authenticate(socketId, channel, presenceData);

	if (users.indexOf(username) === -1) {
		users.push(username);

		if (users.length >= 2 && users.length % 2 === 0) {

			pusher.trigger(
				["presence-game-" + users[users.length - 2]],
				"opponent-found",
				{
					player_one: users[users.length - 2],
					player_two: users[users.length - 1]
				}
			);
		}

		res.send(auth);
	} else {
		res.status(400);
	}
});

const port = 3000;
app.listen(port);