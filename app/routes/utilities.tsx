import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { MouseEvent } from 'react'
import UtilitiesServer from '~/apis/utilities.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - utilities' },
    { name: 'description', content: 'some utilities i made and put online.' }
  ]
}

import utilitiesStyle from '~/styles/utilities.css?url'
import Breadcrumb from '~/components/breadcrumb'

export function links() {
  return [{ rel: 'stylesheet', href: utilitiesStyle }]
}

export async function loader() {
  return { utilities: UtilitiesServer.getUtilities() }
}

export default function Utilities() {
  const { utilities } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  function handleUtilityClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href')
    if (href != null) navigate(href)
  }

  return (
    <>
      <Breadcrumb
        crumbs={[{ label: 'holmok.com', href: '/' }, { label: 'utilities' }]}
      />
      <h1>Enjoy My Silly Online Utilities</h1>
      <p>
        I make a bunch of silly tools I like to keep online. There are some that
        are useful, some that are dumb, some that are just fun.
      </p>
      {utilities.map((utility) => (
        <div className='post'>
          <div className='header'>
            <h2>
              <a href={utility.link} onClick={handleUtilityClick}>
                {utility.title}
              </a>
            </h2>
          </div>
          <div
            className='body'
            dangerouslySetInnerHTML={{ __html: utility.body }}
          />
        </div>
      ))}
    </>
  )
}
