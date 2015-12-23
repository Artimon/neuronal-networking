/**
 * This perceptron has no predefined input/weight setup.
 * It automatically creates weights for the input data it receives and
 * thus can be used for various different input patterns or as hidden
 * layer perceptron.
 *
 * It now uses the sigmoid function instead of the squared non linear
 * product of the simple version.
 *
 * @constructor
 */
function Perceptron() {
	this.input = {};
	this.weights = {};

	this.bias = 0; // This time bias is swapped out and not weighted.

	this.percept = undefined; // Sigmoid function result (float).
	this.activation = undefined; // Boolean activation based on percept.
}

/**
 * You may pass any kind of object but you should keep the patter
 * identical once you fed one pattern in.
 * The values should be in a range between 0 and 1.
 *
 * Example:
 * perceptron.think({ inputOne: 1, inputTwo: 0.35, inputThree: 0 })
 *
 * @param {{}} input property value range [0-1]
 * @returns {boolean}
 */
Perceptron.prototype.think = function (input) {
	var self = this,
		sum = 0;

	this.input = input; // Store last input for learning.

	this.foreach(input, function (value, name) {
		if (self.weights[name] === undefined) {
			self.weights[name] = 0; // Initial weight.
		}

		sum += self.weights[name] * value;
	});

	sum += this.bias;

	/*
	 * Sigmoid function:
	 * @link https://en.wikipedia.org/wiki/Sigmoid_function
	 *
	 * ~1 at +4
	 * ~0 at -4
	 */
	this.percept = 1 / (1 + Math.exp(-sum));
	this.activation = this.percept > 0.5;

	return this.activation;
};

/**
 * When the perceptron.think(...) method does not result in what you
 * expected just call the perceptron.rethink(...) method with the
 * correct expectation. It will return the new result after rethinking.
 *
 * @param {boolean|number} expectation range [0-1]
 * @returns {boolean}
 */
Perceptron.prototype.rethink = function (expectation) {
	var self = this,
		gradient;

	if (expectation === this.activation) {
		return;
	}

	gradient = expectation - this.percept;

	this.foreach(this.input, function (value, name) {
		self.weights[name] += gradient * value;
	});

	this.bias += gradient;

	return this.think(this.input);
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


// Create a perceptron to detect pure red.
pRed = new Perceptron();

// Make it think about a pure red input and it will say "false".
pRed.think({ r: 1, g: 0, b: 0 });

// Let it rethink the result passing in you want to see "true".
pRed.rethink(true);


// Now pass a pure blue color and it will also say "true".
pRed.think({ r: 0, g: 0, b: 1 });

// Tell it to rethink the result passing in you want to see "false".
pRed.rethink(false);


// Check both learned colors again:
pRed.think({ r: 1, g: 0, b: 0 }); // Should return "true".
pRed.think({ r: 0, g: 0, b: 1 }); // Should return "false".

// Lets try a darkish red and see if it still gets detected by returning "true".
pRed.think({ r: 0.25, g: 0, b: 0 });

/*
 * You may also train various values in-between, but it may take more
 * training steps to set up a clear activation level.
 */