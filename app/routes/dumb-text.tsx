import type { MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - dumb text' },
    { name: 'description', content: 'like lipsum, but dumber.' }
  ]
}

export default function DumbText() {
  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'dumb text' }
        ]}
      />
      <h1>Dumb Text Generator</h1>
    </>
  )
}
