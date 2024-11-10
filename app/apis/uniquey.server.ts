import Uniquey from "uniquey"

const alphabets: { [key: string]: string } = {
  letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  hex: '0123456789abcdef',
  base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  base62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  animals: '🐵🐒🦍🐶🐕🐩🐺🦊🐱🐈🦁🐯🐅🐆🐴🐎🦄🦓🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🦒🐘🦏🐭🐁🐀🐹🐰🐇🐿🦔🦇🐻🐨🐼🐾🦃🐔🐓🐣🐤🐥🐦🐧🕊🦅🦆🦉🐸🐊🐢🦎🐍🐲🐉🦕🦖🐳🐋🐬🐟🐠🐡🦈🐙🐚🦀🦐🦑🐌🦋🐛🐜🐝🐞🦗🕷🦂',
  food: '🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶🥒🥦🍄🥜🌰🍞🥐🥖🥨🥞🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🍳🍲🥣🥗🍿🥫🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🍡🥟🥠🥡🍦🍧🍨🍩🍪🎂🍰🥧🍫🍬🍭🍮'
}

const lengths = [16, 32, 64, 128, 256, 512]
const counts = [8, 16, 32, 64]

export default {
  getAlphabetList() {
    return Object.keys(alphabets)
  },
  getLengths() {
    return lengths
  },
  getCounts() {
    return counts
  },
  generateUniquey(alphabet: string, length: number, count: number) {
    if (!alphabets[alphabet]) {
      return ['invalid alphabet']
    }
    if (!lengths.includes(length)) {
      return ['invalid length']
    }
    if (!counts.includes(count)) {
      return ['invalid count']
    }
    const multiByteCharacters = alphabet === 'animals' || alphabet === 'food'
    const uniquey = new Uniquey({ length: length, characters: alphabets[alphabet], multiByteCharacters })
    const output = []
    for (let i = 0; i < count; i++) {
      output.push(uniquey.create())
    }
    return output
  }
}