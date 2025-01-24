export const getFileUrl = (token: string, path: string) =>
	`https://api.telegram.org/file/bot${token}/${path}`
