import type { MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - uniquey' },
    { name: 'description', content: 'make unique strings.' }
  ]
}

export default function Uniquey() {
  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'uniquey' }
        ]}
      />
      <h1>Uniquey</h1>
    </>
  )
}
