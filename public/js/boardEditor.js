const boardEditorEl = document.getElementById('bd');
const startPlayEl = document.getElementById('startPlay');
const arrangeEl = document.getElementById('arrange');
const myAudioEl = document.getElementById('myAudio');
const clearEditorEl = document.getElementById('clearEditor');
// const startEditor = document.getElementById('startEditor');

var editorTurnt = 0;
let play = true;
var configEditor = {};
var editorBoard = null;
var editorGame = new Chess()


startPlayEl.addEventListener('click', (e) => {
	e.preventDefault();

	// clearEditorEl.style.display = null; // changed Here

	if ((editorBoard.fen().match(/k/g) || []).length < 1 && (editorBoard.fen().match(/K/g) || []).length < 1) {
		alert("There must be atleast 2 Kings of both color in the board")
		return
	}
	startPlayEl.style.display = "none";
	arrangeEl.style.display = null;

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
	// document.querySelector('#clearEditor').style.display = null;
	startPlayEl.style.display = null;
	arrangeEl.style.display = "none";
	clearEditorEl.style.display = null;
	let currentFen = editorBoard.fen();


	configEditor = {
		draggable: true,
		dropOffBoard: 'trash',
		position: currentFen,
		sparePieces: true
	}
	editorBoard = Chessboard('boardEditor', configEditor);
	$('#clearEditor').on('click', editorBoard.clear)
})

boardEditorEl.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('gameMode').style.display = "none";
	document.querySelector('#boardEditorGame').style.display = null;
	// document.querySelector('#clearEditor').style.display = "none";
	// document.querySelector('#startEditor').style.display = "none";
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

// clearEditorEl.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	configEditor = {
// 		draggable: true,
// 		dropOffBoard: 'trash',
// 		position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
// 		sparePieces: true
// 	}
// 	editorBoard = Chessboard('boardEditor', configEditor);
// })



function onSnapEndEditor(params) {
	editorBoard.position(editorGame.fen())

	console.log(params)
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
	let currentFen = editorGame.fen()
	if (move != null && 'captured' in move && move.piece != 'p') {
		if (confirm("Do you want to move back ?")) {
			console.log('Move Me to my old position')
			editorGame.load(currentFen)
			editorGame.put({ type: move.piece, color: move.color }, move.from)
			editorGame.remove(move.to)
			if (editorGame.in_check()) {
				alert("Cant Move back as it leads to Check")
				editorGame.load(currentFen)
			}
		}
	}
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

