#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { htmlToText } from "html-to-text";
import { z } from "zod";
import { fetchBoards, fetchPosts, fetchThreads } from "./api.js";

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

server.tool(
	"fetchPosts",
	"Fetch posts from a 4chan thread",
	{
		board: z.string().describe("The board the thread is on, e.g., 'g' for /g/"),
		threadNo: z.number().describe("The thread number to fetch posts from"),
	},
	async ({ board, threadNo }) => {
		if (!board) {
			throw new Error("Parameter 'board' is required");
		}
		if (!threadNo) {
			throw new Error("Parameter 'threadNo' is required");
		}

		const posts = await fetchPosts(board, threadNo);

		const formattedPosts = posts
			.map((post) => `No.${post.no}\n${htmlToText(post.com ?? "(no comment)")}`)
			.join("\n\n");

		return {
			content: [
				{
					type: "text",
					text: `Fetched ${posts.length} posts from thread No.${threadNo} on /${board}/:\n\n${formattedPosts}`,
				},
			],
		};
	},
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("4chan MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
