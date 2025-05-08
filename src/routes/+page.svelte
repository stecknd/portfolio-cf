<script lang="ts">
	import { onMount } from 'svelte';
	import { setupScrollSnapping, scrollToNextSection } from '$lib/scroll';
	import { stringToBinary } from '$lib/sha1';

	import Section1 from './Section1.svelte';
	import Section2 from './Section2.svelte';
	import Section3 from './Section3.svelte';

	let scrollContainer: HTMLElement;
	let sections: HTMLElement[] = [];
	let currentSection: number = $state(0);

	let inputText = $state('');
	let inputBin = $derived(stringToBinary(inputText));

	onMount(() => {
		setupScrollSnapping(scrollContainer, (i) => (currentSection = i));
	});
</script>

<div bind:this={scrollContainer} class="h-screen overflow-x-hidden overflow-y-auto">
	<section bind:this={sections[0]} id="section-1" class="h-screen w-screen">
		<Section1
			bind:inputText
			nextSection={() => scrollToNextSection(scrollContainer, currentSection)}
		/>
	</section>

	<section bind:this={sections[1]} id="section-2" class="h-screen w-screen">
		<Section2 input={inputText} bin={inputBin} currentSection={currentSection}/>
	</section>

	<section bind:this={sections[2]} id="section-3" class="h-screen w-screen">
		<Section3 />
	</section>
</div>

<p class="fixed bottom-4 left-4 z-50 rounded-lg bg-black/50 px-4 py-2 text-sm text-white">
	Snapped to Section: {currentSection}
</p>
