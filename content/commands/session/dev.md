---
description: 'Start development server with mocks enabled'
---

# Start Development Server

**Start project with mocks enabled**

## What It Does

This command guides you through:

1. Checking if `.env.local` exists
2. Checking if `ENABLE_MOCKS=true` is set
3. Running `npm run codegen` to generate API clients
4. Running `npm run dev` to start the development server

## Usage

Type `/start-dev` in chat to start the development server.

## What Are Mocks?

**Mock Service Worker (MSW):**

- Intercepts HTTP requests and returns test data instead of real backend responses
- Allows local development WITHOUT a real backend server
- Used for both development and testing

## Prerequisites

Before running this command, ensure:

1. **Dependencies installed:**

   ```bash
   npm install
   ```

2. **Environment configured:**

   ```bash
   # Copy environment template
   cp .env.development .env.local

   # Enable mocks
   echo "ENABLE_MOCKS=true" >> .env.local
   ```

3. **Port available:**
   - Server runs on `http://localhost:5173`
   - Make sure port 5173 is not in use

## Steps

### Step 1: Check Environment

Verify that `.env.local` exists and contains:

```
ENABLE_MOCKS=true
```

### Step 2: Generate API Clients

```bash
npm run codegen
```

This generates TypeScript clients from OpenAPI spec using Orval.

### Step 3: Start Server

```bash
npm run dev
```

Server will start on `http://localhost:5173`

### Step 4: Open in Browser

Open http://localhost:5173 in your browser.

## Troubleshooting

### "Error: Cannot find module 'src/shared/api/generated'"

**Cause:** API clients not generated

**Solution:**

```bash
npm run codegen
```

### "Mocks not working, requests going to backend"

**Cause:** Mocks not enabled

**Solution:**
Check `.env.local` and ensure:

```
ENABLE_MOCKS=true
```

Restart the server after changing the file.

### "Port 5173 already in use"

**Cause:** Another process is using the port

**Solution:**

```bash
# Find and kill the process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port (modify vite.config.ts)
```

## Verification

To verify mocks are working:

```bash
# Check mock handlers
npm run mocks:check
```

## References

- [docs/guides/cursor-for-team.md](docs/guides/cursor-for-team.md) - Team guide
- [README.md](README.md) - Project overview
- [.cursor/commands/quality/check.md](../quality/check.md) - Quality checks
