# 1 - Build a simple webworker which interacts with a module-based js website
# 2 - Make webworker interact with firebase
# 3 - Get worm to move across terain, with jumping and health bar
# 4 - Start porting three-based game to this new framework, take the list of to-do's from there!
# 5 - Add a "god" object into firebase dataset. Add god 'deltas' before sending data back to the client
6 - add bullet ID's so they only i,pact 1 time
6 - Build a more complex map with multiple levels that worm can move around
7 - create a list of functions that need building
8 - Use WebRTC instead of firebase realtime database

1 - Add multiple worms
2 - support baseball bat
3 - allow worm to hit worm

--List of tasks from previous design
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


webpack
- Doesn't support webworkers natively (impending nightmare)
- If you have more that one page, you have to reload entire bundle
- Takes a while to build - slows down iterative build process
- modules are now part of js, and so is parallel loading of js, removing two main reasons for using webpack
- However, loosing tree shaking. (which didn't work anyway)







