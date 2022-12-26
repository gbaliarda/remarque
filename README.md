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

# Accessing MongoDB and listing all collections

From the terminal:
1. Run `docker exec -ti containerName-mongo-1 bash` changing `containerName` for the name of your container. The default name is the name of the folder containing the project.
2. Run `mongosh`.
3. Run `use remarque`.
4. Run `show collections`

> Note that in order to see both users and notes collections, there has to be a user registered.

# Accessing ElasticSearch and listing all collections and indexes

ElasticSearch can be accessed through the url http://localhost:9200/

- `curl http://localhost:9200/_cat/indices?v` to list all indexes with their core information.
- `curl http://localhost:9200/notes?pretty=true` to list the notes index structure

> Note that in order to see the notes index, a note needs to be created before.

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
