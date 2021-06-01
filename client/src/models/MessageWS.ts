export default class MessageWS {
	type: string;
	data: any;

	constructor(type: string, data?: any) {
		this.type = type;
		this.data = data;
	}
}

export const MessageWSType = {
	USERS: "USERS",
	ADD_USER: "ADD_USER",
	REMOVE_USER: "REMOVE_USER",
	NEW_USER: "NEW_USER",
	ADD_MESSAGE: "ADD_MESSAGE",
	NEW_MESSAGE: "NEW_MESSAGE",
	USERS_WRITING: "USERS_WRITING",
	ADD_WRITING: "ADD_WRITING",
	REMOVE_WRITING: "REMOVE_WRITING"
}
