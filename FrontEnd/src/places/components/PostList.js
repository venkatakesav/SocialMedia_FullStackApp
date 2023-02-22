import PostItem from "./PostItem"

import "./PlaceList.css"

function PostList(props) {
  return (
    <ul className="place-list">
      {props.items.map(post => (
        <PostItem
          key={post.id}
          id={post.id}
          title={post.title}
          description={post.description}
          postedBy={post.postedBy}
          postedIn={post.postedIn}
        />))}
    </ul>
  )
}
export default PostList