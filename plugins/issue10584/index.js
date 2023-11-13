// Workaround https://github.com/sveltejs/kit/issues/10584 (Thank you Hrishikesh-K!)

import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * @param {import('@netlify/build/types/netlify_plugin_options.d.ts').NetlifyPluginOptions} meta
 */
export function onPostBuild(meta) {
    const manifestPath = join(meta.constants.EDGE_FUNCTIONS_DIST, 'manifest.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    manifest.routes.find(route => {
        return route.function === 'render'
    }).excluded_patterns.push('/.netlify/functions/*')
    writeFileSync(manifestPath, JSON.stringify(manifest))
}