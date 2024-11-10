import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import { useLoaderData } from '@remix-run/react'
import blogStyle from '~/styles/blog.css?url'
import PostsService from '~/apis/posts.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - blog archive' },
    { name: 'description', content: 'The blog archive.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: blogStyle }]
}

export async function loader(args: LoaderFunctionArgs) {
  return { posts: PostsService.getAllPosts() }
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <>
      <Breadcrumb
        crumbs={[{ label: 'holmok.com', href: '/' }, { label: 'blog archive' }]}
      />
      <h1>Blog Archive</h1>
      <div className='posts'>
        {posts.map((post) => (
          <div key={post.title} className='post-link'>
            <span className='title'>
              <a href={`/blog/${post.stub}`}>{post.title}</a>
            </span>
            <span className='date'>{post.date}</span>
          </div>
        ))}
      </div>
    </>
  )
}
