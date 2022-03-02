// This file loads a server metadata json file and provides useful functions
// for finding users.
import fs from 'fs';

export function loadMetadataFile() {
    let rawdata = fs.readFileSync('./metadata/no-fishing-talk-allowed.json');
    let json = JSON.parse(rawdata);
    return json;
}

let metadata = loadMetadataFile();

// Returns the user JSON object from `metadata` corresponding to
// `username_to_find` (e.g. "aaaschmitty#6747") or null if not found.
export function findUserByDiscordUsername(username_to_find) {
    console.log(metadata);
    let users = metadata?.users;
    if (!users) return null;
    for (let username in users) {
        if (username === username_to_find) {
            let user = users[username];
            user.username = username;
            return user;
        }
    }
    return null;
}

// Returns the user JSON object from `metadata` that has `real_name` field
// mathcing `name_to_find` (e.g. "andy").
export function findUserByRealName(name_to_find) {
    let users = metadata?.users;
    if (!users) return null;
    for (let username in users) {
        let user = users[username];
        if (user.real_name === name_to_find) {
            user.username = username;
            return user;
        }
    }
}

// Returns an object containing the account type and the username for the
// specified `game` from the `user` object:
// Example: 
// {
//   username: 'aaaschmitty'
//   type: 'xbox'   
// }
// Example:
// {
//   username: 'aaaschmitt_ug92'
//   type: 'origin'  
// }
export function getAccountInfoForGame(user, game) {
    let primary_account_type = user?.games[game]?.primary_account_type;
    if (!primary_account_type) return null;

    let username = user?.usernames[primary_account_type];
    if (!username) return null;

    return {
        "username": username,
        "type": primary_account_type
    };
}