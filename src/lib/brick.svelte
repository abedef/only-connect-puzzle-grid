<script lang="ts">
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

	export let word: string;

	export let selected = false;
	export let valid = false;
</script>

<div
	in:receive={{ key: word }}
	out:send={{ key: word }}
	animate:flip
	on:click
	class="m-1 rounded bg-blue-50 py-8 text-center capitalize hover:cursor-pointer hover:bg-blue-100 md:text-xl"
	class:bg-sky-900={selected}
	class:text-white={selected}
	class:bg-green-900={valid}
>
	{word}
</div>
