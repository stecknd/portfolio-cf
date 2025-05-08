<script lang="ts">
	import { animate, stagger, utils } from 'animejs';
	import { type JSAnimation } from 'animejs';

	let { input, bin, currentSection } = $props();
	let characters = $derived(input.split(''));

	let animation: JSAnimation;

	$effect(() => {
		if (currentSection === 1) {
			document.querySelectorAll('.letter').forEach((el) => el.classList.remove('hidden'));
			animation = animate('.letter', {
				// @ts-ignore
				x: (element: HTMLElement) => {
					const screenCenterX = window.innerWidth / 2;
					const elementRect = element.getBoundingClientRect();
					const elementInitialX = elementRect.left + elementRect.width / 2; // Center of the letter

					return [screenCenterX - elementInitialX, 0]; // Animate from center to original x (offset 0)
				},
				y: { from: '-1000' },
				opacity: { from: 0 },
				delay: stagger(20, { ease: 'out(2)' })
			});
		} else if (animation) {
			animation.complete();
			document.querySelectorAll('.letter').forEach((el) => el.classList.add('hidden'));
		}
	});
</script>

<!-- Grid will flow naturally in the document layout -->
<div class="flex h-full w-full items-end justify-center bg-gray-700 text-white">
	<div class="my-10 grid w-full auto-rows-min grid-cols-[repeat(auto-fit,2rem)] gap-2 p-4 ml-60">
		{#each characters as char, i}
			<div
				class="letter flex items-center justify-center rounded bg-gradient-to-br from-violet-800/60 to-rose-600/60 p-2"
			>
				<p class="text-white">
					{char}
				</p>
			</div>
		{/each}
	</div>
</div>
