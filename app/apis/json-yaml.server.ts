import * as yaml from 'js-yaml'

export default {
  formatJson(json: string): string {
    return JSON.stringify(JSON.parse(json), null, 2)
  },
  minimizeJson(json: string): string {
    return JSON.stringify(JSON.parse(json))
  },
  json2yaml(json: string): string {
    return yaml.dump(JSON.parse(json))
  },
  yaml2json(yamlString: string): string {
    return JSON.stringify(yaml.load(yamlString), null, 2)
  }
}