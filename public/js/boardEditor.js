const boardEditorEl = document.getElementById('bd');
const startPlayEl = document.getElementById('startPlay');
const arrangeEl = document.getElementById('arrange');
const myAudioEl = document.getElementById('myAudio');

var editorTurnt = 0;
let play = true;
var configEditor = {};
var editorBoard = null;
var editorGame = new Chess()

startPlayEl.addEventListener('click', (e) => {
	e.preventDefault();

	document.querySelector('#clearEditor').style.display = "none";
	document.querySelector('#startEditor').style.display = "none";
	let clr = 'w'
	if (confirm("Is it White's turn ?")) {
		clr = "w";
	} else {
		clr = "b";
	}
	let currentFen = editorBoard.fen() + ' ' + clr + ' KQkq - 2 3';
	editorGame = new Chess(currentFen)

	configEditor = {
		draggable: true,
		position: editorBoard.fen(),
		onSnapEnd: onSnapEndEditor,
		onDragStart: onDragStartEditor,
		onDrop: onDropEditor,

	}
	editorBoard = Chessboard('boardEditor', configEditor);
	play = true;
})

arrangeEl.addEventListener('click', (e) => {
	e.preventDefault();
	play = false;
	// Get current Fen string and set config
	document.querySelector('#clearEditor').style.display = null;
	document.querySelector('#startEditor').style.display = null;
	let currentFen = editorBoard.fen();


	configEditor = {
		draggable: true,
		dropOffBoard: 'trash',
		position: currentFen,
		sparePieces: true
	}
	editorBoard = Chessboard('boardEditor', configEditor);
})

boardEditorEl.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('gameMode').style.display = "none";
	document.querySelector('#boardEditorGame').style.display = null;
	document.querySelector('#clearEditor').style.display = "none";
	document.querySelector('#startEditor').style.display = "none";
	configEditor = {
		draggable: true,
		position: 'start',
		onSnapEnd: onSnapEndEditor,
		onDragStart: onDragStartEditor,
		onDrop: onDropEditor,
		dropOffBoard: 'trash',
	}
	editorBoard = Chessboard('boardEditor', configEditor);
})

function onSnapEndEditor() {
	editorBoard.position(editorGame.fen())
}

function onDragStartEditor(source, piece, position, orientation) {
	// do not pick up pieces if the editorGame is over
	if (editorGame.game_over()) {
		if (editorGame.in_draw()) {
			alert('Game Draw!!');
		}
		else if (editorGame.in_checkmate())
			if (editorTurnt === 1) {
				alert('You won the game!!');
			} else {
				alert('You lost!!');
			}
		return false
	}

	// only pick up pieces for White

	// if (piece.search(/^b/) !== -1) return false
}

function onDropEditor(source, target) {
	// see if the move is legal
	var move = editorGame.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	})
	myAudioEl.play();
	// illegal move
	if (move === null) return 'snapback'
	editorTurnt = 1 - editorTurnt;
	// make random legal move for black
	// window.setTimeout(makeRandomMoveEditor, 250)
}

function makeRandomMoveEditor() {
	var possibleMoves = editorGame.moves()

	// editorGame over
	if (possibleMoves.length === 0) {
		return;
	}

	var randomIdx = Math.floor(Math.random() * possibleMoves.length)
	editorGame.move(possibleMoves[randomIdx]);
	myAudioEl.play();
	editorTurnt = 1 - editorTurnt;
	editorBoard.position(editorGame.fen());
}