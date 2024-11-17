import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Fragment } from 'react/jsx-runtime'
import EncodeDecodeServer from '~/apis/encode-decode.server'
import Breadcrumb from '~/components/breadcrumb'
import encodeDecodeStyle from '~/styles/encode-decode.css?url'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - about' },
    { name: 'description', content: 'Welcome to holmok.com, enjoy.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: encodeDecodeStyle }]
}

const encode = Symbol('encode')
const decode = Symbol('decode')

const actions: { [key: string]: Symbol } = {
  '⇩ ENCODE': encode,
  'DECODE ⇧': decode
}

const alphabets: { [key: string]: string } = {
  Base64: '',
  Base64Url: '',
  Base62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  Base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  Base36: '0123456789abcdefghijklmnopqrstuvwxyz',
  Base32: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
  Base16: '0123456789abcdef',
  Base10: '0123456789',
  Base8: '01234567',
  Base2: '01'
}

interface ActionResponse {
  key: string
  encoded: string
  decoded: string
  error: string | undefined
  alphabet: string
}

export async function action(args: ActionFunctionArgs) {
  const { request } = args
  const body = await request.formData()

  const output: ActionResponse = {
    key: Date.now().toString(),
    encoded: body.get('encoded') as string,
    decoded: body.get('decoded') as string,
    error: undefined,
    alphabet: (body.get('alphabet') as string) ?? 'Base64'
  }

  const action = actions[(body.get('action') as string) ?? ''] ?? null
  try {
    switch (action) {
      case encode:
        if (output.alphabet === 'Base64')
          output.encoded = EncodeDecodeServer.encode64(output.decoded, false)
        else if (output.alphabet === 'Base64Url')
          output.encoded = EncodeDecodeServer.encode64(output.decoded, true)
        else
          output.encoded = EncodeDecodeServer.encode(
            output.decoded,
            alphabets[output.alphabet]
          )
        break
      case decode:
        if (output.alphabet === 'Base64')
          output.decoded = EncodeDecodeServer.decode64(output.encoded, false)
        else if (output.alphabet === 'Base64Url')
          output.decoded = EncodeDecodeServer.decode64(output.encoded, true)
        else
          output.decoded = EncodeDecodeServer.decode(
            output.encoded,
            alphabets[output.alphabet]
          )
        break
    }
  } catch (error: any) {
    output.error = error.message
  }

  return output
}

export default function About() {
  const values = useActionData<ActionResponse | undefined>()
  return (
    <Fragment key={values?.key ?? 'empty'}>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'encode/decode tools' }
        ]}
      />
      <h1>Encode/Decode Tools</h1>
      {values?.error && <pre className='error'>{values.error}</pre>}
      <Form method='post'>
        <label>Decoded Text</label>
        <textarea name='decoded' rows={10}>
          {values && values.decoded}
        </textarea>
        <div className='button-row'>
          <input type='submit' value='⇩ ENCODE' name='action' />
          <input type='submit' value='DECODE ⇧' name='action' />
          <select name='alphabet'>
            {Object.keys(alphabets).map((key) => (
              <option key={key} value={key} selected={key === values?.alphabet}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <label>Encoded Text</label>
        <textarea name='encoded' rows={10}>
          {values && values.encoded}
        </textarea>
      </Form>
    </Fragment>
  )
}
