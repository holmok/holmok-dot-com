import * as Fs from 'fs'
import matter from 'gray-matter'
import * as Marked from 'marked'
import * as Path from 'path'

interface Utility {
  title: string
  link: string
  body: string
}

const path = './app/utilities'
const files = Fs.readdirSync(path, { withFileTypes: true })
  .map((file) => file.name)
  .filter((file) => file.endsWith('.md'))

const output: Utility[] = []
for (const file of files) {
  const post = Fs.readFileSync(Path.join(path, file), 'utf8')
  const { data, content } = matter(post)
  output.push({
    title: data.title,
    link: data.link,
    body: await Marked.parse(content)
  })
}

export default {
  getUtilities() {
    return output
  }
}