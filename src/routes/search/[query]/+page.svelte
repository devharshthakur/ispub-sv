<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { XCircle, CheckCircle2 } from '@lucide/svelte';
	import { searchPackage } from '../search.remote';

	const packageName = page.params.query;
	const searchResult = searchPackage(packageName!);
</script>

<main class="bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
	<div class="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 py-16 text-center">
		{#await searchResult}
			<section class="flex items-center justify-center">
				<p class="text-sm text-neutral-500 dark:text-neutral-400">Checking registry…</p>
			</section>
		{:then result}
			<section class="grid gap-8">
				<div class="flex flex-col items-center gap-6">
					<div class="flex items-center justify-center gap-4">
						{#if result.isAvailable === false}
							<div class="flex h-12 w-12 items-center justify-center text-emerald-600 dark:text-emerald-300">
								<CheckCircle2 size={28} />
							</div>
							<div class="text-left">
								<p class="text-2xl font-medium text-emerald-600 dark:text-emerald-300">Available</p>
								<h2 class="text-2xl font-semibold tracking-tight">Ready to claim</h2>
								<p class="text-sm text-neutral-600 dark:text-neutral-300">This name is free on npm.</p>
							</div>
						{:else if result.isAvailable === true}
							<div class="flex h-12 w-12 items-center justify-center text-rose-600 dark:text-rose-300">
								<XCircle size={28} />
							</div>
							<div class="text-left">
								<p class="text-sm font-medium text-rose-600 dark:text-rose-300">Already taken</p>
								<h2 class="text-2xl font-semibold tracking-tight">Registered on npm</h2>
								<p class="text-sm text-neutral-600 dark:text-neutral-300">Pick a variant or see details.</p>
							</div>
						{:else}
							<div class="flex h-12 w-12 items-center justify-center text-neutral-500 dark:text-neutral-400">
								<XCircle size={28} />
							</div>
							<div class="text-left">
								<p class="text-sm font-medium text-neutral-600 dark:text-neutral-300">Not available</p>
								<h2 class="text-2xl font-semibold tracking-tight">Status unknown</h2>
								<p class="text-sm text-neutral-600 dark:text-neutral-300">We couldn't verify this name right now.</p>
							</div>
						{/if}
					</div>
					<div class="flex flex-wrap items-center justify-center gap-3">
						{#if result.nodeUrl}
							<a
								href={result.nodeUrl}
								target="_blank"
								rel="external noopener noreferrer"
								class="inline-flex items-center justify-center rounded-md border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
							>
								View on npm
							</a>
							<button
								onclick={() => goto(resolve('/'))}
								class="inline-flex items-center justify-center rounded-md border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
							>
								Search another
							</button>
						{/if}
					</div>
				</div>
			</section>
		{:catch error}
			<section class="flex flex-col items-center justify-center gap-6">
				<div class="flex flex-col items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center text-rose-600 dark:text-rose-300">
						<XCircle size={28} />
					</div>
					<div>
						<h2 class="text-2xl font-semibold tracking-tight">Something went wrong</h2>
						<p class="text-sm text-neutral-600 dark:text-neutral-300">
							{error instanceof Error ? error.message : 'An error occurred'}
						</p>
					</div>
				</div>
				<button
					onclick={() => goto(resolve('/'))}
					class="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
				>
					Try again
				</button>
			</section>
		{/await}
	</div>
</main>
