import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import Breadcrumb from '~/components/breadcrumb'
import ExcuseServer from '~/apis/excuses.server'
import { useLoaderData, useNavigate } from '@remix-run/react'
import excusesStyle from '~/styles/excuses.css?url'
import { s } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
import { useState } from 'react'

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
  const {
    request,
    context: { log }
  } = args
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

export default function RandomExcuseGenerator() {
  const { scrambled } = useLoaderData<typeof loader>() as {
    scrambled: string[]
  }

  if (typeof window !== 'undefined') {
    const excuse = document.querySelector('.excuse')
    if (excuse != null) {
      const interval = setInterval(() => {
        const next = scrambled.pop()
        if (next) {
          excuse.textContent = next
        } else {
          clearInterval(interval)
        }
      }, 30)
    }
  }

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
            e.preventDefault()
            navigate('.')
          }}
        >
          Generate
        </button>
      </div>
      <div className='excuse'></div>
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
