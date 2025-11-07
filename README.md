# chan-mcp-server

An unofficial MCP Server for 4chan.

## Tools

1. `fetchBoards`: Fetch list of 4chan boards
2. `fetchThreads`: Fetch threads from a 4chan board
3. `fetchPosts`: Fetch posts from a 4chan thread

## Usage

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "chan-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "chan-mcp-server"
      ]
    }
  }
}
```

## Development

### Prerequisites

Use [mise](https://github.com/jdx/mise) to install Node.js and pnpm (recommended):

```bash
mise install
```

### Debug

Use [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to debug the server:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```
