export default class Message {
	userName: string;
	text: string;
	type: string;
}

export const MessageType = {
	SERVER: "SERVER",
	CLIENT: "CLIENT"
}
