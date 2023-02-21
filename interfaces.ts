export interface message {
  id: string;
  message: string;
  isSender: boolean;
  messageTime: string;
}

export interface Room {
  id: string;
  name: string;
  messages: message[];
}

export interface User {
  id?: string;
  name: string;
  password?: string;
}

export interface Session extends User {
  token: string | undefined;
}

export interface FeedItem extends User {
  type: "like_post" | "share_event";
  text: string;
}
