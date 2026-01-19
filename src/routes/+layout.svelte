<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import ModeToogle from '$lib/components/ModeToogle.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main>
	<ModeWatcher />
	<div class="fixed top-3 right-5">
		<ModeToogle />
	</div>
	{@render children()}
</main>
