import Post from "./components/Post";
import CreatePostBox from "./components/CreatePostBox";
import { PostsProvider, usePosts } from "./context/PostsContext";
import "./App.css";

function Feed() {
  const { posts } = usePosts();
  return (
    <>
      <CreatePostBox />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}

function App() {
  return (
    <PostsProvider>
      <div className="page">
        <main className="feed">
          <Feed />
        </main>
      </div>
    </PostsProvider>
  );
}

export default App;
