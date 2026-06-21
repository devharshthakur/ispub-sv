<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TriangleAlert } from '@lucide/svelte';

	let is404 = $derived(page.status === 404);
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
	<TriangleAlert class={is404 ? 'size-14 text-amber-500' : 'size-16 text-destructive'} />
	<div class="space-y-2">
		<h1 class="text-2xl font-bold tracking-tight">
			{is404 ? 'Page not found' : 'Server error'}
		</h1>
		<p class="text-muted-foreground text-md">Status {page.status}</p>
		<p class="text-muted-foreground text-base max-w-md">
			{page.error?.message ?? 'An unexpected error occurred.'}
		</p>
	</div>
	<a
		href={resolve('/')}
		class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-10 py-2 text-lg font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-colors"
	>
		Go home
	</a>
</main>
