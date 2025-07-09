I am looking to build an online riichi mahjong website!

The site is called Small Turtle House (smallturtle.house)

and it's meant as a place to log in, queue into matches, and also manage your bots, which are mahjong playing AI that can get automatically queued into matches. Both players and bots have their own matchmaking ranks.

Take a look at the OpenAPI spec to see the relation between users and notifications, friends, private rooms, and stats

# General design

Im imagining a side bar to login against and get to sidebars various pages, etc. It should collapse into the left side

The main page should show lobbies you can queue into

From the side bar you can access "Queue", "Profile", "My Bots", "Friends", "Leaderboards", "Logout"

On this sidebar should also be a little bell for to show a pop up of notifications.

# Admin dashboard

Additionally, based on the user's role, we should have an admin/moderation dashboard to handle things like disabling users, approving users, handling audit logs, incoming reports, etc.

# `openapi.json` - Service API OpenAPI spec

Run `cat openapi.json | jq '.[0].paths | keys'` to get all the paths

Run `cat openapi.json | jq '.[0].components.schemas | keys'` to get all of the request and response schema names to search against

---

You're doing to have to clean up some of the vike boilerplate.

---

Lets start there, we at some point will also need to handle _playing_ games on this website (some board layout parts are already at `previous/src/components`), but we'll get there when there's more done up in the back to work with.
