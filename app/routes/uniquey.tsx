import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, redirect, useLoaderData } from '@remix-run/react'
import Breadcrumb from '~/components/breadcrumb'
import uniqueyStyle from '~/styles/uniquey.css?url'
import UniqueyServer from '~/apis/uniquey.server'
import EncoderServer from '~/apis/encoder.server'

interface UniqueyArgs {
  length: number
  alphabet: string
  count: number
}

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - uniquey' },
    { name: 'description', content: 'make unique strings.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: uniqueyStyle }]
}

export async function action(args: LoaderFunctionArgs) {
  const { request } = args
  const form = await request.formData()
  const uniqueyArgs: UniqueyArgs = {
    length: Number(form.get('length')),
    alphabet: String(form.get('alphabet')),
    count: Number(form.get('count'))
  }
  const uuid = EncoderServer.encode(uniqueyArgs)
  return redirect(`/uniquey?uuid=${uuid}`)
}

export function loader(args: LoaderFunctionArgs) {
  const { request } = args
  const { searchParams } = new URL(request.url)
  const uuid = searchParams.get('uuid')
  if (uuid) {
    const decoded = EncoderServer.decode<UniqueyArgs>(uuid)
    return {
      lengths: UniqueyServer.getLengths(),
      alphabets: UniqueyServer.getAlphabetList(),
      counts: UniqueyServer.getCounts(),
      strings: UniqueyServer.generateUniquey(
        decoded.alphabet,
        decoded.length,
        decoded.count
      ),
      values: decoded
    }
  } else {
    return {
      lengths: UniqueyServer.getLengths(),
      alphabets: UniqueyServer.getAlphabetList(),
      counts: UniqueyServer.getCounts(),
      strings: [],
      values: { length: 8, alphabet: 'alphanumeric', count: 10 } as UniqueyArgs
    }
  }
}

export default function Uniquey() {
  const { lengths, alphabets, counts, strings, values } =
    useLoaderData<typeof loader>()

  const lighter =
    values.alphabet === 'food' || values.alphabet === 'animals' ? 'lighter' : ''
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
      <Form className='options' method='post'>
        <div className='option'>
          <label htmlFor='length'>Length:</label>
          <select name='length' aria-label='length'>
            {lengths.map((length) => (
              <option
                key={length}
                value={length}
                selected={values.length === length}
              >
                {length}
              </option>
            ))}
          </select>
        </div>
        <div className='option'>
          <label htmlFor='alphabet'>Alphabet:</label>
          <select name='alphabet' aria-label='alphabet'>
            {alphabets.map((alphabet) => (
              <option
                key={alphabet}
                value={alphabet}
                selected={values.alphabet === alphabet}
              >
                {alphabet}
              </option>
            ))}
          </select>
        </div>
        <div className='option'>
          <label htmlFor='count'>Count:</label>
          <select name='count' aria-label='count'>
            {counts.map((count) => (
              <option
                key={count}
                value={count}
                selected={values.count === count}
              >
                {count}
              </option>
            ))}
          </select>
        </div>
        <button type='submit'>Generate</button>
      </Form>
      {strings.length > 0 && (
        <pre className={lighter}>{strings.join('\n')}</pre>
      )}
    </>
  )
}
