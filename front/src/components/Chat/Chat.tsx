import * as React from "react";
import  Header  from '../Header/Header';

// export default class Chat extends React.Component <{}> {
        
//         public render() {
//                 return (
//                         <div className="centreText">
//                                 <h2>Chat</h2>
// 								<h1>ฅ^•ω•^ฅ</h1>
//                         </div>
//                 );
//                 }
// }

function Chat() {
	const [currentMessage, setCurrentMessage] = React.useState("");

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				message: currentMessage
			};
		}
	}

	return (
		<div id="chat-container">
			<div className="chat">
				<div className="header">
					<p> -- Chat --</p>
				</div>
				<div className="body"></div>
				<div className="footer">
					<input type="text" placeholder="Type message here" />
					<button onClick={sendMessage}>Send</button>					
				</div>
			</div>
		</div>
	);
}

export default Chat