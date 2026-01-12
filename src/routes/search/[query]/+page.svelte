<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { XCircle, CheckCircle } from '@lucide/svelte';
	import { searchPackage } from '../search.remote';

	const packageName = page.params.query;
	const searchResult = searchPackage(packageName!);
</script>

<main class="flex min-h-screen items-center justify-center bg-white">
	<div class="mx-auto w-full max-w-2xl px-6 py-12">
		{#await searchResult}
			<section class="space-y-3">
				<p class="text-sm text-gray-500">Checking registry…</p>
				<div class="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
					<div class="h-full w-1/2 animate-pulse rounded-full bg-gray-300"></div>
				</div>
			</section>
		{:then result}
			<section class="flex flex-wrap items-start justify-between gap-6">
				{#if result.isAvailable}
					<div class="flex min-w-[16rem] flex-1 items-start gap-3">
						<XCircle size={22} class="mt-0.5 text-red-500" />
						<div class="space-y-1">
							<h1 class="text-2xl font-semibold tracking-tight text-gray-900">Already taken</h1>
							<p class="text-gray-600">
								<span class="font-medium text-gray-900">{packageName}</span> is registered on npm.
							</p>
						</div>
					</div>
				{:else}
					<div class="flex min-w-[16rem] flex-1 items-start gap-3">
						<CheckCircle size={22} class="mt-0.5 text-green-600" />
						<div class="space-y-1">
							<h1 class="text-2xl font-semibold tracking-tight text-gray-900">Available</h1>
							<p class="text-gray-600">
								<span class="font-medium text-gray-900">{packageName}</span> looks free to claim.
							</p>
						</div>
					</div>
				{/if}

				<div class="flex flex-wrap items-center justify-end gap-3">
					{#if result.isAvailable && result.nodeUrl}
						<a
							href={result.nodeUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
						>
							View on npm
						</a>
					{/if}

					<button
						onclick={() => goto('/')}
						class="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100"
					>
						Search another
					</button>
				</div>
			</section>
		{:catch error}
			<section class="flex flex-wrap items-start justify-between gap-6">
				<div class="flex min-w-[16rem] flex-1 items-start gap-3">
					<XCircle size={22} class="mt-0.5 text-red-500" />
					<div class="space-y-1">
						<h1 class="text-2xl font-semibold tracking-tight text-gray-900">Something went wrong</h1>
						<p class="text-gray-600">
							{error instanceof Error ? error.message : 'An error occurred'}
						</p>
					</div>
				</div>

				<div class="flex justify-end">
					<button
						onclick={() => goto('/')}
						class="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100"
					>
						Try again
					</button>
				</div>
			</section>
		{/await}
	</div>
</main>
