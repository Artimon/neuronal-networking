/*
 * Now we are going to use perceptrons in a row to form a receptor.
 *
 * A receptor will serve us in detecting / pre-forming input values
 * that are no clear true/false or range vectors.
 *
 * The Challenge:
 * Detect letters from a pixel-matrix.
 *
 * The Solution:
 * We'll train a perceptron to detect painted pixels and send patterns
 * to the letter detection perceptrons to evaluate the input.
 *
 * Requirements:
 * Copy the perceptron code from perceptrons/1.2-sophisticated.js into
 * your browser first. You can also use the multi-purpose version, but
 * you'd have to adjust function call names.
 */

// First of all let's predefine some patterns:

// Pattern for the letter "T".
patterForT = [
	1, 1, 1,
	0, 1, 0,
	0, 1, 0
];

// Pattern for the letter "C".
patternForC = [
	0, 1, 1,
	1, 0, 0,
	0, 1, 1
];


/*
 * Now lets train a perceptron to detect painted values. Instead of
 * bright (0) and dark (1) "darkness" values you could also use a soft
 * range representing greyscale values, too.
 * Even extracting the intensity from rpg values or whatever you like.
 */
pPainted = new Perceptron();

for (var i = 0; i < 20; ++i) {
	paint = i % 2;
	answer = paint === 0 ? -1 : 1;

	pPainted.feedForward({ paint: paint });
	pPainted.train(answer);
}

pPainted.feedForward({ paint: 0 }); // Pass an unpainted value.
pPainted.answer(); // Expected answer must be -1.

pPainted.feedForward({ paint: 1 }); // Pass a painted value.
pPainted.answer(); // Expected answer must be 1.


// Now we'll go for the detection of the letter "T".
pLetterT = new Perceptron();

/*
 * The input for detecting a "T" now is simply a set of read-in "pixels".
 * Structured as a 2-dimensional here it actually is only a list of the
 * results for pattern that now can be used as input for the perceptron
 * that shall detect the T.
 */
inputForT = [];
pLetterT.foreach(patterForT, function (paint) {
	pPainted.feedForward({ paint: paint });

	inputForT.push(
		pPainted.answer() // Lets use the answer here to have a stronger result.
	);
});

pLetterT.feedForward(inputForT); // Passing the detected visual pattern.
pLetterT.answer(); // The result is -1, thus not detected.
pLetterT.train(1); // Train to positively detect it, the positive result shows it worked.


// For the next letter let's add a new perceptron.
pLetterC = new Perceptron();

// Repeating just the same thing to create the C-pattern.
inputForC = [];
pLetterT.foreach(patternForC, function (paint) {
	pPainted.feedForward({ paint: paint });

	inputForC.push(
		pPainted.answer() // Lets use the answer here to have a stronger result.
	);
});

/*
 * As we do have 2 letters now we'll have to teach both perceptrons to
 * detect their own pattern but not the other one.
 */
for (var i = 0; i < 10; ++i) {
	pLetterT.feedForward(inputForT); // Positive detection for T.
	pLetterT.train(1);

	pLetterT.feedForward(inputForC); // Negative detection for C.
	pLetterT.train(-1);


	pLetterC.feedForward(inputForC); // Positive detection for C.
	pLetterC.train(1);

	pLetterC.feedForward(inputForT); // Negative detection for T.
	pLetterC.train(-1);
}

// Now check the results.
pLetterT.feedForward(inputForT); // Positive output - okay!
pLetterT.feedForward(inputForC); // Negative output - okay!
pLetterC.feedForward(inputForC); // Positive output - okay!
pLetterC.feedForward(inputForT); // Negative output - okay!


/*
 * But all of that could have been way easier using a few ifs you may say.
 * Well that is true until we start detecting similar but unpredictable
 * different patterns with our perceptrons, like this badly written "T"
 * that follows.
 * It still looks like a T, thus it should be recognized as one.
 */

patternForBadlyWrittenT = [
	1, 1, 1,
	0, 1, 0,
	0, 0, 0
];

inputForBadlyWrittenT = [];
pLetterT.foreach(patternForBadlyWrittenT, function (paint) {
	pPainted.feedForward({ paint: paint });

	inputForBadlyWrittenT.push(
		pPainted.answer() // Lets use the answer here to have a stronger result.
	);
});

pLetterT.feedForward(inputForBadlyWrittenT); // Positive result, we found a different version of a "T" !
pLetterC.feedForward(inputForBadlyWrittenT); // Negative result, it did not match as a "C", perfect!

/*
 * Conclusion:
 *
 * The value range can be extended to greyscale and the read-in matrix
 * can be increased to detect many more different versions of more
 * letters, that is where the power of the perceptrons, or this very
 * simple multi-layer-perceptron kicks ins.
 *
 * You may try that if you want!
 *
 * The result of this receptor is now normalized and can be used for
 * further processing in other perceptrons like word detection.
 */