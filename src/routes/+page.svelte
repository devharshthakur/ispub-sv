<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import type { SearchResult } from './search.remote';
	import { searchPackage as searchNpm } from './search.remote';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils.js';
	import { badgeVariants } from '$lib/components/ui/badge/index.js';
	import SearchResultCard from '$lib/components/SearchResult.svelte';

	const SUGGESTIONS = ['svelte', 'vite', 'lodash', 'zod', 'prisma'] as const;

	let query = $state('');
	let result = $state<SearchResult | null>(null);
	let searching = $state<Promise<SearchResult> | null>(null);

	let hasQuery = $derived(query.trim().length > 0);
	let canSearch = $derived(hasQuery && searching === null);
	let idle = $derived(!result && !searching);

	function searchPackage(name: string) {
		const trimmed = name.trim();
		if (!trimmed) return;
		query = trimmed;
		const promise = searchNpm(trimmed);
		searching = promise;
		promise.then((r) => {
			result = r;
			searching = null;
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && canSearch) searchPackage(query);
	}
</script>

<main
	class="flex min-h-screen flex-col items-center px-4 transition-all duration-300"
	class:pt-48={idle}
	class:pt-12={!idle}
	class:pb-16={!idle}
>
	<div class="flex w-full max-w-xl flex-col items-center">
		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">ispub</h1>
		<p class="mt-3 text-base text-muted-foreground sm:text-lg">Check if an npm package name is available</p>

		<div class="relative mt-4 w-full">
			<Search class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				bind:value={query}
				placeholder="package name"
				onkeydown={handleKeydown}
				class="h-14 rounded-2xl bg-background pl-12 pr-24 text-lg shadow-sm transition-shadow focus-within:shadow-md"
			/>
			<Button
				onclick={() => searchPackage(query)}
				disabled={!canSearch}
				size="lg"
				variant="default"
				type="submit"
				class="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-4"
			>
				Search
			</Button>
		</div>

		{#if idle}
			<nav class="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Try searching for">
				<span class="text-xs text-muted-foreground/50">Try</span>
				{#each SUGGESTIONS as name (name)}
					<button
						type="button"
						onclick={() => searchPackage(name)}
						class={cn(
							badgeVariants({ variant: 'outline' }),
							'cursor-pointer px-3.5 py-1.5 text-xs transition-colors hover:bg-muted',
						)}
					>
						{name}
					</button>
				{/each}
			</nav>
		{/if}
	</div>

	<SearchResultCard searching={!!searching} {result} onsearch={searchPackage} class="mt-8" />
</main>
