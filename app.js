// tutorial reference by Yahya Elharony via YouTube. https://www.youtube.com/watch?v=G8J13lmApkQ

// holds all of the card's names

let cardNames = [
	'diamond',
	'paper-plane-o',
	'anchor',
	'bolt',
	'cube',
	'leaf',
	'bicycle',
	'bomb',
	'diamond',
	'paper-plane-o',
	'anchor',
	'bolt',
	'cube',
	'leaf',
	'bicycle',
	'bomb',
]

scorePanel = $('.score-panel'),
deck = $('.deck'),
card = $('.card'),
cards = card.children(),
movesClass = $('.moves'),
restart = $('.restart');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// start game
function startGame() {
	
	let openCards = [],
		moves = 0,
		matches = 0,
		modal = document.getElementById('youWin-modal'),
		span = document.getElementById('close'),
		timerOn = false,
		starsScorePanel = $('.stars'),
		starRatings = [12, 24],
		clock;

	cardShuffle();

	// event listener for clicks on the deck and cards.
	function initEventListener() {
		// stops event listener on second click
		deck.off('click');

		// reset cards
		deck.children().prop('disabled', false);

		// disable matched cards
		$('li').each(function (index) {
			if ($(this).hasClass('match')) {
				$(this).prop('disabled', true);
			}
		});

		// if all matches
		endGame(matches);

		// restart
		restart.click(function () {
			card.removeClass();
			card.addClass('card');
			matches = 0;
			moves = 0;
			movesClass.text(moves);
			stopTimer();
			$('#seconds').html('00');
			$('#minutes').html('00');
			starsScorePanel.children().children().each(function (index, element) {
				$(element).css('color', '');
			});
			$('.starRatingIcons').children().each(function (index, element) {
				$(element).removeClass();
				$(element).addClass('fa fa-star');
			});
			cardShuffle;
			deck.children().prop('disabled', false);
			openCards.splice(0, 2);
		});

		// star ranking based on moves
		starsScorePanel.children().children().each(function (index, element) {
			if (starRatings[index] === moves) {
				$(element).css('color', 'white');
			}
		});
		$('.starRatingIcons').children().each(function (index, element) {
			if (starRatings[index] === moves) {
				$(element).removeClass();
			}
		});

		// deck event listener
		deck.on('click', '.card', function () {

			// move counter
			moveCounter();
			movesClass.text(moves);

			if (timerOn === false) {
				// timer starts
				goTimer();
			}

			// shows cards
			let showCard = $(this).addClass('open show');

			// disable first clicked card
			if ($(this).hasClass('open')) {
				$(this).prop('disabled', true);
			}

			// card array
			openCards.push(showCard.children());

			// check for match
			if (openCards.length > 1) {
				let compare = compareCards(openCards);
				if (compare === false) {
					for (let i = 0; i < 2; i++) {
						$(openCards[i]).parent().addClass('animated flash').css('background', '#070606');
					}

					//Found on: http://www.telegraphicsinc.com/2013/07/how-to-use-animate-css/
					window.setTimeout(function () {
						card.removeClass('open show animated flash').css('background', '');
					}, 750);

					// clears array
					openCards.splice(0, 2);

					initEventListener();
				} else {
					lockMatch();
				}
			}
		});
	}

	// stops the timer
	function stopTimer() {
		clearInterval(clock);
		timerOn = false;
	}

	// timer found on: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
	function goTimer() {
		let sec = 0;

		function pad(val) {
			return val > 9 ? val : "0" + val;
		}

		// if put let, const, or var will not stop timer
		clock = setInterval(function () {
			$("#seconds").html(pad(++sec % 60));
			$("#minutes").html(pad(parseInt(sec / 60, 10)));
		}, 1000);

		timerOn = true;
	}

	// shuffle cards
	function cardShuffle() {
		shuffle(cardNames);
		cards.removeClass();

		cards.each(function (i) {
			$(this).addClass('fa fa-' + cardNames[i]);
			i++;
		});
	}

	// increases moves
	function moveCounter() {
		moves++;
	}

	// all matches stop timer
	function endGame(value) {
		if (value === 8) {
			stopTimer();

			// opens modal
			modal.style.display = 'block';

			// shows time
			let minutes = $('#minutes').text();
			let seconds = $('#seconds').text();
			$('.clearTime').text('Total Game Time: ' + minutes + ':' + seconds);

			// show moves
			$('.numberMoves').text('You completed the game in ' + moves + ' moves.');

			// star rating
			$('.starMessage').text('Here\'s your star rating: ');

			// close modal
			$('.close').on('click', function () {
				modal.style.display = 'none';
			});

			// outside click close modal
			window.onclick = function (event) {
				if (event.target == modal) {
					modal.style.display = 'none';
				}
			}

			// play again, reset game
			$('.playAgain').on('click', function () {
				card.removeClass();
				card.addClass('card');
				matches = 0;
				moves = 0;
				movesClass.text(moves);
				stopTimer();
				$('#seconds').html('00');
				$('#minutes').html('00');
				starsScorePanel.children().children().each(function (i, element) {
					$(element).css('color', '');
				});
				$('.starRatingIcons').children().each(function (i, element) {
					$(element).removeClass();
					$(element).addClass('fa fa-star');
				});
				modal.style.display = 'none';
				cardShuffle();
				deck.children().prop('disabled', false);
			});
		}
	}

	// looks for match
	function compareCards(array) {
		return openCards[0].attr('class') === openCards[1].attr('class') ? true : false;
	}

	// lock matches
	function lockMatch() {
		for (let index = 0; index < 2; index++) {
			$(openCards[index]).parent().removeClass('open show');
			$(openCards[index]).parent().addClass('match');
			$(openCards[index]).parent().addClass('animated tada');
		}
		openCards.splice(0, 2);
		matches++;
		deck.off('click');
		initEventListener();
	}

	initEventListener();
}

startGame();
