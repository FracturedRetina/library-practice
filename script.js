var cvs;
var ctx;
var lastnames;
var shelf = [];
var book;
var tmpIndex;
var correctShelf;

$('body').focus();
$(document).ready(function() {
	lastnames = $.ajax({
		url: "res/names-dist_last.txt",
		async: false
	}).responseText.split('\n');

	$('button').click(function() {
		refresh();
	});

	refresh();
});

$(document).keydown(function(e) {
	if (e.which == 38 && tmpIndex > 0) {
		tmpIndex--;
	} else if (e.which == 40 && tmpIndex < 10) {
		tmpIndex++;
	} else if (e.which == 13) {
		check();
	}
	e.preventDefault();
	redraw();
});

function genCallNonFic() {
	num = (Math.random() * 999).toFixed(Math.floor(Math.random() * 5));

	//Remove trailing zeros
	lastchar = num.toString().substr(num.length - 1);
	while (lastchar == '0' || lastchar == '.') {
		num = num.substr(0, num.length - 2);
		lastchar = num.substr(num.length - 1);
		if (lastchar == '.') {
			break;
		}
	}

	//Add leading zeros
	mainNum = num.split('.')[0]
	while (mainNum.length < 3) {
		num = "0" + num
		mainNum = num.split('.')[0]
	}

	nameSeed = Math.random() * 90.483;
	for (var i = 0; i < lastnames.length; i++) {
		if (nameSeed < lastnames[i].substr(21, 6).trim()) {
			return num + ' ' + lastnames[i].match(/[A-Z]+/);
		}
	}

	return "ERROR";
}

function sortNonFic(a, b) {
	dNum = a.split(' ')[0] - b.split(' ')[0];

	if (dNum != 0) {
		return dNum;
	} else {
		if (a.split(' ')[1] < b.split(' ')[1]) {
			return -1;
		} else if (a.split(' ')[1] > b.split(' ')[1]) {
			return 1;
		} else {
			return 0;
		}
	}
}

function redraw() {
	tmpShelf = shelf.slice();
	tmpShelf.splice(tmpIndex, 0, book);

	str = "";

	for (var i = 0; i < 11; i++) {
		if (str != 0) {
			str += '\n';
		}
		if (i == tmpIndex) {
			str += '>' + tmpShelf[i];
		} else {
			str += ' ' + tmpShelf[i];
		}
	}

	$('pre').text(str);
}

function refresh() {
	book = genCallNonFic();
	for (var i = 0; i < 10; i++) {
		shelf.push(genCallNonFic());
		shelf = shelf.sort(function(a, b) {
			return sortNonFic(a, b);
		});
	}
	correctShelf = shelf.slice();
	correctShelf.splice(0, 0, book);
	correctShelf.sort(function(a, b) {
		return sortNonFic(a, b);
	});
	$('#answer').slideUp();
	tmpIndex = 0;
	redraw();
}

function check() {
	yourShelf = shelf.slice();
	yourShelf.splice(tmpIndex, 0, book);

	var correct = true;

	for (var i = 0; i < 11; i++) {
		if (yourShelf[i] != correctShelf[i]) {
			correct = false;
			break;
		}
	}

	$('#answer').slideDown();
	if (correct) {
		$('#answer').text("Correct!");
	} else {
		$('#answer').text("Incorrect!");
	}
}