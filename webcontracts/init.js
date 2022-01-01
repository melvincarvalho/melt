#!/usr/bin/env node

// IMPORTS
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'
import { fileURLToPath } from 'url'

// CONTRACT
function init(wallet, indir, walletFile, ledgerFile, creditsFile) {

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  indir = indir || path.join(__dirname, '..', 'webcredits')
  walletFile = walletFile || path.join(indir, 'wallet.json')
  ledgerFile = ledgerFile || path.join(indir, 'webledger.json')
  creditsFile = creditsFile || path.join(indir, 'webcredits.json')

  var ret = { "@type": "Wallet", "webledger": "./webledger.json", "webcredits": "./webcredits.json" }
  if (wallet.id) ret['@id'] = wallet.id
  if (wallet.currency) ret.currency = wallet.currency
  console.log('ret', ret)

  // MAIN
  var webcredits = []
  var webledger = {}
  if (!fs.existsSync(indir)) {
    console.log('making dir', indir)
    fs.mkdirSync(indir)
  }

  // WRITE
  fs.writeFileSync(walletFile, JSON.stringify(ret, null, 1))
  fs.writeFileSync(ledgerFile, JSON.stringify(webledger, null, 1))
  fs.writeFileSync(creditsFile, JSON.stringify(webcredits, null, 1))
}


// INIT
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const indir = path.join(__dirname, '..', 'webcredits')

globalThis.data = {
  currency: 'Mark',
  indir: indir,
  walletFile: path.join(indir, 'wallet.json'),
  ledgerFile: path.join(indir, 'webledger.json'),
  creditsFile: path.join(indir, 'webcredits.json')
}
var argv = minimist(process.argv.slice(2))
console.log(argv)

data.id = argv.id || data.id
data.currency = argv.currency || data.currency
data.indir = argv.indir || data.indir
data.walletFile = argv.walletFile || data.walletFile
data.ledgerFile = argv.ledgerFile || data.ledgerFile
data.walletFile = argv.walletFile || data.walletFile

console.log('data', data)

// MAIN
var credit = {
  id: data.id,
  currency: data.currency
}
init(credit, data.indir, data.walletFile, data.ledgerFile, data.creditsFile)

// EXPORT
export default init
