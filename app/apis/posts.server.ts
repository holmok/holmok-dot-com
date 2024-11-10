import * as Fs from 'fs'
import matter from 'gray-matter'
import { marked } from 'marked'
import * as Path from 'path'

interface Post {
  title: string
  date: string
  body: string
  stub: string
}

const path = './app/posts'
const files = Fs.readdirSync(path, { withFileTypes: true })
  .map((file) => file.name)
  .filter((file) => file.endsWith('.md'))
  .reverse()

const output: Post[] = []
const bySlug: Record<string, Post> = {}
for (const file of files) {
  const postData = Fs.readFileSync(Path.join(path, file), 'utf8')
  const { data, content } = matter(postData)
  const post: Post = {
    title: data.title,
    date: data.date,
    body: marked.parse(content) as string,
    stub: data.stub
  }
  output.push(post)
  bySlug[data.stub] = post
}

export default {
  getPosts(args: { start?: number, end?: number }) {
    const { start = 0, end = 4 } = args
    return output.slice(start, end)
  },
  getPostBySlug(slug: string) {
    return bySlug[slug]
  },
  getPrevPost(slug: string) {
    const index = output.findIndex((post) => post.stub === slug)
    return output[index + 1]
  },
  getNextPost(slug: string) {
    const index = output.findIndex((post) => post.stub === slug)
    return output[index - 1]
  },
  getAllPosts() {
    return output
  }
}