<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import ModeToogle from '$lib/components/ModeToogle.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" href="/fonts/GeistMono-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>
<main>
	<ModeWatcher />
	<div class="fixed top-3 right-5">
		<ModeToogle />
	</div>
	{@render children()}
</main>
