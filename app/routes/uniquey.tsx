import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import Breadcrumb from '~/components/breadcrumb'
import uniqueyStyle from '~/styles/uniquey.css?url'
import UniqueyServer from '~/apis/uniquey.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - uniquey' },
    { name: 'description', content: 'make unique strings.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: uniqueyStyle }]
}

export async function action(args: ActionFunctionArgs) {
  const { request } = args
  const form = await request.formData()
  const { alphabet, count, length } = Object.fromEntries(form)
  const strings = UniqueyServer.generateUniquey(
    alphabet as string,
    Number(length),
    Number(count)
  )
  return { strings }
}

export function loader() {
  return {
    lengths: UniqueyServer.getLengths(),
    alphabets: UniqueyServer.getAlphabetList(),
    counts: UniqueyServer.getCounts()
  }
}

export default function Uniquey() {
  const { lengths, alphabets, counts } = useLoaderData<typeof loader>()
  const action: { strings: string[] } | undefined =
    useActionData<typeof action>()
  const strings = action?.strings
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
      <p>
        Generate some random strings. Select the options below, and click
        generate to get your strings. This page uses my node library you can
        check out on{' '}
        <a href='https://www.npmjs.com/package/uniquey'>npmjs.com</a>.
      </p>

      <Form method='post' className='options'>
        <div className='option'>
          <label htmlFor='length'>Length:</label>
          <select name='length'>
            {lengths.map((length) => (
              <option key={length} value={length}>
                {length}
              </option>
            ))}
          </select>
        </div>
        <div className='option'>
          <label htmlFor='alphabet'>Alphabet:</label>
          <select name='alphabet'>
            {alphabets.map((alphabet) => (
              <option key={alphabet} value={alphabet}>
                {alphabet}
              </option>
            ))}
          </select>
        </div>
        <div className='option'>
          <label htmlFor='count'>Count:</label>
          <select name='count'>
            {counts.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>

        <button type='submit'>Generate</button>
      </Form>
      {strings && <pre>{strings.join('\n')}</pre>}
    </>
  )
}
