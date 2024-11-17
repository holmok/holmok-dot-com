import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import Breadcrumb from '~/components/breadcrumb'
import jsonYamlServer from '~/apis/json-yaml.server'

import jsonYamlStyle from '~/styles/json-yaml.css?url'
import { Fragment, useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'holmok.com - json/yaml tools' },
    { name: 'description', content: 'do stuff with json and yaml.' }
  ]
}

const json2yaml = Symbol('json-to-yaml')
const yaml2json = Symbol('yaml-to-json')
const formatJson = Symbol('format-json')
const minimizeJson = Symbol('minimize-json')

const actions: { [key: string]: Symbol } = {
  '⇩ JSON to YAML': json2yaml,
  'YAML to JSON ⇧': yaml2json,
  'Format JSON': formatJson,
  'Minimize JSON': minimizeJson
}

export function links() {
  return [{ rel: 'stylesheet', href: jsonYamlStyle }]
}

export async function action(args: ActionFunctionArgs) {
  const { request } = args
  const body = await request.formData()
  const action = actions[(body.get('action') as string) ?? ''] ?? null
  const output: {
    key: number
    json: string
    yaml: string
    error: string | undefined
  } = {
    key: Date.now(),
    json: body.get('json') as string,
    yaml: body.get('yaml') as string,
    error: undefined
  }
  try {
    switch (action) {
      case json2yaml:
        output.yaml = jsonYamlServer.json2yaml(output.json)
        break

      case yaml2json:
        output.json = jsonYamlServer.yaml2json(output.yaml)
        break

      case formatJson:
        output.json = jsonYamlServer.formatJson(output.json)
        break

      case minimizeJson:
        output.json = jsonYamlServer.minimizeJson(output.json)
        break
    }
  } catch (error: any) {
    output.error = error.message
  }
  return output
}

export default function JsonYamlTools() {
  const values = useActionData<typeof action>() as {
    json: string
    yaml: string
    key: number
    error: string | undefined
  }

  return (
    <Fragment key={(values?.key ?? -1).toString()}>
      <Breadcrumb
        crumbs={[
          { label: 'holmok.com', href: '/' },
          { label: 'utilities', href: '/utilities' },
          { label: 'json/yaml tools' }
        ]}
      />
      <h1>JSON/YAML Tools</h1>
      {values?.error && <pre className='error'>{values.error}</pre>}
      <Form method='post'>
        <label>JSON</label>
        <textarea name='json' rows={10}>
          {values && values.json}
        </textarea>
        <div className='button-row'>
          <input type='submit' value='⇩ JSON to YAML' name='action' />
          <input type='submit' value='YAML to JSON ⇧' name='action' />
          <input type='submit' value='Format JSON' name='action' />
          <input type='submit' value='Minimize JSON' name='action' />
        </div>
        <label>YAML</label>
        <textarea name='yaml' rows={10}>
          {values && values.yaml}
        </textarea>
      </Form>
    </Fragment>
  )
}
