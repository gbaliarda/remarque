Remarque notes app.

# Running the app locally in development

From the terminal and located in the root of the project:
1. Run `docker compose up`.
2. Run `npm install`.
3. Rename the `.env.example` file to `.env.local` and update as needed. The defaults should work out of the box.
4. Run `npm run dev`.

> Note that you will need `docker` and `npm` installed on your computer.

This will start the user interface at http://localhost:3000.

You can access the **Swagger** docs at http://localhost:3000/doc.

# Running the app from Github Codespaces

- Edit environment variable `NEXT_PUBLIC_BASE_URL` in `.env.local` to match the codespace preview link (e.g. `https://eperezok-cautious-dollop-v7qgg9xpr5hxjxg-3000.preview.app.github.dev/`).
- Set port 3000 visibility to `Public` from the Codespace port configuration.

# Frontend Features

- Katex math expressions.
- Github markdown syntax support.
- `Ctrl+K` to search in all your notes.
- Share your public note ID with anyone to allow them to see/duplicate your note.
- Notes are automatically ordered by modification date.

## Keyboard shortcuts
- `Shift+Enter` to insert a new block.
- `Shift+Backspace` to remove the current block.
- `Tab` to go to the next block.
- `Shift+Tab` to go to the previous block.
