import { query } from '$app/server';
import { z } from 'zod';

export type SearchResult =
	| { status: 'available'; name: string }
	| { status: 'taken'; name: string; description: string | null; version: string | null; url: string }
	| { status: 'error'; name: string; message: string };

export const searchPackage = query(z.string(), async (name: string): Promise<SearchResult> => {
	try {
		const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`);

		if (res.status === 404) {
			return { status: 'available', name };
		}

		if (!res.ok) {
			return { status: 'error', name, message: `npm registry returned ${res.status}` };
		}

		const pkg = await res.json();
		const latest = pkg['dist-tags']?.latest;
		const desc: string | null = pkg.description ?? null;
		const version: string | null = latest ? (pkg.versions?.[latest]?.version ?? latest) : null;

		return {
			status: 'taken',
			name,
			description: desc,
			version,
			url: `https://www.npmjs.com/package/${encodeURIComponent(name)}`,
		};
	} catch (e) {
		return {
			status: 'error',
			name,
			message: e instanceof Error ? e.message : 'Network error',
		};
	}
});
