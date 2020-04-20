# Firebase

Our database. Could be changed in the future if firebase gets too expensive or something

Note. I switched from realtime db to firestore, because firestore is newer and they are pushing people that way. The included files are also 3x smaller. BUT, firestore has daily limits on read and write number, RT DB only has limit on amount of data. Because the game at 30fps will be writing 1800 times/minute, and the limit is 50k per day, that is v bad! So I switched back to RT-DB

1. Stop using the public API! Lucily nobody stole it yet.
2. Decide on data structure. Add rules to firebase so only this structure can exist
