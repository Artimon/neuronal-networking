/**
 * Very simple perceptron with a concrete implementation based on
 * the excitement behaviour of kerbals in kerbal space program.
 * The more courageous and stupid kerbals are the more excited they
 * are about anything.
 *
 * Copy the code into your browser console following given steps.
 *
 * Start with the perceptron class first.
 *
 * @constructor
 */
function Perceptron () {
	this.weights = { bias: 0, courage: 0, stupidity: 0 };
	this.learningRate = 0.1;
}

/**
 * The input numbers may be of any value.
 *
 * @param {{ courage: number, stupidity: number }} input
 * @param {boolean} [expectation] optional for training.
 * @returns {string}
 */
Perceptron.prototype.think = function (input, expectation) {
	var weightedInput = 0,
		nonLinearProduct,
		activation,
		direction;

	/*
	 * Bias is included as static input and weighted.
	 * There are different implementation examples I found so far.
	 */
	input.bias = 1;

	weightedInput += this.weights.bias      * input.bias;
	weightedInput += this.weights.courage   * input.courage;
	weightedInput += this.weights.stupidity * input.stupidity;

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
	activation = nonLinearProduct > 1;

	/*
	 * Got an expectation and it differs from the result?
	 * Adjust input weights depending on the expectation and input
	 */
	if (
		expectation !== undefined &&
		expectation !== activation
	) {
		direction = expectation ? 1 : -1;

		this.weights.bias      += this.learningRate * direction * input.bias;
		this.weights.courage   += this.learningRate * direction * input.courage;
		this.weights.stupidity += this.learningRate * direction * input.stupidity;

		console.log('Learning new weights:', this.weights);
	}

	return activation? 'I like to test dangerous new stuff!' : 'I´d prefer staying on solid ground...';
};


// Now create a perceptron.
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