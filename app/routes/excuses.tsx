import type { MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - random excuse generator' },
    { name: 'description', content: 'make random excuses.' }
  ]
}

export default function RandomExcuseGenerator() {
  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'random excuse generator' }
        ]}
      />
      <h1>Random Excuse Generator</h1>
    </>
  )
}
