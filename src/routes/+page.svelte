<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import SVGIcon from '$lib/components/svg/SVGIcon.svelte';
	import npmSvg from '$lib/components/svg/npm.svg?raw';
	import { Search } from '@lucide/svelte';

	let searchQuery: string = $state('');
	let isSearching: boolean = $state(false);

	async function handleSearch() {
		if (!searchQuery.trim()) return;
		isSearching = true;
		await goto(resolve(`/search/${encodeURIComponent(searchQuery)}`));
		isSearching = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		// On pressing enter do search operation
		if (e.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center pt-72 px-4 text-center">
	<header class="space-y-4">
		<div
			class="mx-auto flex w-fit items-center gap-3 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
		>
			<div
				class="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700"
			>
				<SVGIcon src={npmSvg} />
			</div>
			<span class="text-xs font-semibold tracking-wide uppercase">registry</span>
		</div>
		<h1 class="text-3xl font-semibold tracking-tight sm:text-5xl">Check npm package availability</h1>
		<p class="text-base text-neutral-600 dark:text-neutral-300">Type a package name and jump straight to the result.</p>
	</header>
	<section class="mt-8 w-full max-w-xl">
		<label class="sr-only" for="package">Package name</label>
		<div class="flex w-full items-center gap-3">
			<Input
				id="package"
				type="text"
				bind:value={searchQuery}
				placeholder="e.g. svelte, vite, lodash"
				onkeydown={handleKeydown}
				class="bg-white text-neutral-900 py-5 px-6 dark:bg-neutral-900 dark:text-neutral-100"
			/>
			<Button
				onclick={handleSearch}
				disabled={isSearching || !searchQuery.trim()}
				class="rounded-md py-5 px-5 border-neutral-200 bg-neutral-100 text-neutral-700 shadow-sm hover:bg-neutral-200 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
				aria-label="Search"
				size="icon"
			>
				<Search size={24} />
			</Button>
		</div>
	</section>
</main>
