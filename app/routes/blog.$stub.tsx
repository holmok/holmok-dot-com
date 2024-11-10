import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import { useLoaderData, useNavigate, useParams } from '@remix-run/react'
import PostsServer from '~/apis/posts.server'

import blogStyle from '~/styles/blog.css?url'

export function links() {
  return [{ rel: 'stylesheet', href: blogStyle }]
}

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - blog archive' },
    { name: 'description', content: 'The blog archive.' }
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const { stub } = args.params
  return (
    (stub && {
      post: PostsServer.getPostBySlug(stub),
      prev: PostsServer.getPrevPost(stub),
      next: PostsServer.getNextPost(stub)
    }) || { post: null, prev: null, next: null }
  )
}

export default function Blog() {
  const { post, prev, next } = useLoaderData<typeof loader>()
  if (!post) return <div>Post not found</div>

  const navigate = useNavigate()

  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'blog archive', href: '/blog' },
          { label: post.title }
        ]}
      />
      <div className='post'>
        <div className='header'>
          <h2>{post.title}</h2>
          <p className='date'>{post.date}</p>
        </div>
        <div className='body' dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
      <div className='pagination'>
        {(next && (
          <span>
            ←{' '}
            <a
              href={`/blog/${next.stub}`}
              className='prev'
              onClick={(e) => {
                e.preventDefault()
                navigate(`/blog/${next.stub}`)
              }}
            >
              {next.title}
            </a>
          </span>
        )) || <span> </span>}

        {(prev && (
          <span>
            <a
              href={`/blog/${prev.stub}`}
              className='next'
              onClick={(e) => {
                e.preventDefault()
                navigate(`/blog/${prev.stub}`)
              }}
            >
              {prev.title}
            </a>{' '}
            →
          </span>
        )) || <span> </span>}
      </div>
    </>
  )
}
