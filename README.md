# aaabot

A bot that does funny things, mostly related to gaming and trash talk.

### Commands

Create a death counter button for someone. Fun to play with while watching friends play games like dark souls.
```
/death <name> [initial-count]
```

Insult someone by name using this API: https://insult.mattbas.org/api/
```
/insult <name>
```

List the total or per legened kills for an apex legends player. One or user (a Discord user @)
or name (a string) must be specified. The user must be registered in `no-fishing-talk-allowed.json`.
```
/apexkills [user] [name] [legend]
```

### Deployment Notes

This bot is currently deployed in a free Heroku account. Pushes to master automatically trigger a deployment.