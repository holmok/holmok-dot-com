import type { MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import DumbTextServer from '~/apis/dumb-text.server'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import dumbTextStyle from '~/styles/dumb-text.css?url'
import { FormEvent, Fragment, MouseEvent, useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - dumb text' },
    { name: 'description', content: 'like Lipsum, but dumber.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: dumbTextStyle }]
}

export async function action() {
  const text = DumbTextServer.getDumbText()
  return { text }
}

export function loader() {
  const text = DumbTextServer.getDumbText()
  return { text }
}

export default function DumbText() {
  const loaderData = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const { text } = loaderData || actionData || { text: '' }

  const [renderType, setRenderType] = useState<string>('text')
  const [renderKey, setRenderKey] = useState<string>(Date.now().toString())

  function generateText(event: FormEvent<HTMLFormElement>): void {
    setRenderKey(Date.now().toString())
  }

  return (
    <Fragment key={renderKey}>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'dumb text' }
        ]}
      />
      <div className='dt-header'>
        <h1>Dumb Text Generator</h1>
        <span>
          <Form method='post' onSubmit={generateText}>
            <input
              type='submit'
              value='Generate Text'
              onClick={() => {
                setRenderType('text')
              }}
            />
            <input
              type='submit'
              value='Generate HTML'
              onClick={() => {
                setRenderType('html')
              }}
            />
          </Form>
        </span>
      </div>
      {renderType === 'text' ? (
        <div className='dumb-text' dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <pre className='dumb-html'>{text}</pre>
      )}
    </Fragment>
  )
}
