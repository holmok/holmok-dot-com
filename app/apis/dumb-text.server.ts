import * as Data from './dumb-text.data.server'
import Sentencer from 'sentencer'

type Sets = { [key in Data.Part]: number[] }

function shuffle(array: string[]) {
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

function makeSentence(sets: Sets) {
  if (sets[Data.Part.Start].length === 0) sets[Data.Part.Start] = shuffle(Data.parts[Data.Part.Start])
  if (sets[Data.Part.Middle].length === 0) sets[Data.Part.Middle] = shuffle(Data.parts[Data.Part.Middle])
  if (sets[Data.Part.End].length === 0) sets[Data.Part.End] = shuffle(Data.parts[Data.Part.End])

  const start = sets[Data.Part.Start].pop() as number
  const middle = sets[Data.Part.Middle].pop() as number
  const end = sets[Data.Part.End].pop() as number
  const output = Sentencer.make(`${Data.parts[Data.Part.Start][start]} ${Data.parts[Data.Part.Middle][middle]} ${Data.parts[Data.Part.End][end]}`)

  return { output, sets }
}

function wordWrap(text: string, args?: { width?: number, indent?: number }) {
  const { width = 60, indent = 4 } = args ?? {}
  const words = text.split(' ')
  let output = ''
  let line = ''
  let lineLength = 0
  for (let i = 0; i < words.length; i++) {
    if (lineLength + words[i].length + 1 > width) {
      output += `${line}\n`
      line = ' '.repeat(indent)
      lineLength = indent
    }
    line += `${words[i]} `
    lineLength += words[i].length + 1
  }
  const lastLine = line.trim().length > 0 ? `${line}\n` : ''
  return `${output}${lastLine}`
}

function makeParagraph(sets?: Sets): { output: string, sets: Sets } {
  const sentences = Math.floor(Math.random() * 8) + 3
  let output = ''
  let outSets = sets ?? {
    [Data.Part.Start]: shuffle(Data.parts[Data.Part.Start]),
    [Data.Part.Middle]: shuffle(Data.parts[Data.Part.Middle]),
    [Data.Part.End]: shuffle(Data.parts[Data.Part.End])
  }
  for (let i = 0; i < sentences; i++) {
    const sentence = makeSentence(outSets)
    output += sentence.output + (i === sentences - 1 ? '' : ' ')
    outSets = sentence.sets
  }
  return { output: `<p>\n    ${wordWrap(output)}</p>`, sets: outSets }
}

export default {
  getDumbText() {
    let sets: Sets | undefined
    let text = ''
    const paragraphs = Math.floor(Math.random() * 4) + 3
    for (let i = 0; i < paragraphs; i++) {
      const paragraph = makeParagraph(sets)
      sets = paragraph.sets
      text += paragraph.output + '\n'
    }
    return text
  }
}