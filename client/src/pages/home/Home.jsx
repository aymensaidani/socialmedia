import { useContext, useEffect } from "react";
import Posts from "../../components/posts/Posts"
import Publication from "../../components/publication/Publication"
// import RightBar from "../../components/righBar/RightBar"
// import Stories from "../../components/stories/Stories"
import { AuthContext } from "../../context/authContext";

const Home = ({socket}) => {
  const { currentUser } = useContext(AuthContext);
console.log(currentUser.id,"curentuser f home");
useEffect(() => {
  if (socket) {
    socket.emit("newUser", currentUser.id);
  }
}, [socket, currentUser.id]);
console.log(socket);

  return (
    <div>
        {/* <Stories/> */}
        <Publication socket={socket}/>
        <Posts socket={socket}/>
        {/* <RightBar/> */}
    </div>
  )
}

export default Home