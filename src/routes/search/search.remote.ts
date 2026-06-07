import { query } from '$app/server';
import { z } from 'zod';

export type SearchResult = {
	isAvailable: boolean;
	nodeUrl: string | null;
};

export const searchPackage = query(z.string(), async (packageName: string): Promise<SearchResult> => {
	try {
		const apiUrl = `https://registry.npmjs.org/${packageName}`;
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			return {
				isAvailable: false,
				nodeUrl: null
			};
		} else {
			return {
				isAvailable: true,
				nodeUrl: `https://www.npmjs.com/package/${packageName}`
			};
		}
	} catch (error) {
		console.error('Api request error:', error);
		throw new Error('Failed to fetch search results', { cause: error });
	}
});
