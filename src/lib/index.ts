/**
 * Shuffles a collection in place using the Fisher-Yates algorithm.
 * This function modifies the original collection and returns the shuffled version.
 *
 * @template T - The type of elements in the collection.
 * @param {T[]} collection - The collection to be shuffled.
 * @returns {T[]} The shuffled collection.
 *
 * @example
 * const myList = [1, 2, 3, 4, 5];
 * const shuffledList = shuffle(myList);
 * console.log(shuffledList); // e.g., [3, 1, 5, 4, 2]
 */
export function shuffle<T>(collection: T[]): T[] {
	for (let i = collection.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[collection[i], collection[j]] = [collection[j], collection[i]];
	}
	return collection;
}

export enum TileState {
	None,
	Selected,
	Validated,
	Invalid
}

export interface Tile {
	word: string;
	state: TileState;
	sort: number;
}
