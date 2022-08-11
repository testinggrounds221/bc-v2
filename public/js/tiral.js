
// https://github.com/jhlywa/chess.js

var board = null
var boardJqry = $('#boardEditor')
var editorGame = new Chess()
var squareToHighlight = null
var squareClass = 'square-55d63'

function removeHighlights(color) {
	boardJqry.find('.' + squareClass)
		.removeClass('highlight-' + color)
}

function onDragStart(source, piece, position, orientation) {
	// do not pick up pieces if the editorGame is over
	if (editorGame.game_over()) return false

	// only pick up pieces for White
	if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove() {
	var possibleMoves = editorGame.moves({
		verbose: true
	})

	// editorGame over
	if (possibleMoves.length === 0) return

	var randomIdx = Math.floor(Math.random() * possibleMoves.length)
	var move = possibleMoves[randomIdx]
	editorGame.move(move.san)

	// highlight black's move
	removeHighlights('white')
	removeHighlights('black')
	boardJqry.find('.square-' + move.from).addClass('highlight-black')
	squareToHighlight = move.to

	// update the board to the new position
	board.position(editorGame.fen())
}

function onDrop(source, target) {
	// see if the move is legal
	var move = editorGame.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	})

	// illegal move
	if (move === null) return 'snapback'

	// highlight white's move
	removeHighlights('white')
	removeHighlights('black')

	boardJqry.find('.square-' + source).addClass('highlight-white')
	boardJqry.find('.square-' + target).addClass('highlight-white')

	// make random move for black
	window.setTimeout(makeRandomMove, 250)
}

function onMoveEnd() {
	boardJqry.find('.square-' + squareToHighlight)
		.addClass('highlight-black')
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
	board.position(editorGame.fen())
}

var config = {
	draggable: true,
	position: 'start',
	onDragStart: onDragStart,
	onDrop: onDrop,
	onMoveEnd: onMoveEnd,
	onSnapEnd: onSnapEnd
}
board = Chessboard('boardEditor', config)