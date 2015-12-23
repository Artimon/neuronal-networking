/**
 * Very simple perceptron with a concrete implementation based on
 * the excitement behaviour of kerbals in kerbal space program.
 * The more courage and stupid kerbals are the more excited they
 * are about anything.
 *
 * Copy the code into your browser console following given steps.
 *
 * Start with the perceptron class first.
 *
 * @constructor
 */
function Perceptron () {
	this.weight = { bias: 0, courage: 0, stupidity: 0 };
	this.learningRate = 0.1;
}

/**
 * The input numbers may be of any value.
 *
 * @param {{ courage: number, stupidity: number }} input
 * @param {boolean} [expectedResult] optional for training.
 * @returns {string}
 */
Perceptron.prototype.think = function (input, expectedResult) {
	var weightedInput = 0,
		nonLinearProduct,
		percept,
		direction;

	/*
	 * Bias is included as static input and weighted.
	 * There are different implementation examples I found so far.
	 */
	input.bias = 1;

	weightedInput += this.weight.bias      * input.bias;
	weightedInput += this.weight.courage   * input.courage;
	weightedInput += this.weight.stupidity * input.stupidity;

	/*
	 * Important:
	 * Neuronal networking needs a non linear function of some kind
	 * somewhere to draw different input patterns farther away from
	 * each other to differ them more easily.
	 */
	nonLinearProduct = weightedInput * weightedInput;

	/*
	 * Just chose a random activation threshold, could also be 0 for
	 * example.
	 */
	percept = nonLinearProduct > 1;

	if (expectedResult!== undefined && expectedResult!== percept) {
		direction = expectedResult? 1 : -1;

		this.weight.bias      += this.learningRate * direction * input.bias;
		this.weight.courage   += this.learningRate * direction * input.courage;
		this.weight.stupidity += this.learningRate * direction * input.stupidity;

		console.log('Learning new weights:', this.weight);
	}

	return percept? 'I like to test dangerous new stuff!' : 'I´d prefer staying on solid ground...';
};


// No create a perceptron.
p = new Perceptron();

// Train until "I like to test dangerous new stuff!" appears.
p.think({ courage: 10, stupidity: 10 }, true);

// Train until "I´d prefer staying on solid ground..." appears.
p.think({ courage: 1, stupidity: 1 }, false);

// Test the previous trained set again, "I like to test dangerous new stuff!" should appear.
p.think({ courage: 10, stupidity: 10 }, true);


// Train intermediate value until "I´d prefer staying on solid ground..." appears.
p.think({ courage: 5, stupidity: 1}, false);

// Cross check what was learned before, "I like to test dangerous new stuff!" should appear.
p.think({ courage: 10, stupidity: 10 }, true);

// And "I´d prefer staying on solid ground..." should appear.
p.think({ courage: 1, stupidity: 1 }, false);


// Now try some new values without training parameter, "I´d prefer staying on solid ground..." should appear.
p.think({ courage: 4, stupidity: 1});