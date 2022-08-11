var onDrop = function (source, target) {
	move_cfg = {
		from: source,
		to: target,
		promotion: "q",
	};

	// check we are not trying to make an illegal pawn move to the 8th or 1st rank,
	// so the promotion dialog doesn't pop up unnecessarily
	// e.g. (p)d7-f8
	var move = editorGame.move(move_cfg);
	// illegal move
	if (move === null) {
		return "snapback";
	} else {
		editorGame.undo(); //move is ok, now we can go ahead and check for promotion
	}

	// is it a promotion?
	var source_rank = source.substring(2, 1);
	var target_rank = target.substring(2, 1);
	var piece = editorGame.get(source).type;

	if (
		piece === "p" &&
		((source_rank === "7" && target_rank === "8") ||
			(source_rank === "2" && target_rank === "1"))
	) {
		promoting = true;

		// get piece images
		$(".promotion-piece-q").attr("src", getImgSrc("q"));
		$(".promotion-piece-r").attr("src", getImgSrc("r"));
		$(".promotion-piece-n").attr("src", getImgSrc("n"));
		$(".promotion-piece-b").attr("src", getImgSrc("b"));

		//show the select piece to promote to dialog
		promotion_dialog
			.dialog({
				modal: true,
				height: 52,
				width: 184,
				resizable: true,
				draggable: false,
				close: onDialogClose,
				closeOnEscape: false,
				dialogClass: "noTitleStuff",
			})
			.dialog("widget")
			.position({
				of: $("#board"),
				my: "middle middle",
				at: "middle middle",
			});
		//the actual move is made after the piece to promote to
		//has been selected, in the stop event of the promotion piece selectable
		return;
	}

	// no promotion, go ahead and move
	makeMove(editorGame, move_cfg);
};
