#!/usr/bin/env node

// IMPORTS
import fs from 'fs'
import minimist from 'minimist'
import cuid from 'cuid'
import path from 'path'
import { fileURLToPath } from 'url'

// WEB CONTRACT
/**
 * 
 * @param {Object} credit credit object is a transaction
 * @param {string} credit.id credit id as per JSON-LD or Linked Objects
 * @param {string} credit.source source of the transaction
 * @param {number} credit.amount amount
 * @param {string} credit.destination destination of the transaction
 * @param {string} credit.description description of the transaction
 * @param {string} credit.context context of the transaction
 * @param {number} credit.timestamp timestamp in UNIX format
 * @param {Object} options 
 * @returns 
 */
function mark(credit, options) {

  // INIT
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  var indir = options.indir || path.join(__dirname, '..', 'webcredits')
  var creditsFile = options.creditsFile || path.join(indir, 'webcredits.json')
  var ledgerFile = options.ledgerFile || path.join(indir, 'webledger.json')

  // MAIN
  // SETUP
  var credits = []
  var ledger = {}
  try {
    var credits = readJson(creditsFile)
    var ledger = readJson(ledgerFile)
  } catch (e) {
    if (!fs.existsSync(indir)) {
      console.log('making dir', indir)
      fs.mkdirSync(indir)
    }
    if (!fs.existsSync(creditsFile)) {
      var credits = []
      console.log('creating', creditsFile)
      writeJson(creditsFile, credits)
    }
    if (!fs.existsSync(ledgerFile)) {
      var ledger = {}
      console.log('creating', ledgerFile)
      writeJson(ledgerFile, ledger)
    }
  }

  if (credit.amount && credit.amount > 0) {
    // CREDIT
    var ret = { "@type": "Credit" }
    if (credit.id) ret['@id'] = credit.id
    if (credit.source) ret.source = credit.source
    if (credit.amount) ret.amount = credit.amount
    if (credit.currency) ret.currency = credit.currency
    if (credit.destination) ret.destination = credit.destination
    if (credit.timestamp) ret.timestamp = credit.timestamp
    if (credit.description) ret.description = credit.description
    if (credit.context) ret.context = credit.context
    console.log('ret', ret)
    credits.push(ret)

    // LEDGER
    ledger[credit.source] = ledger[credit.source] || 0
    if (ledger[credit.source] < data.amount && !options.allowNegative) {
      console.error('error: source', ledger[credit.source], 'is less than amount', data.amount)
      return
    }
    ledger[credit.source] -= data.amount
    ledger[credit.destination] = ledger[credit.destination] || 0
    ledger[credit.destination] += data.amount
    console.log('ledger', ledger)

    // WRITE
    writeJson(creditsFile, credits)
    writeJson(ledgerFile, ledger)
  }

}

// READ FUNCTIONS
// TODO add multi data store back end
function readJson(file) {
  var d = fs.readFileSync(file)
  return JSON.parse(d)
}

// WRITE FUNCTIONS
// TODO add proper lockfile
// TODO add multi data store back end
function writeJson(file, json) {
  fs.writeFileSync(file, JSON.stringify(json, null, 1))
}


// INIT
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const indir = path.join(__dirname, '..', 'webcredits')
const creditsFile = path.join(indir, 'webcredits.json')
console.log(indir)
console.log(creditsFile)

globalThis.data = {
  amount: 5,
  timestamp: Math.round(Date.now() / 1000),
  cuid: false,
  store: 'file',
  allowNegative: false
}
var argv = minimist(process.argv.slice(2))
console.log(argv)

data.id = argv.id || data.id
data.amount = argv.amount || parseInt(argv._[0]) || data.amount
data.currency = argv.currency || data.currency
data.timestamp = argv.timestamp || data.timestamp
data.source = argv.source || data.source
data.destination = argv.destination || data.destination
data.description = argv.description || data.description
data.context = argv.context || data.context
data.indir = argv.indir || data.indir
data.creditsFile = argv.creditsFile || data.creditsFile
data.ledgerFile = argv.ledgerFile || data.ledgerFile
data.cuid = !!argv.cuid || data.cuid
data.allowNegative = argv.allowNegative || data.allowNegative

console.log('data', data)

// MAIN
var credit = {
  id: data.id,
  source: data.source,
  amount: data.amount,
  currency: data.currency,
  destination: data.destination,
  description: data.description,
  context: data.context,
  timestamp: data.timestamp
}
if (data.cuid) {
  const cuidPrefix = 'urn:cuid:'
  credit.id = cuidPrefix + cuid()
}
var options = {
  allowNegative: data.allowNegative,
  indir: data.indir,
  creditsFile: data.creditsFile,
  ledgerFile: data.ledgerFile
}
console.log('options', options)
mark(credit, options)

// EXPORT
export default mark
