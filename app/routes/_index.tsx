import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import PostsServer from '~/apis/posts.server'
import blogStyle from '~/styles/blog.css?url'

interface Post {
  title: string
  date: string
  body: string
}

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - home' },
    {
      name: 'description',
      content: 'welcome to holmok.com, enjoy. this is the blog page.'
    }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: blogStyle }]
}

export async function loader() {
  return { posts: PostsServer.getPosts({ start: 0, end: 4 }) }
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  return (
    <>
      {posts.map((post) => (
        <div className='post'>
          <div className='header'>
            <h2>{post.title}</h2>
            <p className='date'>{post.date}</p>
          </div>
          <div
            className='body'
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      ))}
      <div className='post-footer'>
        <a
          href='/blog'
          onClick={(e) => {
            e.preventDefault()
            navigate('/blog')
          }}
        >
          blog archive
        </a>
      </div>
    </>
  )
}
