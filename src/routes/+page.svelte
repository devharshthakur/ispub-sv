<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
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

<main class="flex min-h-screen items-center justify-center bg-white">
	<div class="mx-auto max-w-2xl px-6 text-center">
		<header class="space-y-3">
			<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Check npm package availability</h1>
			<p class="text-base text-gray-600">Type a package name and jump straight to the result.</p>
		</header>

		<section class="mt-10">
			<label class="sr-only" for="package"> Package name </label>

			<div class="flex items-center gap-2">
				<input
					id="package"
					type="text"
					bind:value={searchQuery}
					placeholder="e.g. svelte, vite, lodash"
					onkeydown={handleKeydown}
					class="h-11 w-full flex-1 rounded-md border border-gray-200 px-4 text-gray-900 shadow-sm ring-0 outline-none placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
				/>

				<button
					onclick={handleSearch}
					disabled={isSearching || !searchQuery.trim()}
					class="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
					aria-label="Search"
				>
					<Search size={18} />
				</button>
			</div>
		</section>
	</div>
</main>
9
