export default class MessageWS {
	type: string;
	data: any;

	constructor(type: ClientMessageWSType | ServerMessageWSType, data?: any) {
		this.type = type;
		this.data = data;
	}
}

export enum ClientMessageWSType {
	NEW_USER = "NEW_USER",
	NEW_MESSAGE = "NEW_MESSAGE",
	STARTED_TYPING = "STARTED_TYPING",
	STOPPED_TYPING = "STOPPED_TYPING"
}

export enum ServerMessageWSType {
	USERS = "USERS",
	ADD_USER = "ADD_USER",
	REMOVE_USER = "REMOVE_USER",
	ADD_MESSAGE = "ADD_MESSAGE",
	ADD_USER_TYPING = "ADD_USER_TYPING",
	REMOVE_USER_TYPING = "REMOVE_USER_TYPING"
}
