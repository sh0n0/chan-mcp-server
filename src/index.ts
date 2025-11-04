import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fetchBoards } from "./api";

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

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.log("4chan MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
