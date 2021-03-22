const Discord = require("discord.js");
const util = require("minecraft-server-util");
const config = require("./config");

const bot = new Discord.Client();

const randomEmoji = name => {
	emojis = [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"😂",
		"😉",
		"😊",
		"😇",
		"😍",
		"😘",
		"😗",
		"☺️",
		"😚",
		"😙",
		"😋",
		"😛",
		"😜",
		"😝",
		"😐",
		"😑",
		"😶",
		"😏",
		"😒",
		"😬",
		"😌",
		"😔",
		"😪",
		"😴",
		"😷",
		"😵",
		"😎",
		"😕",
		"😟",
		"😮",
		"😯",
		"😲",
		"😳",
		"😦",
		"😧",
		"😨",
		"😰",
		"😥",
		"😢",
		"😭",
		"😱",
		"😖",
		"😣",
		"😞",
		"😓",
		"😩",
		"😫",
		"😤",
		"😡",
		"😠",
		"😈",
		"👿",
	];
	if (name === "Kalinosaur") return "😈";
	return emojis[Math.floor(Math.random() * emojis.length)];
};

bot.on("ready", _ => {
	console.log("bot started");
	bot.user
		.setPresence({
			status: "online",
			afk: false,
			activity: {
				name: "server status",
				type: "WATCHING",
			},
		})
		.then(p => {
			console.log(`presence ready`);
		});
});

bot.on("message", message => {
	if (message.content === "!check") {
		message.delete().catch(e => {
			console.log(`Can't delete message: ${e}`);
		});
		let embedsent = {
			embed: {
				title: "Récupération de l'état du serveur",
				description: "ça devrait pas etre trop long...",
			},
		};
		message.channel
			.send(embedsent)
			.catch(e => {
				console.log(e);
			})
			.then(messageSent => {
				util
					.status(config.MINECRAFT_SERVER_URL, {
						port: 25565,
						enableSRV: true,
						timeout: 5000,
						protocolVersion: 47,
					})
					.then(response => {
						if (response.version.includes("Offline")) {
							console.log("offline");
							let embed = {
								embed: {
									title: "Le serveur est **HORS LIGNE**",
									description: "",
								},
							};
							messageSent
								.edit(embed)
								.catch(e => {
									console.log(e);
								})
								.then(console.log("message édité"));
							return;
						}
						if (response.version == "1.16.5") {
							console.log("online");
							let embed = {
								embed: {
									title: "Le serveur est **EN LIGNE**",
									description: "",
									fields: [
										{
											name: "🔢",
											value: "Joueurs présents :",
											inline: true,
										},
										{
											name: "~",
											value: response.onlinePlayers,
											inline: true,
										},
										{
											name: "📝",
											value: "Liste :",
											inline: false,
										},
									],
								},
							};
							for (const player in response.samplePlayers) {
								if (
									Object.hasOwnProperty.call(response.samplePlayers, player)
								) {
									const element = response.samplePlayers[player];
									embed.embed.fields.push({
										name: element.name,
										value: randomEmoji(element.name),
										inline: true,
									});
								}
							}
							messageSent.edit(embed).catch(e => {
								console.log(e);
							});
							return;
						}
					})
					.catch(error => {
						console.log("error : ", error);
						let embed = {
							embed: {
								title: "Le serveur est **EN LIGNE**",
								description:
									"Cependant, il ne renvoie pas de données, il peut etre en cours de démarrage.",
							},
						};
						messageSent.edit(embed).catch(e => {
							console.log(e);
						});
						return;
					});
			});
	}
});
setInterval(_ => {
	util
		.status(config.MINECRAFT_SERVER_URL, {
			port: 25565,
			enableSRV: true,
			timeout: 5000,
			protocolVersion: 47,
		})
		.then(response => {
			console.log("🚀 ~ file: bot.js ~ line 208 ~ response", response);

			if (response.version.includes("Offline")) {
				bot.user.setPresence({
					status: "afk",
					afk: false,
					activity: {
						name: "😭 server OFF",
						type: "WATCHING",
					},
				});
				return;
			}

			bot.user.setPresence({
				status: "online",
				afk: false,
				activity: {
					name: "😀 server ON",
					type: "WATCHING",
				},
			});
			return;
		})
		.catch(error => {
			bot.user.setPresence({
				status: "dnd",
				afk: false,
				activity: {
					name: "😌 server Injoignable (erreur)",
					type: "WATCHING",
				},
			});
		});
}, 60000);

bot.login(config.DISCORD_TOKEN);
