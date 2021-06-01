export default class MessageWS {
	type: string;
	data: any;

	constructor(type: string, data: any) {
		this.type = type;
		this.data = data;
	}
}

export const MessageWSType = {
	SAY: "say",
	JOIN: "join",
	MESSAGES: "messages",
	USERS: "users"
}
