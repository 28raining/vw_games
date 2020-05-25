# Updates Page

## May 24th
- Seperate out animations in their own object *wk done*
- Give basball bat a wood texture *wk done*
- Why is baseball bat swinging the wrong way? fix. *wk fixed. Could add shadows, and also fix the zoom on wood texture in the future. Original issue was with bat leaving the fulstrum. x25 scaling means +- 100 z range needed*
- Add button on right of screen to select bat or nothing *rotate through weapons using 'f'. No button*
- swing bat using enter *done*
- Started the health bar, not finished yet.


## May 17th
- Fix the worms eyes. Maybe because they are a plane they are dissapearing?
- Improve animation
- Add baseball bat animation (press g!)
- everything looks very bad, doing a proof of concept first

## May 3rd

- Added jumping. Added a gravity function. Not really sure why the gravity looks unrealistic, something to do with the distance between pixels and the real distance. Maybe we can know find pixels-per-inch and literally map pixles to inches?. Window.devicePixelRatio. This might actually be needed to make canvas look good on all devices. *completed this*
- Pixi could be good in the future for more complex anmiation which runs smoother. For now I think everything can be done on the canvas without much complexity. Or three.js, use tlgf to easily modify 3d objects. tlgf have anchors so you can modify 3d objects in the browser. v cool!

## April 26th

- Started using milligram to stype all the buttons very nicely and easily. Looked at using bootstrap but it is very heavy. This article ranked it as best lightweight: https://designmodo.com/frontend-web-dev-frameworks/
- Added multiple players + multiple worms. Involved creating a player number, restructering database, changing renderer so there can be an infinite number of worms.
- Probably should use spectre or mustard css framework, much more features than milligram

## April 19th 2020

*Finally got the infastructure up and running well!!*
Had to make decisions about database, refresh-rate, drawing method (chose canvas)
And dealt with several weird things, like using images in typescript and firestore limitations.

As a start, let's first aim to build the *worm with baseball bat*. There's many tasks here!

1. Draw the 2nd, 3rd, Nth worm which is controlled by different users -> wk done
2. Add jumping to the worm (requires physics math) (spacebar) -> wk done
3. Implement sprites or similar - a method to animate the worm. Prefer SVG, because then 1x sprite can be easily re-coloured (may want to use library for sprites? Makes it look simple) -> wk - no sprites but use SVG to create paths, then use Canvas to draw and modify the paths. Not bad!. 50% done (literally 50% of the worm)
4. Sprite for the baseball bat, do animation
5. Add a weapon selector and let user chose nothing or baseball bat
6. What happens when the worm is hit by the bat? Full animation needed 
7. Add health meter and name above each worm
8. Add game-over graphics + animations
9. Add usernames and a game lobby - let people join a lobby then one person can take them into the game
10. Add a favicon to get rid of that error
11. If a player leaves then detect it and kill the worm

## April 12th 2020

1. Wills Plan
   1. Get work enviornment up and running (webpack, typescripts, svg.js) -> Done
   2. Stop using API-key for firebase, this is bad! Instead, all requests must come from www.will-kelsey.com -> Add API credentials check that requests can only come frome this URL -> Done (but doesn't seem to work??)
   3. Create HTML homepage, allow user to create game id. Show list of existing game ID's. Change page to game page on req. -> Game ID created, user now has somewhere to r+w data -> Done
   4. On game page draw a single contour, 1 worm per player -> Done (1 worm only)
   5. Arrow presses to move the worm left or right along the contour -> Done

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
