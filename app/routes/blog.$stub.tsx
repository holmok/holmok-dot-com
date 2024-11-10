import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import * as Fs from 'fs'
import matter from 'gray-matter'
import * as Marked from 'marked'
import * as Path from 'path'
import { useLoaderData, useNavigate, useParams } from '@remix-run/react'

import homeStyle from '~/styles/home.css?url'

export function links() {
  return [{ rel: 'stylesheet', href: homeStyle }]
}

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - blog archive' },
    { name: 'description', content: 'The blog archive.' }
  ]
}

interface Post {
  title: string
  date: string
  body: string
  stub: string
}

export async function loader(args: LoaderFunctionArgs) {
  const path = './app/posts'
  const files = Fs.readdirSync(path, { withFileTypes: true })
    .map((file) => file.name)
    .filter((file) => file.endsWith('.md'))
    .reverse()

  const output: Post[] = []
  for (const file of files) {
    const post = Fs.readFileSync(Path.join(path, file), 'utf8')
    const { data, content } = matter(post)
    output.push({
      title: data.title,
      date: data.date,
      body: await Marked.parse(content),
      stub: data.stub
    })
  }

  return { posts: output }
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>()
  const { stub } = useParams()
  const post = posts.find((post) => post.stub === stub)
  const index = posts.findIndex((post) => post.stub === stub)

  const navigate = useNavigate()

  if (!post) return <div>Post not found</div>

  const prev = posts[index + 1]
  const next = posts[index - 1]

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
