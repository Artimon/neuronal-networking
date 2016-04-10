/**
 * @link http://natureofcode.com/book/chapter-10-neural-networks/
 *
 * We'll again do some improvements, like adding a learning rate to our
 * perceptron. This time we make use of the valuable information
 * provided by the linked article but merge it with the improved parts
 * we already used before.
 *
 * @constructor
 */
function Perceptron() {
	this.input = {};
	this.weights = {};

	this.output = 0; // Sign function like sigmoid result (-1 to +1);

	this.learningRate = 0.01; // Can be adjusted for different learning speeds.
}

/**
 * You may pass any kind of object but you should keep the pattern
 * identical once you fed one pattern in.
 *
 * Note:
 * 1. Automatically adds new input parameters to its pattern.
 * 2. Do not pass a value named "bias", since it will be overwritten.
 * 3. Pattern values can be of any range.
 *
 * Changes:
 * 1. Bias is put back into the input to be enforced and weighted.
 * 2. The sigmoid result directly is the output. You could also use a
 *    sign(...) function to only differ between "black and white" but
 *    I'd like to have a natural perception.
 * 3. The output ranges from -1 to +1 instead of "true VS false".
 *
 * Example:
 * perceptron.feedForward({ inputOne: 100, inputTwo: -5.35, inputThree: 0.01 })
 *
 * @param {{}} input
 * @returns {number}
 */
Perceptron.prototype.feedForward = function (input) {
	var self = this,
		sum = 0;

	this.input = input; // Store last input for learning.
	this.input.bias = 1; // Enforce bias to be weighted.

	this.foreach(input, function (value, name) {
		if (self.weights[name] === undefined) {
			self.weights[name] = 0; // Initial weight.
		}

		sum += self.weights[name] * value;
	});

	/*
	 * Sigmoid function:
	 * @link https://en.wikipedia.org/wiki/Sigmoid_function
	 * @link http://wiki.bethanycrane.com/perceptron
	 *
	 * A simpler version would be:
	 * return sum > 0 ? 1 : -1;
	 * Works, too, but it would strip away the "soft perception".
	 *
	 * ~1 at +4
	 * ~0 at -4
	 */
	this.output = 1 / (1 + Math.exp(-sum)); // 0 to 1
	this.output = 2 * this.output - 1; // -1 to +1

	return this.output;
};

/**
 * If you want to check for a clear answer like the sign(...)
 * function would create, you just call this method.
 *
 * Example:
 * perceptron.feedForward(...);
 * perceptron.answer() -> returns -1 or +1
 *
 * @returns {number}
 */
Perceptron.prototype.answer = function () {
	return this.output > 0 ? 1 : -1;
};

/**
 * When the perceptron.feedForward(...) method does not result in what you
 * expected just call the perceptron.train(...) method with the
 * correct expectation. It will return the new result after rethinking.
 *
 * @param {number} expectation range [-1 to +1]
 * @returns {number}
 */
Perceptron.prototype.train = function (expectation) {
	var self = this,
		error;

	if (expectation === this.answer()) {
		return this.output;
	}

	error = expectation - this.output;

	this.foreach(this.input, function (value, name) {
		self.weights[name] += self.learningRate * error * value;
	});

	return this.feedForward(this.input);
};

Perceptron.prototype.foreach = function (list, callback) {
	for (var i in list) {
		if (list.hasOwnProperty(i)) {
			if (callback(list[i], i) === false) {
				break;
			}
		}
	}
};

/**
 * this time we'll make a bit more complex example:
 * The perceptron shall differ between values that lay above or
 * underneath a line described by the formula 2 * x + 1.
 *
 * As you know from school: y = f(x)
 *
 * The perceptron will receive the x and y coordinates ONLY and shall
 * not know anything of the formula for the "border" we draw but still
 * give us the result whether it is above or below just by training.
 *
 * @param {number} x
 * @returns {number}
 */
function lineFormula(x) {
	return 2 * x + 1;
}

p = new Perceptron();

/**
 * This is the "field" in which we'll play with our perceptron.
 * Thus all training and check points will be inside these diameters.
 *
 * Example for width:
 * Width of 640 ranges from -320 to +320 but could be any other value
 * range between +/- infinity.
 *
 * @type {{width: number, height: number}}
 */
area = {
	width: 640,
	height: 360
};

/*
 * Training:
 *
 * We'll create 2,000 random points and predefine the correct answer
 * for the perceptron (below/above).
 */
for (i = 0; i < 2000; ++i) {
	// Random point coordinates.
	point = {
		x: Math.random() * area.width - (area.width / 2),
		y: Math.random() * area.height - (area.height / 2)
	};

	// Check the position against the formula.
	answer = point.y < lineFormula(point.x) ? -1 : 1;

	p.feedForward(point); // Pass the x,y-patter to the perceptron.
	p.train(answer); // Make it train to learn the desired answer.
}

/*
 * Checking:
 *
 * We'll basically do the same thing as before, but instead of training
 * the answer we do only check it against the perceptron answer.
 */
for (i = 0; i < 20; ++i) {
	// Random point coordinates.
	point = {
		x: Math.random() * area.width - (area.width / 2),
		y: Math.random() * area.height - (area.height / 2)
	};

	// Check the position against the formula.
	answer = point.y < lineFormula(point.x) ? -1 : 1;
	positionText = answer === -1 ? ' (below)' : ' (above)';

	p.feedForward(point);

	// Output instead of training.
	if (answer === p.answer()) {
		console.log('Correct answer for: ' + point.x + ' / ' + point.y + positionText);
	}
	else {
		console.log('Wrong answer for: ' + point.x + ' / ' + point.y + positionText);
	}
}