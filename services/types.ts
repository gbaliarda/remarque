export interface Note {
	_id: string
	owner: string
	title: string
	content: string[]
	isPublic: boolean
	lastModified: string
}

export interface User {
	_id: string
	email: string
	notes: string[]
}
