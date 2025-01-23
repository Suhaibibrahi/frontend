module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{jpg,png,html,json}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};