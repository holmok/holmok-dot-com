import bs58 from 'bs58'

export default {
  encode<T>(data: T) {
    const str = JSON.stringify(data)
    const bfr = Buffer.from(str)
    return bs58.encode(bfr)
  },
  decode<T>(data: string) {
    const bfr = bs58.decode(data)
    const str = Buffer.from(bfr).toString()
    return JSON.parse(str) as T
  }
}