//Packages
var gamePrompt = require('game-prompt');
var colors = require('colors');

//Global variables
var playerName;
var shipName;
var fuelSupply;
var myArtifacts;
var planets;
var myPlanetIndex = 0;
var validPlanets;

//"Borrowed" Functions (thanks, Google)

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Functions
function cleanInput(string) {
	return string.charAt(0).toUpperCase();
}

function startGame() {
	fuelSupply = 1000;
	myArtifacts = [];
	planets = [	{name: 'Earth',
					dist: 10,
//					init: 'E',
					introText: 'You return to Earth.',
					canTalk: false,
					hasFuel: 10},
				{name: 'Mesnides',
					isNew: true,
					dist: 20,
//					init: 'M',
					introText: ["You've arrived at Mesnides. As you land, a representative\n" +
								"of the Mesnidian people is there to greet you.",
								'"Welcome, traveler, to Mesnides."'],
					canTalk: true,
					hasArtifact: 'Myoin Horn',
//? Possible to refer to hasArtifact? In case we rename artifact					
					A: '"Here, take this Myoin Horn, an ancient Mesnidian instrument."',
					P: '"Well, Laplides suffered from atomic war and has been\n' +
								'uninhabited for centuries. You would do well to avoid it on your journey."',
					hasFuel: false},
				{name: 'Laplides',
					isNew: true,
					dist: 50,
//					init: 'L',
					introText: 'You enter orbit around Laplides. Looking down at the planet, you see signs\n' + 
								'of atomic war and realize there is no option but to turn around.',
					canTalk: false,
					hasFuel: false},
				{name: 'Kiyturn',
					isNew: true,
					dist: 120,
//					init: 'K',
					introText: ["You've arrived at Kiyturn. As you land, a representative of the Kiyturn\n" + 
								"people is there to greet you.",
								'"Hello, what brings you to Kiyturn? You\'re not here to cause trouble are you?"'],
					canTalk: true,
					hasArtifact: 'Kiyturn Glass Bowl',
					A: '"Here, take this Kiyturn Glass Bowl, a symbol of our civilization."',
					P: '"I\'m sorry, but we do not leave our planet. The universe, to us,\n'+
									'is a beautiful mystery."',
					hasFuel: false},
				{name: 'Aenides',
					isNew: true,
					dist: 25,
//					init: 'A',
					introText: 'You discover upon arrival to Aenides that they are a hostile people.\n' + 
								'You attempt to land, but they begin to fire upon your S.R.S.V.\n' + 
								'and you are forced to retreat.',
					canTalk: false,
					hasFuel: false},
				{name: 'Cramuthea',
					isNew: true,
					dist: 200,
//					init: 'C',
					introText: 'Cramuthea has been abandoned due to global environmental disaster,\n' + 
								'but there are remnants of the people that left. You are able to refuel\n' + 
								'your ship and read a beacon signal that tells you the Cramuthean people\n' + 
								'have migrated to Smeon T9Q.',
					canTalk: false,
					hasFuel: 500},
				{name: 'Smeon T9Q',
					isNew: true,
					dist: 400,
//					init: 'S',
					introText: 'The Cramuthean people, living on Smeon T9Q, are a friendly people that\n' +
								'give you some fuel when you arrive.',
					canTalk: true,
					hasArtifact: 'Cramun Flower',
					A: '"Here, take this Cramun Flower, flora from our home planet."',
					P: '"The people of Aenides once tried to take over our home planet by force."',
					hasFuel: 100},
				{name: 'Gleshan 7Z9',
					isNew: true,
					dist: 85,
//					init: 'G',
					introText: 'Gleshan 7Z9 is a poor country.',
					canTalk: true,
					hasArtifact: false,
					P: '"A wealthy people, the Cramuthean, once visited us on Gleshan 7Z9."',
					hasFuel: false}
	];
	gamePrompt('S.R.S.V. Press ENTER to start. And pretty much whenever there\'s a lull.', intro);
}

function intro() {
	gamePrompt(	'You are the captain of a Solo Research Space Vehicle (S.R.S.V.)\n' +
				'on an expedition to explore foreign planets. Your mission is to\n' +
				'make contact with three alien life forms, acquire an artifact\n' +
				'representative of their culture, and bring back your findings to\n' + 
				'Earth.',
	collectInfo);
}

function collectInfo() {
	gamePrompt([
		'A voice comes over the intercom.',
		'"Please state your name for identity verification purposes."'],
		collectName);
}

function collectName(nameInput) {
	var output, nextFunc;

	if (playerName = nameInput){
		output = ['"Thank you, Captain ' + playerName + '."',
			'"And the name of this ship?"'];
		nextFunc = collectShipName;
	} else {
		output = ['A captain needs a name.',
			'"Please state your name for identity verification purposes."'];
		nextFunc = collectName;
	}
	gamePrompt(output,nextFunc);
}
//Trim function to avoid ' ' as name?


function collectShipName(shipInput) {
	var output, nextFunc;

	shipName = (shipInput) ? shipInput : 'Boaty McBoatface';

	gamePrompt(['"Of course. You are flying in the USS ' + shipName + '.',
		'"This ship is remarkably fuel-efficient. Each gallon of fuel\n' + 
		'will transport you one lightyear.',
		'"To begin your ship has ' + numberWithCommas(fuelSupply) +
		' gallons of fuel.',
		'"Where to, Captain ' + playerName + '?"'
		],
		giveDestOptions)
}

function giveDestOptions() {
	var optionsString = 'You are currently on ' + planets[myPlanetIndex].name + '.\n' +
		'You have ' + numberWithCommas(fuelSupply) + ' gallons of fuel.\n\n';
	validPlanets = [];
//build out list of destinations, valid planet inputs
	planets.forEach(function (planet){
		if (planet.name !== planets[myPlanetIndex].name){
			var planetInit = cleanInput(planet.name);
			validPlanets.push(planetInit);
			awkName = '(' + planetInit + ')' + planet.name.substring(1);
			optionsString += (awkName + ': ' + planet.dist + ' light years away.\n');
		}
	});

	gamePrompt(optionsString,processDest);
}

function processDest(destInput) {
	var output = '';
	var nextFunc;

//Remind that only first initial is needed
//?I'd like fold this reminder into the "cleanInput" function but don't see a way
//?to produce (or add to) the output.
	if (destInput.length > 1) {
		output += 'The ' + shipName +
			' navigation system only reads one-letter commands.\n' + 
			'Taking the first letter of your response....\n';
	}

	var input = cleanInput(destInput);

// Check that input is a valid initial
	if ( validPlanets.indexOf(input) >= 0 ) {
		planets.forEach(function (planet, index){
			if (cleanInput(planet.name) === input)
				myPlanetIndex = index;
		});
		output += ('Traveling to ' + planets[myPlanetIndex].name + '...');
		fuelSupply -= planets[myPlanetIndex].dist;
		nextFunc = (fuelSupply >= 0) ? arrival : gameOver;
	} else {
		output += 'That isn\'t a valid option.\n';
		nextFunc = giveDestOptions;
	}

	gamePrompt(output,nextFunc);
}

function gameOver() {
	gamePrompt(['You\'ve run out of fuel in the cold reaches of outer space. ' + 
		shipName + ' is your flying mausoleum.',
			'Play again? (Y/N)'],
		playAgain);
}

function playAgain(ans) {
	if (cleanInput(ans) === 'Y')
		startGame();
}

function arrival() {
	var output = ['Beginning landing procedures for ' + planets[myPlanetIndex].name + '...'];
	var nextFunc;

	if (myPlanetIndex === 0 && myArtifacts.length >= 3) {
		//return to Earth and win
		output.push('You return home victorious with the following objects: ');
		output = output.concat(myArtifacts);
// Tried and failed to do something withforEach:	myArtifacts.forEach(output.push);
		output.push('You win!!!', 'Play again?');
		nextFunc = playAgain;
	} else {
		if (planets[myPlanetIndex].isNew) {
			planets[myPlanetIndex].isNew = false;
			output = output.concat(planets[myPlanetIndex].introText);
		}

		if (planets[myPlanetIndex].hasFuel) {
			fuelSupply += planets[myPlanetIndex].hasFuel;
			output.push(numberWithCommas(planets[myPlanetIndex].hasFuel) + ' gallons of fuel added to ' + shipName + "'s tank.");
			if (myPlanetIndex !== 0)
			//can indefinitely refuel on Earth only
				planets[myPlanetIndex].hasFuel = false;
		}

		nextFunc = planets[myPlanetIndex].canTalk ? pickAction : giveDestOptions;
	}

	gamePrompt(output,nextFunc);
}

function pickAction() {
	var output = ['"How can we assist you?"\n' +
				'Ask about (A)rtifact.\n' +
				'Ask about other (P)lanets\n' +
				'(L)eave'];
	gamePrompt(output,talkToLocals);
}

function talkToLocals(feedback) {
	var nextFunc = pickAction;
	var input = cleanInput(feedback);
	var output = [];
	switch (input) {
//Is there a way to say "the object key that is input"?
		case 'A':
			if (planets[myPlanetIndex].hasArtifact) {
				myArtifacts.push(planets[myPlanetIndex].hasArtifact);
				output.push(planets[myPlanetIndex].A);
				planets[myPlanetIndex].hasArtifact = false;
			} else {
				output.push('"I\'m sorry, we have nothing to offer you."');
			}
			break;
		case 'P':
			output.push(planets[myPlanetIndex].P);
			break;
		case 'L':
			nextFunc = giveDestOptions;
			break;
		default:
				output.push('The representative stares at you blankly.');
	}

	gamePrompt(output,nextFunc);
}



startGame();