export default class Message {
	userName: string;
	text: string;
	type: string;
}

export const MessageType = {
	OWN: "OWN",
	USER: "USER",
	SERVER: "SERVER"
}
