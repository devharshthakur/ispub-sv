<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	interface Props {
		src: string;
		class?: string;
		size?: number;
		title?: string;
		[x: string]: unknown;
	}

	let { src, class: className = '', size, title, ...restProps }: Props = $props();

	// Strip explicit width/height from SVG so it scales to its container.
	// Uses DOMParser to handle the SVG as a real DOM — no regex edge cases.
	function normalizeSvg(raw: string): string {
		try {
			const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
			const svg = doc.documentElement;
			if (svg.tagName !== 'svg') return raw; // parse error fallback
			svg.removeAttribute('width');
			svg.removeAttribute('height');
			return new XMLSerializer().serializeToString(svg);
		} catch {
			return raw; // malformed input fallback
		}
	}

	let processedSrc = $derived(normalizeSvg(src));
</script>

{#if title}
	<span role="img" aria-label={title} class={`svg-icon ${className}`} style={size ? `--svg-icon-size:${size}px` : ''} {...restProps}>
		{@html processedSrc}
	</span>
{:else}
	<span aria-hidden="true" class={`svg-icon ${className}`} style={size ? `--svg-icon-size:${size}px` : ''} {...restProps}>
		{@html processedSrc}
	</span>
{/if}

<style>
	.svg-icon {
		display: inline-flex;
		width: var(--svg-icon-size, auto);
		height: var(--svg-icon-size, auto);
	}

	:global(.svg-icon > svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
