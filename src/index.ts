import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { htmlToText } from "html-to-text";
import { z } from "zod";
import { fetchBoards, fetchThreads } from "./api";

const server = new McpServer({
	name: "4chan MCP Server",
	version: "0.1.0",
	capabilities: {
		resources: {},
		tools: {},
	},
});

server.tool("fetchBoards", "Fetch list of 4chan boards", async () => {
	const boards = await fetchBoards();

	const formattedBoards = boards
		.map((board) => `/${board.board}/ - ${board.title}`)
		.join("\n");

	return {
		content: [
			{
				type: "text",
				text: `Fetched ${boards.length} boards:\n${formattedBoards}`,
			},
		],
	};
});

server.tool(
	"fetchThreads",
	"Fetch threads from a 4chan board",
	{
		board: z
			.string()
			.describe("The board to fetch threads from, e.g., 'g' for /g/"),
	},
	async ({ board }) => {
		if (!board) {
			throw new Error("Parameter 'board' is required");
		}

		const threads = await fetchThreads(board);

		const formattedThreads = threads
			.map(
				(thread) =>
					`No.${thread.no} - ${thread.sub ?? "(no subject)"}\n${htmlToText(thread.com ?? "(no comment)")}`,
			)
			.join("\n\n");

		return {
			content: [
				{
					type: "text",
					text: `Fetched ${threads.length} threads from /${board}/:\n\n${formattedThreads}`,
				},
			],
		};
	},
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.log("4chan MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
