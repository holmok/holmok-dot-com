import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import * as Fs from 'fs'
import matter from 'gray-matter'
import * as Marked from 'marked'
import * as Path from 'path'
import { useLoaderData, useNavigate } from '@remix-run/react'

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

import homeStyle from '~/styles/home.css?url'

export function links() {
  return [{ rel: 'stylesheet', href: homeStyle }]
}

export async function loader(args: LoaderFunctionArgs) {
  const path = './app/posts'
  const files = Fs.readdirSync(path, { withFileTypes: true })
    .map((file) => file.name)
    .filter((file) => file.endsWith('.md'))
    .reverse()
    .slice(0, 5)

  const output: Post[] = []
  for (const file of files) {
    const post = Fs.readFileSync(Path.join(path, file), 'utf8')
    const { data, content } = matter(post)
    output.push({
      title: data.title,
      date: data.date,
      body: await Marked.parse(content)
    })
  }

  return { posts: output }
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
