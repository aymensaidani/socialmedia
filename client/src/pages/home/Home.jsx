import Posts from "../../components/posts/Posts"
import Publication from "../../components/publication/Publication"
// import RightBar from "../../components/righBar/RightBar"
import Stories from "../../components/stories/Stories"

const Home = () => {
  return (
    <div>
        {/* <Stories/> */}
        <Publication/>
        <Posts/>
        {/* <RightBar/> */}
    </div>
  )
}

export default Home