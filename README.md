# Discord Minecraft Bot


## Introduction
This is a NodeJS Minecraft Bot that let you manage or do in game operation via Discord. It's based off the work of the orginal author Amal Bansode [Discord-Minecraft-Bot](https://github.com/amalbansode/Discord-Minecraft-Bot) and uses the  [MineStat](https://github.com/ldilley/minestat), the bot checks the status of user-specified Minecraft servers, teleport users to a specified coordinates, list the names of players in game, broadcast messages and a lot more to come. 

## Installation
This requires Node.js to be installed on your system, along with primary dependencies discord.js and minestat.js.

### Setting up for use with Node.js
1. Install Node.js and npm on your system. (You can use [nvm](https://github.com/nvm-sh/nvm) or the [Node.js](https://nodejs.org/en/download/) binary.)
2. Install [mcrcon](https://github.com/Tiiffi/mcrcon)
3. Clone this repository and place it in a folder. (Use `git clone https://github.com/cedroid09/homer-mc-discord`)
4. In terminal, navigate to this folder.
	```bash
	$ cd location/of/your/homer-mc-discord
	```
5. Install the latest `discord.js` using npm.
	```bash
	$ npm i -S discord.js # You can remove the -S because npm now automatically saves it to package.json
	```

### Setting up a Discord Application
1. [Create a Discord Application](https://discordapp.com/developers/applications/) for the purpose of this bot. Setup a Discord account if you do not have one yet.
2. Give the application/bot a name and description.
3. Navigate to the ‘Bot’ section. Reveal your bot’s token, and copy it.
4. Open `config.json`, which is contained in the same folder as `bot.js`.
5. Paste your token within the double quotes corresponding to the "authtoken" key, and save.
6. Now, with Terminal open in the same directory as before, run
	```bash
	$ node bot.js
	```
7. The output should say the following. If so, you have setup the bot correctly.
	```
	Logged in as <your bot’s discord tag>!
	Ready...
	```
8. Exit the application using a keyboard escape (typically `control/command + C`).

### Adding the bot to a server
1. On the [Dicord Chat Client](https://discordapp.com/channels/), click the '+' icon on the left side and create a new server for testing the bot. Skip this step if you manage a pre-existing server you want the bot to be added to.
2. On the Discord Develper Portal for your bot, navigate to the section titled ‘OAuth2’. Scroll down to view the OAuth2 URL Generator.
3. Check the following boxes: 
	* In Scopes, _bot_
	* In Bot Permissions, _Send Messages_ and _Read Message History_
4. A URL must have been generated above. Follow this URL in a new browser tab.
5. Specify the server you would like to add the bot to (this could be the one you created in step 1, or a pre-existing server).
6. Verify the permissions stated, and click ‘Authorize’.
7. The bot should now be a member of your specified server.
8. Start the bot in Terminal again
	```bash
	$ node bot.js
	```
9. In the Discord chat window for this server, enter ‘!ip’ and check for output in your Discord chat.

## Features

### Player count display
The number of players on the server is displayed as the bot’s activity in the ‘Users‘ list on the right side.

![Discord Bot Activity shows player count](/images/discord_activity.png)

### Printing the list of server IPs in chat
The IP details of servers can be displayed in Discord chat by typing `!ip` into Discord chat. The bot will reply to the user invoking the command.

![Discord Bot replies with list of IPs to servers](/images/discord_reply.png)

### Returns the list of players connected
The list of users in-game can be obtained by typing the keyword `!playing` into any Discord chat. A list of users and server capacity will be printed.

![Bot replies with the name of users connected](/images/discord_print_users.png)

### Reports the status of the user
Quick way to check if the server ready to accept connections.

![Bot checks server connectivity](/images/discord_print_status.png)

### Broadcast a massage to all in-game players
Quickly sent out alert or message using the bot to all players in game. 

![Bot sends in game messages](/images/discord_send_message.png)

### Gives the ability to anyone to teleport
The bot can be used to allow users on a vanilla server to teleport without any OP level permissions.

![Bot teleport users](/images/discord_teleport_users.png)

## Configuration

### Changing the servers to be checked
1. Stop the bot if it is running. Open `config.json` in a text-editing program.
2. Change the parameters listed as follows:
	```json
		{
			"discord": {
					"authtoken": "<your_discord_authtoken_here"
			},
			"mcrcon": {
					"path": "path/to/mcrcon/binary",
					"host": "host_ip", #ip for mcrcon to connect to the server
					"password": "mcrcon_password" #defined in server.properties
			},
			"minecraft": {
					"host": "public.minecraft.server.dns",
					"hostname": "server_name",
					"port": "25565"
			}
		}
	```

### Changing the frequency of checking servers' status
1. By default, the bot checks the status of servers every four minutes.
2. To modify this, change the variable `refreshEvery` to the number of minutes between every refresh. Use a floating point numeral if required.

Note: The bot being asynchronous, however, will require at least `the number of servers times 2.5` seconds to fetch the statuses of all servers at once. This time interval can be reduced, but it is suggested that this remain as it is to prevent any malfunctioning.

### Install the Bot service
Note, this applies only if you are running the bot a Linux machine. Here we are using CentOS.
1. On your server, create a unit file under `/etc/systemd/system/homer-mc-bot.service`
2. Paste in the following conetents:

```
Description=Homer's Minecraft stats bot
After=network.target

[Service]
Type=simple

WorkingDirectory=/minecraft/bot/installation/directory
User=minecraft
Group=minecraft

ExecStart=/bin/node minecraft/bot/installation/directory
ExecStop=/bin/pkill -9 node
Restart=always
SyslogIdentifier=minecraft

[Install]
WantedBy=multi-user.target
```

## FAQs
**There's no port specified for my Minecraft server**

The standard port for Minecraft servers is typically _25565_.

## Other Contributors, besides orignal author

Contributions and improvements to the project are welcome! The following users helped by reviewing code and fixing my silly errors:

* [Shreyas Minocha](https://github.com/shreyasminocha)
* [Shreyansh Pandey](https://github.com/labsvisual)

## License
<!--
GPL v3 is not a very permissive license. You may be better off with 
MIT or ISC license. Check it out! :)
-->
GNU GPL v3 or later
