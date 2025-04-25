/**
 * Calculates box plot statistics for an array of scores.
 *
 * This function computes the minimum, first quartile (Q1), median, third quartile (Q3),
 * maximum, and outliers based on the given scores. It returns these values to give
 * insight into the distribution of the data.
 *
 * @param {number[]} scores - An array of numerical scores to analyse.
 * @returns {Object|null} An object containing min, Q1, median, Q3, max, and outliers, or null if the array is empty.
 */
export const getBoxPlotData = (scores) => {
	if (!scores.length) return null;

	const sorted = [...scores].sort((a, b) => a - b);
	const n = sorted.length;

	// Function to calculate the percentile value for a given percentile (p).
	const percentile = (p) => {
		// Calculate the index of the desired percentile.
		const index = (p / 100) * (n - 1);

		// Find the lower and upper bounds of the index.
		const lower = Math.floor(index);
		const upper = Math.ceil(index);

		// If the lower and upper indices are the same, return the value at that index.
		if (lower === upper) return sorted[lower];

		// Otherwise, interpolate between the values at the lower and upper indices.
		return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
	};

	// Calculate the first quartile (Q1), median, and third quartile (Q3) percentiles.
	const q1 = percentile(25);
	const median = percentile(50);
	const q3 = percentile(75);

	// Calculate the Interquartile Range (IQR) as the difference between Q3 and Q1.
	const iqr = q3 - q1;

	// Calculate the minimum score, ensuring it is not lower than Q1 - 1.5 * IQR.
	// This ensures that we do not count extreme outliers as part of the "min".
	const min = Math.max(Math.min(...sorted), q1 - 1.5 * iqr);

	// Calculate the maximum score, ensuring it is not higher than Q3 + 1.5 * IQR.
	// This ensures that we do not count extreme outliers as part of the "max".
	const max = Math.min(Math.max(...sorted), q3 + 1.5 * iqr);

	// Identify any scores that are considered outliers, based on being lower than
	// Q1 - 1.5 * IQR or higher than Q3 + 1.5 * IQR.
	const outliers = sorted.filter(
		(score) => score < q1 - 1.5 * iqr || score > q3 + 1.5 * iqr,
	);

	return {
		min,
		q1,
		median,
		q3,
		max,
		outliers,
	};
};
