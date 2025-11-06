interface Board {
	board: string;
	title: string;
}

interface Thread {
	no: number;
	sub?: string;
	com?: string;
}

interface CatalogPage {
	page: number;
	threads: Thread[];
}

async function fetchBoards() {
	const response = await fetch("https://a.4cdn.org/boards.json");
	if (!response.ok) {
		throw new Error(
			`Failed to fetch boards: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.boards as Board[];
}

async function fetchThreads(board: string) {
	const response = await fetch(`https://a.4cdn.org/${board}/catalog.json`);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch threads for board ${board}: ${response.status} ${response.statusText}`,
		);
	}
	const data: CatalogPage[] = await response.json();
	const threads = data.flatMap((page) => page.threads);
	return threads;
}

export { fetchBoards, fetchThreads };
