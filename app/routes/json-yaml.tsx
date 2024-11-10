import type { MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - json/yaml tools' },
    { name: 'description', content: 'do stuff with json and yaml.' }
  ]
}

export default function JsonYamlTools() {
  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'json/yaml tools' }
        ]}
      />
      <h1>JSON/YAML Tools</h1>
    </>
  )
}
