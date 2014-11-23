/******************* VARIABLE DEFINITION *************************/
//Constants
var ROW = 30, COL =20;
var EMPTY = 0, CAR = 1, RCAR = 2 ;
var CENTER = 9, LEFT = 3, RIGHT = 15;

//Key states
var KEY_LEFT = 37 , KEY_RIGHT = 39, KEY_UP = 38, ESC = 27;

//speed variables
var FAST = 2, NORMAL = 8;

//Game variables
var canvas, ctx, score, frames, keystate, currFrame , speed;
var carpos = CENTER ;
var gamefail = 0;
var count = 0;

//Score variables
var carcrossed ;
var startTime, endTime;

//Main variables
var map ={

	width: null,
	height: null,
	_grid: null,

	init: function(d) {
		this.width = COL;
		this.height = ROW*20;

		this._grid = [] ;

		for (var i = 0; i < this.width; i++) {
			this._grid.push([]);
			for (var j = 0; j < this.height; j++) {
				this._grid[i].push(d);
			};			
		};

		posx = [LEFT, CENTER, RIGHT ];
		posyprev = 0;
		posxprev = 1;
		ydiff = [8 ,9,10];
		while ( posyprev < this.height - 20 ) {
			do
			{
				randx = Math.floor(Math.random()*3);
			}while (randx == posxprev);	
			posxprev = randx;
			randy = Math.floor(Math.random()*3);
			setCar( this, CAR, posx[randx], posyprev + ydiff[randy] );
			posyprev = posyprev + ydiff[randy] ;
		}

		
	},

	set: function( val, x, y ){
		this._grid[x][y] = val;
	},

	get: function( x,y ) {
		return this._grid[x][y];
	},

}

var grid ={

	width: null,
	height: null,
	_grid: null,

	init: function(d,c,r){
		this.width = COL;
		this.height = ROW;

		this._grid =[];

		for (var i = 0; i < c; i++) {
			this._grid.push([]);
			for (var j = 0; j < r; j++) {
				this._grid[i].push(d);
				};			
			};
	},

	set: function( val, x, y ){
		this._grid[x][y] = val;
	},

	get: function( x,y ) {
		return this._grid[x][y];
	},

}

/*************** FUNCTION DEFINITIONS **********************/
function mainScreen()
{
	var div = document.getElementById("canvas");
	if( div ) {document.body.removeChild( div );}

	mainDiv = document.createElement("div");
	mainDiv.classList.add("mainScreen");
	mainDiv.id = "mainScreen";
	document.body.appendChild( mainDiv );

	startButton = document.createElement("button");
	startButton.classList.add("start")
	startButton.innerHTML = "Start";
	startButton.addEventListener("click", function(){
		clearScreen();
		game();
		});
	mainDiv.appendChild( startButton );
}

function clearScreen()
{
	var div = document.getElementById("mainScreen");
	document.body.removeChild( div );
}

function setCar( place, type, x, y )
{
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			if( !( ( i==0 || i==2 ) && ( j==0 || j==2 ) ) )  {
				place.set(type, x+i, y+j);	
			}
		}	
	}
}

function createCanvas()
{
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.classList.add("grid");
	canvas.width = COL*20;
	canvas.height = ROW*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
}

function getKey()
{

	keystate = [];
	document.addEventListener( "keydown", function( evt ){
		keystate[evt.keyCode] = true;
	} );

	document.addEventListener( "keyup", function( evt ){
		delete keystate[evt.keyCode];
	} )


}

function game()
{
	//initialise the game
	init();

	//map + cars
	createCanvas();

	//get key pressed
	getKey();

	//all the cool stuff happens here
	loop();
}

function loop()
{
	if( keystate[ESC] ) { 
		endGame();
		mainScreen();
	}
	update();
	if( !gamefail ) { window.requestAnimationFrame( loop, canvas ); }
	
}

function update()
{
if( !gamefail )
	{
		frames++;
		var carposNew = carpos;
		
		//to reduce sensitivity of keys being presed
		if( frames - currFrame > 6 )
		{
		//get key pressed and new position
			if (keystate[KEY_LEFT] && carpos == RIGHT ) { 
				carposNew = CENTER;
				currFrame = frames; }
			if (keystate[KEY_LEFT] && carpos == CENTER ) { 
				carposNew = LEFT;
				currFrame = frames; }
			if (keystate[KEY_RIGHT] && carpos == CENTER ) { 
				carposNew = RIGHT;
				currFrame = frames; }
			if (keystate[KEY_RIGHT] && carpos == LEFT ) { 
				carposNew = CENTER;
				currFrame = frames; }
		}

		//control speed
		if( keystate[KEY_UP] ) { speed = FAST;}
		else{ speed = NORMAL; }

		if( keystate[KEY_LEFT] || keystate[KEY_RIGHT] )
		{
		//set car in current position EMPTY and ser new RCAR
		setCar( grid, EMPTY, carpos, ( ROW - 5 ) );
		setCar( grid, RCAR, carposNew, ( ROW - 5 ) );
		}

		carpos = carposNew;
		
		draw( count );
		check( count );
		
		//move the map
		if( frames%speed == 0 )
		{
			count++ ;
			calcscore( count );
		}

		//end game if map is complete
		if( count > map.height + 10 )
		{
			endGame();
			mainScreen();
		}

	}
else
{
	init();
	gamefail = 0;
}

}

function check( count )
{

for (var i = 0; i < grid.width; i++) {
	for (var j = 0; j < grid.height; j++) {
		
		if( ( grid.get(i,j) + map.get(i,j + ( map.height - grid.height - count ) ) )==3 )	
			{
				endGame();
				break;
			}
	}
	
}	

}

function endGame()
{
	gamefail = 1;
	mainScreen();
}

function calcscore( count )
{

for (var i = 0; i < grid.width; i++) {
	if( map.get( i, ( map.height - grid.height - count ) ) == 1)
	{
		carcrossed++;
		console.log( i + "--" + ( map.height- grid.height - count ))		
	}
		
}		

}


function draw( count )
{
tw = canvas.width/grid.width;
th = canvas.height/grid.height;

for (var i = 0; i < grid.width; i++) {
		for (var j = 0; j < grid.height; j++) {
			switch( grid.get(i,j) + map.get(i,j + ( map.height - grid.height - count ) ) ){

			case EMPTY:
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(i*tw, j*th , tw,th);	
				break;
			case CAR:
				ctx.fillStyle = "#660033";
				ctx.fillRect(i*tw, j*th , tw,th);
				break;
			case RCAR:
				ctx.fillStyle = "#D699AE";
				ctx.fillRect(i*tw, j*th , tw,th);
				break
			case 3:
				ctx.fillStyle = "#000000";
				ctx.fillRect(i*tw, j*th , tw,th);
				
			}
			
		}	
	}
	ctx.fillStyle = "#000";
	ctx.font =  "12px Arial";
	ctx.fillText( ( "CARS CROSSED : " + Math.floor( carcrossed/8 ) ) , 10 , ( canvas.height - 10 ) );
	currTime = new Date().getTime() / 1000;
	ctx.fillText(  "TIME : " + ( Math.floor(currTime - startTime) ) , 150 , ( canvas.height - 10 ) );
}

function setvariables()
{
// to initialise game variables
	count = 0 ;
	frames = 0;
	currFrame = 0;
	speed = NORMAL;
	carpos =CENTER;
	carcrossed = 0;
	startTime = new Date().getTime() / 1000;
}

function init()
{
	setvariables();
	grid.init( EMPTY, COL, ROW );
	setCar( grid, RCAR, carpos, ( ROW - 5 ) );
	map.init( EMPTY );
}


/******************* MAIN *************************/

function main()
{
// Call main game function
	mainScreen();
}

window.onload = main ;
