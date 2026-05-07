# Saturday.ai

Local-first AI agent desktop. VS Code-inspired layout. Built to extend.

## What it is

| App | Description | Port |
|---|---|---|
| `apps/desktop` | Electron + React + Vite + Tailwind UI | 5173 (renderer) |
| `apps/api` | FastAPI backend with mock workflow engine | 8000 |
| `packages/shared` | Shared TypeScript types only | — |

## Setup

### 1. Install JS dependencies

```bash
npm install
```

### 2. Set up Python environment

```bash
cd apps/api

python -m venv .venv
```

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

```bash
pip install -e .
cd ../..
```

### 3. Run everything

With the Python venv active:

```bash
npm run dev
```

This starts:
- Vite dev server on `http://localhost:5173`
- Electron (loads the renderer after Vite is ready)
- FastAPI on `http://localhost:8000`

## Layout

```
+------+-----------+------------------+----------+
| Side |   Chat    |    Workflow      |  System  |
| bar  |   Panel   |    Panel         |  Dashboard|
+------+-----------+------------------+----------+
```

- **Sidebar** — icon rail (placeholder buttons)
- **Chat** — send messages to the API, see responses
- **Workflow** — inspect plan/retrieve/draft/finalize nodes and logs
- **System** — live CPU, RAM, GPU metrics via Electron IPC

## Extending with LangGraph + Ollama

Start here:

**`apps/api/app/workflow.py`** — the mock engine with `TODO` comments marking exactly where to plug in:

1. Replace `mock_outputs` with real Ollama calls (`ollama` Python SDK or HTTP)
2. Replace the sequential loop with a `LangGraph` `StateGraph`
3. Wire RAG into the `retrieve` node

Once the API streams real responses, update **`apps/desktop/src/components/ChatPanel.tsx`** to use an `EventSource` instead of a one-shot `fetch`.

## API routes

```
GET  /health
POST /chat                 ← main entry point
POST /workflow/compile
POST /workflow/run
GET  /workflow/{id}
GET  /runs/{id}/logs
```
