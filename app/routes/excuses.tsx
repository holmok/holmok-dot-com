import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import ExcuseServer from '~/apis/excuses.server'
import { useLoaderData, useNavigate } from '@remix-run/react'
import excusesStyle from '~/styles/excuses.css?url'
import { Fragment, useEffect, useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - random excuse generator' },
    { name: 'description', content: 'make random excuses.' }
  ]
}

export function links() {
  return [{ rel: 'stylesheet', href: excusesStyle }]
}

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args
  const { phrase, cookie } = await ExcuseServer.getExcuse(request)
  const scrambled: string[] = [phrase]
  const positions = shuffle([...phrase.matchAll(rxLetters)].map((m) => m.index))
  let state = [...phrase]
  for (const i in positions) {
    state[positions[i]] = letters[Math.floor(Math.random() * letters.length)]
    scrambled.push(state.join(''))
  }

  return Response.json(
    { scrambled, phrase },
    {
      headers: {
        'Set-Cookie': cookie
      }
    }
  )
}

const letters = 'QWERTYUIOPLKJHGFDSAZXCVBNMzaqwsxcderfvbgtyhnmjuiklop'
const rxLetters = /[a-zA-Z]/g

function Excuse(props: { scrambled: string[] }) {
  const { scrambled } = props
  const [index, setIndex] = useState(scrambled.length - 1)
  const [excuse, setExcuse] = useState(scrambled[0])
  if (index >= 0) {
    setTimeout(() => {
      setExcuse(scrambled[index])
      setIndex(index - 1)
    }, 30)
  }
  return <div className='excuse'>{excuse}</div>
}

export default function RandomExcuseGenerator() {
  const { scrambled } = useLoaderData<typeof loader>() as {
    scrambled: string[]
  }

  const [clientOnly, setClientOnly] = useState(false)
  useEffect(() => {
    setClientOnly(true)
  }, [])

  const navigate = useNavigate()
  return (
    <>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'random excuse generator' }
        ]}
      />
      <div className='ex-header'>
        <h1>Random Excuse Generator</h1>
        <button
          type='submit'
          onClick={(e) => {
            navigate('/excuses', { replace: true })
          }}
        >
          Generate
        </button>
      </div>
      {clientOnly && (
        <Fragment key={scrambled[0]}>
          <Excuse scrambled={scrambled} />{' '}
        </Fragment>
      )}
    </>
  )
}

function shuffle(positions: number[]): number[] {
  const output: number[] = []
  while (positions.length > 0) {
    output.push(
      positions.splice(Math.floor(Math.random() * positions.length), 1)[0]
    )
  }
  return output
}
