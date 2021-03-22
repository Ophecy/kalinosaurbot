if (process.env.NODE_ENV != "production") require("dotenv").config();

module.exports.config = {
	DISCORD_TOKEN: process.env.DISCORD_TOKEN, // populate .env file or env variable with discord bot token
	MINECRAFT_SERVER_URL: process.env.MINECRAFT_SERVER_URL,
};
