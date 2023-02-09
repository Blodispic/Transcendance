import { ChatBody } from "./Chat";
import '../../styles/chat.scss'


// make a list of friends that had conversation with
function DMList() {
	return (
		<div className="title"> Direct Messages <hr />
		</div>
	);
}

function AllFriendList() {
	return (
		<div className="title"> All Friends <hr />
		</div>
	);
}


export function DirectMessage() {
	return (
		<div id="chat-container">
		<div className="left-sidebar">
			<DMList />
		</div>
			<ChatBody />
		<div className="right-sidebar">
			<AllFriendList />
		</div>
	</div>
	);
}