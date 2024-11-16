import * as Data from './excuses.data.server'

import { createCookie } from '@remix-run/node'

export const excuseTokenCookie = createCookie('excuseToken', {
  maxAge: 604_800
})

function shuffle(array: string[]): number[] {
  const output = Object.keys(array).map(i => parseInt(i))
  let currentIndex = array.length
  let randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [output[currentIndex], output[randomIndex]] = [output[randomIndex], output[currentIndex]]
  }
  return output
}


type Sets = { [key in Data.Part]: number[] }

async function getSetsFromCookie(req: Request) {
  const cookieHeader = req.headers.get("Cookie")
  const cookie = await excuseTokenCookie.parse(cookieHeader) as string | undefined
  try {
    if (cookie != null) {
      const items = cookie.split('|').map((x) => {
        return JSON.parse(Buffer.from(x, 'base64').toString())
      })
      return { [Data.Part.A]: items[0], [Data.Part.B]: items[1], [Data.Part.C]: items[2] } as Sets
    }
  } catch (e) {

  }
  return { [Data.Part.A]: [], [Data.Part.B]: [], [Data.Part.C]: [] } as Sets
}

function getRandom(part: Data.Part, sets: Sets): { value: string, code: string } {
  let list = sets[part]
  if (list.length === 0) {
    list = sets[part] = shuffle(Data.parts[part])
  }
  return {
    value: Data.parts[part][list.pop() as number],
    code: Buffer.from(JSON.stringify(list)).toString('base64')
  }
}

export default {
  async getExcuse(req: Request) {
    const sets = await getSetsFromCookie(req)
    const partA = getRandom(Data.Part.A, sets)
    const partB = getRandom(Data.Part.B, sets)
    const partC = getRandom(Data.Part.C, sets)
    const phrase = `${partA.value} ${partB.value} ${partC.value}`
    const cookie = await excuseTokenCookie.serialize(`${partA.code}|${partB.code}|${partC.code}`)
    return {
      phrase,
      cookie
    }
  }
}

