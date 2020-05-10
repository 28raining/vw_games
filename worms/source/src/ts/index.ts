import "../css/styles.css";
// import "../../node_modules/normalize.css/normalize.css";
// import "../../node_modules/milligram/dist/milligram.min.css";
require('normalize.css');
require('milligram');
// require('typeface-roboto')

// import { firebase_initialise } from "./data_management";
import {initialise_listeners} from "./userInput"


// firebase_initialise();
initialise_listeners();
