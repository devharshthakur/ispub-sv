<script lang="ts">
	import { goto } from '$app/navigation';
	import { Loader2, Search } from '@lucide/svelte';

	let searchQuery: string = $state('');
	let isSearching: boolean = $state(false);

	async function handleSearch() {
		if (!searchQuery.trim()) return;
		isSearching = true;
		await goto(`/search/${encodeURIComponent(searchQuery)}`);
		isSearching = false;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="w-full max-w-2xl space-y-8">
		<div class="text-center">
			<h1 class="text-5xl font-bold tracking-tight text-gray-700">Search Any npm package name</h1>
		</div>
	</div>

	<div class="mt-6">
		<div class="relative">
			<div class="">
				{#if isSearching}
					<h2>checking....</h2>
				{:else}
					<Search />
				{/if}
			</div>
		</div>
	</div>
</div>
