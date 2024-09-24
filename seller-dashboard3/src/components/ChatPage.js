import { useParams } from "react-router-dom";
import ChatBox from "./ChatBox";

function ChatPage() {
  const { recipientId, productId } = useParams(); // Extract recipientId and productId from the URL

  return (
    <div className="chatpage-container">
      <div className="chatbox-wrapper">
        {/* Pass the correct props to the ChatBox component */}
        <ChatBox />
      </div>
    </div>
  );
}

export default ChatPage;
