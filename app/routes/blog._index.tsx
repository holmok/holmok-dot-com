import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import * as Fs from 'fs'
import matter from 'gray-matter'
import * as Marked from 'marked'
import * as Path from 'path'
import { useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - blog archive' },
    { name: 'description', content: 'The blog archive.' }
  ]
}

interface Post {
  title: string
  date: string
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
      stub: data.stub
    })
  }

  return { posts: output }
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <>
      <Breadcrumb
        crumbs={[{ label: 'holmok.com', href: '/' }, { label: 'blog' }]}
      />
      <h1>Blog Archive</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.title}>
            {post.date} - <a href={`/blog/${post.stub}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </>
  )
}
