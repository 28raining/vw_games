# Planning Descisions

## Status Updates

[click here](status/README.md)

## High Level Discussions

1. **Graphics library**
Use SVG (2D)
Use a library, either snap.js or svg.js because drawing lots of objects in svg can get pretty messy! Library is 60KB, so quite heavy, but only loaded once. Probably available from Google CDN.
Three.js is really good for 3D. We can put the SVG into this tool. For example if we wanted to make the board 3D. But later

2. **Resolution**
Eventually it needs to work on all devices. Design for desktop first but be very concious of smaller screens. Eventually it will by dynamic resolution

3. **Libraries**
Try not to use jquery?
socket library
svg / snap .js
Maybe external font
but for sure try to minimize it

4. **Design**
   * Should fit all in one screen, that is annoying about current worms
   * Use an image as the background. Worms and weapons are drawn
   * On Desktop, use mouse to aim and shoot. On phone there should be a 'fire' button, and aim with finger

5. **Number of players**
   * Start with multiplayer so we don't have to build a bot :)

6. **Backend**
   * *Note* - User input passes to server before being drawn. SVG drawer does not contribute to state.
   * I'm not faimiliar with this. So it's most interesting :) I did some googling and it seems that websockets are the best way to communicate with a server. Debugging C will drive me crazy. Go hopefully is better, Go is from Google.
   * [https://hashrocket.com/blog/posts/websocket-shootout](https://hashrocket.com/blog/posts/websocket-shootout)
   * ![Top Level Diagram](TopLevelDiagram.png "Logo Title Text 1")

7. **Data Storage**
   * We shouldn't need a database unless we need to retain data for days. I was imagining an array of strings. Each entry in the array is a string. The string is a JSON. It looks like JSON's can be compressed in BSON's

## Delegations

| Preference | Will              | Vlad |
|------------|-------------------|------|
| 1          | Backend + Sockets |      |
| 2          | Input processing  |      |
| 3          | SVG drawing       |      |
| 4          | Webpage           |      |
