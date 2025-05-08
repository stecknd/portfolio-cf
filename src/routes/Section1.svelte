<script lang="ts">
    let { inputText = $bindable(), nextSection} = $props();
</script>

<div class="flex h-full w-full items-center justify-center bg-gray-800 p-4 text-white selection:bg-rose-500 selection:text-white">
    <div
        class="mt-8 w-full max-w-3xl rounded-2xl bg-gradient-to-br from-violet-800 to-rose-600 p-[3px] shadow-xl"
    >
        <div class="space-y-6 rounded-[calc(1rem-3px)] border border-white/10 bg-gray-800/60 p-6 text-center backdrop-blur-md sm:p-10"
        >
            <h1
                class="bg-gradient-to-r from-violet-800 to-rose-600 bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl"
            >
                SHA-1 Interactive Visualizer
            </h1>
            <input
                type="text"
                placeholder="Enter text to hash..."
                bind:value={inputText}
                class="w-full max-w-md rounded-md bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            <button
                class="w-full max-w-md transform rounded-lg bg-gradient-to-r from-violet-700 to-rose-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-violet-600 hover:to-rose-500 hover:shadow-lg focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-800/80 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
				onclick = {nextSection}
            >
                Visualize Hash Steps
            </button>
        </div>
    </div>
</div>