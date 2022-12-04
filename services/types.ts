export interface Note {
	_id: string
	owner: string
	title: string
	content: string[]
	isPublic: boolean
	lastModified: string
}

export interface IndexedNote {
	_id: string
	owner: string
	title: string
	content: string[]
	// both title and content, or only one of them
	highlight: { title: string[], content?: never } | { title?: never, content: string[] } | { title: string[], content: string[] }
}

export interface User {
	_id: string
	email: string
	notes: string[]
}
