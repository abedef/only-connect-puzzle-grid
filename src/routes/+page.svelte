<script lang="ts">
	import type { PageData } from './$types';

	import type { Tile } from '$lib';
	import { TileState } from '$lib';
	import Logo from '$lib/logo.svelte';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
				  transform: ${transform} scale(${t});
				  opacity: ${t};
				`
			};
		}
	});

	export let data: PageData;

	/** The tiles that make up the puzzle grid. Words should be unique, and their
	 * quantity divisible by four. */
	let tiles: Tile[] = data.words.map((word) => ({ word, state: TileState.None, sort: 0 }));
	$: selected = tiles.filter((tile) => tile.state === TileState.Selected);
	$: validated = tiles.filter((tile) => tile.state === TileState.Validated);

	/** The number groups completed so far. */
	let completed = 0;

	/** TODO: Validation should happen server-side. */
	const selectionIsValid = () =>
		data.solutions.some(
			(solution) =>
				new Set(solution).difference(
					new Set(
						tiles.filter((tile) => tile.state === TileState.Selected).map((tile) => tile.word)
					)
				).size === 0
		);

	const handleSelection = (tile: Tile) => () => {
		switch (tile.state) {
			case TileState.None:
				tile.state = TileState.Selected;
				break;
			case TileState.Selected:
				tile.state = TileState.None;
				break;
		}

		if (tiles.filter((tile) => tile.state === TileState.Selected).length === 4) {
			if (selectionIsValid()) {
				completed++;
				tiles
					.filter((tile) => tile.state === TileState.Selected)
					.forEach((tile) => ([tile.state, tile.sort] = [TileState.Validated, completed]));
			} else {
				tiles
					.filter((tile) => tile.state === TileState.Selected)
					.forEach((tile) => (tile.state = TileState.Invalid));

				setTimeout(() => {
					tiles
						.filter((tile) => tile.state === TileState.Invalid)
						.forEach((tile) => (tile.state = TileState.None));
					tiles = [...tiles];
				}, 200);
			}
		}

		tiles = [...tiles];
	};
</script>

<div class="flex max-h-32 -translate-x-20 translate-y-6 justify-center">
	<div class="-translate-y-4 translate-x-20">
		<Logo />
	</div>
	<div class="flex flex-col justify-center">
		<h1 class="font-serif text-2xl leading-3 text-blue-300">Only</h1>
		<h1 class="font-serif text-2xl text-blue-700">Connect</h1>
		<h2 class="text-sm">Yousef Edition</h2>
	</div>
</div>

<div class="m-auto grid max-w-screen-md grid-cols-4 pt-8">
	{#each tiles
		.filter((tile) => tile.state === TileState.Validated)
		.sort((a, b) => a.sort - b.sort) as tile (tile.word)}
		<div
			class="m-1 rounded bg-green-700 py-8 text-center capitalize text-white hover:cursor-default md:text-xl"
			in:receive={{ key: tile.word }}
			out:send={{ key: tile.word }}
			animate:flip
		>
			{tile.word}
		</div>
	{/each}

	{#each tiles.filter((tile) => tile.state !== TileState.Validated) as tile (tile.word)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="m-1 rounded bg-blue-50 py-8 text-center capitalize hover:cursor-pointer md:text-xl"
			class:hover:bg-blue-100={tile.state === TileState.None}
			class:bg-sky-900={tile.state === TileState.Selected}
			class:text-white={tile.state === TileState.Selected}
			class:bg-red-900={tile.state === TileState.Invalid}
			in:receive={{ key: tile.word }}
			out:send={{ key: tile.word }}
			animate:flip
			on:click={handleSelection(tile)}
		>
			{tile.word}
		</div>
	{/each}
</div>
