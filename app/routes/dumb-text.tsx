import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import DumbTextServer from '~/apis/dumb-text.server'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import dumbTextStyle from '~/styles/dumb-text.css?url'
import { MouseEvent, useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - dumb text' },
    { name: 'description', content: 'like Lipsum, but dumber.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: dumbTextStyle }]
}

export function loader(args: LoaderFunctionArgs) {
  const {
    context: { log }
  } = args
  const text = DumbTextServer.getDumbText()
  log.info(`Dumb text generated: ${text}`)
  return { text }
}

export default function DumbText() {
  const { text } = useLoaderData<typeof loader>()

  const [searchParams, setSearchParams] = useSearchParams()

  const textType = searchParams.get('type') ?? 'text'

  function generateText(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault()
    const type = event.currentTarget.value
    const params = new URLSearchParams()
    params.set('type', type)
    setSearchParams(params)
  }

  return (
    <>
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
          <button value='text' onClick={generateText}>
            Generate Text
          </button>
          <button value='html' onClick={generateText}>
            Generate HTML
          </button>
        </span>
      </div>
      {textType === 'text' ? (
        <div className='dumb-text' dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <pre className='dumb-html'>{text}</pre>
      )}
    </>
  )
}
