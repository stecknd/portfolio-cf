<script lang="ts">
    import { animate } from 'animejs'; // You can use this for visual flair on value changes or transitions

    // --- Svelte State ---
    let inputText = $state('');
    let animationFrames = $state<Sha1StepView[]>([]);
    let currentStepIndex = $state(0);
    let isHashing = $state(false); // To show a loading/processing state if needed

    // --- TypeScript Interfaces for Step Data ---
    interface Sha1StepView {
        stepTitle: string; // e.g., "Preprocessing: Convert to Binary", "Chunk 1: Round 5"
        description?: string; // More detailed explanation of the current step
        // Data fields for visualization (examples, expand as needed)
        inputString?: string;
        binaryRepresentation?: string; // formatted binary
        paddedMessage?: string; // formatted padded binary
        chunks?: string[]; // Array of 512-bit chunks (formatted)
        currentChunkIndex?: number;
        messageSchedule?: string[]; // W[0]...W[79] for current chunk (formatted)
        currentWordIndex?: number; // For W_t generation
        currentRound?: number; // 0-79
        kConstant?: string; // K_t for current round
        fFunctionResult?: string; // f_t(b,c,d) for current round
        // Working variables (a,b,c,d,e) - values at start/end of round
        a?: string; b?: string; c?: string; d?: string; e?: string;
        // Hash accumulators (H0,H1,H2,H3,H4) - values at start/end of chunk processing
        h0?: string; h1?: string; h2?: string; h3?: string; h4?: string;
        finalHash?: string;
        // Highlight keys: for dynamic styling of which part of data is "active"
        highlight?: {
            elementId: string; // ID of the DOM element to highlight
            type: 'value-change' | 'active-calculation';
        };
    }

    // --- SHA-1 Logic (Placeholder - This needs to be a detailed implementation) ---
    /**
     * Placeholder for the actual SHA-1 algorithm.
     * This function should:
     * 1. Take the input string.
     * 2. Perform SHA-1 step-by-step.
     * 3. For each significant step, create a Sha1StepView object and add it to a temporary array.
     * 4. Return the array of frames.
     *
     * Example of how it might be called from within your actual sha1.ts:
     * // inside sha1_step_by_step_generator(text):
     * //   frames.push({ stepTitle: "Initial Input", inputString: text });
     * //   ... perform conversion to binary ...
     * //   frames.push({ stepTitle: "To Binary", binaryRepresentation: binOutput, ... });
     * //   ...
     */
    function generateSha1AnimationFrames(text: string): Sha1StepView[] {
        // Simulate generating frames. Replace with actual SHA-1 logic.
        const frames: Sha1StepView[] = [];
        frames.push({ stepTitle: "1. Input Text", inputString: text, description: "The original text to be hashed." });

        // 1. Preprocessing: Convert to binary (UTF-8/ASCII)
        let binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        frames.push({ stepTitle: "2. To Binary (ASCII)", binaryRepresentation: binary, description: "Input text converted to its 8-bit binary representation (per character)." });

        // 2. Preprocessing: Append '1' bit
        let message = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(''); // unspaced binary
        const initialLength = message.length;
        message += '1';
        frames.push({ stepTitle: "3. Append '1' bit", paddedMessage: formatBinary(message, 8), description: "A single '1' bit is appended to the binary message." });

        // 3. Preprocessing: Pad with '0's until length is 448 mod 512
        // (L + 1 + K) % 512 == 448
        let k = 448 - (initialLength + 1) % 512;
        if (k < 0) k += 512;
        message += '0'.repeat(k);
        frames.push({ stepTitle: "4. Pad with '0's", paddedMessage: formatBinary(message, 32), description: `Padded with ${k} '0' bits until the message length is 448 (mod 512).` });

        // 4. Preprocessing: Append original message length (64-bit big-endian)
        const lengthBits = initialLength.toString(2).padStart(64, '0');
        message += lengthBits;
        frames.push({ stepTitle: "5. Append Length", paddedMessage: formatBinary(message, 32), description: `Appended the original message length (${initialLength} bits) as a 64-bit big-endian integer.` });

        // 5. Chunking (example for one chunk)
        const chunk = message.substring(0, 512); // First chunk
        frames.push({ stepTitle: "6. First 512-bit Chunk", chunks: [formatBinary(chunk, 32)], currentChunkIndex: 0, description: "The padded message is divided into 512-bit chunks." });

        // 6. Message Schedule (W_t) for first chunk (simplified)
        const words: string[] = [];
        for (let i = 0; i < 16; i++) {
            words.push(chunk.substring(i * 32, (i + 1) * 32));
        }
        frames.push({ stepTitle: "7. Initial 16 Words (W0-W15)", messageSchedule: words.map(w => formatBinary(w, 32)), currentChunkIndex: 0, description: "The first chunk is broken into sixteen 32-bit words."});
        // ... Simulate W_16 to W_79 generation (actual SHA-1 uses XORs and rotations)
        for (let t = 16; t < 80; t++) {
            words[t] = `(W${t-3} XOR W${t-8} XOR W${t-14} XOR W${t-16}) ROL 1`; // Symbolic representation
        }
        // frames.push({ stepTitle: "8. Extended Message Schedule (W0-W79)", messageSchedule: words.map(w => typeof w === 'string' ? w : formatBinary(w,32)), currentChunkIndex: 0 });


        // 7. Initialize Hash Variables for Chunk
        let H = ["0x67452301", "0xEFCDAB89", "0x98BADCFE", "0x10325476", "0xC3D2E1F0"];
        frames.push({
            stepTitle: "9. Initialize Hash Values (H0-H4)",
            h0: H[0], h1: H[1], h2: H[2], h3: H[3], h4: H[4],
            description: "Initial hash values for SHA-1."
        });


        // 8. Main Loop (80 rounds - highly simplified example)
        let [a,b,c,d,e] = H;
        for (let t = 0; t < 5; t++) { // Show first 5 pseudo-rounds for brevity
             // Actual f, K, W[t] would be used here
            const K_t_example = ["0x5A827999", "0x6ED9EBA1", "0x8F1BBCDC", "0xCA62C1D6"][Math.floor(t/20)];
            frames.push({
                stepTitle: `10. Round ${t + 1} (Example)`,
                currentChunkIndex: 0, currentRound: t,
                a,b,c,d,e,
                messageSchedule: words.map(w => typeof w === 'string' && w.startsWith('(') ? w : formatBinary(w,32)),
                currentWordIndex: t,
                kConstant: K_t_example,
                fFunctionResult: "f(B,C,D) example value",
                description: `Processing round ${t+1} of 80. Showing working variables a,b,c,d,e, current word W[${t}], and constant K[${Math.floor(t/20)}].`
            });
            // Simulate update of a,b,c,d,e
            const temp_a = e; e = d; d = c; c = b; b = a; a = temp_a; // simple shuffle for demo
        }

        frames.push({ stepTitle: "11. Update Main Hash (Example)", h0: a, h1:b, h2:c, h3:d, h4:e, description: "After 80 rounds, the working variables are added to the main H values (simplified)." });

        // 9. Final Hash
        frames.push({ stepTitle: "12. Final Hash (Example)", finalHash: "EXAMPLE73A32DB9182420A7FE25D8788038132B639FC4F", description: "The concatenation of the final H values forms the SHA-1 hash." });

        return frames;
    }

    // --- Event Handlers ---
    const processInputAndAnimate = () => {
        if (!inputText.trim()) {
            animationFrames = [{ stepTitle: "Input Empty", description: "Please enter text to hash." }];
            currentStepIndex = 0;
            return;
        }
        isHashing = true;
        // Simulate processing time for complex hashing
        setTimeout(() => {
            animationFrames = generateSha1AnimationFrames(inputText);
            currentStepIndex = 0; // Reset to the first step
            isHashing = false;
        }, 100); // Simulate async work or complex generation
    };

    // --- Derived State ---
    let currentFrame = $derived(animationFrames[currentStepIndex] || null);
    let maxSteps = $derived(animationFrames.length > 0 ? animationFrames.length - 1 : 0);

    // --- Helper for formatting binary/hex data for display ---
    function formatBinary(binString: string, groupSize = 8, lineLength = 32): string {
        if (!binString) return '';
        let formatted = '';
        for (let i = 0; i < binString.length; i += groupSize) {
            formatted += binString.substring(i, i + groupSize) + ' ';
            if ((i + groupSize) % lineLength === 0 && (i + groupSize) < binString.length) {
                formatted += '\n';
            }
        }
        return formatted.trim();
    }
     function formatHex(hexString: string, groupSize = 2, lineLength = 16): string {
        if (!hexString) return '';
        let formatted = '';
        for (let i = 0; i < hexString.length; i += groupSize) {
            formatted += hexString.substring(i, i + groupSize).toUpperCase() + ' ';
            if ((i + groupSize) % lineLength === 0 && (i + groupSize) < hexString.length) {
                formatted += '\n';
            }
        }
        return formatted.trim();
    }


    // --- Anime.js example (call this when a value changes to animate it) ---
    // e.g., when currentFrame.a changes, you might call:
    // animateValueChange('#register-a-display', new_a_value);
    function animateValueChange(targetSelector: string, newValue: string) {
        const targets = document.querySelector(targetSelector);
        if (targets) {
            // Example: flash background
            animate('targets', {
                backgroundColor: ['#FFFF00', '#FFFFFF'], // Flash yellow then back to white (or original)
                duration: 800,
                easing: 'easeInOutQuad'
            });
            // You might also update innerHTML here if not handled by Svelte's reactivity for the value itself
        }
    }

    // Reactive watcher for highlighting (Illustrative)
    $effect(() => {
        if (currentFrame?.highlight) {
            // This is conceptual. You'd need a more robust way to apply highlights.
            // E.g., add/remove classes, or use Anime.js for temporary highlights.
            console.log("Highlight requested for:", currentFrame.highlight.elementId, "Type:", currentFrame.highlight.type);
            // Example using Anime.js for a temporary highlight
            // animateValueChange(`#${currentFrame.highlight.elementId}`, ''); // Pass dummy value or handle differently
        }
    });

</script>

<main id="main" class="flex min-h-screen w-screen flex-col items-center justify-start bg-gray-950 p-4 text-white selection:bg-rose-500 selection:text-white">
    <div class="w-full max-w-3xl rounded-2xl bg-gradient-to-br from-violet-800 to-rose-600 p-[3px] shadow-xl mt-8">
        <section
            class="space-y-6 rounded-[calc(1rem-3px)] border border-white/10 bg-gray-950/60 p-6 text-center backdrop-blur-md sm:p-10"
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
                disabled={isHashing}
                class="w-full max-w-md rounded-md bg-gray-800/80 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
                onclick={processInputAndAnimate}
                disabled={isHashing}
                class="w-full max-w-md transform rounded-lg bg-gradient-to-r from-violet-700 to-rose-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:from-violet-600 hover:to-rose-500 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-950/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {#if isHashing}
                    Processing...
                {:else}
                    Visualize Hash Steps
                {/if}
            </button>
        </section>
    </div>

    {#if animationFrames.length > 0}
        <div class="mt-8 w-full max-w-4xl space-y-6 rounded-xl border border-white/10 bg-slate-800/30 p-6 shadow-lg backdrop-blur-md">
            <h2 class="text-2xl font-semibold text-violet-400">Animation Steps</h2>

            <div class="space-y-3">
                <div class="flex items-center justify-between text-sm text-slate-400">
                    <span>Step: {currentStepIndex + 1} / {maxSteps + 1}</span>
                    <span class="font-medium text-slate-200">{currentFrame?.stepTitle || 'N/A'}</span>
                </div>
                <input
                    type="range"
                    bind:value={currentStepIndex}
                    min="0"
                    max={maxSteps}
                    disabled={isHashing}
                    class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50"
                />
                <div class="flex justify-between">
                    <button
                        onclick={() => currentStepIndex = Math.max(0, currentStepIndex - 1)}
                        disabled={currentStepIndex === 0 || isHashing}
                        class="rounded-md bg-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onclick={() => currentStepIndex = Math.min(maxSteps, currentStepIndex + 1)}
                        disabled={currentStepIndex === maxSteps || isHashing}
                        class="rounded-md bg-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {#if currentFrame}
                <div class="mt-6 space-y-4 rounded-lg bg-gray-950/50 p-6 border border-gray-700/50 min-h-[200px] text-left">
                    <h3 class="text-xl font-semibold text-rose-400">{currentFrame.stepTitle}</h3>
                    {#if currentFrame.description}
                        <p class="text-sm text-slate-300 italic">{currentFrame.description}</p>
                    {/if}

                    {#if currentFrame.inputString !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Input String:</strong>
                            <pre class="whitespace-pre-wrap break-all rounded bg-slate-900 p-2 text-sm text-sky-300">{currentFrame.inputString}</pre>
                        </div>
                    {/if}
                    {#if currentFrame.binaryRepresentation !== undefined}
                         <div class="data-block">
                            <strong class="text-slate-400">Binary Representation:</strong>
                            <pre class="whitespace-pre-wrap break-all rounded bg-slate-900 p-2 text-sm text-sky-300">{currentFrame.binaryRepresentation}</pre>
                        </div>
                    {/if}
                    {#if currentFrame.paddedMessage !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Padded Message (Binary):</strong>
                            <pre class="whitespace-pre-wrap break-all rounded bg-slate-900 p-2 text-sm text-sky-300">{currentFrame.paddedMessage}</pre>
                        </div>
                    {/if}
                     {#if currentFrame.chunks !== undefined && currentFrame.currentChunkIndex !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Chunk {currentFrame.currentChunkIndex + 1}:</strong>
                            <pre class="whitespace-pre-wrap break-all rounded bg-slate-900 p-2 text-sm text-sky-300">{currentFrame.chunks[currentFrame.currentChunkIndex]}</pre>
                        </div>
                    {/if}
                    {#if currentFrame.messageSchedule !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Message Schedule (W<sub>t</sub> for current chunk{currentFrame.currentWordIndex !== undefined ? ` - Current W[${currentFrame.currentWordIndex}]` : ''}):</strong>
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                                {#each currentFrame.messageSchedule as word, i}
                                    <pre class="whitespace-pre break-all rounded {currentFrame.currentWordIndex === i ? 'bg-rose-500/30 ring-1 ring-rose-400' : 'bg-slate-900'} p-1 text-xs text-sky-300">W{i.toString().padStart(2,'0')}: {word.length > 20 ? word.substring(0,17)+'...' : word}</pre>
                                {/each}
                            </div>
                        </div>
                    {/if}
                    {#if currentFrame.currentRound !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Current Round: {currentFrame.currentRound + 1} / 80</strong>
                            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 text-sm mt-2">
                                {#if currentFrame.a !== undefined}<div id="reg-a"><span class="text-slate-500">A:</span> <span class="text-amber-300">{currentFrame.a}</span></div>{/if}
                                {#if currentFrame.b !== undefined}<div id="reg-b"><span class="text-slate-500">B:</span> <span class="text-amber-300">{currentFrame.b}</span></div>{/if}
                                {#if currentFrame.c !== undefined}<div id="reg-c"><span class="text-slate-500">C:</span> <span class="text-amber-300">{currentFrame.c}</span></div>{/if}
                                {#if currentFrame.d !== undefined}<div id="reg-d"><span class="text-slate-500">D:</span> <span class="text-amber-300">{currentFrame.d}</span></div>{/if}
                                {#if currentFrame.e !== undefined}<div id="reg-e"><span class="text-slate-500">E:</span> <span class="text-amber-300">{currentFrame.e}</span></div>{/if}
                                {#if currentFrame.kConstant !== undefined}<div><span class="text-slate-500">K<sub>t</sub>:</span> <span class="text-teal-300">{currentFrame.kConstant}</span></div>{/if}
                                {#if currentFrame.fFunctionResult !== undefined}<div><span class="text-slate-500">f<sub>t</sub>:</span> <span class="text-lime-300">{currentFrame.fFunctionResult}</span></div>{/if}
                            </div>
                        </div>
                    {/if}
                     {#if currentFrame.h0 !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Hash Accumulators (H<sub>0</sub>-H<sub>4</sub>):</strong>
                             <div class="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-5 text-sm mt-2">
                                <div><span class="text-slate-500">H0:</span> <span class="text-emerald-300">{currentFrame.h0}</span></div>
                                <div><span class="text-slate-500">H1:</span> <span class="text-emerald-300">{currentFrame.h1}</span></div>
                                <div><span class="text-slate-500">H2:</span> <span class="text-emerald-300">{currentFrame.h2}</span></div>
                                <div><span class="text-slate-500">H3:</span> <span class="text-emerald-300">{currentFrame.h3}</span></div>
                                <div><span class="text-slate-500">H4:</span> <span class="text-emerald-300">{currentFrame.h4}</span></div>
                            </div>
                        </div>
                    {/if}
                    {#if currentFrame.finalHash !== undefined}
                        <div class="data-block">
                            <strong class="text-slate-400">Final SHA-1 Hash:</strong>
                            <pre class="whitespace-pre-wrap break-all rounded bg-green-900/50 p-3 text-lg font-mono text-green-300 ring-1 ring-green-500">{formatHex(currentFrame.finalHash, 8)}</pre>
                        </div>
                    {/if}

                </div>
            {:else if isHashing}
                 <div class="mt-6 flex items-center justify-center rounded-lg bg-gray-950/50 p-6 border border-gray-700/50 min-h-[200px]">
                    <p class="text-xl text-slate-400">Generating animation frames...</p>
                </div>
            {/if}
        </div>
    {/if}
    <footer class="p-8 text-center text-xs text-slate-500">
        SHA-1 Visualizer | Note: SHA-1 is considered cryptographically insecure for many applications. This tool is for educational purposes.
    </footer>
</main>