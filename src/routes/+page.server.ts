import { shuffle } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const words = shuffle([
		// Words that you could add "dead" before
		'beat',
		'ass',
		'weight',
		'on',

		// Greek letters with one letter changed
		'aloha',
		'bets',
		'pho',
		'gemma',

		// Words with ancient Egyptian gods in them
		'ramen',
		'reset',
		'anushka',
		'chorus',

		// Names that are words in the dictionary
		'rob',
		'dawn',
		'ray',
		'river'
	]);

	const solutions = [
		// Words that you could add "dead" before
		['beat', 'ass', 'weight', 'on'],
		// Greek letters with one letter changed
		['aloha', 'bets', 'pho', 'gemma'],
		// Words with ancient Egyptian gods in them
		['ramen', 'reset', 'anushka', 'chorus'],
		// Names that are words in the dictionary
		['rob', 'dawn', 'ray', 'river']
	];

	return { words, solutions };
}) satisfies PageServerLoad;
