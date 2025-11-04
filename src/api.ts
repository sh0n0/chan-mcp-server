interface Board {
	board: string;
	title: string;
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

export { fetchBoards };
