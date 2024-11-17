import type { MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - about' },
    { name: 'description', content: 'Welcome to holmok.com, enjoy.' }
  ]
}

export default function About() {
  return (
    <>
      <Breadcrumb
        crumbs={[{ label: 'holmok.com', href: '/' }, { label: 'about' }]}
      />
      <h1>All About Christopher Holmok</h1>
      <p>
        Guh, I gotta write something for this. In the meantime, enjoy this photo
        and the fact that I'm a pretty cool guy.
      </p>
      <img src='/images/profile.jpg' alt='Christopher Holmok' />
    </>
  )
}
