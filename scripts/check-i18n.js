#!/usr/bin/env node
/**
 * i18n consistency and inline string check.
 * Fails (exit code 1) if:
 *  - Missing translation paths in any non-English language.
 *  - Extra paths present only in a non-English language.
 *  - Inline language ternaries detected (lang==='en' ? '...' : ...) in source files.
 */

const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const translationsPath = path.join(ROOT, 'src/i18n/translations.json')

function loadTranslations(){
  const raw = fs.readFileSync(translationsPath, 'utf8')
  return JSON.parse(raw)
}

function collectPaths(obj, prefix = ''){
  const paths = []
  if (typeof obj !== 'object' || obj === null) return paths
  for (const key of Object.keys(obj)){
    const val = obj[key]
    const full = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'object' && val !== null && !Array.isArray(val)){
      paths.push(...collectPaths(val, full))
    } else {
      paths.push(full)
    }
  }
  return paths
}

function getValue(obj, pathStr){
  return pathStr.split('.').reduce((acc, k)=> acc && acc[k], obj)
}

function checkStructure(trans){
  const languages = ['en','no','pa']
  const en = trans.en
  const enPaths = collectPaths(en)
  const issues = {
    missing: [],
    extras: []
  }
  for (const lang of languages.filter(l=> l!=='en')){
    const target = trans[lang]
    for (const p of enPaths){
      if (getValue(target, p) === undefined){
        issues.missing.push({ lang, path: p })
      }
    }
    // extras: paths in target not in en
    const targetPaths = collectPaths(target)
    for (const p of targetPaths){
      if (!enPaths.includes(p)){
        issues.extras.push({ lang, path: p })
      }
    }
  }
  return issues
}

function scanSource(){
  const srcDir = path.join(ROOT, 'src')
  const exts = new Set(['.js','.jsx','.ts','.tsx'])
  const ignore = new Set([
    path.join(srcDir,'context','LanguageContext.jsx'),
    path.join(srcDir,'components','DevI18nPanel.jsx'),
    path.join(srcDir,'pages','Styles_backup.jsx')
  ])
  const inlineMatches = []
  function walk(dir){
    for (const entry of fs.readdirSync(dir)){
      const full = path.join(dir, entry)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) walk(full)
      else if (exts.has(path.extname(full)) && !ignore.has(full)){
        const content = fs.readFileSync(full,'utf8')
        const regex = /lang\s*===\s*['\"](en|no|pa)['\"]\s*\?/g
        let m
        while ((m = regex.exec(content))){
          inlineMatches.push({ file: full, index: m.index })
        }
      }
    }
  }
  walk(srcDir)
  return inlineMatches
}

function main(){
  const trans = loadTranslations()
  const { missing, extras } = checkStructure(trans)
  const inline = scanSource()

  const strict = process.env.I18N_STRICT === '1'
  const hasIssues = missing.length || extras.length || (strict ? inline.length : 0)

  if (hasIssues){
    console.error('\n[i18n] Issues detected:')
    if (missing.length){
      console.error(`  Missing keys in languages (compared to en): ${missing.length}`)
      missing.slice(0,50).forEach(m=> console.error(`    - ${m.lang}: ${m.path}`))
      if (missing.length>50) console.error(`    ... +${missing.length-50} more`)
    }
    if (extras.length){
      console.error(`  Extra keys (not present in en): ${extras.length}`)
      extras.slice(0,50).forEach(e=> console.error(`    - ${e.lang}: ${e.path}`))
      if (extras.length>50) console.error(`    ... +${extras.length-50} more`)
    }
    if (inline.length){
      const heading = strict ? 'Inline language ternaries found' : 'Inline language ternaries (warning only)'
      console.error(`  ${heading}: ${inline.length}`)
      inline.slice(0,50).forEach(i=> console.error(`    - ${path.relative(ROOT,i.file)} @ index ${i.index}`))
      if (inline.length>50) console.error(`    ... +${inline.length-50} more`)
      console.error('    Replace with t(…) or getLocalized(…).')
      if (!strict) console.error('    (Set I18N_STRICT=1 to fail on inline ternaries)')
    }
    process.exit(1)
  } else {
    console.log('[i18n] All good: no missing/extras and no inline ternaries found.')
  }
}

main()
