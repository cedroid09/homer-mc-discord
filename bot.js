/*
 * MinecraftDiscordBot.js — A script to power a Discord bot that checks
 * the status of specified Minecraft servers.
 * Original author: Amal Bansode
 * Fork by: Cedric Poottaren 
 * https://cedric.poottaren.com
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Load required modules
const Discord = require('discord.js');
const config = require('./config.json');
const serv = require('./minestat');

const client = new Discord.Client();

// Load mcron variables
const mcron_loc = config["mcrcon"].path;
const mcron_host = config["mcrcon"].host;
const mcron_pwd = config["mcrcon"].password;

// Load minecraft server variables
const mc_server_addr = config["minecraft"].host;
const mc_server_name = config["minecraft"].hostname;
const mc_server_port = config["minecraft"].port;

// Number of minutes to refresh server count after (recommended >= 1 min; default = 2)
const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes.

// IP and port of Minecraft servers
const servIP = {
    server_name: `${mc_server_addr}:${mc_server_port}`
};

let intervalId;

// Executes as long as bot is online.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready...');
    checkStatus();

    // Check status every 4 minutes
    intervalId = client.setInterval(checkStatus, REFRESH_INTERVAL);
});


// Executes upon reception of message.
// States IPs of Minecraft servers respectively if '!ip' is typed into chat.
client.on('message', async msg => {
    if (msg.content === '!ip') {
        await checkStatus();
        // Building string output for '!ip' command
        for (const name in servIP) {
            msg.reply(`Hello, my name is ${mc_server_name}, here's my address:  ${servIP[name]}` +
                     `\nI hope to see in-world soon!`);
        }
    }
});

// Teleports user to the specified coordinates
client.on('message', async msg => {
    if (msg.content.startsWith('!tp')) {
        if (await checkServerStatus()) {
                // Building string output for '!tp' command
                data = msg.content.split(' ');
                let user = data[1];
                let x = Number(data[2]);
                let y = Number(data[3]);
                let z = Number(data[4]);
                if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
                        msg.reply("Nope, won't teleport you! Please check the coordinates again.");
                } else {
                        msg.reply(`Hi, trying to teleport user: ${user}.` +
                                 `\nLocation is set to x: ${x}, y: ${y} and z: ${z}`);
                        var tp = await teleportUser(user, x, y, z);
                        if (tp == 0) {
                                msg.reply(`User ${user} teleported successfully ;)`);
                        } else if (tp == 1) {
                                msg.reply(`Oops... I can't find user ${user}`);
                        } else {
                                msg.reply(`I'm so sorry.. Failed to teleport user ${user}`);
                        }
                }
        } else {
                msg.reply(`Oops.. Looks like the server is offline!`);
        }
    }
});

// Returns the status of the server
client.on('message', async msg => {
    if (msg.content === '!status') {
        if (await checkServerStatus()) {
                // Building string output for '!status' command
                msg.reply(`I'm online and ready for you to connect!`);
        } else {
                msg.reply(`Server offline, please contact the Wizards!`);
        }
    }
});

// Broadcast msg to all in-game players
client.on('message', async msg => {
    if (msg.content.startsWith('!broadcast')) {
        if (await checkServerStatus()) {
                // Building string output for '!broadcast' command
                let _msg = "";
                _msg = msg.content.split(' ')[1];
                console.log(_msg);
                if (_msg == null) {
                        msg.reply(`Nope, I won't broadcast empty messages!`);
                } else {
                        bd = await broadcast(`[${mc_server_name}]: ${_msg}`);
                        if (bd == 0) {
                                msg.reply(`Message broadcasted successfully ;)`);
                        } else {
                                msg.reply(`Oops.. I couldn't send that out for you`);
                        }
                }
        } else {
                msg.reply(`Server offline, please contact the Wizards!`);
        }
    }
});

// Returns the number & name of in-game players
client.on('message', async msg => {
    if (msg.content === '!playing') {
        if (await checkServerStatus()) {
                // Building string output for '!playing' command
                result = await mcrcon_cmd(`list`);
                if (result != 2) {
                        msg.reply(result.substring(0, result.length - 5));
                } else {
                        msg.reply(`Oops.. Can't list the players for now!`);
                }
        } else {
                msg.reply(`Server offline, please contact the Wizards!`);
        }
    }
});

// The teleport user function
async function teleportUser(user, x, y, z) {
     const { exec } = require('child_process');
     return new Promise(resolve => {
          exec(`${mcron_loc} -H ${mcron_host} -p ${mcron_pwd} 'teleport ${user} ${x} ${y} ${z}'`, (err, stdout, stderr) => {
                console.log(`[info]: ${stdout}`);
                console.log(`[error]: ${stderr}`);
                if (err) {
                        // node couldn't execute the command
                        resolve(2);
                } else {
                        var out = stdout.toLowerCase().concat(stderr.toLowerCase());
                        if (out.includes(`no entity`)) {
                                resolve(1);
                        } else if (out.includes(`teleported`)) {
                                resolve(0);
                        }
                }
          });
     });
}

// Broadcast message to all in-game players
async function broadcast(msg) {
     const { exec } = require('child_process');
     return new Promise(resolve => {
          exec(`${mcron_loc} -H ${mcron_host} -p ${mcron_pwd} 'say ${msg}'`, (err, stdout, stderr) => {
                console.log(`[info]: ${stdout}`);
                console.log(`[error]: ${stderr}`);
                if (err) {
                        // node couldn't execute the command
                        resolve(2);
                } else {
                        var out = stdout.toLowerCase().concat(stderr.toLowerCase());
                        if (out == "") {
                                resolve(0);
                        } else {
                                resolve(1);
                        }
                }
          });
     });
}

// Generic mcrcon command parser
async function mcrcon_cmd(command) {
     const { exec } = require('child_process');
     return new Promise(resolve => {
          exec(`${mcron_loc} -H ${mcron_host} -p ${mcron_pwd} '${command}'`, (err, stdout, stderr) => {
                console.log(`[info]: ${stdout}`);
                console.log(`[error]: ${stderr}`);
                if (err) {
                        // node couldn't execute the command
                        resolve(2);
                } else {
                        resolve(stdout);
                }
          });
     });
}

// Query mc server for availability
async function checkServerStatus() {
        serv.init(mc_server_addr, parseInt(mc_server_port), () => {
                if (serv.online) {
                        return true;
                }
                else {
                        return false;
                }
        });

        return serv;
}

// Updates the in-discord status of the server and number of players in-world
async function checkStatus() {
    let statusStr = '';

    for (const name in servIP) {

        const [host, port] = servIP[name].split(':'); // Splitting into ip and port
        serv.init(host, parseInt(port), () => {
            if (serv.online) {
                // Setting 'Activity' attribute of Discord bot with player counts of servers respectively.
                statusStr = (`${mc_server_name} | Players online: ${serv.current_players} | running ${serv.version}`);
            }
            else {
                statusStr = (`${mc_server_name}: Server unreachable`);
            }
            client.user.setActivity(statusStr);
        });

    }
}

// Set this in 'config.json'
// Token can be found on your Discord developer portal.

client.login(config["discord"].authtoken);