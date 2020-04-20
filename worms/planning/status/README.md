# Updates Page

## April 12th 2020

1. Wills Plan
   1. Get work enviornment up and running (webpack, typescripts, svg.js) -> Done
   2. Stop using API-key for firebase, this is bad! Instead, all requests must come from www.will-kelsey.com -> Add API credentials check that requests can only come frome this URL
   3. Create HTML homepage, allow user to create game id. Show list of existing game ID's. Change page to game page on req. -> Game ID created, user now has somewhere to r+w data
   4. On game page draw a single contour, 1 worm per player
   5. Arrow presses to move the worm left or right along the contour

## April 4th 2020

1. **Regarding back-end**
I looked at Go and yes it's possible to write a back end. I followed the tutorial and wrote one To get this online we can use a raspberry pi at home, or you rent some online compute power and host it there.
Assuming the Pi is not capable of low-latency and many players, we would need to rent some cloud compute.
What is confusing me is that these only compute spaces like Azure, AWS, Google cloud, the users connect to different servers. So if you save some data on 1 server the other users won't be able to see it.
To solve this problem they all have Real Time Databases. Google cloud has enough for us to get going for free. And it's Google se we know its fast.
Eventually we could move it to a raspberry pi or another computer we own.
Plan - Use Google Firebase for now. This is actually serverless, the data is r/w all over JS.

2. **Wills Plan**

By this weekend
1 - Have a webpage which can register a user key-press (4x arrows)
2 - Send the keypress to Firebase
3 - Receive the keypress back from Firebase
4 - Move an SVG object around the screen
