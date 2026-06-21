import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	console.error(`[${errorId}] ${event.route?.id ?? 'unknown'} ${status}:`, error);

	return {
		message: message ?? 'An unexpected error occurred.',
		code: String(status),
		id: errorId,
	};
};
