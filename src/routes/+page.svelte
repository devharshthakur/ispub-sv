<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { fly } from 'svelte/transition';
	import { Search, CircleCheckBig, CircleX, Copy, ExternalLink } from '@lucide/svelte';
	import type { SearchResult } from './search.remote';
	import { searchPackage } from './search.remote';
	import { cn } from '$lib/utils.js';
	import { badgeVariants } from '$lib/components/ui/badge/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const SUGGESTIONS = ['svelte', 'vite', 'lodash', 'zod', 'prisma'] as const;
	let query = $state('');
	let result = $state<SearchResult | null>(null);
	let searching = $state<Promise<SearchResult> | null>(null);
	let copied = $state(false);

	let hasQuery = $derived(query.trim().length > 0);
	let canSearch = $derived(hasQuery && searching === null);
	let idle = $derived(!result && !searching);

	function doSearch(name: string) {
		const trimmed = name.trim();
		if (!trimmed) return;
		query = trimmed;
		const promise = searchPackage(trimmed);
		searching = promise;
		promise.then((r) => {
			result = r;
			searching = null;
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && canSearch) doSearch(query);
	}

	async function handleCopy(command: string) {
		try {
			await navigator.clipboard.writeText(command);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* clipboard denied */
		}
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

		<div class="relative mt-10 w-full">
			<Search class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				bind:value={query}
				placeholder="package name"
				onkeydown={handleKeydown}
				class="h-14 rounded-2xl bg-background pl-12 pr-24 text-lg shadow-sm transition-shadow focus-within:shadow-md"
			/>
			<Button
				onclick={() => doSearch(query)}
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
						onclick={() => doSearch(name)}
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

	{#if searching}
		<div class="mt-14 w-full max-w-xl" in:fly={{ y: 24, duration: 300 }}>
			<div class="animate-pulse rounded-2xl border border-border bg-card p-6">
				<div class="space-y-3.5">
					<div class="h-4 w-20 rounded-md bg-muted"></div>
					<div class="h-8 w-52 rounded-md bg-muted"></div>
					<div class="h-4 w-72 rounded-md bg-muted"></div>
				</div>
			</div>
		</div>
	{:else if result}
		{const c = result}
		<div class="mt-14 w-full max-w-xl" in:fly={{ y: 24, duration: 300 }}>
			{#if c.status === 'available'}
				<div
					class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 dark:border-emerald-900 dark:bg-emerald-950/30"
				>
					<div class="flex items-start gap-5">
						<CircleCheckBig class="mt-0.5 size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
						<div class="min-w-0 flex-1 space-y-4">
							<div>
								<p class="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
									Available
								</p>
								<p class="mt-1 text-2xl font-bold tracking-tight break-all">{c.name}</p>
								<p class="mt-1 text-sm text-muted-foreground">Free on npm. Claim it before someone else does.</p>
							</div>
							<div
								class="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm break-all"
							>
								<code class="flex-1">npm init {c.name}</code>
								<button
									onclick={() => handleCopy(`npm init ${c.name}`)}
									class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
									aria-label="Copy command"
								>
									{#if copied}
										<CircleCheckBig class="size-4 text-emerald-600" />
									{:else}
										<Copy class="size-4" />
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>
			{:else if c.status === 'taken'}
				<div class="rounded-2xl border border-border bg-card p-8">
					<div class="flex items-start gap-5">
						<CircleX class="mt-0.5 size-6 shrink-0 text-rose-500 dark:text-rose-400" />
						<div class="min-w-0 flex-1 space-y-4">
							<div>
								<p class="text-sm font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
									Already taken
								</p>
								<p class="mt-1 text-2xl font-bold tracking-tight break-all">{c.name}</p>
								{#if c.version}
									<p class="mt-1 text-xs text-muted-foreground">latest v{c.version}</p>
								{/if}
							</div>
							{#if c.description}
								<p class="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
							{/if}
							<a
								href={c.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 rounded-xl bg-muted px-5 py-2.5 text-sm font-medium transition hover:bg-muted/80"
							>
								View on npm
								<ExternalLink class="size-3.5" />
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
					<div class="flex items-start gap-5">
						<CircleX class="mt-0.5 size-6 shrink-0 text-destructive" />
						<div class="space-y-3">
							<p class="text-sm font-semibold text-destructive">Something went wrong</p>
							<p class="text-sm text-muted-foreground">{c.message}</p>
							<button
								onclick={() => doSearch(c.name)}
								class="inline-flex items-center rounded-xl bg-muted px-5 py-2.5 text-sm font-medium transition hover:bg-muted/80"
							>
								Retry
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</main>
