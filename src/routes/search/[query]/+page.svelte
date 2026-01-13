<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { XCircle, CheckCircle } from '@lucide/svelte';
	import { searchPackage } from '../search.remote';
	import LoadingSpinner from './LoadingSpinner.svelte';

	const packageName = page.params.query;
	const searchResult = searchPackage(packageName!);
</script>

<main class="flex min-h-screen items-center justify-center bg-white">
	<div class="mx-auto w-full max-w-2xl px-6 py-12">
		{#await searchResult}
			<section class="flex flex-col items-center justify-center space-y-4">
				<LoadingSpinner size="16" />
				<p class="text-sm text-gray-500">Checking registry…</p>
			</section>
		{:then result}
			<section class="flex flex-col items-center justify-center space-y-8">
				<div class="flex flex-col items-center gap-3 text-center">
					{#if result.isAvailable}
						<XCircle size={28} class="text-red-500" />
						<div class="space-y-2">
							<h1 class="text-3xl font-semibold tracking-tight text-gray-900">Already taken</h1>
							<p class="text-gray-600">
								<span class="font-medium text-gray-900">{packageName}</span> is registered on npm.
							</p>
						</div>
					{:else}
						<CheckCircle size={28} class="text-green-600" />
						<div class="space-y-2">
							<h1 class="text-3xl font-semibold tracking-tight text-gray-900">Available</h1>
							<p class="text-gray-600">
								<span class="font-medium text-gray-900">{packageName}</span> looks free to claim.
							</p>
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-3">
					{#if result.isAvailable && result.nodeUrl}
						<a
							href={result.nodeUrl}
							target="_blank"
							rel="external noopener noreferrer"
							class="rounded-md border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
						>
							View on npm
						</a>
					{/if}

					<button
						onclick={() => goto(resolve('/'))}
						class="rounded-md border border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100"
					>
						Search another
					</button>
				</div>
			</section>
		{:catch error}
			<section class="flex flex-col items-center justify-center space-y-8">
				<div class="flex flex-col items-center gap-3 text-center">
					<XCircle size={28} class="text-red-500" />
					<div class="space-y-2">
						<h1 class="text-3xl font-semibold tracking-tight text-gray-900">Something went wrong</h1>
						<p class="text-gray-600">
							{error instanceof Error ? error.message : 'An error occurred'}
						</p>
					</div>
				</div>

				<button
					onclick={() => goto(resolve('/'))}
					class="rounded-md border border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100"
				>
					Try again
				</button>
			</section>
		{/await}
	</div>
</main>
