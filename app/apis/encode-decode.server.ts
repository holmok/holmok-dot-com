import basex from 'base-x'

export default {
  encode(input: string, alphabet: string): string {
    const buffer = Buffer.from(input)
    return basex(alphabet).encode(buffer)
  },
  decode(input: string, alphabet: string): string {
    const buffer = Buffer.from(basex(alphabet).decode(input))
    return buffer.toString('utf8')
  },
  encode64(input: string, url: boolean): string {
    const buffer = Buffer.from(input)
    return buffer.toString(url ? 'base64url' : 'base64')
  },
  decode64(input: string, url: boolean): string {
    const buffer = Buffer.from(input, url ? 'base64url' : 'base64')
    return buffer.toString('utf8')
  }
}