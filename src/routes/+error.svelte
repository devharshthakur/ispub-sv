<script lang="ts">
	import { page } from '$app/state';
	import { TriangleAlert, Home } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let is404 = $derived(page.status === 404);
</script>

<main class="flex min-h-screen flex-col items-center justify-center px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<TriangleAlert class={is404 ? 'size-5 text-amber-500' : 'size-5 text-destructive'} />
				{is404 ? 'Page not found' : 'Server error'}
			</Card.Title>
			<Card.Description>Status {page.status}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-muted-foreground text-sm">
				{page.error?.message ?? 'An unexpected error occurred.'}
			</p>
		</Card.Content>
		<Card.Footer>
			<Button href="/" variant="outline" class="w-full">
				<Home class="mr-2" />
				Go home
			</Button>
		</Card.Footer>
	</Card.Root>
</main>
