exports.id = 503;
exports.ids = [503];
exports.modules = {

/***/ 8889:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(9896)
const path = __webpack_require__(6928)
const os = __webpack_require__(857)
const crypto = __webpack_require__(6982)
const packageJson = __webpack_require__(56)

const version = packageJson.version

// Array of tips to display randomly
const TIPS = [
  '🔐 encrypt with Dotenvx: https://dotenvx.com',
  '🔐 prevent committing .env to code: https://dotenvx.com/precommit',
  '🔐 prevent building .env in docker: https://dotenvx.com/prebuild',
  '📡 add observability to secrets: https://dotenvx.com/ops',
  '👥 sync secrets across teammates & machines: https://dotenvx.com/ops',
  '🗂️ backup and recover secrets: https://dotenvx.com/ops',
  '✅ audit secrets and track compliance: https://dotenvx.com/ops',
  '🔄 add secrets lifecycle management: https://dotenvx.com/ops',
  '🔑 add access controls to secrets: https://dotenvx.com/ops',
  '🛠️  run anywhere with `dotenvx run -- yourcommand`',
  '⚙️  specify custom .env file path with { path: \'/custom/path/.env\' }',
  '⚙️  enable debug logging with { debug: true }',
  '⚙️  override existing env vars with { override: true }',
  '⚙️  suppress all logs with { quiet: true }',
  '⚙️  write to custom object with { processEnv: myObject }',
  '⚙️  load multiple .env files with { path: [\'.env.local\', \'.env\'] }'
]

// Get a random tip from the tips array
function _getRandomTip () {
  return TIPS[Math.floor(Math.random() * TIPS.length)]
}

function parseBoolean (value) {
  if (typeof value === 'string') {
    return !['false', '0', 'no', 'off', ''].includes(value.toLowerCase())
  }
  return Boolean(value)
}

function supportsAnsi () {
  return process.stdout.isTTY // && process.env.TERM !== 'dumb'
}

function dim (text) {
  return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text
}

const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

// Parse src into an Object
function parse (src) {
  const obj = {}

  // Convert buffer to string
  let lines = src.toString()

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/mg, '\n')

  let match
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]

    // Default undefined or null to empty string
    let value = (match[2] || '')

    // Remove whitespace
    value = value.trim()

    // Check if double quoted
    const maybeQuote = value[0]

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // Add to object
    obj[key] = value
  }

  return obj
}

function _parseVault (options) {
  options = options || {}

  const vaultPath = _vaultPath(options)
  options.path = vaultPath // parse .env.vault
  const result = DotenvModule.configDotenv(options)
  if (!result.parsed) {
    const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`)
    err.code = 'MISSING_DATA'
    throw err
  }

  // handle scenario for comma separated keys - for use with key rotation
  // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
  const keys = _dotenvKey(options).split(',')
  const length = keys.length

  let decrypted
  for (let i = 0; i < length; i++) {
    try {
      // Get full key
      const key = keys[i].trim()

      // Get instructions for decrypt
      const attrs = _instructions(result, key)

      // Decrypt
      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key)

      break
    } catch (error) {
      // last key
      if (i + 1 >= length) {
        throw error
      }
      // try next key
    }
  }

  // Parse decrypted .env string
  return DotenvModule.parse(decrypted)
}

function _warn (message) {
  console.error(`[dotenv@${version}][WARN] ${message}`)
}

function _debug (message) {
  console.log(`[dotenv@${version}][DEBUG] ${message}`)
}

function _log (message) {
  console.log(`[dotenv@${version}] ${message}`)
}

function _dotenvKey (options) {
  // prioritize developer directly setting options.DOTENV_KEY
  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
    return options.DOTENV_KEY
  }

  // secondary infra already contains a DOTENV_KEY environment variable
  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
    return process.env.DOTENV_KEY
  }

  // fallback to empty string
  return ''
}

function _instructions (result, dotenvKey) {
  // Parse DOTENV_KEY. Format is a URI
  let uri
  try {
    uri = new URL(dotenvKey)
  } catch (error) {
    if (error.code === 'ERR_INVALID_URL') {
      const err = new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development')
      err.code = 'INVALID_DOTENV_KEY'
      throw err
    }

    throw error
  }

  // Get decrypt key
  const key = uri.password
  if (!key) {
    const err = new Error('INVALID_DOTENV_KEY: Missing key part')
    err.code = 'INVALID_DOTENV_KEY'
    throw err
  }

  // Get environment
  const environment = uri.searchParams.get('environment')
  if (!environment) {
    const err = new Error('INVALID_DOTENV_KEY: Missing environment part')
    err.code = 'INVALID_DOTENV_KEY'
    throw err
  }

  // Get ciphertext payload
  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`
  const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION
  if (!ciphertext) {
    const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`)
    err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT'
    throw err
  }

  return { ciphertext, key }
}

function _vaultPath (options) {
  let possibleVaultPath = null

  if (options && options.path && options.path.length > 0) {
    if (Array.isArray(options.path)) {
      for (const filepath of options.path) {
        if (fs.existsSync(filepath)) {
          possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`
        }
      }
    } else {
      possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`
    }
  } else {
    possibleVaultPath = path.resolve(process.cwd(), '.env.vault')
  }

  if (fs.existsSync(possibleVaultPath)) {
    return possibleVaultPath
  }

  return null
}

function _resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

function _configVault (options) {
  const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || (options && options.debug))
  const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || (options && options.quiet))

  if (debug || !quiet) {
    _log('Loading env from encrypted .env.vault')
  }

  const parsed = DotenvModule._parseVault(options)

  let processEnv = process.env
  if (options && options.processEnv != null) {
    processEnv = options.processEnv
  }

  DotenvModule.populate(processEnv, parsed, options)

  return { parsed }
}

function configDotenv (options) {
  const dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  let processEnv = process.env
  if (options && options.processEnv != null) {
    processEnv = options.processEnv
  }
  let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || (options && options.debug))
  let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || (options && options.quiet))

  if (options && options.encoding) {
    encoding = options.encoding
  } else {
    if (debug) {
      _debug('No encoding is specified. UTF-8 is used by default')
    }
  }

  let optionPaths = [dotenvPath] // default, look for .env
  if (options && options.path) {
    if (!Array.isArray(options.path)) {
      optionPaths = [_resolveHome(options.path)]
    } else {
      optionPaths = [] // reset default
      for (const filepath of options.path) {
        optionPaths.push(_resolveHome(filepath))
      }
    }
  }

  // Build the parsed data in a temporary object (because we need to return it).  Once we have the final
  // parsed data, we will combine it with process.env (or options.processEnv if provided).
  let lastError
  const parsedAll = {}
  for (const path of optionPaths) {
    try {
      // Specifying an encoding returns a string instead of a buffer
      const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }))

      DotenvModule.populate(parsedAll, parsed, options)
    } catch (e) {
      if (debug) {
        _debug(`Failed to load ${path} ${e.message}`)
      }
      lastError = e
    }
  }

  const populated = DotenvModule.populate(processEnv, parsedAll, options)

  // handle user settings DOTENV_CONFIG_ options inside .env file(s)
  debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug)
  quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet)

  if (debug || !quiet) {
    const keysCount = Object.keys(populated).length
    const shortPaths = []
    for (const filePath of optionPaths) {
      try {
        const relative = path.relative(process.cwd(), filePath)
        shortPaths.push(relative)
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${filePath} ${e.message}`)
        }
        lastError = e
      }
    }

    _log(`injecting env (${keysCount}) from ${shortPaths.join(',')} ${dim(`-- tip: ${_getRandomTip()}`)}`)
  }

  if (lastError) {
    return { parsed: parsedAll, error: lastError }
  } else {
    return { parsed: parsedAll }
  }
}

// Populates process.env from .env file
function config (options) {
  // fallback to original dotenv if DOTENV_KEY is not set
  if (_dotenvKey(options).length === 0) {
    return DotenvModule.configDotenv(options)
  }

  const vaultPath = _vaultPath(options)

  // dotenvKey exists but .env.vault file does not exist
  if (!vaultPath) {
    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`)

    return DotenvModule.configDotenv(options)
  }

  return DotenvModule._configVault(options)
}

function decrypt (encrypted, keyStr) {
  const key = Buffer.from(keyStr.slice(-64), 'hex')
  let ciphertext = Buffer.from(encrypted, 'base64')

  const nonce = ciphertext.subarray(0, 12)
  const authTag = ciphertext.subarray(-16)
  ciphertext = ciphertext.subarray(12, -16)

  try {
    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)
    aesgcm.setAuthTag(authTag)
    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`
  } catch (error) {
    const isRange = error instanceof RangeError
    const invalidKeyLength = error.message === 'Invalid key length'
    const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data'

    if (isRange || invalidKeyLength) {
      const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)')
      err.code = 'INVALID_DOTENV_KEY'
      throw err
    } else if (decryptionFailed) {
      const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY')
      err.code = 'DECRYPTION_FAILED'
      throw err
    } else {
      throw error
    }
  }
}

// Populate process.env with parsed values
function populate (processEnv, parsed, options = {}) {
  const debug = Boolean(options && options.debug)
  const override = Boolean(options && options.override)
  const populated = {}

  if (typeof parsed !== 'object') {
    const err = new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate')
    err.code = 'OBJECT_REQUIRED'
    throw err
  }

  // Set process.env
  for (const key of Object.keys(parsed)) {
    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
      if (override === true) {
        processEnv[key] = parsed[key]
        populated[key] = parsed[key]
      }

      if (debug) {
        if (override === true) {
          _debug(`"${key}" is already defined and WAS overwritten`)
        } else {
          _debug(`"${key}" is already defined and was NOT overwritten`)
        }
      }
    } else {
      processEnv[key] = parsed[key]
      populated[key] = parsed[key]
    }
  }

  return populated
}

const DotenvModule = {
  configDotenv,
  _configVault,
  _parseVault,
  config,
  decrypt,
  parse,
  populate
}

module.exports.configDotenv = DotenvModule.configDotenv
module.exports._configVault = DotenvModule._configVault
module.exports._parseVault = DotenvModule._parseVault
module.exports.config = DotenvModule.config
module.exports.decrypt = DotenvModule.decrypt
module.exports.parse = DotenvModule.parse
module.exports.populate = DotenvModule.populate

module.exports = DotenvModule


/***/ }),

/***/ 4780:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(()=>{var e={"./node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist lazy recursive":function(e){function webpackEmptyAsyncContext(e){return Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t})}webpackEmptyAsyncContext.keys=()=>[],webpackEmptyAsyncContext.resolve=webpackEmptyAsyncContext,webpackEmptyAsyncContext.id="./node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist lazy recursive",e.exports=webpackEmptyAsyncContext}},t={};function __nested_webpack_require_494__(i){var s=t[i];if(void 0!==s)return s.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,__nested_webpack_require_494__),r.exports}__nested_webpack_require_494__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __nested_webpack_require_494__.d(t,{a:t}),t},__nested_webpack_require_494__.d=(e,t)=>{for(var i in t)__nested_webpack_require_494__.o(t,i)&&!__nested_webpack_require_494__.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},__nested_webpack_require_494__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var i={};(()=>{"use strict";__nested_webpack_require_494__.d(i,{default:()=>createJiti});const e=__webpack_require__(8161);var t=[509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,7,9,32,4,318,1,80,3,71,10,50,3,123,2,54,14,32,10,3,1,11,3,46,10,8,0,46,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,2,11,83,11,7,0,3,0,158,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,68,8,2,0,3,0,2,3,2,4,2,0,15,1,83,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,7,19,58,14,5,9,243,14,166,9,71,5,2,1,3,3,2,0,2,1,13,9,120,6,3,6,4,0,29,9,41,6,2,3,9,0,10,10,47,15,343,9,54,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,330,3,10,1,2,0,49,6,4,4,14,10,5350,0,7,14,11465,27,2343,9,87,9,39,4,60,6,26,9,535,9,470,0,2,54,8,3,82,0,12,1,19628,1,4178,9,519,45,3,22,543,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,101,0,161,6,10,9,357,0,62,13,499,13,245,1,2,9,726,6,110,6,6,9,4759,9,787719,239],s=[0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,13,10,2,14,2,6,2,1,2,10,2,14,2,6,2,1,4,51,13,310,10,21,11,7,25,5,2,41,2,8,70,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,71,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,39,27,10,22,251,41,7,1,17,2,60,28,11,0,9,21,43,17,47,20,28,22,13,52,58,1,3,0,14,44,33,24,27,35,30,0,3,0,9,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,20,1,64,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,31,9,2,0,3,0,2,37,2,0,26,0,2,0,45,52,19,3,21,2,31,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,14,0,72,26,38,6,186,43,117,63,32,7,3,0,3,7,2,1,2,23,16,0,2,0,95,7,3,38,17,0,2,0,29,0,11,39,8,0,22,0,12,45,20,0,19,72,200,32,32,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,328,18,16,0,2,12,2,33,125,0,80,921,103,110,18,195,2637,96,16,1071,18,5,26,3994,6,582,6842,29,1763,568,8,30,18,78,18,29,19,47,17,3,32,20,6,18,433,44,212,63,129,74,6,0,67,12,65,1,2,0,29,6135,9,1237,42,9,8936,3,2,6,2,1,2,290,16,0,30,2,3,0,15,3,9,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,1845,30,7,5,262,61,147,44,11,6,17,0,322,29,19,43,485,27,229,29,3,0,496,6,2,3,2,1,2,14,2,196,60,67,8,0,1205,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42719,33,4153,7,221,3,5761,15,7472,16,621,2467,541,1507,4938,6,4191],r="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",n={3:"abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",5:"class enum extends super const export import",6:"enum",strict:"implements interface let package private protected public static yield",strictBind:"eval arguments"},a="break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",o={5:a,"5module":a+" export import",6:a+" const class extends export import super"},h=/^in(stanceof)?$/,c=new RegExp("["+r+"]"),p=new RegExp("["+r+"‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･]");function isInAstralSet(e,t){for(var i=65536,s=0;s<t.length;s+=2){if((i+=t[s])>e)return!1;if((i+=t[s+1])>=e)return!0}return!1}function isIdentifierStart(e,t){return e<65?36===e:e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&c.test(String.fromCharCode(e)):!1!==t&&isInAstralSet(e,s)))}function isIdentifierChar(e,i){return e<48?36===e:e<58||!(e<65)&&(e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&p.test(String.fromCharCode(e)):!1!==i&&(isInAstralSet(e,s)||isInAstralSet(e,t)))))}var acorn_TokenType=function(e,t){void 0===t&&(t={}),this.label=e,this.keyword=t.keyword,this.beforeExpr=!!t.beforeExpr,this.startsExpr=!!t.startsExpr,this.isLoop=!!t.isLoop,this.isAssign=!!t.isAssign,this.prefix=!!t.prefix,this.postfix=!!t.postfix,this.binop=t.binop||null,this.updateContext=null};function binop(e,t){return new acorn_TokenType(e,{beforeExpr:!0,binop:t})}var l={beforeExpr:!0},u={startsExpr:!0},d={};function kw(e,t){return void 0===t&&(t={}),t.keyword=e,d[e]=new acorn_TokenType(e,t)}var f={num:new acorn_TokenType("num",u),regexp:new acorn_TokenType("regexp",u),string:new acorn_TokenType("string",u),name:new acorn_TokenType("name",u),privateId:new acorn_TokenType("privateId",u),eof:new acorn_TokenType("eof"),bracketL:new acorn_TokenType("[",{beforeExpr:!0,startsExpr:!0}),bracketR:new acorn_TokenType("]"),braceL:new acorn_TokenType("{",{beforeExpr:!0,startsExpr:!0}),braceR:new acorn_TokenType("}"),parenL:new acorn_TokenType("(",{beforeExpr:!0,startsExpr:!0}),parenR:new acorn_TokenType(")"),comma:new acorn_TokenType(",",l),semi:new acorn_TokenType(";",l),colon:new acorn_TokenType(":",l),dot:new acorn_TokenType("."),question:new acorn_TokenType("?",l),questionDot:new acorn_TokenType("?."),arrow:new acorn_TokenType("=>",l),template:new acorn_TokenType("template"),invalidTemplate:new acorn_TokenType("invalidTemplate"),ellipsis:new acorn_TokenType("...",l),backQuote:new acorn_TokenType("`",u),dollarBraceL:new acorn_TokenType("${",{beforeExpr:!0,startsExpr:!0}),eq:new acorn_TokenType("=",{beforeExpr:!0,isAssign:!0}),assign:new acorn_TokenType("_=",{beforeExpr:!0,isAssign:!0}),incDec:new acorn_TokenType("++/--",{prefix:!0,postfix:!0,startsExpr:!0}),prefix:new acorn_TokenType("!/~",{beforeExpr:!0,prefix:!0,startsExpr:!0}),logicalOR:binop("||",1),logicalAND:binop("&&",2),bitwiseOR:binop("|",3),bitwiseXOR:binop("^",4),bitwiseAND:binop("&",5),equality:binop("==/!=/===/!==",6),relational:binop("</>/<=/>=",7),bitShift:binop("<</>>/>>>",8),plusMin:new acorn_TokenType("+/-",{beforeExpr:!0,binop:9,prefix:!0,startsExpr:!0}),modulo:binop("%",10),star:binop("*",10),slash:binop("/",10),starstar:new acorn_TokenType("**",{beforeExpr:!0}),coalesce:binop("??",1),_break:kw("break"),_case:kw("case",l),_catch:kw("catch"),_continue:kw("continue"),_debugger:kw("debugger"),_default:kw("default",l),_do:kw("do",{isLoop:!0,beforeExpr:!0}),_else:kw("else",l),_finally:kw("finally"),_for:kw("for",{isLoop:!0}),_function:kw("function",u),_if:kw("if"),_return:kw("return",l),_switch:kw("switch"),_throw:kw("throw",l),_try:kw("try"),_var:kw("var"),_const:kw("const"),_while:kw("while",{isLoop:!0}),_with:kw("with"),_new:kw("new",{beforeExpr:!0,startsExpr:!0}),_this:kw("this",u),_super:kw("super",u),_class:kw("class",u),_extends:kw("extends",l),_export:kw("export"),_import:kw("import",u),_null:kw("null",u),_true:kw("true",u),_false:kw("false",u),_in:kw("in",{beforeExpr:!0,binop:7}),_instanceof:kw("instanceof",{beforeExpr:!0,binop:7}),_typeof:kw("typeof",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_void:kw("void",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_delete:kw("delete",{beforeExpr:!0,prefix:!0,startsExpr:!0})},m=/\r\n?|\n|\u2028|\u2029/,g=new RegExp(m.source,"g");function isNewLine(e){return 10===e||13===e||8232===e||8233===e}function nextLineBreak(e,t,i){void 0===i&&(i=e.length);for(var s=t;s<i;s++){var r=e.charCodeAt(s);if(isNewLine(r))return s<i-1&&13===r&&10===e.charCodeAt(s+1)?s+2:s+1}return-1}var x=/[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,v=/(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,y=Object.prototype,_=y.hasOwnProperty,E=y.toString,b=Object.hasOwn||function(e,t){return _.call(e,t)},S=Array.isArray||function(e){return"[object Array]"===E.call(e)},k=Object.create(null);function wordsRegexp(e){return k[e]||(k[e]=new RegExp("^(?:"+e.replace(/ /g,"|")+")$"))}function codePointToString(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode(55296+(e>>10),56320+(1023&e)))}var w=/(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,acorn_Position=function(e,t){this.line=e,this.column=t};acorn_Position.prototype.offset=function(e){return new acorn_Position(this.line,this.column+e)};var acorn_SourceLocation=function(e,t,i){this.start=t,this.end=i,null!==e.sourceFile&&(this.source=e.sourceFile)};function getLineInfo(e,t){for(var i=1,s=0;;){var r=nextLineBreak(e,s,t);if(r<0)return new acorn_Position(i,t-s);++i,s=r}}var I={ecmaVersion:null,sourceType:"script",onInsertedSemicolon:null,onTrailingComma:null,allowReserved:null,allowReturnOutsideFunction:!1,allowImportExportEverywhere:!1,allowAwaitOutsideFunction:null,allowSuperOutsideMethod:null,allowHashBang:!1,checkPrivateFields:!0,locations:!1,onToken:null,onComment:null,ranges:!1,program:null,sourceFile:null,directSourceFile:null,preserveParens:!1},C=!1;function getOptions(e){var t={};for(var i in I)t[i]=e&&b(e,i)?e[i]:I[i];if("latest"===t.ecmaVersion?t.ecmaVersion=1e8:null==t.ecmaVersion?(!C&&"object"==typeof console&&console.warn&&(C=!0,console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")),t.ecmaVersion=11):t.ecmaVersion>=2015&&(t.ecmaVersion-=2009),null==t.allowReserved&&(t.allowReserved=t.ecmaVersion<5),e&&null!=e.allowHashBang||(t.allowHashBang=t.ecmaVersion>=14),S(t.onToken)){var s=t.onToken;t.onToken=function(e){return s.push(e)}}return S(t.onComment)&&(t.onComment=function(e,t){return function(i,s,r,n,a,o){var h={type:i?"Block":"Line",value:s,start:r,end:n};e.locations&&(h.loc=new acorn_SourceLocation(this,a,o)),e.ranges&&(h.range=[r,n]),t.push(h)}}(t,t.onComment)),t}var R=256,P=259;function functionFlags(e,t){return 2|(e?4:0)|(t?8:0)}var acorn_Parser=function(e,t,i){this.options=e=getOptions(e),this.sourceFile=e.sourceFile,this.keywords=wordsRegexp(o[e.ecmaVersion>=6?6:"module"===e.sourceType?"5module":5]);var s="";!0!==e.allowReserved&&(s=n[e.ecmaVersion>=6?6:5===e.ecmaVersion?5:3],"module"===e.sourceType&&(s+=" await")),this.reservedWords=wordsRegexp(s);var r=(s?s+" ":"")+n.strict;this.reservedWordsStrict=wordsRegexp(r),this.reservedWordsStrictBind=wordsRegexp(r+" "+n.strictBind),this.input=String(t),this.containsEsc=!1,i?(this.pos=i,this.lineStart=this.input.lastIndexOf("\n",i-1)+1,this.curLine=this.input.slice(0,this.lineStart).split(m).length):(this.pos=this.lineStart=0,this.curLine=1),this.type=f.eof,this.value=null,this.start=this.end=this.pos,this.startLoc=this.endLoc=this.curPosition(),this.lastTokEndLoc=this.lastTokStartLoc=null,this.lastTokStart=this.lastTokEnd=this.pos,this.context=this.initialContext(),this.exprAllowed=!0,this.inModule="module"===e.sourceType,this.strict=this.inModule||this.strictDirective(this.pos),this.potentialArrowAt=-1,this.potentialArrowInForAwait=!1,this.yieldPos=this.awaitPos=this.awaitIdentPos=0,this.labels=[],this.undefinedExports=Object.create(null),0===this.pos&&e.allowHashBang&&"#!"===this.input.slice(0,2)&&this.skipLineComment(2),this.scopeStack=[],this.enterScope(1),this.regexpState=null,this.privateNameStack=[]},T={inFunction:{configurable:!0},inGenerator:{configurable:!0},inAsync:{configurable:!0},canAwait:{configurable:!0},allowSuper:{configurable:!0},allowDirectSuper:{configurable:!0},treatFunctionsAsVar:{configurable:!0},allowNewDotTarget:{configurable:!0},inClassStaticBlock:{configurable:!0}};acorn_Parser.prototype.parse=function(){var e=this.options.program||this.startNode();return this.nextToken(),this.parseTopLevel(e)},T.inFunction.get=function(){return(2&this.currentVarScope().flags)>0},T.inGenerator.get=function(){return(8&this.currentVarScope().flags)>0},T.inAsync.get=function(){return(4&this.currentVarScope().flags)>0},T.canAwait.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t)return!1;if(2&t)return(4&t)>0}return this.inModule&&this.options.ecmaVersion>=13||this.options.allowAwaitOutsideFunction},T.allowSuper.get=function(){return(64&this.currentThisScope().flags)>0||this.options.allowSuperOutsideMethod},T.allowDirectSuper.get=function(){return(128&this.currentThisScope().flags)>0},T.treatFunctionsAsVar.get=function(){return this.treatFunctionsAsVarInScope(this.currentScope())},T.allowNewDotTarget.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t||2&t&&!(16&t))return!0}return!1},T.inClassStaticBlock.get=function(){return(this.currentVarScope().flags&R)>0},acorn_Parser.extend=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=this,s=0;s<e.length;s++)i=e[s](i);return i},acorn_Parser.parse=function(e,t){return new this(t,e).parse()},acorn_Parser.parseExpressionAt=function(e,t,i){var s=new this(i,e,t);return s.nextToken(),s.parseExpression()},acorn_Parser.tokenizer=function(e,t){return new this(t,e)},Object.defineProperties(acorn_Parser.prototype,T);var A=acorn_Parser.prototype,N=/^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;A.strictDirective=function(e){if(this.options.ecmaVersion<5)return!1;for(;;){v.lastIndex=e,e+=v.exec(this.input)[0].length;var t=N.exec(this.input.slice(e));if(!t)return!1;if("use strict"===(t[1]||t[2])){v.lastIndex=e+t[0].length;var i=v.exec(this.input),s=i.index+i[0].length,r=this.input.charAt(s);return";"===r||"}"===r||m.test(i[0])&&!(/[(`.[+\-/*%<>=,?^&]/.test(r)||"!"===r&&"="===this.input.charAt(s+1))}e+=t[0].length,v.lastIndex=e,e+=v.exec(this.input)[0].length,";"===this.input[e]&&e++}},A.eat=function(e){return this.type===e&&(this.next(),!0)},A.isContextual=function(e){return this.type===f.name&&this.value===e&&!this.containsEsc},A.eatContextual=function(e){return!!this.isContextual(e)&&(this.next(),!0)},A.expectContextual=function(e){this.eatContextual(e)||this.unexpected()},A.canInsertSemicolon=function(){return this.type===f.eof||this.type===f.braceR||m.test(this.input.slice(this.lastTokEnd,this.start))},A.insertSemicolon=function(){if(this.canInsertSemicolon())return this.options.onInsertedSemicolon&&this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc),!0},A.semicolon=function(){this.eat(f.semi)||this.insertSemicolon()||this.unexpected()},A.afterTrailingComma=function(e,t){if(this.type===e)return this.options.onTrailingComma&&this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc),t||this.next(),!0},A.expect=function(e){this.eat(e)||this.unexpected()},A.unexpected=function(e){this.raise(null!=e?e:this.start,"Unexpected token")};var acorn_DestructuringErrors=function(){this.shorthandAssign=this.trailingComma=this.parenthesizedAssign=this.parenthesizedBind=this.doubleProto=-1};A.checkPatternErrors=function(e,t){if(e){e.trailingComma>-1&&this.raiseRecoverable(e.trailingComma,"Comma is not permitted after the rest element");var i=t?e.parenthesizedAssign:e.parenthesizedBind;i>-1&&this.raiseRecoverable(i,t?"Assigning to rvalue":"Parenthesized pattern")}},A.checkExpressionErrors=function(e,t){if(!e)return!1;var i=e.shorthandAssign,s=e.doubleProto;if(!t)return i>=0||s>=0;i>=0&&this.raise(i,"Shorthand property assignments are valid only in destructuring patterns"),s>=0&&this.raiseRecoverable(s,"Redefinition of __proto__ property")},A.checkYieldAwaitInDefaultParams=function(){this.yieldPos&&(!this.awaitPos||this.yieldPos<this.awaitPos)&&this.raise(this.yieldPos,"Yield expression cannot be a default value"),this.awaitPos&&this.raise(this.awaitPos,"Await expression cannot be a default value")},A.isSimpleAssignTarget=function(e){return"ParenthesizedExpression"===e.type?this.isSimpleAssignTarget(e.expression):"Identifier"===e.type||"MemberExpression"===e.type};var L=acorn_Parser.prototype;L.parseTopLevel=function(e){var t=Object.create(null);for(e.body||(e.body=[]);this.type!==f.eof;){var i=this.parseStatement(null,!0,t);e.body.push(i)}if(this.inModule)for(var s=0,r=Object.keys(this.undefinedExports);s<r.length;s+=1){var n=r[s];this.raiseRecoverable(this.undefinedExports[n].start,"Export '"+n+"' is not defined")}return this.adaptDirectivePrologue(e.body),this.next(),e.sourceType=this.options.sourceType,this.finishNode(e,"Program")};var O={kind:"loop"},D={kind:"switch"};L.isLet=function(e){if(this.options.ecmaVersion<6||!this.isContextual("let"))return!1;v.lastIndex=this.pos;var t=v.exec(this.input),i=this.pos+t[0].length,s=this.input.charCodeAt(i);if(91===s||92===s)return!0;if(e)return!1;if(123===s||s>55295&&s<56320)return!0;if(isIdentifierStart(s,!0)){for(var r=i+1;isIdentifierChar(s=this.input.charCodeAt(r),!0);)++r;if(92===s||s>55295&&s<56320)return!0;var n=this.input.slice(i,r);if(!h.test(n))return!0}return!1},L.isAsyncFunction=function(){if(this.options.ecmaVersion<8||!this.isContextual("async"))return!1;v.lastIndex=this.pos;var e,t=v.exec(this.input),i=this.pos+t[0].length;return!(m.test(this.input.slice(this.pos,i))||"function"!==this.input.slice(i,i+8)||i+8!==this.input.length&&(isIdentifierChar(e=this.input.charCodeAt(i+8))||e>55295&&e<56320))},L.isUsingKeyword=function(e,t){if(this.options.ecmaVersion<17||!this.isContextual(e?"await":"using"))return!1;v.lastIndex=this.pos;var i=v.exec(this.input),s=this.pos+i[0].length;if(m.test(this.input.slice(this.pos,s)))return!1;if(e){var r,n=s+5;if("using"!==this.input.slice(s,n)||n===this.input.length||isIdentifierChar(r=this.input.charCodeAt(n))||r>55295&&r<56320)return!1;v.lastIndex=n;var a=v.exec(this.input);if(a&&m.test(this.input.slice(n,n+a[0].length)))return!1}if(t){var o,h=s+2;if(!("of"!==this.input.slice(s,h)||h!==this.input.length&&(isIdentifierChar(o=this.input.charCodeAt(h))||o>55295&&o<56320)))return!1}var c=this.input.charCodeAt(s);return isIdentifierStart(c,!0)||92===c},L.isAwaitUsing=function(e){return this.isUsingKeyword(!0,e)},L.isUsing=function(e){return this.isUsingKeyword(!1,e)},L.parseStatement=function(e,t,i){var s,r=this.type,n=this.startNode();switch(this.isLet(e)&&(r=f._var,s="let"),r){case f._break:case f._continue:return this.parseBreakContinueStatement(n,r.keyword);case f._debugger:return this.parseDebuggerStatement(n);case f._do:return this.parseDoStatement(n);case f._for:return this.parseForStatement(n);case f._function:return e&&(this.strict||"if"!==e&&"label"!==e)&&this.options.ecmaVersion>=6&&this.unexpected(),this.parseFunctionStatement(n,!1,!e);case f._class:return e&&this.unexpected(),this.parseClass(n,!0);case f._if:return this.parseIfStatement(n);case f._return:return this.parseReturnStatement(n);case f._switch:return this.parseSwitchStatement(n);case f._throw:return this.parseThrowStatement(n);case f._try:return this.parseTryStatement(n);case f._const:case f._var:return s=s||this.value,e&&"var"!==s&&this.unexpected(),this.parseVarStatement(n,s);case f._while:return this.parseWhileStatement(n);case f._with:return this.parseWithStatement(n);case f.braceL:return this.parseBlock(!0,n);case f.semi:return this.parseEmptyStatement(n);case f._export:case f._import:if(this.options.ecmaVersion>10&&r===f._import){v.lastIndex=this.pos;var a=v.exec(this.input),o=this.pos+a[0].length,h=this.input.charCodeAt(o);if(40===h||46===h)return this.parseExpressionStatement(n,this.parseExpression())}return this.options.allowImportExportEverywhere||(t||this.raise(this.start,"'import' and 'export' may only appear at the top level"),this.inModule||this.raise(this.start,"'import' and 'export' may appear only with 'sourceType: module'")),r===f._import?this.parseImport(n):this.parseExport(n,i);default:if(this.isAsyncFunction())return e&&this.unexpected(),this.next(),this.parseFunctionStatement(n,!0,!e);var c=this.isAwaitUsing(!1)?"await using":this.isUsing(!1)?"using":null;if(c)return t&&"script"===this.options.sourceType&&this.raise(this.start,"Using declaration cannot appear in the top level when source type is `script`"),"await using"===c&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.next(),this.parseVar(n,!1,c),this.semicolon(),this.finishNode(n,"VariableDeclaration");var p=this.value,l=this.parseExpression();return r===f.name&&"Identifier"===l.type&&this.eat(f.colon)?this.parseLabeledStatement(n,p,l,e):this.parseExpressionStatement(n,l)}},L.parseBreakContinueStatement=function(e,t){var i="break"===t;this.next(),this.eat(f.semi)||this.insertSemicolon()?e.label=null:this.type!==f.name?this.unexpected():(e.label=this.parseIdent(),this.semicolon());for(var s=0;s<this.labels.length;++s){var r=this.labels[s];if(null==e.label||r.name===e.label.name){if(null!=r.kind&&(i||"loop"===r.kind))break;if(e.label&&i)break}}return s===this.labels.length&&this.raise(e.start,"Unsyntactic "+t),this.finishNode(e,i?"BreakStatement":"ContinueStatement")},L.parseDebuggerStatement=function(e){return this.next(),this.semicolon(),this.finishNode(e,"DebuggerStatement")},L.parseDoStatement=function(e){return this.next(),this.labels.push(O),e.body=this.parseStatement("do"),this.labels.pop(),this.expect(f._while),e.test=this.parseParenExpression(),this.options.ecmaVersion>=6?this.eat(f.semi):this.semicolon(),this.finishNode(e,"DoWhileStatement")},L.parseForStatement=function(e){this.next();var t=this.options.ecmaVersion>=9&&this.canAwait&&this.eatContextual("await")?this.lastTokStart:-1;if(this.labels.push(O),this.enterScope(0),this.expect(f.parenL),this.type===f.semi)return t>-1&&this.unexpected(t),this.parseFor(e,null);var i=this.isLet();if(this.type===f._var||this.type===f._const||i){var s=this.startNode(),r=i?"let":this.value;return this.next(),this.parseVar(s,!0,r),this.finishNode(s,"VariableDeclaration"),this.parseForAfterInit(e,s,t)}var n=this.isContextual("let"),a=!1,o=this.isUsing(!0)?"using":this.isAwaitUsing(!0)?"await using":null;if(o){var h=this.startNode();return this.next(),"await using"===o&&this.next(),this.parseVar(h,!0,o),this.finishNode(h,"VariableDeclaration"),this.parseForAfterInit(e,h,t)}var c=this.containsEsc,p=new acorn_DestructuringErrors,l=this.start,u=t>-1?this.parseExprSubscripts(p,"await"):this.parseExpression(!0,p);return this.type===f._in||(a=this.options.ecmaVersion>=6&&this.isContextual("of"))?(t>-1?(this.type===f._in&&this.unexpected(t),e.await=!0):a&&this.options.ecmaVersion>=8&&(u.start!==l||c||"Identifier"!==u.type||"async"!==u.name?this.options.ecmaVersion>=9&&(e.await=!1):this.unexpected()),n&&a&&this.raise(u.start,"The left-hand side of a for-of loop may not start with 'let'."),this.toAssignable(u,!1,p),this.checkLValPattern(u),this.parseForIn(e,u)):(this.checkExpressionErrors(p,!0),t>-1&&this.unexpected(t),this.parseFor(e,u))},L.parseForAfterInit=function(e,t,i){return(this.type===f._in||this.options.ecmaVersion>=6&&this.isContextual("of"))&&1===t.declarations.length?(this.options.ecmaVersion>=9&&(this.type===f._in?i>-1&&this.unexpected(i):e.await=i>-1),this.parseForIn(e,t)):(i>-1&&this.unexpected(i),this.parseFor(e,t))},L.parseFunctionStatement=function(e,t,i){return this.next(),this.parseFunction(e,U|(i?0:M),!1,t)},L.parseIfStatement=function(e){return this.next(),e.test=this.parseParenExpression(),e.consequent=this.parseStatement("if"),e.alternate=this.eat(f._else)?this.parseStatement("if"):null,this.finishNode(e,"IfStatement")},L.parseReturnStatement=function(e){return this.inFunction||this.options.allowReturnOutsideFunction||this.raise(this.start,"'return' outside of function"),this.next(),this.eat(f.semi)||this.insertSemicolon()?e.argument=null:(e.argument=this.parseExpression(),this.semicolon()),this.finishNode(e,"ReturnStatement")},L.parseSwitchStatement=function(e){var t;this.next(),e.discriminant=this.parseParenExpression(),e.cases=[],this.expect(f.braceL),this.labels.push(D),this.enterScope(0);for(var i=!1;this.type!==f.braceR;)if(this.type===f._case||this.type===f._default){var s=this.type===f._case;t&&this.finishNode(t,"SwitchCase"),e.cases.push(t=this.startNode()),t.consequent=[],this.next(),s?t.test=this.parseExpression():(i&&this.raiseRecoverable(this.lastTokStart,"Multiple default clauses"),i=!0,t.test=null),this.expect(f.colon)}else t||this.unexpected(),t.consequent.push(this.parseStatement(null));return this.exitScope(),t&&this.finishNode(t,"SwitchCase"),this.next(),this.labels.pop(),this.finishNode(e,"SwitchStatement")},L.parseThrowStatement=function(e){return this.next(),m.test(this.input.slice(this.lastTokEnd,this.start))&&this.raise(this.lastTokEnd,"Illegal newline after throw"),e.argument=this.parseExpression(),this.semicolon(),this.finishNode(e,"ThrowStatement")};var V=[];L.parseCatchClauseParam=function(){var e=this.parseBindingAtom(),t="Identifier"===e.type;return this.enterScope(t?32:0),this.checkLValPattern(e,t?4:2),this.expect(f.parenR),e},L.parseTryStatement=function(e){if(this.next(),e.block=this.parseBlock(),e.handler=null,this.type===f._catch){var t=this.startNode();this.next(),this.eat(f.parenL)?t.param=this.parseCatchClauseParam():(this.options.ecmaVersion<10&&this.unexpected(),t.param=null,this.enterScope(0)),t.body=this.parseBlock(!1),this.exitScope(),e.handler=this.finishNode(t,"CatchClause")}return e.finalizer=this.eat(f._finally)?this.parseBlock():null,e.handler||e.finalizer||this.raise(e.start,"Missing catch or finally clause"),this.finishNode(e,"TryStatement")},L.parseVarStatement=function(e,t,i){return this.next(),this.parseVar(e,!1,t,i),this.semicolon(),this.finishNode(e,"VariableDeclaration")},L.parseWhileStatement=function(e){return this.next(),e.test=this.parseParenExpression(),this.labels.push(O),e.body=this.parseStatement("while"),this.labels.pop(),this.finishNode(e,"WhileStatement")},L.parseWithStatement=function(e){return this.strict&&this.raise(this.start,"'with' in strict mode"),this.next(),e.object=this.parseParenExpression(),e.body=this.parseStatement("with"),this.finishNode(e,"WithStatement")},L.parseEmptyStatement=function(e){return this.next(),this.finishNode(e,"EmptyStatement")},L.parseLabeledStatement=function(e,t,i,s){for(var r=0,n=this.labels;r<n.length;r+=1){n[r].name===t&&this.raise(i.start,"Label '"+t+"' is already declared")}for(var a=this.type.isLoop?"loop":this.type===f._switch?"switch":null,o=this.labels.length-1;o>=0;o--){var h=this.labels[o];if(h.statementStart!==e.start)break;h.statementStart=this.start,h.kind=a}return this.labels.push({name:t,kind:a,statementStart:this.start}),e.body=this.parseStatement(s?-1===s.indexOf("label")?s+"label":s:"label"),this.labels.pop(),e.label=i,this.finishNode(e,"LabeledStatement")},L.parseExpressionStatement=function(e,t){return e.expression=t,this.semicolon(),this.finishNode(e,"ExpressionStatement")},L.parseBlock=function(e,t,i){for(void 0===e&&(e=!0),void 0===t&&(t=this.startNode()),t.body=[],this.expect(f.braceL),e&&this.enterScope(0);this.type!==f.braceR;){var s=this.parseStatement(null);t.body.push(s)}return i&&(this.strict=!1),this.next(),e&&this.exitScope(),this.finishNode(t,"BlockStatement")},L.parseFor=function(e,t){return e.init=t,this.expect(f.semi),e.test=this.type===f.semi?null:this.parseExpression(),this.expect(f.semi),e.update=this.type===f.parenR?null:this.parseExpression(),this.expect(f.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,"ForStatement")},L.parseForIn=function(e,t){var i=this.type===f._in;return this.next(),"VariableDeclaration"===t.type&&null!=t.declarations[0].init&&(!i||this.options.ecmaVersion<8||this.strict||"var"!==t.kind||"Identifier"!==t.declarations[0].id.type)&&this.raise(t.start,(i?"for-in":"for-of")+" loop variable declaration may not have an initializer"),e.left=t,e.right=i?this.parseExpression():this.parseMaybeAssign(),this.expect(f.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,i?"ForInStatement":"ForOfStatement")},L.parseVar=function(e,t,i,s){for(e.declarations=[],e.kind=i;;){var r=this.startNode();if(this.parseVarId(r,i),this.eat(f.eq)?r.init=this.parseMaybeAssign(t):s||"const"!==i||this.type===f._in||this.options.ecmaVersion>=6&&this.isContextual("of")?s||"using"!==i&&"await using"!==i||!(this.options.ecmaVersion>=17)||this.type===f._in||this.isContextual("of")?s||"Identifier"===r.id.type||t&&(this.type===f._in||this.isContextual("of"))?r.init=null:this.raise(this.lastTokEnd,"Complex binding patterns require an initialization value"):this.raise(this.lastTokEnd,"Missing initializer in "+i+" declaration"):this.unexpected(),e.declarations.push(this.finishNode(r,"VariableDeclarator")),!this.eat(f.comma))break}return e},L.parseVarId=function(e,t){e.id="using"===t||"await using"===t?this.parseIdent():this.parseBindingAtom(),this.checkLValPattern(e.id,"var"===t?1:2,!1)};var U=1,M=2;function isPrivateNameConflicted(e,t){var i=t.key.name,s=e[i],r="true";return"MethodDefinition"!==t.type||"get"!==t.kind&&"set"!==t.kind||(r=(t.static?"s":"i")+t.kind),"iget"===s&&"iset"===r||"iset"===s&&"iget"===r||"sget"===s&&"sset"===r||"sset"===s&&"sget"===r?(e[i]="true",!1):!!s||(e[i]=r,!1)}function checkKeyName(e,t){var i=e.computed,s=e.key;return!i&&("Identifier"===s.type&&s.name===t||"Literal"===s.type&&s.value===t)}L.parseFunction=function(e,t,i,s,r){this.initFunction(e),(this.options.ecmaVersion>=9||this.options.ecmaVersion>=6&&!s)&&(this.type===f.star&&t&M&&this.unexpected(),e.generator=this.eat(f.star)),this.options.ecmaVersion>=8&&(e.async=!!s),t&U&&(e.id=4&t&&this.type!==f.name?null:this.parseIdent(),!e.id||t&M||this.checkLValSimple(e.id,this.strict||e.generator||e.async?this.treatFunctionsAsVar?1:2:3));var n=this.yieldPos,a=this.awaitPos,o=this.awaitIdentPos;return this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(functionFlags(e.async,e.generator)),t&U||(e.id=this.type===f.name?this.parseIdent():null),this.parseFunctionParams(e),this.parseFunctionBody(e,i,!1,r),this.yieldPos=n,this.awaitPos=a,this.awaitIdentPos=o,this.finishNode(e,t&U?"FunctionDeclaration":"FunctionExpression")},L.parseFunctionParams=function(e){this.expect(f.parenL),e.params=this.parseBindingList(f.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams()},L.parseClass=function(e,t){this.next();var i=this.strict;this.strict=!0,this.parseClassId(e,t),this.parseClassSuper(e);var s=this.enterClassBody(),r=this.startNode(),n=!1;for(r.body=[],this.expect(f.braceL);this.type!==f.braceR;){var a=this.parseClassElement(null!==e.superClass);a&&(r.body.push(a),"MethodDefinition"===a.type&&"constructor"===a.kind?(n&&this.raiseRecoverable(a.start,"Duplicate constructor in the same class"),n=!0):a.key&&"PrivateIdentifier"===a.key.type&&isPrivateNameConflicted(s,a)&&this.raiseRecoverable(a.key.start,"Identifier '#"+a.key.name+"' has already been declared"))}return this.strict=i,this.next(),e.body=this.finishNode(r,"ClassBody"),this.exitClassBody(),this.finishNode(e,t?"ClassDeclaration":"ClassExpression")},L.parseClassElement=function(e){if(this.eat(f.semi))return null;var t=this.options.ecmaVersion,i=this.startNode(),s="",r=!1,n=!1,a="method",o=!1;if(this.eatContextual("static")){if(t>=13&&this.eat(f.braceL))return this.parseClassStaticBlock(i),i;this.isClassElementNameStart()||this.type===f.star?o=!0:s="static"}if(i.static=o,!s&&t>=8&&this.eatContextual("async")&&(!this.isClassElementNameStart()&&this.type!==f.star||this.canInsertSemicolon()?s="async":n=!0),!s&&(t>=9||!n)&&this.eat(f.star)&&(r=!0),!s&&!n&&!r){var h=this.value;(this.eatContextual("get")||this.eatContextual("set"))&&(this.isClassElementNameStart()?a=h:s=h)}if(s?(i.computed=!1,i.key=this.startNodeAt(this.lastTokStart,this.lastTokStartLoc),i.key.name=s,this.finishNode(i.key,"Identifier")):this.parseClassElementName(i),t<13||this.type===f.parenL||"method"!==a||r||n){var c=!i.static&&checkKeyName(i,"constructor"),p=c&&e;c&&"method"!==a&&this.raise(i.key.start,"Constructor can't have get/set modifier"),i.kind=c?"constructor":a,this.parseClassMethod(i,r,n,p)}else this.parseClassField(i);return i},L.isClassElementNameStart=function(){return this.type===f.name||this.type===f.privateId||this.type===f.num||this.type===f.string||this.type===f.bracketL||this.type.keyword},L.parseClassElementName=function(e){this.type===f.privateId?("constructor"===this.value&&this.raise(this.start,"Classes can't have an element named '#constructor'"),e.computed=!1,e.key=this.parsePrivateIdent()):this.parsePropertyName(e)},L.parseClassMethod=function(e,t,i,s){var r=e.key;"constructor"===e.kind?(t&&this.raise(r.start,"Constructor can't be a generator"),i&&this.raise(r.start,"Constructor can't be an async method")):e.static&&checkKeyName(e,"prototype")&&this.raise(r.start,"Classes may not have a static property named prototype");var n=e.value=this.parseMethod(t,i,s);return"get"===e.kind&&0!==n.params.length&&this.raiseRecoverable(n.start,"getter should have no params"),"set"===e.kind&&1!==n.params.length&&this.raiseRecoverable(n.start,"setter should have exactly one param"),"set"===e.kind&&"RestElement"===n.params[0].type&&this.raiseRecoverable(n.params[0].start,"Setter cannot use rest params"),this.finishNode(e,"MethodDefinition")},L.parseClassField=function(e){return checkKeyName(e,"constructor")?this.raise(e.key.start,"Classes can't have a field named 'constructor'"):e.static&&checkKeyName(e,"prototype")&&this.raise(e.key.start,"Classes can't have a static field named 'prototype'"),this.eat(f.eq)?(this.enterScope(576),e.value=this.parseMaybeAssign(),this.exitScope()):e.value=null,this.semicolon(),this.finishNode(e,"PropertyDefinition")},L.parseClassStaticBlock=function(e){e.body=[];var t=this.labels;for(this.labels=[],this.enterScope(320);this.type!==f.braceR;){var i=this.parseStatement(null);e.body.push(i)}return this.next(),this.exitScope(),this.labels=t,this.finishNode(e,"StaticBlock")},L.parseClassId=function(e,t){this.type===f.name?(e.id=this.parseIdent(),t&&this.checkLValSimple(e.id,2,!1)):(!0===t&&this.unexpected(),e.id=null)},L.parseClassSuper=function(e){e.superClass=this.eat(f._extends)?this.parseExprSubscripts(null,!1):null},L.enterClassBody=function(){var e={declared:Object.create(null),used:[]};return this.privateNameStack.push(e),e.declared},L.exitClassBody=function(){var e=this.privateNameStack.pop(),t=e.declared,i=e.used;if(this.options.checkPrivateFields)for(var s=this.privateNameStack.length,r=0===s?null:this.privateNameStack[s-1],n=0;n<i.length;++n){var a=i[n];b(t,a.name)||(r?r.used.push(a):this.raiseRecoverable(a.start,"Private field '#"+a.name+"' must be declared in an enclosing class"))}},L.parseExportAllDeclaration=function(e,t){return this.options.ecmaVersion>=11&&(this.eatContextual("as")?(e.exported=this.parseModuleExportName(),this.checkExport(t,e.exported,this.lastTokStart)):e.exported=null),this.expectContextual("from"),this.type!==f.string&&this.unexpected(),e.source=this.parseExprAtom(),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause()),this.semicolon(),this.finishNode(e,"ExportAllDeclaration")},L.parseExport=function(e,t){if(this.next(),this.eat(f.star))return this.parseExportAllDeclaration(e,t);if(this.eat(f._default))return this.checkExport(t,"default",this.lastTokStart),e.declaration=this.parseExportDefaultDeclaration(),this.finishNode(e,"ExportDefaultDeclaration");if(this.shouldParseExportStatement())e.declaration=this.parseExportDeclaration(e),"VariableDeclaration"===e.declaration.type?this.checkVariableExport(t,e.declaration.declarations):this.checkExport(t,e.declaration.id,e.declaration.id.start),e.specifiers=[],e.source=null,this.options.ecmaVersion>=16&&(e.attributes=[]);else{if(e.declaration=null,e.specifiers=this.parseExportSpecifiers(t),this.eatContextual("from"))this.type!==f.string&&this.unexpected(),e.source=this.parseExprAtom(),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause());else{for(var i=0,s=e.specifiers;i<s.length;i+=1){var r=s[i];this.checkUnreserved(r.local),this.checkLocalExport(r.local),"Literal"===r.local.type&&this.raise(r.local.start,"A string literal cannot be used as an exported binding without `from`.")}e.source=null,this.options.ecmaVersion>=16&&(e.attributes=[])}this.semicolon()}return this.finishNode(e,"ExportNamedDeclaration")},L.parseExportDeclaration=function(e){return this.parseStatement(null)},L.parseExportDefaultDeclaration=function(){var e;if(this.type===f._function||(e=this.isAsyncFunction())){var t=this.startNode();return this.next(),e&&this.next(),this.parseFunction(t,4|U,!1,e)}if(this.type===f._class){var i=this.startNode();return this.parseClass(i,"nullableID")}var s=this.parseMaybeAssign();return this.semicolon(),s},L.checkExport=function(e,t,i){e&&("string"!=typeof t&&(t="Identifier"===t.type?t.name:t.value),b(e,t)&&this.raiseRecoverable(i,"Duplicate export '"+t+"'"),e[t]=!0)},L.checkPatternExport=function(e,t){var i=t.type;if("Identifier"===i)this.checkExport(e,t,t.start);else if("ObjectPattern"===i)for(var s=0,r=t.properties;s<r.length;s+=1){var n=r[s];this.checkPatternExport(e,n)}else if("ArrayPattern"===i)for(var a=0,o=t.elements;a<o.length;a+=1){var h=o[a];h&&this.checkPatternExport(e,h)}else"Property"===i?this.checkPatternExport(e,t.value):"AssignmentPattern"===i?this.checkPatternExport(e,t.left):"RestElement"===i&&this.checkPatternExport(e,t.argument)},L.checkVariableExport=function(e,t){if(e)for(var i=0,s=t;i<s.length;i+=1){var r=s[i];this.checkPatternExport(e,r.id)}},L.shouldParseExportStatement=function(){return"var"===this.type.keyword||"const"===this.type.keyword||"class"===this.type.keyword||"function"===this.type.keyword||this.isLet()||this.isAsyncFunction()},L.parseExportSpecifier=function(e){var t=this.startNode();return t.local=this.parseModuleExportName(),t.exported=this.eatContextual("as")?this.parseModuleExportName():t.local,this.checkExport(e,t.exported,t.exported.start),this.finishNode(t,"ExportSpecifier")},L.parseExportSpecifiers=function(e){var t=[],i=!0;for(this.expect(f.braceL);!this.eat(f.braceR);){if(i)i=!1;else if(this.expect(f.comma),this.afterTrailingComma(f.braceR))break;t.push(this.parseExportSpecifier(e))}return t},L.parseImport=function(e){return this.next(),this.type===f.string?(e.specifiers=V,e.source=this.parseExprAtom()):(e.specifiers=this.parseImportSpecifiers(),this.expectContextual("from"),e.source=this.type===f.string?this.parseExprAtom():this.unexpected()),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause()),this.semicolon(),this.finishNode(e,"ImportDeclaration")},L.parseImportSpecifier=function(){var e=this.startNode();return e.imported=this.parseModuleExportName(),this.eatContextual("as")?e.local=this.parseIdent():(this.checkUnreserved(e.imported),e.local=e.imported),this.checkLValSimple(e.local,2),this.finishNode(e,"ImportSpecifier")},L.parseImportDefaultSpecifier=function(){var e=this.startNode();return e.local=this.parseIdent(),this.checkLValSimple(e.local,2),this.finishNode(e,"ImportDefaultSpecifier")},L.parseImportNamespaceSpecifier=function(){var e=this.startNode();return this.next(),this.expectContextual("as"),e.local=this.parseIdent(),this.checkLValSimple(e.local,2),this.finishNode(e,"ImportNamespaceSpecifier")},L.parseImportSpecifiers=function(){var e=[],t=!0;if(this.type===f.name&&(e.push(this.parseImportDefaultSpecifier()),!this.eat(f.comma)))return e;if(this.type===f.star)return e.push(this.parseImportNamespaceSpecifier()),e;for(this.expect(f.braceL);!this.eat(f.braceR);){if(t)t=!1;else if(this.expect(f.comma),this.afterTrailingComma(f.braceR))break;e.push(this.parseImportSpecifier())}return e},L.parseWithClause=function(){var e=[];if(!this.eat(f._with))return e;this.expect(f.braceL);for(var t={},i=!0;!this.eat(f.braceR);){if(i)i=!1;else if(this.expect(f.comma),this.afterTrailingComma(f.braceR))break;var s=this.parseImportAttribute(),r="Identifier"===s.key.type?s.key.name:s.key.value;b(t,r)&&this.raiseRecoverable(s.key.start,"Duplicate attribute key '"+r+"'"),t[r]=!0,e.push(s)}return e},L.parseImportAttribute=function(){var e=this.startNode();return e.key=this.type===f.string?this.parseExprAtom():this.parseIdent("never"!==this.options.allowReserved),this.expect(f.colon),this.type!==f.string&&this.unexpected(),e.value=this.parseExprAtom(),this.finishNode(e,"ImportAttribute")},L.parseModuleExportName=function(){if(this.options.ecmaVersion>=13&&this.type===f.string){var e=this.parseLiteral(this.value);return w.test(e.value)&&this.raise(e.start,"An export name cannot include a lone surrogate."),e}return this.parseIdent(!0)},L.adaptDirectivePrologue=function(e){for(var t=0;t<e.length&&this.isDirectiveCandidate(e[t]);++t)e[t].directive=e[t].expression.raw.slice(1,-1)},L.isDirectiveCandidate=function(e){return this.options.ecmaVersion>=5&&"ExpressionStatement"===e.type&&"Literal"===e.expression.type&&"string"==typeof e.expression.value&&('"'===this.input[e.start]||"'"===this.input[e.start])};var j=acorn_Parser.prototype;j.toAssignable=function(e,t,i){if(this.options.ecmaVersion>=6&&e)switch(e.type){case"Identifier":this.inAsync&&"await"===e.name&&this.raise(e.start,"Cannot use 'await' as identifier inside an async function");break;case"ObjectPattern":case"ArrayPattern":case"AssignmentPattern":case"RestElement":break;case"ObjectExpression":e.type="ObjectPattern",i&&this.checkPatternErrors(i,!0);for(var s=0,r=e.properties;s<r.length;s+=1){var n=r[s];this.toAssignable(n,t),"RestElement"!==n.type||"ArrayPattern"!==n.argument.type&&"ObjectPattern"!==n.argument.type||this.raise(n.argument.start,"Unexpected token")}break;case"Property":"init"!==e.kind&&this.raise(e.key.start,"Object pattern can't contain getter or setter"),this.toAssignable(e.value,t);break;case"ArrayExpression":e.type="ArrayPattern",i&&this.checkPatternErrors(i,!0),this.toAssignableList(e.elements,t);break;case"SpreadElement":e.type="RestElement",this.toAssignable(e.argument,t),"AssignmentPattern"===e.argument.type&&this.raise(e.argument.start,"Rest elements cannot have a default value");break;case"AssignmentExpression":"="!==e.operator&&this.raise(e.left.end,"Only '=' operator can be used for specifying default value."),e.type="AssignmentPattern",delete e.operator,this.toAssignable(e.left,t);break;case"ParenthesizedExpression":this.toAssignable(e.expression,t,i);break;case"ChainExpression":this.raiseRecoverable(e.start,"Optional chaining cannot appear in left-hand side");break;case"MemberExpression":if(!t)break;default:this.raise(e.start,"Assigning to rvalue")}else i&&this.checkPatternErrors(i,!0);return e},j.toAssignableList=function(e,t){for(var i=e.length,s=0;s<i;s++){var r=e[s];r&&this.toAssignable(r,t)}if(i){var n=e[i-1];6===this.options.ecmaVersion&&t&&n&&"RestElement"===n.type&&"Identifier"!==n.argument.type&&this.unexpected(n.argument.start)}return e},j.parseSpread=function(e){var t=this.startNode();return this.next(),t.argument=this.parseMaybeAssign(!1,e),this.finishNode(t,"SpreadElement")},j.parseRestBinding=function(){var e=this.startNode();return this.next(),6===this.options.ecmaVersion&&this.type!==f.name&&this.unexpected(),e.argument=this.parseBindingAtom(),this.finishNode(e,"RestElement")},j.parseBindingAtom=function(){if(this.options.ecmaVersion>=6)switch(this.type){case f.bracketL:var e=this.startNode();return this.next(),e.elements=this.parseBindingList(f.bracketR,!0,!0),this.finishNode(e,"ArrayPattern");case f.braceL:return this.parseObj(!0)}return this.parseIdent()},j.parseBindingList=function(e,t,i,s){for(var r=[],n=!0;!this.eat(e);)if(n?n=!1:this.expect(f.comma),t&&this.type===f.comma)r.push(null);else{if(i&&this.afterTrailingComma(e))break;if(this.type===f.ellipsis){var a=this.parseRestBinding();this.parseBindingListItem(a),r.push(a),this.type===f.comma&&this.raiseRecoverable(this.start,"Comma is not permitted after the rest element"),this.expect(e);break}r.push(this.parseAssignableListItem(s))}return r},j.parseAssignableListItem=function(e){var t=this.parseMaybeDefault(this.start,this.startLoc);return this.parseBindingListItem(t),t},j.parseBindingListItem=function(e){return e},j.parseMaybeDefault=function(e,t,i){if(i=i||this.parseBindingAtom(),this.options.ecmaVersion<6||!this.eat(f.eq))return i;var s=this.startNodeAt(e,t);return s.left=i,s.right=this.parseMaybeAssign(),this.finishNode(s,"AssignmentPattern")},j.checkLValSimple=function(e,t,i){void 0===t&&(t=0);var s=0!==t;switch(e.type){case"Identifier":this.strict&&this.reservedWordsStrictBind.test(e.name)&&this.raiseRecoverable(e.start,(s?"Binding ":"Assigning to ")+e.name+" in strict mode"),s&&(2===t&&"let"===e.name&&this.raiseRecoverable(e.start,"let is disallowed as a lexically bound name"),i&&(b(i,e.name)&&this.raiseRecoverable(e.start,"Argument name clash"),i[e.name]=!0),5!==t&&this.declareName(e.name,t,e.start));break;case"ChainExpression":this.raiseRecoverable(e.start,"Optional chaining cannot appear in left-hand side");break;case"MemberExpression":s&&this.raiseRecoverable(e.start,"Binding member expression");break;case"ParenthesizedExpression":return s&&this.raiseRecoverable(e.start,"Binding parenthesized expression"),this.checkLValSimple(e.expression,t,i);default:this.raise(e.start,(s?"Binding":"Assigning to")+" rvalue")}},j.checkLValPattern=function(e,t,i){switch(void 0===t&&(t=0),e.type){case"ObjectPattern":for(var s=0,r=e.properties;s<r.length;s+=1){var n=r[s];this.checkLValInnerPattern(n,t,i)}break;case"ArrayPattern":for(var a=0,o=e.elements;a<o.length;a+=1){var h=o[a];h&&this.checkLValInnerPattern(h,t,i)}break;default:this.checkLValSimple(e,t,i)}},j.checkLValInnerPattern=function(e,t,i){switch(void 0===t&&(t=0),e.type){case"Property":this.checkLValInnerPattern(e.value,t,i);break;case"AssignmentPattern":this.checkLValPattern(e.left,t,i);break;case"RestElement":this.checkLValPattern(e.argument,t,i);break;default:this.checkLValPattern(e,t,i)}};var acorn_TokContext=function(e,t,i,s,r){this.token=e,this.isExpr=!!t,this.preserveSpace=!!i,this.override=s,this.generator=!!r},F={b_stat:new acorn_TokContext("{",!1),b_expr:new acorn_TokContext("{",!0),b_tmpl:new acorn_TokContext("${",!1),p_stat:new acorn_TokContext("(",!1),p_expr:new acorn_TokContext("(",!0),q_tmpl:new acorn_TokContext("`",!0,!0,function(e){return e.tryReadTemplateToken()}),f_stat:new acorn_TokContext("function",!1),f_expr:new acorn_TokContext("function",!0),f_expr_gen:new acorn_TokContext("function",!0,!1,null,!0),f_gen:new acorn_TokContext("function",!1,!1,null,!0)},B=acorn_Parser.prototype;B.initialContext=function(){return[F.b_stat]},B.curContext=function(){return this.context[this.context.length-1]},B.braceIsBlock=function(e){var t=this.curContext();return t===F.f_expr||t===F.f_stat||(e!==f.colon||t!==F.b_stat&&t!==F.b_expr?e===f._return||e===f.name&&this.exprAllowed?m.test(this.input.slice(this.lastTokEnd,this.start)):e===f._else||e===f.semi||e===f.eof||e===f.parenR||e===f.arrow||(e===f.braceL?t===F.b_stat:e!==f._var&&e!==f._const&&e!==f.name&&!this.exprAllowed):!t.isExpr)},B.inGeneratorContext=function(){for(var e=this.context.length-1;e>=1;e--){var t=this.context[e];if("function"===t.token)return t.generator}return!1},B.updateContext=function(e){var t,i=this.type;i.keyword&&e===f.dot?this.exprAllowed=!1:(t=i.updateContext)?t.call(this,e):this.exprAllowed=i.beforeExpr},B.overrideContext=function(e){this.curContext()!==e&&(this.context[this.context.length-1]=e)},f.parenR.updateContext=f.braceR.updateContext=function(){if(1!==this.context.length){var e=this.context.pop();e===F.b_stat&&"function"===this.curContext().token&&(e=this.context.pop()),this.exprAllowed=!e.isExpr}else this.exprAllowed=!0},f.braceL.updateContext=function(e){this.context.push(this.braceIsBlock(e)?F.b_stat:F.b_expr),this.exprAllowed=!0},f.dollarBraceL.updateContext=function(){this.context.push(F.b_tmpl),this.exprAllowed=!0},f.parenL.updateContext=function(e){var t=e===f._if||e===f._for||e===f._with||e===f._while;this.context.push(t?F.p_stat:F.p_expr),this.exprAllowed=!0},f.incDec.updateContext=function(){},f._function.updateContext=f._class.updateContext=function(e){!e.beforeExpr||e===f._else||e===f.semi&&this.curContext()!==F.p_stat||e===f._return&&m.test(this.input.slice(this.lastTokEnd,this.start))||(e===f.colon||e===f.braceL)&&this.curContext()===F.b_stat?this.context.push(F.f_stat):this.context.push(F.f_expr),this.exprAllowed=!1},f.colon.updateContext=function(){"function"===this.curContext().token&&this.context.pop(),this.exprAllowed=!0},f.backQuote.updateContext=function(){this.curContext()===F.q_tmpl?this.context.pop():this.context.push(F.q_tmpl),this.exprAllowed=!1},f.star.updateContext=function(e){if(e===f._function){var t=this.context.length-1;this.context[t]===F.f_expr?this.context[t]=F.f_expr_gen:this.context[t]=F.f_gen}this.exprAllowed=!0},f.name.updateContext=function(e){var t=!1;this.options.ecmaVersion>=6&&e!==f.dot&&("of"===this.value&&!this.exprAllowed||"yield"===this.value&&this.inGeneratorContext())&&(t=!0),this.exprAllowed=t};var $=acorn_Parser.prototype;function isLocalVariableAccess(e){return"Identifier"===e.type||"ParenthesizedExpression"===e.type&&isLocalVariableAccess(e.expression)}function isPrivateFieldAccess(e){return"MemberExpression"===e.type&&"PrivateIdentifier"===e.property.type||"ChainExpression"===e.type&&isPrivateFieldAccess(e.expression)||"ParenthesizedExpression"===e.type&&isPrivateFieldAccess(e.expression)}$.checkPropClash=function(e,t,i){if(!(this.options.ecmaVersion>=9&&"SpreadElement"===e.type||this.options.ecmaVersion>=6&&(e.computed||e.method||e.shorthand))){var s,r=e.key;switch(r.type){case"Identifier":s=r.name;break;case"Literal":s=String(r.value);break;default:return}var n=e.kind;if(this.options.ecmaVersion>=6)"__proto__"===s&&"init"===n&&(t.proto&&(i?i.doubleProto<0&&(i.doubleProto=r.start):this.raiseRecoverable(r.start,"Redefinition of __proto__ property")),t.proto=!0);else{var a=t[s="$"+s];if(a)("init"===n?this.strict&&a.init||a.get||a.set:a.init||a[n])&&this.raiseRecoverable(r.start,"Redefinition of property");else a=t[s]={init:!1,get:!1,set:!1};a[n]=!0}}},$.parseExpression=function(e,t){var i=this.start,s=this.startLoc,r=this.parseMaybeAssign(e,t);if(this.type===f.comma){var n=this.startNodeAt(i,s);for(n.expressions=[r];this.eat(f.comma);)n.expressions.push(this.parseMaybeAssign(e,t));return this.finishNode(n,"SequenceExpression")}return r},$.parseMaybeAssign=function(e,t,i){if(this.isContextual("yield")){if(this.inGenerator)return this.parseYield(e);this.exprAllowed=!1}var s=!1,r=-1,n=-1,a=-1;t?(r=t.parenthesizedAssign,n=t.trailingComma,a=t.doubleProto,t.parenthesizedAssign=t.trailingComma=-1):(t=new acorn_DestructuringErrors,s=!0);var o=this.start,h=this.startLoc;this.type!==f.parenL&&this.type!==f.name||(this.potentialArrowAt=this.start,this.potentialArrowInForAwait="await"===e);var c=this.parseMaybeConditional(e,t);if(i&&(c=i.call(this,c,o,h)),this.type.isAssign){var p=this.startNodeAt(o,h);return p.operator=this.value,this.type===f.eq&&(c=this.toAssignable(c,!1,t)),s||(t.parenthesizedAssign=t.trailingComma=t.doubleProto=-1),t.shorthandAssign>=c.start&&(t.shorthandAssign=-1),this.type===f.eq?this.checkLValPattern(c):this.checkLValSimple(c),p.left=c,this.next(),p.right=this.parseMaybeAssign(e),a>-1&&(t.doubleProto=a),this.finishNode(p,"AssignmentExpression")}return s&&this.checkExpressionErrors(t,!0),r>-1&&(t.parenthesizedAssign=r),n>-1&&(t.trailingComma=n),c},$.parseMaybeConditional=function(e,t){var i=this.start,s=this.startLoc,r=this.parseExprOps(e,t);if(this.checkExpressionErrors(t))return r;if(this.eat(f.question)){var n=this.startNodeAt(i,s);return n.test=r,n.consequent=this.parseMaybeAssign(),this.expect(f.colon),n.alternate=this.parseMaybeAssign(e),this.finishNode(n,"ConditionalExpression")}return r},$.parseExprOps=function(e,t){var i=this.start,s=this.startLoc,r=this.parseMaybeUnary(t,!1,!1,e);return this.checkExpressionErrors(t)||r.start===i&&"ArrowFunctionExpression"===r.type?r:this.parseExprOp(r,i,s,-1,e)},$.parseExprOp=function(e,t,i,s,r){var n=this.type.binop;if(null!=n&&(!r||this.type!==f._in)&&n>s){var a=this.type===f.logicalOR||this.type===f.logicalAND,o=this.type===f.coalesce;o&&(n=f.logicalAND.binop);var h=this.value;this.next();var c=this.start,p=this.startLoc,l=this.parseExprOp(this.parseMaybeUnary(null,!1,!1,r),c,p,n,r),u=this.buildBinary(t,i,e,l,h,a||o);return(a&&this.type===f.coalesce||o&&(this.type===f.logicalOR||this.type===f.logicalAND))&&this.raiseRecoverable(this.start,"Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"),this.parseExprOp(u,t,i,s,r)}return e},$.buildBinary=function(e,t,i,s,r,n){"PrivateIdentifier"===s.type&&this.raise(s.start,"Private identifier can only be left side of binary expression");var a=this.startNodeAt(e,t);return a.left=i,a.operator=r,a.right=s,this.finishNode(a,n?"LogicalExpression":"BinaryExpression")},$.parseMaybeUnary=function(e,t,i,s){var r,n=this.start,a=this.startLoc;if(this.isContextual("await")&&this.canAwait)r=this.parseAwait(s),t=!0;else if(this.type.prefix){var o=this.startNode(),h=this.type===f.incDec;o.operator=this.value,o.prefix=!0,this.next(),o.argument=this.parseMaybeUnary(null,!0,h,s),this.checkExpressionErrors(e,!0),h?this.checkLValSimple(o.argument):this.strict&&"delete"===o.operator&&isLocalVariableAccess(o.argument)?this.raiseRecoverable(o.start,"Deleting local variable in strict mode"):"delete"===o.operator&&isPrivateFieldAccess(o.argument)?this.raiseRecoverable(o.start,"Private fields can not be deleted"):t=!0,r=this.finishNode(o,h?"UpdateExpression":"UnaryExpression")}else if(t||this.type!==f.privateId){if(r=this.parseExprSubscripts(e,s),this.checkExpressionErrors(e))return r;for(;this.type.postfix&&!this.canInsertSemicolon();){var c=this.startNodeAt(n,a);c.operator=this.value,c.prefix=!1,c.argument=r,this.checkLValSimple(r),this.next(),r=this.finishNode(c,"UpdateExpression")}}else(s||0===this.privateNameStack.length)&&this.options.checkPrivateFields&&this.unexpected(),r=this.parsePrivateIdent(),this.type!==f._in&&this.unexpected();return i||!this.eat(f.starstar)?r:t?void this.unexpected(this.lastTokStart):this.buildBinary(n,a,r,this.parseMaybeUnary(null,!1,!1,s),"**",!1)},$.parseExprSubscripts=function(e,t){var i=this.start,s=this.startLoc,r=this.parseExprAtom(e,t);if("ArrowFunctionExpression"===r.type&&")"!==this.input.slice(this.lastTokStart,this.lastTokEnd))return r;var n=this.parseSubscripts(r,i,s,!1,t);return e&&"MemberExpression"===n.type&&(e.parenthesizedAssign>=n.start&&(e.parenthesizedAssign=-1),e.parenthesizedBind>=n.start&&(e.parenthesizedBind=-1),e.trailingComma>=n.start&&(e.trailingComma=-1)),n},$.parseSubscripts=function(e,t,i,s,r){for(var n=this.options.ecmaVersion>=8&&"Identifier"===e.type&&"async"===e.name&&this.lastTokEnd===e.end&&!this.canInsertSemicolon()&&e.end-e.start===5&&this.potentialArrowAt===e.start,a=!1;;){var o=this.parseSubscript(e,t,i,s,n,a,r);if(o.optional&&(a=!0),o===e||"ArrowFunctionExpression"===o.type){if(a){var h=this.startNodeAt(t,i);h.expression=o,o=this.finishNode(h,"ChainExpression")}return o}e=o}},$.shouldParseAsyncArrow=function(){return!this.canInsertSemicolon()&&this.eat(f.arrow)},$.parseSubscriptAsyncArrow=function(e,t,i,s){return this.parseArrowExpression(this.startNodeAt(e,t),i,!0,s)},$.parseSubscript=function(e,t,i,s,r,n,a){var o=this.options.ecmaVersion>=11,h=o&&this.eat(f.questionDot);s&&h&&this.raise(this.lastTokStart,"Optional chaining cannot appear in the callee of new expressions");var c=this.eat(f.bracketL);if(c||h&&this.type!==f.parenL&&this.type!==f.backQuote||this.eat(f.dot)){var p=this.startNodeAt(t,i);p.object=e,c?(p.property=this.parseExpression(),this.expect(f.bracketR)):this.type===f.privateId&&"Super"!==e.type?p.property=this.parsePrivateIdent():p.property=this.parseIdent("never"!==this.options.allowReserved),p.computed=!!c,o&&(p.optional=h),e=this.finishNode(p,"MemberExpression")}else if(!s&&this.eat(f.parenL)){var l=new acorn_DestructuringErrors,u=this.yieldPos,d=this.awaitPos,m=this.awaitIdentPos;this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0;var g=this.parseExprList(f.parenR,this.options.ecmaVersion>=8,!1,l);if(r&&!h&&this.shouldParseAsyncArrow())return this.checkPatternErrors(l,!1),this.checkYieldAwaitInDefaultParams(),this.awaitIdentPos>0&&this.raise(this.awaitIdentPos,"Cannot use 'await' as identifier inside an async function"),this.yieldPos=u,this.awaitPos=d,this.awaitIdentPos=m,this.parseSubscriptAsyncArrow(t,i,g,a);this.checkExpressionErrors(l,!0),this.yieldPos=u||this.yieldPos,this.awaitPos=d||this.awaitPos,this.awaitIdentPos=m||this.awaitIdentPos;var x=this.startNodeAt(t,i);x.callee=e,x.arguments=g,o&&(x.optional=h),e=this.finishNode(x,"CallExpression")}else if(this.type===f.backQuote){(h||n)&&this.raise(this.start,"Optional chaining cannot appear in the tag of tagged template expressions");var v=this.startNodeAt(t,i);v.tag=e,v.quasi=this.parseTemplate({isTagged:!0}),e=this.finishNode(v,"TaggedTemplateExpression")}return e},$.parseExprAtom=function(e,t,i){this.type===f.slash&&this.readRegexp();var s,r=this.potentialArrowAt===this.start;switch(this.type){case f._super:return this.allowSuper||this.raise(this.start,"'super' keyword outside a method"),s=this.startNode(),this.next(),this.type!==f.parenL||this.allowDirectSuper||this.raise(s.start,"super() call outside constructor of a subclass"),this.type!==f.dot&&this.type!==f.bracketL&&this.type!==f.parenL&&this.unexpected(),this.finishNode(s,"Super");case f._this:return s=this.startNode(),this.next(),this.finishNode(s,"ThisExpression");case f.name:var n=this.start,a=this.startLoc,o=this.containsEsc,h=this.parseIdent(!1);if(this.options.ecmaVersion>=8&&!o&&"async"===h.name&&!this.canInsertSemicolon()&&this.eat(f._function))return this.overrideContext(F.f_expr),this.parseFunction(this.startNodeAt(n,a),0,!1,!0,t);if(r&&!this.canInsertSemicolon()){if(this.eat(f.arrow))return this.parseArrowExpression(this.startNodeAt(n,a),[h],!1,t);if(this.options.ecmaVersion>=8&&"async"===h.name&&this.type===f.name&&!o&&(!this.potentialArrowInForAwait||"of"!==this.value||this.containsEsc))return h=this.parseIdent(!1),!this.canInsertSemicolon()&&this.eat(f.arrow)||this.unexpected(),this.parseArrowExpression(this.startNodeAt(n,a),[h],!0,t)}return h;case f.regexp:var c=this.value;return(s=this.parseLiteral(c.value)).regex={pattern:c.pattern,flags:c.flags},s;case f.num:case f.string:return this.parseLiteral(this.value);case f._null:case f._true:case f._false:return(s=this.startNode()).value=this.type===f._null?null:this.type===f._true,s.raw=this.type.keyword,this.next(),this.finishNode(s,"Literal");case f.parenL:var p=this.start,l=this.parseParenAndDistinguishExpression(r,t);return e&&(e.parenthesizedAssign<0&&!this.isSimpleAssignTarget(l)&&(e.parenthesizedAssign=p),e.parenthesizedBind<0&&(e.parenthesizedBind=p)),l;case f.bracketL:return s=this.startNode(),this.next(),s.elements=this.parseExprList(f.bracketR,!0,!0,e),this.finishNode(s,"ArrayExpression");case f.braceL:return this.overrideContext(F.b_expr),this.parseObj(!1,e);case f._function:return s=this.startNode(),this.next(),this.parseFunction(s,0);case f._class:return this.parseClass(this.startNode(),!1);case f._new:return this.parseNew();case f.backQuote:return this.parseTemplate();case f._import:return this.options.ecmaVersion>=11?this.parseExprImport(i):this.unexpected();default:return this.parseExprAtomDefault()}},$.parseExprAtomDefault=function(){this.unexpected()},$.parseExprImport=function(e){var t=this.startNode();if(this.containsEsc&&this.raiseRecoverable(this.start,"Escape sequence in keyword import"),this.next(),this.type===f.parenL&&!e)return this.parseDynamicImport(t);if(this.type===f.dot){var i=this.startNodeAt(t.start,t.loc&&t.loc.start);return i.name="import",t.meta=this.finishNode(i,"Identifier"),this.parseImportMeta(t)}this.unexpected()},$.parseDynamicImport=function(e){if(this.next(),e.source=this.parseMaybeAssign(),this.options.ecmaVersion>=16)this.eat(f.parenR)?e.options=null:(this.expect(f.comma),this.afterTrailingComma(f.parenR)?e.options=null:(e.options=this.parseMaybeAssign(),this.eat(f.parenR)||(this.expect(f.comma),this.afterTrailingComma(f.parenR)||this.unexpected())));else if(!this.eat(f.parenR)){var t=this.start;this.eat(f.comma)&&this.eat(f.parenR)?this.raiseRecoverable(t,"Trailing comma is not allowed in import()"):this.unexpected(t)}return this.finishNode(e,"ImportExpression")},$.parseImportMeta=function(e){this.next();var t=this.containsEsc;return e.property=this.parseIdent(!0),"meta"!==e.property.name&&this.raiseRecoverable(e.property.start,"The only valid meta property for import is 'import.meta'"),t&&this.raiseRecoverable(e.start,"'import.meta' must not contain escaped characters"),"module"===this.options.sourceType||this.options.allowImportExportEverywhere||this.raiseRecoverable(e.start,"Cannot use 'import.meta' outside a module"),this.finishNode(e,"MetaProperty")},$.parseLiteral=function(e){var t=this.startNode();return t.value=e,t.raw=this.input.slice(this.start,this.end),110===t.raw.charCodeAt(t.raw.length-1)&&(t.bigint=null!=t.value?t.value.toString():t.raw.slice(0,-1).replace(/_/g,"")),this.next(),this.finishNode(t,"Literal")},$.parseParenExpression=function(){this.expect(f.parenL);var e=this.parseExpression();return this.expect(f.parenR),e},$.shouldParseArrow=function(e){return!this.canInsertSemicolon()},$.parseParenAndDistinguishExpression=function(e,t){var i,s=this.start,r=this.startLoc,n=this.options.ecmaVersion>=8;if(this.options.ecmaVersion>=6){this.next();var a,o=this.start,h=this.startLoc,c=[],p=!0,l=!1,u=new acorn_DestructuringErrors,d=this.yieldPos,m=this.awaitPos;for(this.yieldPos=0,this.awaitPos=0;this.type!==f.parenR;){if(p?p=!1:this.expect(f.comma),n&&this.afterTrailingComma(f.parenR,!0)){l=!0;break}if(this.type===f.ellipsis){a=this.start,c.push(this.parseParenItem(this.parseRestBinding())),this.type===f.comma&&this.raiseRecoverable(this.start,"Comma is not permitted after the rest element");break}c.push(this.parseMaybeAssign(!1,u,this.parseParenItem))}var g=this.lastTokEnd,x=this.lastTokEndLoc;if(this.expect(f.parenR),e&&this.shouldParseArrow(c)&&this.eat(f.arrow))return this.checkPatternErrors(u,!1),this.checkYieldAwaitInDefaultParams(),this.yieldPos=d,this.awaitPos=m,this.parseParenArrowList(s,r,c,t);c.length&&!l||this.unexpected(this.lastTokStart),a&&this.unexpected(a),this.checkExpressionErrors(u,!0),this.yieldPos=d||this.yieldPos,this.awaitPos=m||this.awaitPos,c.length>1?((i=this.startNodeAt(o,h)).expressions=c,this.finishNodeAt(i,"SequenceExpression",g,x)):i=c[0]}else i=this.parseParenExpression();if(this.options.preserveParens){var v=this.startNodeAt(s,r);return v.expression=i,this.finishNode(v,"ParenthesizedExpression")}return i},$.parseParenItem=function(e){return e},$.parseParenArrowList=function(e,t,i,s){return this.parseArrowExpression(this.startNodeAt(e,t),i,!1,s)};var q=[];$.parseNew=function(){this.containsEsc&&this.raiseRecoverable(this.start,"Escape sequence in keyword new");var e=this.startNode();if(this.next(),this.options.ecmaVersion>=6&&this.type===f.dot){var t=this.startNodeAt(e.start,e.loc&&e.loc.start);t.name="new",e.meta=this.finishNode(t,"Identifier"),this.next();var i=this.containsEsc;return e.property=this.parseIdent(!0),"target"!==e.property.name&&this.raiseRecoverable(e.property.start,"The only valid meta property for new is 'new.target'"),i&&this.raiseRecoverable(e.start,"'new.target' must not contain escaped characters"),this.allowNewDotTarget||this.raiseRecoverable(e.start,"'new.target' can only be used in functions and class static block"),this.finishNode(e,"MetaProperty")}var s=this.start,r=this.startLoc;return e.callee=this.parseSubscripts(this.parseExprAtom(null,!1,!0),s,r,!0,!1),this.eat(f.parenL)?e.arguments=this.parseExprList(f.parenR,this.options.ecmaVersion>=8,!1):e.arguments=q,this.finishNode(e,"NewExpression")},$.parseTemplateElement=function(e){var t=e.isTagged,i=this.startNode();return this.type===f.invalidTemplate?(t||this.raiseRecoverable(this.start,"Bad escape sequence in untagged template literal"),i.value={raw:this.value.replace(/\r\n?/g,"\n"),cooked:null}):i.value={raw:this.input.slice(this.start,this.end).replace(/\r\n?/g,"\n"),cooked:this.value},this.next(),i.tail=this.type===f.backQuote,this.finishNode(i,"TemplateElement")},$.parseTemplate=function(e){void 0===e&&(e={});var t=e.isTagged;void 0===t&&(t=!1);var i=this.startNode();this.next(),i.expressions=[];var s=this.parseTemplateElement({isTagged:t});for(i.quasis=[s];!s.tail;)this.type===f.eof&&this.raise(this.pos,"Unterminated template literal"),this.expect(f.dollarBraceL),i.expressions.push(this.parseExpression()),this.expect(f.braceR),i.quasis.push(s=this.parseTemplateElement({isTagged:t}));return this.next(),this.finishNode(i,"TemplateLiteral")},$.isAsyncProp=function(e){return!e.computed&&"Identifier"===e.key.type&&"async"===e.key.name&&(this.type===f.name||this.type===f.num||this.type===f.string||this.type===f.bracketL||this.type.keyword||this.options.ecmaVersion>=9&&this.type===f.star)&&!m.test(this.input.slice(this.lastTokEnd,this.start))},$.parseObj=function(e,t){var i=this.startNode(),s=!0,r={};for(i.properties=[],this.next();!this.eat(f.braceR);){if(s)s=!1;else if(this.expect(f.comma),this.options.ecmaVersion>=5&&this.afterTrailingComma(f.braceR))break;var n=this.parseProperty(e,t);e||this.checkPropClash(n,r,t),i.properties.push(n)}return this.finishNode(i,e?"ObjectPattern":"ObjectExpression")},$.parseProperty=function(e,t){var i,s,r,n,a=this.startNode();if(this.options.ecmaVersion>=9&&this.eat(f.ellipsis))return e?(a.argument=this.parseIdent(!1),this.type===f.comma&&this.raiseRecoverable(this.start,"Comma is not permitted after the rest element"),this.finishNode(a,"RestElement")):(a.argument=this.parseMaybeAssign(!1,t),this.type===f.comma&&t&&t.trailingComma<0&&(t.trailingComma=this.start),this.finishNode(a,"SpreadElement"));this.options.ecmaVersion>=6&&(a.method=!1,a.shorthand=!1,(e||t)&&(r=this.start,n=this.startLoc),e||(i=this.eat(f.star)));var o=this.containsEsc;return this.parsePropertyName(a),!e&&!o&&this.options.ecmaVersion>=8&&!i&&this.isAsyncProp(a)?(s=!0,i=this.options.ecmaVersion>=9&&this.eat(f.star),this.parsePropertyName(a)):s=!1,this.parsePropertyValue(a,e,i,s,r,n,t,o),this.finishNode(a,"Property")},$.parseGetterSetter=function(e){var t=e.key.name;this.parsePropertyName(e),e.value=this.parseMethod(!1),e.kind=t;var i="get"===e.kind?0:1;if(e.value.params.length!==i){var s=e.value.start;"get"===e.kind?this.raiseRecoverable(s,"getter should have no params"):this.raiseRecoverable(s,"setter should have exactly one param")}else"set"===e.kind&&"RestElement"===e.value.params[0].type&&this.raiseRecoverable(e.value.params[0].start,"Setter cannot use rest params")},$.parsePropertyValue=function(e,t,i,s,r,n,a,o){(i||s)&&this.type===f.colon&&this.unexpected(),this.eat(f.colon)?(e.value=t?this.parseMaybeDefault(this.start,this.startLoc):this.parseMaybeAssign(!1,a),e.kind="init"):this.options.ecmaVersion>=6&&this.type===f.parenL?(t&&this.unexpected(),e.method=!0,e.value=this.parseMethod(i,s),e.kind="init"):t||o||!(this.options.ecmaVersion>=5)||e.computed||"Identifier"!==e.key.type||"get"!==e.key.name&&"set"!==e.key.name||this.type===f.comma||this.type===f.braceR||this.type===f.eq?this.options.ecmaVersion>=6&&!e.computed&&"Identifier"===e.key.type?((i||s)&&this.unexpected(),this.checkUnreserved(e.key),"await"!==e.key.name||this.awaitIdentPos||(this.awaitIdentPos=r),t?e.value=this.parseMaybeDefault(r,n,this.copyNode(e.key)):this.type===f.eq&&a?(a.shorthandAssign<0&&(a.shorthandAssign=this.start),e.value=this.parseMaybeDefault(r,n,this.copyNode(e.key))):e.value=this.copyNode(e.key),e.kind="init",e.shorthand=!0):this.unexpected():((i||s)&&this.unexpected(),this.parseGetterSetter(e))},$.parsePropertyName=function(e){if(this.options.ecmaVersion>=6){if(this.eat(f.bracketL))return e.computed=!0,e.key=this.parseMaybeAssign(),this.expect(f.bracketR),e.key;e.computed=!1}return e.key=this.type===f.num||this.type===f.string?this.parseExprAtom():this.parseIdent("never"!==this.options.allowReserved)},$.initFunction=function(e){e.id=null,this.options.ecmaVersion>=6&&(e.generator=e.expression=!1),this.options.ecmaVersion>=8&&(e.async=!1)},$.parseMethod=function(e,t,i){var s=this.startNode(),r=this.yieldPos,n=this.awaitPos,a=this.awaitIdentPos;return this.initFunction(s),this.options.ecmaVersion>=6&&(s.generator=e),this.options.ecmaVersion>=8&&(s.async=!!t),this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(64|functionFlags(t,s.generator)|(i?128:0)),this.expect(f.parenL),s.params=this.parseBindingList(f.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams(),this.parseFunctionBody(s,!1,!0,!1),this.yieldPos=r,this.awaitPos=n,this.awaitIdentPos=a,this.finishNode(s,"FunctionExpression")},$.parseArrowExpression=function(e,t,i,s){var r=this.yieldPos,n=this.awaitPos,a=this.awaitIdentPos;return this.enterScope(16|functionFlags(i,!1)),this.initFunction(e),this.options.ecmaVersion>=8&&(e.async=!!i),this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,e.params=this.toAssignableList(t,!0),this.parseFunctionBody(e,!0,!1,s),this.yieldPos=r,this.awaitPos=n,this.awaitIdentPos=a,this.finishNode(e,"ArrowFunctionExpression")},$.parseFunctionBody=function(e,t,i,s){var r=t&&this.type!==f.braceL,n=this.strict,a=!1;if(r)e.body=this.parseMaybeAssign(s),e.expression=!0,this.checkParams(e,!1);else{var o=this.options.ecmaVersion>=7&&!this.isSimpleParamList(e.params);n&&!o||(a=this.strictDirective(this.end))&&o&&this.raiseRecoverable(e.start,"Illegal 'use strict' directive in function with non-simple parameter list");var h=this.labels;this.labels=[],a&&(this.strict=!0),this.checkParams(e,!n&&!a&&!t&&!i&&this.isSimpleParamList(e.params)),this.strict&&e.id&&this.checkLValSimple(e.id,5),e.body=this.parseBlock(!1,void 0,a&&!n),e.expression=!1,this.adaptDirectivePrologue(e.body.body),this.labels=h}this.exitScope()},$.isSimpleParamList=function(e){for(var t=0,i=e;t<i.length;t+=1){if("Identifier"!==i[t].type)return!1}return!0},$.checkParams=function(e,t){for(var i=Object.create(null),s=0,r=e.params;s<r.length;s+=1){var n=r[s];this.checkLValInnerPattern(n,1,t?null:i)}},$.parseExprList=function(e,t,i,s){for(var r=[],n=!0;!this.eat(e);){if(n)n=!1;else if(this.expect(f.comma),t&&this.afterTrailingComma(e))break;var a=void 0;i&&this.type===f.comma?a=null:this.type===f.ellipsis?(a=this.parseSpread(s),s&&this.type===f.comma&&s.trailingComma<0&&(s.trailingComma=this.start)):a=this.parseMaybeAssign(!1,s),r.push(a)}return r},$.checkUnreserved=function(e){var t=e.start,i=e.end,s=e.name;(this.inGenerator&&"yield"===s&&this.raiseRecoverable(t,"Cannot use 'yield' as identifier inside a generator"),this.inAsync&&"await"===s&&this.raiseRecoverable(t,"Cannot use 'await' as identifier inside an async function"),this.currentThisScope().flags&P||"arguments"!==s||this.raiseRecoverable(t,"Cannot use 'arguments' in class field initializer"),!this.inClassStaticBlock||"arguments"!==s&&"await"!==s||this.raise(t,"Cannot use "+s+" in class static initialization block"),this.keywords.test(s)&&this.raise(t,"Unexpected keyword '"+s+"'"),this.options.ecmaVersion<6&&-1!==this.input.slice(t,i).indexOf("\\"))||(this.strict?this.reservedWordsStrict:this.reservedWords).test(s)&&(this.inAsync||"await"!==s||this.raiseRecoverable(t,"Cannot use keyword 'await' outside an async function"),this.raiseRecoverable(t,"The keyword '"+s+"' is reserved"))},$.parseIdent=function(e){var t=this.parseIdentNode();return this.next(!!e),this.finishNode(t,"Identifier"),e||(this.checkUnreserved(t),"await"!==t.name||this.awaitIdentPos||(this.awaitIdentPos=t.start)),t},$.parseIdentNode=function(){var e=this.startNode();return this.type===f.name?e.name=this.value:this.type.keyword?(e.name=this.type.keyword,"class"!==e.name&&"function"!==e.name||this.lastTokEnd===this.lastTokStart+1&&46===this.input.charCodeAt(this.lastTokStart)||this.context.pop(),this.type=f.name):this.unexpected(),e},$.parsePrivateIdent=function(){var e=this.startNode();return this.type===f.privateId?e.name=this.value:this.unexpected(),this.next(),this.finishNode(e,"PrivateIdentifier"),this.options.checkPrivateFields&&(0===this.privateNameStack.length?this.raise(e.start,"Private field '#"+e.name+"' must be declared in an enclosing class"):this.privateNameStack[this.privateNameStack.length-1].used.push(e)),e},$.parseYield=function(e){this.yieldPos||(this.yieldPos=this.start);var t=this.startNode();return this.next(),this.type===f.semi||this.canInsertSemicolon()||this.type!==f.star&&!this.type.startsExpr?(t.delegate=!1,t.argument=null):(t.delegate=this.eat(f.star),t.argument=this.parseMaybeAssign(e)),this.finishNode(t,"YieldExpression")},$.parseAwait=function(e){this.awaitPos||(this.awaitPos=this.start);var t=this.startNode();return this.next(),t.argument=this.parseMaybeUnary(null,!0,!1,e),this.finishNode(t,"AwaitExpression")};var W=acorn_Parser.prototype;W.raise=function(e,t){var i=getLineInfo(this.input,e);t+=" ("+i.line+":"+i.column+")",this.sourceFile&&(t+=" in "+this.sourceFile);var s=new SyntaxError(t);throw s.pos=e,s.loc=i,s.raisedAt=this.pos,s},W.raiseRecoverable=W.raise,W.curPosition=function(){if(this.options.locations)return new acorn_Position(this.curLine,this.pos-this.lineStart)};var G=acorn_Parser.prototype,acorn_Scope=function(e){this.flags=e,this.var=[],this.lexical=[],this.functions=[]};G.enterScope=function(e){this.scopeStack.push(new acorn_Scope(e))},G.exitScope=function(){this.scopeStack.pop()},G.treatFunctionsAsVarInScope=function(e){return 2&e.flags||!this.inModule&&1&e.flags},G.declareName=function(e,t,i){var s=!1;if(2===t){var r=this.currentScope();s=r.lexical.indexOf(e)>-1||r.functions.indexOf(e)>-1||r.var.indexOf(e)>-1,r.lexical.push(e),this.inModule&&1&r.flags&&delete this.undefinedExports[e]}else if(4===t){this.currentScope().lexical.push(e)}else if(3===t){var n=this.currentScope();s=this.treatFunctionsAsVar?n.lexical.indexOf(e)>-1:n.lexical.indexOf(e)>-1||n.var.indexOf(e)>-1,n.functions.push(e)}else for(var a=this.scopeStack.length-1;a>=0;--a){var o=this.scopeStack[a];if(o.lexical.indexOf(e)>-1&&!(32&o.flags&&o.lexical[0]===e)||!this.treatFunctionsAsVarInScope(o)&&o.functions.indexOf(e)>-1){s=!0;break}if(o.var.push(e),this.inModule&&1&o.flags&&delete this.undefinedExports[e],o.flags&P)break}s&&this.raiseRecoverable(i,"Identifier '"+e+"' has already been declared")},G.checkLocalExport=function(e){-1===this.scopeStack[0].lexical.indexOf(e.name)&&-1===this.scopeStack[0].var.indexOf(e.name)&&(this.undefinedExports[e.name]=e)},G.currentScope=function(){return this.scopeStack[this.scopeStack.length-1]},G.currentVarScope=function(){for(var e=this.scopeStack.length-1;;e--){var t=this.scopeStack[e];if(771&t.flags)return t}},G.currentThisScope=function(){for(var e=this.scopeStack.length-1;;e--){var t=this.scopeStack[e];if(771&t.flags&&!(16&t.flags))return t}};var acorn_Node=function(e,t,i){this.type="",this.start=t,this.end=0,e.options.locations&&(this.loc=new acorn_SourceLocation(e,i)),e.options.directSourceFile&&(this.sourceFile=e.options.directSourceFile),e.options.ranges&&(this.range=[t,0])},H=acorn_Parser.prototype;function finishNodeAt(e,t,i,s){return e.type=t,e.end=i,this.options.locations&&(e.loc.end=s),this.options.ranges&&(e.range[1]=i),e}H.startNode=function(){return new acorn_Node(this,this.start,this.startLoc)},H.startNodeAt=function(e,t){return new acorn_Node(this,e,t)},H.finishNode=function(e,t){return finishNodeAt.call(this,e,t,this.lastTokEnd,this.lastTokEndLoc)},H.finishNodeAt=function(e,t,i,s){return finishNodeAt.call(this,e,t,i,s)},H.copyNode=function(e){var t=new acorn_Node(this,e.start,this.startLoc);for(var i in e)t[i]=e[i];return t};var K="ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS",z=K+" Extended_Pictographic",J=z+" EBase EComp EMod EPres ExtPict",Y={9:K,10:z,11:z,12:J,13:J,14:J},Q={9:"",10:"",11:"",12:"",13:"",14:"Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji"},Z="Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu",X="Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb",ee=X+" Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd",te=ee+" Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho",ie=te+" Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi",se=ie+" Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith",re={9:X,10:ee,11:te,12:ie,13:se,14:se+" Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz"},ne={};function buildUnicodeData(e){var t=ne[e]={binary:wordsRegexp(Y[e]+" "+Z),binaryOfStrings:wordsRegexp(Q[e]),nonBinary:{General_Category:wordsRegexp(Z),Script:wordsRegexp(re[e])}};t.nonBinary.Script_Extensions=t.nonBinary.Script,t.nonBinary.gc=t.nonBinary.General_Category,t.nonBinary.sc=t.nonBinary.Script,t.nonBinary.scx=t.nonBinary.Script_Extensions}for(var ae=0,oe=[9,10,11,12,13,14];ae<oe.length;ae+=1){buildUnicodeData(oe[ae])}var he=acorn_Parser.prototype,acorn_BranchID=function(e,t){this.parent=e,this.base=t||this};acorn_BranchID.prototype.separatedFrom=function(e){for(var t=this;t;t=t.parent)for(var i=e;i;i=i.parent)if(t.base===i.base&&t!==i)return!0;return!1},acorn_BranchID.prototype.sibling=function(){return new acorn_BranchID(this.parent,this.base)};var acorn_RegExpValidationState=function(e){this.parser=e,this.validFlags="gim"+(e.options.ecmaVersion>=6?"uy":"")+(e.options.ecmaVersion>=9?"s":"")+(e.options.ecmaVersion>=13?"d":"")+(e.options.ecmaVersion>=15?"v":""),this.unicodeProperties=ne[e.options.ecmaVersion>=14?14:e.options.ecmaVersion],this.source="",this.flags="",this.start=0,this.switchU=!1,this.switchV=!1,this.switchN=!1,this.pos=0,this.lastIntValue=0,this.lastStringValue="",this.lastAssertionIsQuantifiable=!1,this.numCapturingParens=0,this.maxBackReference=0,this.groupNames=Object.create(null),this.backReferenceNames=[],this.branchID=null};function isRegularExpressionModifier(e){return 105===e||109===e||115===e}function isSyntaxCharacter(e){return 36===e||e>=40&&e<=43||46===e||63===e||e>=91&&e<=94||e>=123&&e<=125}function isControlLetter(e){return e>=65&&e<=90||e>=97&&e<=122}acorn_RegExpValidationState.prototype.reset=function(e,t,i){var s=-1!==i.indexOf("v"),r=-1!==i.indexOf("u");this.start=0|e,this.source=t+"",this.flags=i,s&&this.parser.options.ecmaVersion>=15?(this.switchU=!0,this.switchV=!0,this.switchN=!0):(this.switchU=r&&this.parser.options.ecmaVersion>=6,this.switchV=!1,this.switchN=r&&this.parser.options.ecmaVersion>=9)},acorn_RegExpValidationState.prototype.raise=function(e){this.parser.raiseRecoverable(this.start,"Invalid regular expression: /"+this.source+"/: "+e)},acorn_RegExpValidationState.prototype.at=function(e,t){void 0===t&&(t=!1);var i=this.source,s=i.length;if(e>=s)return-1;var r=i.charCodeAt(e);if(!t&&!this.switchU||r<=55295||r>=57344||e+1>=s)return r;var n=i.charCodeAt(e+1);return n>=56320&&n<=57343?(r<<10)+n-56613888:r},acorn_RegExpValidationState.prototype.nextIndex=function(e,t){void 0===t&&(t=!1);var i=this.source,s=i.length;if(e>=s)return s;var r,n=i.charCodeAt(e);return!t&&!this.switchU||n<=55295||n>=57344||e+1>=s||(r=i.charCodeAt(e+1))<56320||r>57343?e+1:e+2},acorn_RegExpValidationState.prototype.current=function(e){return void 0===e&&(e=!1),this.at(this.pos,e)},acorn_RegExpValidationState.prototype.lookahead=function(e){return void 0===e&&(e=!1),this.at(this.nextIndex(this.pos,e),e)},acorn_RegExpValidationState.prototype.advance=function(e){void 0===e&&(e=!1),this.pos=this.nextIndex(this.pos,e)},acorn_RegExpValidationState.prototype.eat=function(e,t){return void 0===t&&(t=!1),this.current(t)===e&&(this.advance(t),!0)},acorn_RegExpValidationState.prototype.eatChars=function(e,t){void 0===t&&(t=!1);for(var i=this.pos,s=0,r=e;s<r.length;s+=1){var n=r[s],a=this.at(i,t);if(-1===a||a!==n)return!1;i=this.nextIndex(i,t)}return this.pos=i,!0},he.validateRegExpFlags=function(e){for(var t=e.validFlags,i=e.flags,s=!1,r=!1,n=0;n<i.length;n++){var a=i.charAt(n);-1===t.indexOf(a)&&this.raise(e.start,"Invalid regular expression flag"),i.indexOf(a,n+1)>-1&&this.raise(e.start,"Duplicate regular expression flag"),"u"===a&&(s=!0),"v"===a&&(r=!0)}this.options.ecmaVersion>=15&&s&&r&&this.raise(e.start,"Invalid regular expression flag")},he.validateRegExpPattern=function(e){this.regexp_pattern(e),!e.switchN&&this.options.ecmaVersion>=9&&function(e){for(var t in e)return!0;return!1}(e.groupNames)&&(e.switchN=!0,this.regexp_pattern(e))},he.regexp_pattern=function(e){e.pos=0,e.lastIntValue=0,e.lastStringValue="",e.lastAssertionIsQuantifiable=!1,e.numCapturingParens=0,e.maxBackReference=0,e.groupNames=Object.create(null),e.backReferenceNames.length=0,e.branchID=null,this.regexp_disjunction(e),e.pos!==e.source.length&&(e.eat(41)&&e.raise("Unmatched ')'"),(e.eat(93)||e.eat(125))&&e.raise("Lone quantifier brackets")),e.maxBackReference>e.numCapturingParens&&e.raise("Invalid escape");for(var t=0,i=e.backReferenceNames;t<i.length;t+=1){var s=i[t];e.groupNames[s]||e.raise("Invalid named capture referenced")}},he.regexp_disjunction=function(e){var t=this.options.ecmaVersion>=16;for(t&&(e.branchID=new acorn_BranchID(e.branchID,null)),this.regexp_alternative(e);e.eat(124);)t&&(e.branchID=e.branchID.sibling()),this.regexp_alternative(e);t&&(e.branchID=e.branchID.parent),this.regexp_eatQuantifier(e,!0)&&e.raise("Nothing to repeat"),e.eat(123)&&e.raise("Lone quantifier brackets")},he.regexp_alternative=function(e){for(;e.pos<e.source.length&&this.regexp_eatTerm(e););},he.regexp_eatTerm=function(e){return this.regexp_eatAssertion(e)?(e.lastAssertionIsQuantifiable&&this.regexp_eatQuantifier(e)&&e.switchU&&e.raise("Invalid quantifier"),!0):!!(e.switchU?this.regexp_eatAtom(e):this.regexp_eatExtendedAtom(e))&&(this.regexp_eatQuantifier(e),!0)},he.regexp_eatAssertion=function(e){var t=e.pos;if(e.lastAssertionIsQuantifiable=!1,e.eat(94)||e.eat(36))return!0;if(e.eat(92)){if(e.eat(66)||e.eat(98))return!0;e.pos=t}if(e.eat(40)&&e.eat(63)){var i=!1;if(this.options.ecmaVersion>=9&&(i=e.eat(60)),e.eat(61)||e.eat(33))return this.regexp_disjunction(e),e.eat(41)||e.raise("Unterminated group"),e.lastAssertionIsQuantifiable=!i,!0}return e.pos=t,!1},he.regexp_eatQuantifier=function(e,t){return void 0===t&&(t=!1),!!this.regexp_eatQuantifierPrefix(e,t)&&(e.eat(63),!0)},he.regexp_eatQuantifierPrefix=function(e,t){return e.eat(42)||e.eat(43)||e.eat(63)||this.regexp_eatBracedQuantifier(e,t)},he.regexp_eatBracedQuantifier=function(e,t){var i=e.pos;if(e.eat(123)){var s=0,r=-1;if(this.regexp_eatDecimalDigits(e)&&(s=e.lastIntValue,e.eat(44)&&this.regexp_eatDecimalDigits(e)&&(r=e.lastIntValue),e.eat(125)))return-1!==r&&r<s&&!t&&e.raise("numbers out of order in {} quantifier"),!0;e.switchU&&!t&&e.raise("Incomplete quantifier"),e.pos=i}return!1},he.regexp_eatAtom=function(e){return this.regexp_eatPatternCharacters(e)||e.eat(46)||this.regexp_eatReverseSolidusAtomEscape(e)||this.regexp_eatCharacterClass(e)||this.regexp_eatUncapturingGroup(e)||this.regexp_eatCapturingGroup(e)},he.regexp_eatReverseSolidusAtomEscape=function(e){var t=e.pos;if(e.eat(92)){if(this.regexp_eatAtomEscape(e))return!0;e.pos=t}return!1},he.regexp_eatUncapturingGroup=function(e){var t=e.pos;if(e.eat(40)){if(e.eat(63)){if(this.options.ecmaVersion>=16){var i=this.regexp_eatModifiers(e),s=e.eat(45);if(i||s){for(var r=0;r<i.length;r++){var n=i.charAt(r);i.indexOf(n,r+1)>-1&&e.raise("Duplicate regular expression modifiers")}if(s){var a=this.regexp_eatModifiers(e);i||a||58!==e.current()||e.raise("Invalid regular expression modifiers");for(var o=0;o<a.length;o++){var h=a.charAt(o);(a.indexOf(h,o+1)>-1||i.indexOf(h)>-1)&&e.raise("Duplicate regular expression modifiers")}}}}if(e.eat(58)){if(this.regexp_disjunction(e),e.eat(41))return!0;e.raise("Unterminated group")}}e.pos=t}return!1},he.regexp_eatCapturingGroup=function(e){if(e.eat(40)){if(this.options.ecmaVersion>=9?this.regexp_groupSpecifier(e):63===e.current()&&e.raise("Invalid group"),this.regexp_disjunction(e),e.eat(41))return e.numCapturingParens+=1,!0;e.raise("Unterminated group")}return!1},he.regexp_eatModifiers=function(e){for(var t="",i=0;-1!==(i=e.current())&&isRegularExpressionModifier(i);)t+=codePointToString(i),e.advance();return t},he.regexp_eatExtendedAtom=function(e){return e.eat(46)||this.regexp_eatReverseSolidusAtomEscape(e)||this.regexp_eatCharacterClass(e)||this.regexp_eatUncapturingGroup(e)||this.regexp_eatCapturingGroup(e)||this.regexp_eatInvalidBracedQuantifier(e)||this.regexp_eatExtendedPatternCharacter(e)},he.regexp_eatInvalidBracedQuantifier=function(e){return this.regexp_eatBracedQuantifier(e,!0)&&e.raise("Nothing to repeat"),!1},he.regexp_eatSyntaxCharacter=function(e){var t=e.current();return!!isSyntaxCharacter(t)&&(e.lastIntValue=t,e.advance(),!0)},he.regexp_eatPatternCharacters=function(e){for(var t=e.pos,i=0;-1!==(i=e.current())&&!isSyntaxCharacter(i);)e.advance();return e.pos!==t},he.regexp_eatExtendedPatternCharacter=function(e){var t=e.current();return!(-1===t||36===t||t>=40&&t<=43||46===t||63===t||91===t||94===t||124===t)&&(e.advance(),!0)},he.regexp_groupSpecifier=function(e){if(e.eat(63)){this.regexp_eatGroupName(e)||e.raise("Invalid group");var t=this.options.ecmaVersion>=16,i=e.groupNames[e.lastStringValue];if(i)if(t)for(var s=0,r=i;s<r.length;s+=1){r[s].separatedFrom(e.branchID)||e.raise("Duplicate capture group name")}else e.raise("Duplicate capture group name");t?(i||(e.groupNames[e.lastStringValue]=[])).push(e.branchID):e.groupNames[e.lastStringValue]=!0}},he.regexp_eatGroupName=function(e){if(e.lastStringValue="",e.eat(60)){if(this.regexp_eatRegExpIdentifierName(e)&&e.eat(62))return!0;e.raise("Invalid capture group name")}return!1},he.regexp_eatRegExpIdentifierName=function(e){if(e.lastStringValue="",this.regexp_eatRegExpIdentifierStart(e)){for(e.lastStringValue+=codePointToString(e.lastIntValue);this.regexp_eatRegExpIdentifierPart(e);)e.lastStringValue+=codePointToString(e.lastIntValue);return!0}return!1},he.regexp_eatRegExpIdentifierStart=function(e){var t=e.pos,i=this.options.ecmaVersion>=11,s=e.current(i);return e.advance(i),92===s&&this.regexp_eatRegExpUnicodeEscapeSequence(e,i)&&(s=e.lastIntValue),function(e){return isIdentifierStart(e,!0)||36===e||95===e}(s)?(e.lastIntValue=s,!0):(e.pos=t,!1)},he.regexp_eatRegExpIdentifierPart=function(e){var t=e.pos,i=this.options.ecmaVersion>=11,s=e.current(i);return e.advance(i),92===s&&this.regexp_eatRegExpUnicodeEscapeSequence(e,i)&&(s=e.lastIntValue),function(e){return isIdentifierChar(e,!0)||36===e||95===e||8204===e||8205===e}(s)?(e.lastIntValue=s,!0):(e.pos=t,!1)},he.regexp_eatAtomEscape=function(e){return!!(this.regexp_eatBackReference(e)||this.regexp_eatCharacterClassEscape(e)||this.regexp_eatCharacterEscape(e)||e.switchN&&this.regexp_eatKGroupName(e))||(e.switchU&&(99===e.current()&&e.raise("Invalid unicode escape"),e.raise("Invalid escape")),!1)},he.regexp_eatBackReference=function(e){var t=e.pos;if(this.regexp_eatDecimalEscape(e)){var i=e.lastIntValue;if(e.switchU)return i>e.maxBackReference&&(e.maxBackReference=i),!0;if(i<=e.numCapturingParens)return!0;e.pos=t}return!1},he.regexp_eatKGroupName=function(e){if(e.eat(107)){if(this.regexp_eatGroupName(e))return e.backReferenceNames.push(e.lastStringValue),!0;e.raise("Invalid named reference")}return!1},he.regexp_eatCharacterEscape=function(e){return this.regexp_eatControlEscape(e)||this.regexp_eatCControlLetter(e)||this.regexp_eatZero(e)||this.regexp_eatHexEscapeSequence(e)||this.regexp_eatRegExpUnicodeEscapeSequence(e,!1)||!e.switchU&&this.regexp_eatLegacyOctalEscapeSequence(e)||this.regexp_eatIdentityEscape(e)},he.regexp_eatCControlLetter=function(e){var t=e.pos;if(e.eat(99)){if(this.regexp_eatControlLetter(e))return!0;e.pos=t}return!1},he.regexp_eatZero=function(e){return 48===e.current()&&!isDecimalDigit(e.lookahead())&&(e.lastIntValue=0,e.advance(),!0)},he.regexp_eatControlEscape=function(e){var t=e.current();return 116===t?(e.lastIntValue=9,e.advance(),!0):110===t?(e.lastIntValue=10,e.advance(),!0):118===t?(e.lastIntValue=11,e.advance(),!0):102===t?(e.lastIntValue=12,e.advance(),!0):114===t&&(e.lastIntValue=13,e.advance(),!0)},he.regexp_eatControlLetter=function(e){var t=e.current();return!!isControlLetter(t)&&(e.lastIntValue=t%32,e.advance(),!0)},he.regexp_eatRegExpUnicodeEscapeSequence=function(e,t){void 0===t&&(t=!1);var i,s=e.pos,r=t||e.switchU;if(e.eat(117)){if(this.regexp_eatFixedHexDigits(e,4)){var n=e.lastIntValue;if(r&&n>=55296&&n<=56319){var a=e.pos;if(e.eat(92)&&e.eat(117)&&this.regexp_eatFixedHexDigits(e,4)){var o=e.lastIntValue;if(o>=56320&&o<=57343)return e.lastIntValue=1024*(n-55296)+(o-56320)+65536,!0}e.pos=a,e.lastIntValue=n}return!0}if(r&&e.eat(123)&&this.regexp_eatHexDigits(e)&&e.eat(125)&&((i=e.lastIntValue)>=0&&i<=1114111))return!0;r&&e.raise("Invalid unicode escape"),e.pos=s}return!1},he.regexp_eatIdentityEscape=function(e){if(e.switchU)return!!this.regexp_eatSyntaxCharacter(e)||!!e.eat(47)&&(e.lastIntValue=47,!0);var t=e.current();return!(99===t||e.switchN&&107===t)&&(e.lastIntValue=t,e.advance(),!0)},he.regexp_eatDecimalEscape=function(e){e.lastIntValue=0;var t=e.current();if(t>=49&&t<=57){do{e.lastIntValue=10*e.lastIntValue+(t-48),e.advance()}while((t=e.current())>=48&&t<=57);return!0}return!1};function isUnicodePropertyNameCharacter(e){return isControlLetter(e)||95===e}function isUnicodePropertyValueCharacter(e){return isUnicodePropertyNameCharacter(e)||isDecimalDigit(e)}function isDecimalDigit(e){return e>=48&&e<=57}function isHexDigit(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102}function hexToInt(e){return e>=65&&e<=70?e-65+10:e>=97&&e<=102?e-97+10:e-48}function isOctalDigit(e){return e>=48&&e<=55}he.regexp_eatCharacterClassEscape=function(e){var t=e.current();if(function(e){return 100===e||68===e||115===e||83===e||119===e||87===e}(t))return e.lastIntValue=-1,e.advance(),1;var i=!1;if(e.switchU&&this.options.ecmaVersion>=9&&((i=80===t)||112===t)){var s;if(e.lastIntValue=-1,e.advance(),e.eat(123)&&(s=this.regexp_eatUnicodePropertyValueExpression(e))&&e.eat(125))return i&&2===s&&e.raise("Invalid property name"),s;e.raise("Invalid property name")}return 0},he.regexp_eatUnicodePropertyValueExpression=function(e){var t=e.pos;if(this.regexp_eatUnicodePropertyName(e)&&e.eat(61)){var i=e.lastStringValue;if(this.regexp_eatUnicodePropertyValue(e)){var s=e.lastStringValue;return this.regexp_validateUnicodePropertyNameAndValue(e,i,s),1}}if(e.pos=t,this.regexp_eatLoneUnicodePropertyNameOrValue(e)){var r=e.lastStringValue;return this.regexp_validateUnicodePropertyNameOrValue(e,r)}return 0},he.regexp_validateUnicodePropertyNameAndValue=function(e,t,i){b(e.unicodeProperties.nonBinary,t)||e.raise("Invalid property name"),e.unicodeProperties.nonBinary[t].test(i)||e.raise("Invalid property value")},he.regexp_validateUnicodePropertyNameOrValue=function(e,t){return e.unicodeProperties.binary.test(t)?1:e.switchV&&e.unicodeProperties.binaryOfStrings.test(t)?2:void e.raise("Invalid property name")},he.regexp_eatUnicodePropertyName=function(e){var t=0;for(e.lastStringValue="";isUnicodePropertyNameCharacter(t=e.current());)e.lastStringValue+=codePointToString(t),e.advance();return""!==e.lastStringValue},he.regexp_eatUnicodePropertyValue=function(e){var t=0;for(e.lastStringValue="";isUnicodePropertyValueCharacter(t=e.current());)e.lastStringValue+=codePointToString(t),e.advance();return""!==e.lastStringValue},he.regexp_eatLoneUnicodePropertyNameOrValue=function(e){return this.regexp_eatUnicodePropertyValue(e)},he.regexp_eatCharacterClass=function(e){if(e.eat(91)){var t=e.eat(94),i=this.regexp_classContents(e);return e.eat(93)||e.raise("Unterminated character class"),t&&2===i&&e.raise("Negated character class may contain strings"),!0}return!1},he.regexp_classContents=function(e){return 93===e.current()?1:e.switchV?this.regexp_classSetExpression(e):(this.regexp_nonEmptyClassRanges(e),1)},he.regexp_nonEmptyClassRanges=function(e){for(;this.regexp_eatClassAtom(e);){var t=e.lastIntValue;if(e.eat(45)&&this.regexp_eatClassAtom(e)){var i=e.lastIntValue;!e.switchU||-1!==t&&-1!==i||e.raise("Invalid character class"),-1!==t&&-1!==i&&t>i&&e.raise("Range out of order in character class")}}},he.regexp_eatClassAtom=function(e){var t=e.pos;if(e.eat(92)){if(this.regexp_eatClassEscape(e))return!0;if(e.switchU){var i=e.current();(99===i||isOctalDigit(i))&&e.raise("Invalid class escape"),e.raise("Invalid escape")}e.pos=t}var s=e.current();return 93!==s&&(e.lastIntValue=s,e.advance(),!0)},he.regexp_eatClassEscape=function(e){var t=e.pos;if(e.eat(98))return e.lastIntValue=8,!0;if(e.switchU&&e.eat(45))return e.lastIntValue=45,!0;if(!e.switchU&&e.eat(99)){if(this.regexp_eatClassControlLetter(e))return!0;e.pos=t}return this.regexp_eatCharacterClassEscape(e)||this.regexp_eatCharacterEscape(e)},he.regexp_classSetExpression=function(e){var t,i=1;if(this.regexp_eatClassSetRange(e));else if(t=this.regexp_eatClassSetOperand(e)){2===t&&(i=2);for(var s=e.pos;e.eatChars([38,38]);)38!==e.current()&&(t=this.regexp_eatClassSetOperand(e))?2!==t&&(i=1):e.raise("Invalid character in character class");if(s!==e.pos)return i;for(;e.eatChars([45,45]);)this.regexp_eatClassSetOperand(e)||e.raise("Invalid character in character class");if(s!==e.pos)return i}else e.raise("Invalid character in character class");for(;;)if(!this.regexp_eatClassSetRange(e)){if(!(t=this.regexp_eatClassSetOperand(e)))return i;2===t&&(i=2)}},he.regexp_eatClassSetRange=function(e){var t=e.pos;if(this.regexp_eatClassSetCharacter(e)){var i=e.lastIntValue;if(e.eat(45)&&this.regexp_eatClassSetCharacter(e)){var s=e.lastIntValue;return-1!==i&&-1!==s&&i>s&&e.raise("Range out of order in character class"),!0}e.pos=t}return!1},he.regexp_eatClassSetOperand=function(e){return this.regexp_eatClassSetCharacter(e)?1:this.regexp_eatClassStringDisjunction(e)||this.regexp_eatNestedClass(e)},he.regexp_eatNestedClass=function(e){var t=e.pos;if(e.eat(91)){var i=e.eat(94),s=this.regexp_classContents(e);if(e.eat(93))return i&&2===s&&e.raise("Negated character class may contain strings"),s;e.pos=t}if(e.eat(92)){var r=this.regexp_eatCharacterClassEscape(e);if(r)return r;e.pos=t}return null},he.regexp_eatClassStringDisjunction=function(e){var t=e.pos;if(e.eatChars([92,113])){if(e.eat(123)){var i=this.regexp_classStringDisjunctionContents(e);if(e.eat(125))return i}else e.raise("Invalid escape");e.pos=t}return null},he.regexp_classStringDisjunctionContents=function(e){for(var t=this.regexp_classString(e);e.eat(124);)2===this.regexp_classString(e)&&(t=2);return t},he.regexp_classString=function(e){for(var t=0;this.regexp_eatClassSetCharacter(e);)t++;return 1===t?1:2},he.regexp_eatClassSetCharacter=function(e){var t=e.pos;if(e.eat(92))return!(!this.regexp_eatCharacterEscape(e)&&!this.regexp_eatClassSetReservedPunctuator(e))||(e.eat(98)?(e.lastIntValue=8,!0):(e.pos=t,!1));var i=e.current();return!(i<0||i===e.lookahead()&&function(e){return 33===e||e>=35&&e<=38||e>=42&&e<=44||46===e||e>=58&&e<=64||94===e||96===e||126===e}(i))&&(!function(e){return 40===e||41===e||45===e||47===e||e>=91&&e<=93||e>=123&&e<=125}(i)&&(e.advance(),e.lastIntValue=i,!0))},he.regexp_eatClassSetReservedPunctuator=function(e){var t=e.current();return!!function(e){return 33===e||35===e||37===e||38===e||44===e||45===e||e>=58&&e<=62||64===e||96===e||126===e}(t)&&(e.lastIntValue=t,e.advance(),!0)},he.regexp_eatClassControlLetter=function(e){var t=e.current();return!(!isDecimalDigit(t)&&95!==t)&&(e.lastIntValue=t%32,e.advance(),!0)},he.regexp_eatHexEscapeSequence=function(e){var t=e.pos;if(e.eat(120)){if(this.regexp_eatFixedHexDigits(e,2))return!0;e.switchU&&e.raise("Invalid escape"),e.pos=t}return!1},he.regexp_eatDecimalDigits=function(e){var t=e.pos,i=0;for(e.lastIntValue=0;isDecimalDigit(i=e.current());)e.lastIntValue=10*e.lastIntValue+(i-48),e.advance();return e.pos!==t},he.regexp_eatHexDigits=function(e){var t=e.pos,i=0;for(e.lastIntValue=0;isHexDigit(i=e.current());)e.lastIntValue=16*e.lastIntValue+hexToInt(i),e.advance();return e.pos!==t},he.regexp_eatLegacyOctalEscapeSequence=function(e){if(this.regexp_eatOctalDigit(e)){var t=e.lastIntValue;if(this.regexp_eatOctalDigit(e)){var i=e.lastIntValue;t<=3&&this.regexp_eatOctalDigit(e)?e.lastIntValue=64*t+8*i+e.lastIntValue:e.lastIntValue=8*t+i}else e.lastIntValue=t;return!0}return!1},he.regexp_eatOctalDigit=function(e){var t=e.current();return isOctalDigit(t)?(e.lastIntValue=t-48,e.advance(),!0):(e.lastIntValue=0,!1)},he.regexp_eatFixedHexDigits=function(e,t){var i=e.pos;e.lastIntValue=0;for(var s=0;s<t;++s){var r=e.current();if(!isHexDigit(r))return e.pos=i,!1;e.lastIntValue=16*e.lastIntValue+hexToInt(r),e.advance()}return!0};var acorn_Token=function(e){this.type=e.type,this.value=e.value,this.start=e.start,this.end=e.end,e.options.locations&&(this.loc=new acorn_SourceLocation(e,e.startLoc,e.endLoc)),e.options.ranges&&(this.range=[e.start,e.end])},ce=acorn_Parser.prototype;function stringToBigInt(e){return"function"!=typeof BigInt?null:BigInt(e.replace(/_/g,""))}ce.next=function(e){!e&&this.type.keyword&&this.containsEsc&&this.raiseRecoverable(this.start,"Escape sequence in keyword "+this.type.keyword),this.options.onToken&&this.options.onToken(new acorn_Token(this)),this.lastTokEnd=this.end,this.lastTokStart=this.start,this.lastTokEndLoc=this.endLoc,this.lastTokStartLoc=this.startLoc,this.nextToken()},ce.getToken=function(){return this.next(),new acorn_Token(this)},"undefined"!=typeof Symbol&&(ce[Symbol.iterator]=function(){var e=this;return{next:function(){var t=e.getToken();return{done:t.type===f.eof,value:t}}}}),ce.nextToken=function(){var e=this.curContext();return e&&e.preserveSpace||this.skipSpace(),this.start=this.pos,this.options.locations&&(this.startLoc=this.curPosition()),this.pos>=this.input.length?this.finishToken(f.eof):e.override?e.override(this):void this.readToken(this.fullCharCodeAtPos())},ce.readToken=function(e){return isIdentifierStart(e,this.options.ecmaVersion>=6)||92===e?this.readWord():this.getTokenFromCode(e)},ce.fullCharCodeAtPos=function(){var e=this.input.charCodeAt(this.pos);if(e<=55295||e>=56320)return e;var t=this.input.charCodeAt(this.pos+1);return t<=56319||t>=57344?e:(e<<10)+t-56613888},ce.skipBlockComment=function(){var e=this.options.onComment&&this.curPosition(),t=this.pos,i=this.input.indexOf("*/",this.pos+=2);if(-1===i&&this.raise(this.pos-2,"Unterminated comment"),this.pos=i+2,this.options.locations)for(var s=void 0,r=t;(s=nextLineBreak(this.input,r,this.pos))>-1;)++this.curLine,r=this.lineStart=s;this.options.onComment&&this.options.onComment(!0,this.input.slice(t+2,i),t,this.pos,e,this.curPosition())},ce.skipLineComment=function(e){for(var t=this.pos,i=this.options.onComment&&this.curPosition(),s=this.input.charCodeAt(this.pos+=e);this.pos<this.input.length&&!isNewLine(s);)s=this.input.charCodeAt(++this.pos);this.options.onComment&&this.options.onComment(!1,this.input.slice(t+e,this.pos),t,this.pos,i,this.curPosition())},ce.skipSpace=function(){e:for(;this.pos<this.input.length;){var e=this.input.charCodeAt(this.pos);switch(e){case 32:case 160:++this.pos;break;case 13:10===this.input.charCodeAt(this.pos+1)&&++this.pos;case 10:case 8232:case 8233:++this.pos,this.options.locations&&(++this.curLine,this.lineStart=this.pos);break;case 47:switch(this.input.charCodeAt(this.pos+1)){case 42:this.skipBlockComment();break;case 47:this.skipLineComment(2);break;default:break e}break;default:if(!(e>8&&e<14||e>=5760&&x.test(String.fromCharCode(e))))break e;++this.pos}}},ce.finishToken=function(e,t){this.end=this.pos,this.options.locations&&(this.endLoc=this.curPosition());var i=this.type;this.type=e,this.value=t,this.updateContext(i)},ce.readToken_dot=function(){var e=this.input.charCodeAt(this.pos+1);if(e>=48&&e<=57)return this.readNumber(!0);var t=this.input.charCodeAt(this.pos+2);return this.options.ecmaVersion>=6&&46===e&&46===t?(this.pos+=3,this.finishToken(f.ellipsis)):(++this.pos,this.finishToken(f.dot))},ce.readToken_slash=function(){var e=this.input.charCodeAt(this.pos+1);return this.exprAllowed?(++this.pos,this.readRegexp()):61===e?this.finishOp(f.assign,2):this.finishOp(f.slash,1)},ce.readToken_mult_modulo_exp=function(e){var t=this.input.charCodeAt(this.pos+1),i=1,s=42===e?f.star:f.modulo;return this.options.ecmaVersion>=7&&42===e&&42===t&&(++i,s=f.starstar,t=this.input.charCodeAt(this.pos+2)),61===t?this.finishOp(f.assign,i+1):this.finishOp(s,i)},ce.readToken_pipe_amp=function(e){var t=this.input.charCodeAt(this.pos+1);if(t===e){if(this.options.ecmaVersion>=12)if(61===this.input.charCodeAt(this.pos+2))return this.finishOp(f.assign,3);return this.finishOp(124===e?f.logicalOR:f.logicalAND,2)}return 61===t?this.finishOp(f.assign,2):this.finishOp(124===e?f.bitwiseOR:f.bitwiseAND,1)},ce.readToken_caret=function(){return 61===this.input.charCodeAt(this.pos+1)?this.finishOp(f.assign,2):this.finishOp(f.bitwiseXOR,1)},ce.readToken_plus_min=function(e){var t=this.input.charCodeAt(this.pos+1);return t===e?45!==t||this.inModule||62!==this.input.charCodeAt(this.pos+2)||0!==this.lastTokEnd&&!m.test(this.input.slice(this.lastTokEnd,this.pos))?this.finishOp(f.incDec,2):(this.skipLineComment(3),this.skipSpace(),this.nextToken()):61===t?this.finishOp(f.assign,2):this.finishOp(f.plusMin,1)},ce.readToken_lt_gt=function(e){var t=this.input.charCodeAt(this.pos+1),i=1;return t===e?(i=62===e&&62===this.input.charCodeAt(this.pos+2)?3:2,61===this.input.charCodeAt(this.pos+i)?this.finishOp(f.assign,i+1):this.finishOp(f.bitShift,i)):33!==t||60!==e||this.inModule||45!==this.input.charCodeAt(this.pos+2)||45!==this.input.charCodeAt(this.pos+3)?(61===t&&(i=2),this.finishOp(f.relational,i)):(this.skipLineComment(4),this.skipSpace(),this.nextToken())},ce.readToken_eq_excl=function(e){var t=this.input.charCodeAt(this.pos+1);return 61===t?this.finishOp(f.equality,61===this.input.charCodeAt(this.pos+2)?3:2):61===e&&62===t&&this.options.ecmaVersion>=6?(this.pos+=2,this.finishToken(f.arrow)):this.finishOp(61===e?f.eq:f.prefix,1)},ce.readToken_question=function(){var e=this.options.ecmaVersion;if(e>=11){var t=this.input.charCodeAt(this.pos+1);if(46===t){var i=this.input.charCodeAt(this.pos+2);if(i<48||i>57)return this.finishOp(f.questionDot,2)}if(63===t){if(e>=12)if(61===this.input.charCodeAt(this.pos+2))return this.finishOp(f.assign,3);return this.finishOp(f.coalesce,2)}}return this.finishOp(f.question,1)},ce.readToken_numberSign=function(){var e=35;if(this.options.ecmaVersion>=13&&(++this.pos,isIdentifierStart(e=this.fullCharCodeAtPos(),!0)||92===e))return this.finishToken(f.privateId,this.readWord1());this.raise(this.pos,"Unexpected character '"+codePointToString(e)+"'")},ce.getTokenFromCode=function(e){switch(e){case 46:return this.readToken_dot();case 40:return++this.pos,this.finishToken(f.parenL);case 41:return++this.pos,this.finishToken(f.parenR);case 59:return++this.pos,this.finishToken(f.semi);case 44:return++this.pos,this.finishToken(f.comma);case 91:return++this.pos,this.finishToken(f.bracketL);case 93:return++this.pos,this.finishToken(f.bracketR);case 123:return++this.pos,this.finishToken(f.braceL);case 125:return++this.pos,this.finishToken(f.braceR);case 58:return++this.pos,this.finishToken(f.colon);case 96:if(this.options.ecmaVersion<6)break;return++this.pos,this.finishToken(f.backQuote);case 48:var t=this.input.charCodeAt(this.pos+1);if(120===t||88===t)return this.readRadixNumber(16);if(this.options.ecmaVersion>=6){if(111===t||79===t)return this.readRadixNumber(8);if(98===t||66===t)return this.readRadixNumber(2)}case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return this.readNumber(!1);case 34:case 39:return this.readString(e);case 47:return this.readToken_slash();case 37:case 42:return this.readToken_mult_modulo_exp(e);case 124:case 38:return this.readToken_pipe_amp(e);case 94:return this.readToken_caret();case 43:case 45:return this.readToken_plus_min(e);case 60:case 62:return this.readToken_lt_gt(e);case 61:case 33:return this.readToken_eq_excl(e);case 63:return this.readToken_question();case 126:return this.finishOp(f.prefix,1);case 35:return this.readToken_numberSign()}this.raise(this.pos,"Unexpected character '"+codePointToString(e)+"'")},ce.finishOp=function(e,t){var i=this.input.slice(this.pos,this.pos+t);return this.pos+=t,this.finishToken(e,i)},ce.readRegexp=function(){for(var e,t,i=this.pos;;){this.pos>=this.input.length&&this.raise(i,"Unterminated regular expression");var s=this.input.charAt(this.pos);if(m.test(s)&&this.raise(i,"Unterminated regular expression"),e)e=!1;else{if("["===s)t=!0;else if("]"===s&&t)t=!1;else if("/"===s&&!t)break;e="\\"===s}++this.pos}var r=this.input.slice(i,this.pos);++this.pos;var n=this.pos,a=this.readWord1();this.containsEsc&&this.unexpected(n);var o=this.regexpState||(this.regexpState=new acorn_RegExpValidationState(this));o.reset(i,r,a),this.validateRegExpFlags(o),this.validateRegExpPattern(o);var h=null;try{h=new RegExp(r,a)}catch(e){}return this.finishToken(f.regexp,{pattern:r,flags:a,value:h})},ce.readInt=function(e,t,i){for(var s=this.options.ecmaVersion>=12&&void 0===t,r=i&&48===this.input.charCodeAt(this.pos),n=this.pos,a=0,o=0,h=0,c=null==t?1/0:t;h<c;++h,++this.pos){var p=this.input.charCodeAt(this.pos),l=void 0;if(s&&95===p)r&&this.raiseRecoverable(this.pos,"Numeric separator is not allowed in legacy octal numeric literals"),95===o&&this.raiseRecoverable(this.pos,"Numeric separator must be exactly one underscore"),0===h&&this.raiseRecoverable(this.pos,"Numeric separator is not allowed at the first of digits"),o=p;else{if((l=p>=97?p-97+10:p>=65?p-65+10:p>=48&&p<=57?p-48:1/0)>=e)break;o=p,a=a*e+l}}return s&&95===o&&this.raiseRecoverable(this.pos-1,"Numeric separator is not allowed at the last of digits"),this.pos===n||null!=t&&this.pos-n!==t?null:a},ce.readRadixNumber=function(e){var t=this.pos;this.pos+=2;var i=this.readInt(e);return null==i&&this.raise(this.start+2,"Expected number in radix "+e),this.options.ecmaVersion>=11&&110===this.input.charCodeAt(this.pos)?(i=stringToBigInt(this.input.slice(t,this.pos)),++this.pos):isIdentifierStart(this.fullCharCodeAtPos())&&this.raise(this.pos,"Identifier directly after number"),this.finishToken(f.num,i)},ce.readNumber=function(e){var t=this.pos;e||null!==this.readInt(10,void 0,!0)||this.raise(t,"Invalid number");var i=this.pos-t>=2&&48===this.input.charCodeAt(t);i&&this.strict&&this.raise(t,"Invalid number");var s=this.input.charCodeAt(this.pos);if(!i&&!e&&this.options.ecmaVersion>=11&&110===s){var r=stringToBigInt(this.input.slice(t,this.pos));return++this.pos,isIdentifierStart(this.fullCharCodeAtPos())&&this.raise(this.pos,"Identifier directly after number"),this.finishToken(f.num,r)}i&&/[89]/.test(this.input.slice(t,this.pos))&&(i=!1),46!==s||i||(++this.pos,this.readInt(10),s=this.input.charCodeAt(this.pos)),69!==s&&101!==s||i||(43!==(s=this.input.charCodeAt(++this.pos))&&45!==s||++this.pos,null===this.readInt(10)&&this.raise(t,"Invalid number")),isIdentifierStart(this.fullCharCodeAtPos())&&this.raise(this.pos,"Identifier directly after number");var n,a=(n=this.input.slice(t,this.pos),i?parseInt(n,8):parseFloat(n.replace(/_/g,"")));return this.finishToken(f.num,a)},ce.readCodePoint=function(){var e;if(123===this.input.charCodeAt(this.pos)){this.options.ecmaVersion<6&&this.unexpected();var t=++this.pos;e=this.readHexChar(this.input.indexOf("}",this.pos)-this.pos),++this.pos,e>1114111&&this.invalidStringToken(t,"Code point out of bounds")}else e=this.readHexChar(4);return e},ce.readString=function(e){for(var t="",i=++this.pos;;){this.pos>=this.input.length&&this.raise(this.start,"Unterminated string constant");var s=this.input.charCodeAt(this.pos);if(s===e)break;92===s?(t+=this.input.slice(i,this.pos),t+=this.readEscapedChar(!1),i=this.pos):8232===s||8233===s?(this.options.ecmaVersion<10&&this.raise(this.start,"Unterminated string constant"),++this.pos,this.options.locations&&(this.curLine++,this.lineStart=this.pos)):(isNewLine(s)&&this.raise(this.start,"Unterminated string constant"),++this.pos)}return t+=this.input.slice(i,this.pos++),this.finishToken(f.string,t)};var pe={};ce.tryReadTemplateToken=function(){this.inTemplateElement=!0;try{this.readTmplToken()}catch(e){if(e!==pe)throw e;this.readInvalidTemplateToken()}this.inTemplateElement=!1},ce.invalidStringToken=function(e,t){if(this.inTemplateElement&&this.options.ecmaVersion>=9)throw pe;this.raise(e,t)},ce.readTmplToken=function(){for(var e="",t=this.pos;;){this.pos>=this.input.length&&this.raise(this.start,"Unterminated template");var i=this.input.charCodeAt(this.pos);if(96===i||36===i&&123===this.input.charCodeAt(this.pos+1))return this.pos!==this.start||this.type!==f.template&&this.type!==f.invalidTemplate?(e+=this.input.slice(t,this.pos),this.finishToken(f.template,e)):36===i?(this.pos+=2,this.finishToken(f.dollarBraceL)):(++this.pos,this.finishToken(f.backQuote));if(92===i)e+=this.input.slice(t,this.pos),e+=this.readEscapedChar(!0),t=this.pos;else if(isNewLine(i)){switch(e+=this.input.slice(t,this.pos),++this.pos,i){case 13:10===this.input.charCodeAt(this.pos)&&++this.pos;case 10:e+="\n";break;default:e+=String.fromCharCode(i)}this.options.locations&&(++this.curLine,this.lineStart=this.pos),t=this.pos}else++this.pos}},ce.readInvalidTemplateToken=function(){for(;this.pos<this.input.length;this.pos++)switch(this.input[this.pos]){case"\\":++this.pos;break;case"$":if("{"!==this.input[this.pos+1])break;case"`":return this.finishToken(f.invalidTemplate,this.input.slice(this.start,this.pos));case"\r":"\n"===this.input[this.pos+1]&&++this.pos;case"\n":case"\u2028":case"\u2029":++this.curLine,this.lineStart=this.pos+1}this.raise(this.start,"Unterminated template")},ce.readEscapedChar=function(e){var t=this.input.charCodeAt(++this.pos);switch(++this.pos,t){case 110:return"\n";case 114:return"\r";case 120:return String.fromCharCode(this.readHexChar(2));case 117:return codePointToString(this.readCodePoint());case 116:return"\t";case 98:return"\b";case 118:return"\v";case 102:return"\f";case 13:10===this.input.charCodeAt(this.pos)&&++this.pos;case 10:return this.options.locations&&(this.lineStart=this.pos,++this.curLine),"";case 56:case 57:if(this.strict&&this.invalidStringToken(this.pos-1,"Invalid escape sequence"),e){var i=this.pos-1;this.invalidStringToken(i,"Invalid escape sequence in template string")}default:if(t>=48&&t<=55){var s=this.input.substr(this.pos-1,3).match(/^[0-7]+/)[0],r=parseInt(s,8);return r>255&&(s=s.slice(0,-1),r=parseInt(s,8)),this.pos+=s.length-1,t=this.input.charCodeAt(this.pos),"0"===s&&56!==t&&57!==t||!this.strict&&!e||this.invalidStringToken(this.pos-1-s.length,e?"Octal literal in template string":"Octal literal in strict mode"),String.fromCharCode(r)}return isNewLine(t)?(this.options.locations&&(this.lineStart=this.pos,++this.curLine),""):String.fromCharCode(t)}},ce.readHexChar=function(e){var t=this.pos,i=this.readInt(16,e);return null===i&&this.invalidStringToken(t,"Bad character escape sequence"),i},ce.readWord1=function(){this.containsEsc=!1;for(var e="",t=!0,i=this.pos,s=this.options.ecmaVersion>=6;this.pos<this.input.length;){var r=this.fullCharCodeAtPos();if(isIdentifierChar(r,s))this.pos+=r<=65535?1:2;else{if(92!==r)break;this.containsEsc=!0,e+=this.input.slice(i,this.pos);var n=this.pos;117!==this.input.charCodeAt(++this.pos)&&this.invalidStringToken(this.pos,"Expecting Unicode escape sequence \\uXXXX"),++this.pos;var a=this.readCodePoint();(t?isIdentifierStart:isIdentifierChar)(a,s)||this.invalidStringToken(n,"Invalid Unicode escape"),e+=codePointToString(a),i=this.pos}t=!1}return e+this.input.slice(i,this.pos)},ce.readWord=function(){var e=this.readWord1(),t=f.name;return this.keywords.test(e)&&(t=d[e]),this.finishToken(t,e)};acorn_Parser.acorn={Parser:acorn_Parser,version:"8.15.0",defaultOptions:I,Position:acorn_Position,SourceLocation:acorn_SourceLocation,getLineInfo,Node:acorn_Node,TokenType:acorn_TokenType,tokTypes:f,keywordTypes:d,TokContext:acorn_TokContext,tokContexts:F,isIdentifierChar,isIdentifierStart,Token:acorn_Token,isNewLine,lineBreak:m,lineBreakG:g,nonASCIIwhitespace:x};const le=__webpack_require__(8995),ue=__webpack_require__(3024);String.fromCharCode;const de=/\/$|\/\?|\/#/,fe=/^\.?\//;function hasTrailingSlash(e="",t){return t?de.test(e):e.endsWith("/")}function withTrailingSlash(e="",t){if(!t)return e.endsWith("/")?e:e+"/";if(hasTrailingSlash(e,!0))return e||"/";let i=e,s="";const r=e.indexOf("#");if(-1!==r&&(i=e.slice(0,r),s=e.slice(r),!i))return s;const[n,...a]=i.split("?");return n+"/"+(a.length>0?`?${a.join("?")}`:"")+s}function isNonEmptyURL(e){return e&&"/"!==e}function dist_joinURL(e,...t){let i=e||"";for(const e of t.filter(e=>isNonEmptyURL(e)))if(i){const t=e.replace(fe,"");i=withTrailingSlash(i)+t}else i=e;return i}Symbol.for("ufo:protocolRelative");const me=/^[A-Za-z]:\//;function pathe_M_eThtNZ_normalizeWindowsPath(e=""){return e?e.replace(/\\/g,"/").replace(me,e=>e.toUpperCase()):e}const ge=/^[/\\]{2}/,xe=/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/,ve=/^[A-Za-z]:$/,ye=/.(\.[^./]+|\.)$/,pathe_M_eThtNZ_normalize=function(e){if(0===e.length)return".";const t=(e=pathe_M_eThtNZ_normalizeWindowsPath(e)).match(ge),i=isAbsolute(e),s="/"===e[e.length-1];return 0===(e=normalizeString(e,!i)).length?i?"/":s?"./":".":(s&&(e+="/"),ve.test(e)&&(e+="/"),t?i?`//${e}`:`//./${e}`:i&&!isAbsolute(e)?`/${e}`:e)},pathe_M_eThtNZ_join=function(...e){let t="";for(const i of e)if(i)if(t.length>0){const e="/"===t[t.length-1],s="/"===i[0];t+=e&&s?i.slice(1):e||s?i:`/${i}`}else t+=i;return pathe_M_eThtNZ_normalize(t)};function pathe_M_eThtNZ_cwd(){return"undefined"!=typeof process&&"function"==typeof process.cwd?process.cwd().replace(/\\/g,"/"):"/"}const pathe_M_eThtNZ_resolve=function(...e){let t="",i=!1;for(let s=(e=e.map(e=>pathe_M_eThtNZ_normalizeWindowsPath(e))).length-1;s>=-1&&!i;s--){const r=s>=0?e[s]:pathe_M_eThtNZ_cwd();r&&0!==r.length&&(t=`${r}/${t}`,i=isAbsolute(r))}return t=normalizeString(t,!i),i&&!isAbsolute(t)?`/${t}`:t.length>0?t:"."};function normalizeString(e,t){let i="",s=0,r=-1,n=0,a=null;for(let o=0;o<=e.length;++o){if(o<e.length)a=e[o];else{if("/"===a)break;a="/"}if("/"===a){if(r===o-1||1===n);else if(2===n){if(i.length<2||2!==s||"."!==i[i.length-1]||"."!==i[i.length-2]){if(i.length>2){const e=i.lastIndexOf("/");-1===e?(i="",s=0):(i=i.slice(0,e),s=i.length-1-i.lastIndexOf("/")),r=o,n=0;continue}if(i.length>0){i="",s=0,r=o,n=0;continue}}t&&(i+=i.length>0?"/..":"..",s=2)}else i.length>0?i+=`/${e.slice(r+1,o)}`:i=e.slice(r+1,o),s=o-r-1;r=o,n=0}else"."===a&&-1!==n?++n:n=-1}return i}const isAbsolute=function(e){return xe.test(e)},extname=function(e){if(".."===e)return"";const t=ye.exec(pathe_M_eThtNZ_normalizeWindowsPath(e));return t&&t[1]||""},pathe_M_eThtNZ_dirname=function(e){const t=pathe_M_eThtNZ_normalizeWindowsPath(e).replace(/\/$/,"").split("/").slice(0,-1);return 1===t.length&&ve.test(t[0])&&(t[0]+="/"),t.join("/")||(isAbsolute(e)?"/":".")},basename=function(e,t){const i=pathe_M_eThtNZ_normalizeWindowsPath(e).split("/");let s="";for(let e=i.length-1;e>=0;e--){const t=i[e];if(t){s=t;break}}return t&&s.endsWith(t)?s.slice(0,-t.length):s},_e=__webpack_require__(3136),Ee=__webpack_require__(4589),be=__webpack_require__(1708),Se=__webpack_require__(6760),ke=__webpack_require__(8877),we=__webpack_require__(7975),Ie=new Set(le.builtinModules);function normalizeSlash(e){return e.replace(/\\/g,"/")}const Ce={}.hasOwnProperty,Re=/^([A-Z][a-z\d]*)+$/,Pe=new Set(["string","function","number","object","Function","Object","boolean","bigint","symbol"]),Te={};function formatList(e,t="and"){return e.length<3?e.join(` ${t} `):`${e.slice(0,-1).join(", ")}, ${t} ${e[e.length-1]}`}const Ae=new Map;let Ne;function createError(e,t,i){return Ae.set(e,t),function(e,t){return NodeError;function NodeError(...i){const s=Error.stackTraceLimit;isErrorStackTraceLimitWritable()&&(Error.stackTraceLimit=0);const r=new e;isErrorStackTraceLimitWritable()&&(Error.stackTraceLimit=s);const n=function(e,t,i){const s=Ae.get(e);if(Ee(void 0!==s,"expected `message` to be found"),"function"==typeof s)return Ee(s.length<=t.length,`Code: ${e}; The provided arguments length (${t.length}) does not match the required ones (${s.length}).`),Reflect.apply(s,i,t);const r=/%[dfijoOs]/g;let n=0;for(;null!==r.exec(s);)n++;return Ee(n===t.length,`Code: ${e}; The provided arguments length (${t.length}) does not match the required ones (${n}).`),0===t.length?s:(t.unshift(s),Reflect.apply(we.format,null,t))}(t,i,r);return Object.defineProperties(r,{message:{value:n,enumerable:!1,writable:!0,configurable:!0},toString:{value(){return`${this.name} [${t}]: ${this.message}`},enumerable:!1,writable:!0,configurable:!0}}),Le(r),r.code=t,r}}(i,e)}function isErrorStackTraceLimitWritable(){try{if(ke.startupSnapshot.isBuildingSnapshot())return!1}catch{}const e=Object.getOwnPropertyDescriptor(Error,"stackTraceLimit");return void 0===e?Object.isExtensible(Error):Ce.call(e,"writable")&&void 0!==e.writable?e.writable:void 0!==e.set}Te.ERR_INVALID_ARG_TYPE=createError("ERR_INVALID_ARG_TYPE",(e,t,i)=>{Ee("string"==typeof e,"'name' must be a string"),Array.isArray(t)||(t=[t]);let s="The ";if(e.endsWith(" argument"))s+=`${e} `;else{const t=e.includes(".")?"property":"argument";s+=`"${e}" ${t} `}s+="must be ";const r=[],n=[],a=[];for(const e of t)Ee("string"==typeof e,"All expected entries have to be of type string"),Pe.has(e)?r.push(e.toLowerCase()):null===Re.exec(e)?(Ee("object"!==e,'The value "object" should be written as "Object"'),a.push(e)):n.push(e);if(n.length>0){const e=r.indexOf("object");-1!==e&&(r.slice(e,1),n.push("Object"))}return r.length>0&&(s+=`${r.length>1?"one of type":"of type"} ${formatList(r,"or")}`,(n.length>0||a.length>0)&&(s+=" or ")),n.length>0&&(s+=`an instance of ${formatList(n,"or")}`,a.length>0&&(s+=" or ")),a.length>0&&(a.length>1?s+=`one of ${formatList(a,"or")}`:(a[0].toLowerCase()!==a[0]&&(s+="an "),s+=`${a[0]}`)),s+=`. Received ${function(e){if(null==e)return String(e);if("function"==typeof e&&e.name)return`function ${e.name}`;if("object"==typeof e)return e.constructor&&e.constructor.name?`an instance of ${e.constructor.name}`:`${(0,we.inspect)(e,{depth:-1})}`;let t=(0,we.inspect)(e,{colors:!1});t.length>28&&(t=`${t.slice(0,25)}...`);return`type ${typeof e} (${t})`}(i)}`,s},TypeError),Te.ERR_INVALID_MODULE_SPECIFIER=createError("ERR_INVALID_MODULE_SPECIFIER",(e,t,i=void 0)=>`Invalid module "${e}" ${t}${i?` imported from ${i}`:""}`,TypeError),Te.ERR_INVALID_PACKAGE_CONFIG=createError("ERR_INVALID_PACKAGE_CONFIG",(e,t,i)=>`Invalid package config ${e}${t?` while importing ${t}`:""}${i?`. ${i}`:""}`,Error),Te.ERR_INVALID_PACKAGE_TARGET=createError("ERR_INVALID_PACKAGE_TARGET",(e,t,i,s=!1,r=void 0)=>{const n="string"==typeof i&&!s&&i.length>0&&!i.startsWith("./");return"."===t?(Ee(!1===s),`Invalid "exports" main target ${JSON.stringify(i)} defined in the package config ${e}package.json${r?` imported from ${r}`:""}${n?'; targets must start with "./"':""}`):`Invalid "${s?"imports":"exports"}" target ${JSON.stringify(i)} defined for '${t}' in the package config ${e}package.json${r?` imported from ${r}`:""}${n?'; targets must start with "./"':""}`},Error),Te.ERR_MODULE_NOT_FOUND=createError("ERR_MODULE_NOT_FOUND",(e,t,i=!1)=>`Cannot find ${i?"module":"package"} '${e}' imported from ${t}`,Error),Te.ERR_NETWORK_IMPORT_DISALLOWED=createError("ERR_NETWORK_IMPORT_DISALLOWED","import of '%s' by %s is not supported: %s",Error),Te.ERR_PACKAGE_IMPORT_NOT_DEFINED=createError("ERR_PACKAGE_IMPORT_NOT_DEFINED",(e,t,i)=>`Package import specifier "${e}" is not defined${t?` in package ${t}package.json`:""} imported from ${i}`,TypeError),Te.ERR_PACKAGE_PATH_NOT_EXPORTED=createError("ERR_PACKAGE_PATH_NOT_EXPORTED",(e,t,i=void 0)=>"."===t?`No "exports" main defined in ${e}package.json${i?` imported from ${i}`:""}`:`Package subpath '${t}' is not defined by "exports" in ${e}package.json${i?` imported from ${i}`:""}`,Error),Te.ERR_UNSUPPORTED_DIR_IMPORT=createError("ERR_UNSUPPORTED_DIR_IMPORT","Directory import '%s' is not supported resolving ES modules imported from %s",Error),Te.ERR_UNSUPPORTED_RESOLVE_REQUEST=createError("ERR_UNSUPPORTED_RESOLVE_REQUEST",'Failed to resolve module specifier "%s" from "%s": Invalid relative URL or base scheme is not hierarchical.',TypeError),Te.ERR_UNKNOWN_FILE_EXTENSION=createError("ERR_UNKNOWN_FILE_EXTENSION",(e,t)=>`Unknown file extension "${e}" for ${t}`,TypeError),Te.ERR_INVALID_ARG_VALUE=createError("ERR_INVALID_ARG_VALUE",(e,t,i="is invalid")=>{let s=(0,we.inspect)(t);s.length>128&&(s=`${s.slice(0,128)}...`);return`The ${e.includes(".")?"property":"argument"} '${e}' ${i}. Received ${s}`},TypeError);const Le=function(e){const t="__node_internal_"+e.name;return Object.defineProperty(e,"name",{value:t}),e}(function(e){const t=isErrorStackTraceLimitWritable();return t&&(Ne=Error.stackTraceLimit,Error.stackTraceLimit=Number.POSITIVE_INFINITY),Error.captureStackTrace(e),t&&(Error.stackTraceLimit=Ne),e});const Oe={}.hasOwnProperty,{ERR_INVALID_PACKAGE_CONFIG:De}=Te,Ve=new Map;function read(e,{base:t,specifier:i}){const s=Ve.get(e);if(s)return s;let r;try{r=ue.readFileSync(Se.toNamespacedPath(e),"utf8")}catch(e){const t=e;if("ENOENT"!==t.code)throw t}const n={exists:!1,pjsonPath:e,main:void 0,name:void 0,type:"none",exports:void 0,imports:void 0};if(void 0!==r){let s;try{s=JSON.parse(r)}catch(s){const r=s,n=new De(e,(t?`"${i}" from `:"")+(0,_e.fileURLToPath)(t||i),r.message);throw n.cause=r,n}n.exists=!0,Oe.call(s,"name")&&"string"==typeof s.name&&(n.name=s.name),Oe.call(s,"main")&&"string"==typeof s.main&&(n.main=s.main),Oe.call(s,"exports")&&(n.exports=s.exports),Oe.call(s,"imports")&&(n.imports=s.imports),!Oe.call(s,"type")||"commonjs"!==s.type&&"module"!==s.type||(n.type=s.type)}return Ve.set(e,n),n}function getPackageScopeConfig(e){let t=new URL("package.json",e);for(;;){if(t.pathname.endsWith("node_modules/package.json"))break;const i=read((0,_e.fileURLToPath)(t),{specifier:e});if(i.exists)return i;const s=t;if(t=new URL("../package.json",t),t.pathname===s.pathname)break}return{pjsonPath:(0,_e.fileURLToPath)(t),exists:!1,type:"none"}}function getPackageType(e){return getPackageScopeConfig(e).type}const{ERR_UNKNOWN_FILE_EXTENSION:Ue}=Te,Me={}.hasOwnProperty,je={__proto__:null,".cjs":"commonjs",".js":"module",".json":"json",".mjs":"module"};const Fe={__proto__:null,"data:":function(e){const{1:t}=/^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(e.pathname)||[null,null,null];return function(e){return e&&/\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(e)?"module":"application/json"===e?"json":null}(t)},"file:":function(e,t,i){const s=function(e){const t=e.pathname;let i=t.length;for(;i--;){const e=t.codePointAt(i);if(47===e)return"";if(46===e)return 47===t.codePointAt(i-1)?"":t.slice(i)}return""}(e);if(".js"===s){const t=getPackageType(e);return"none"!==t?t:"commonjs"}if(""===s){const t=getPackageType(e);return"none"===t||"commonjs"===t?"commonjs":"module"}const r=je[s];if(r)return r;if(i)return;const n=(0,_e.fileURLToPath)(e);throw new Ue(s,n)},"http:":getHttpProtocolModuleFormat,"https:":getHttpProtocolModuleFormat,"node:":()=>"builtin"};function getHttpProtocolModuleFormat(){}const Be=RegExp.prototype[Symbol.replace],{ERR_INVALID_MODULE_SPECIFIER:$e,ERR_INVALID_PACKAGE_CONFIG:qe,ERR_INVALID_PACKAGE_TARGET:We,ERR_MODULE_NOT_FOUND:Ge,ERR_PACKAGE_IMPORT_NOT_DEFINED:He,ERR_PACKAGE_PATH_NOT_EXPORTED:Ke,ERR_UNSUPPORTED_DIR_IMPORT:ze,ERR_UNSUPPORTED_RESOLVE_REQUEST:Je}=Te,Ye={}.hasOwnProperty,Qe=/(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i,Ze=/(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i,Xe=/^\.|%|\\/,et=/\*/g,tt=/%2f|%5c/i,it=new Set,st=/[/\\]{2}/;function emitInvalidSegmentDeprecation(e,t,i,s,r,n,a){if(be.noDeprecation)return;const o=(0,_e.fileURLToPath)(s),h=null!==st.exec(a?e:t);be.emitWarning(`Use of deprecated ${h?"double slash":"leading or trailing slash matching"} resolving "${e}" for module request "${t}" ${t===i?"":`matched to "${i}" `}in the "${r?"imports":"exports"}" field module resolution of the package at ${o}${n?` imported from ${(0,_e.fileURLToPath)(n)}`:""}.`,"DeprecationWarning","DEP0166")}function emitLegacyIndexDeprecation(e,t,i,s){if(be.noDeprecation)return;const r=function(e,t){const i=e.protocol;return Me.call(Fe,i)&&Fe[i](e,t,!0)||null}(e,{parentURL:i.href});if("module"!==r)return;const n=(0,_e.fileURLToPath)(e.href),a=(0,_e.fileURLToPath)(new _e.URL(".",t)),o=(0,_e.fileURLToPath)(i);s?Se.resolve(a,s)!==n&&be.emitWarning(`Package ${a} has a "main" field set to "${s}", excluding the full filename and extension to the resolved file at "${n.slice(a.length)}", imported from ${o}.\n Automatic extension resolution of the "main" field is deprecated for ES modules.`,"DeprecationWarning","DEP0151"):be.emitWarning(`No "main" or "exports" field defined in the package.json for ${a} resolving the main entry point "${n.slice(a.length)}", imported from ${o}.\nDefault "index" lookups for the main are deprecated for ES modules.`,"DeprecationWarning","DEP0151")}function tryStatSync(e){try{return(0,ue.statSync)(e)}catch{}}function fileExists(e){const t=(0,ue.statSync)(e,{throwIfNoEntry:!1}),i=t?t.isFile():void 0;return null!=i&&i}function legacyMainResolve(e,t,i){let s;if(void 0!==t.main){if(s=new _e.URL(t.main,e),fileExists(s))return s;const r=[`./${t.main}.js`,`./${t.main}.json`,`./${t.main}.node`,`./${t.main}/index.js`,`./${t.main}/index.json`,`./${t.main}/index.node`];let n=-1;for(;++n<r.length&&(s=new _e.URL(r[n],e),!fileExists(s));)s=void 0;if(s)return emitLegacyIndexDeprecation(s,e,i,t.main),s}const r=["./index.js","./index.json","./index.node"];let n=-1;for(;++n<r.length&&(s=new _e.URL(r[n],e),!fileExists(s));)s=void 0;if(s)return emitLegacyIndexDeprecation(s,e,i,t.main),s;throw new Ge((0,_e.fileURLToPath)(new _e.URL(".",e)),(0,_e.fileURLToPath)(i))}function exportsNotFound(e,t,i){return new Ke((0,_e.fileURLToPath)(new _e.URL(".",t)),e,i&&(0,_e.fileURLToPath)(i))}function invalidPackageTarget(e,t,i,s,r){return t="object"==typeof t&&null!==t?JSON.stringify(t,null,""):`${t}`,new We((0,_e.fileURLToPath)(new _e.URL(".",i)),e,t,s,r&&(0,_e.fileURLToPath)(r))}function resolvePackageTargetString(e,t,i,s,r,n,a,o,h){if(""!==t&&!n&&"/"!==e[e.length-1])throw invalidPackageTarget(i,e,s,a,r);if(!e.startsWith("./")){if(a&&!e.startsWith("../")&&!e.startsWith("/")){let i=!1;try{new _e.URL(e),i=!0}catch{}if(!i){return packageResolve(n?Be.call(et,e,()=>t):e+t,s,h)}}throw invalidPackageTarget(i,e,s,a,r)}if(null!==Qe.exec(e.slice(2))){if(null!==Ze.exec(e.slice(2)))throw invalidPackageTarget(i,e,s,a,r);if(!o){const o=n?i.replace("*",()=>t):i+t;emitInvalidSegmentDeprecation(n?Be.call(et,e,()=>t):e,o,i,s,a,r,!0)}}const c=new _e.URL(e,s),p=c.pathname,l=new _e.URL(".",s).pathname;if(!p.startsWith(l))throw invalidPackageTarget(i,e,s,a,r);if(""===t)return c;if(null!==Qe.exec(t)){const h=n?i.replace("*",()=>t):i+t;if(null===Ze.exec(t)){if(!o){emitInvalidSegmentDeprecation(n?Be.call(et,e,()=>t):e,h,i,s,a,r,!1)}}else!function(e,t,i,s,r){const n=`request is not a valid match in pattern "${t}" for the "${s?"imports":"exports"}" resolution of ${(0,_e.fileURLToPath)(i)}`;throw new $e(e,n,r&&(0,_e.fileURLToPath)(r))}(h,i,s,a,r)}return n?new _e.URL(Be.call(et,c.href,()=>t)):new _e.URL(t,c)}function isArrayIndex(e){const t=Number(e);return`${t}`===e&&(t>=0&&t<4294967295)}function resolvePackageTarget(e,t,i,s,r,n,a,o,h){if("string"==typeof t)return resolvePackageTargetString(t,i,s,e,r,n,a,o,h);if(Array.isArray(t)){const c=t;if(0===c.length)return null;let p,l=-1;for(;++l<c.length;){const t=c[l];let u;try{u=resolvePackageTarget(e,t,i,s,r,n,a,o,h)}catch(e){if(p=e,"ERR_INVALID_PACKAGE_TARGET"===e.code)continue;throw e}if(void 0!==u){if(null!==u)return u;p=null}}if(null==p)return null;throw p}if("object"==typeof t&&null!==t){const c=Object.getOwnPropertyNames(t);let p=-1;for(;++p<c.length;){if(isArrayIndex(c[p]))throw new qe((0,_e.fileURLToPath)(e),r,'"exports" cannot contain numeric property keys.')}for(p=-1;++p<c.length;){const l=c[p];if("default"===l||h&&h.has(l)){const c=resolvePackageTarget(e,t[l],i,s,r,n,a,o,h);if(void 0===c)continue;return c}}return null}if(null===t)return null;throw invalidPackageTarget(s,t,e,a,r)}function emitTrailingSlashPatternDeprecation(e,t,i){if(be.noDeprecation)return;const s=(0,_e.fileURLToPath)(t);it.has(s+"|"+e)||(it.add(s+"|"+e),be.emitWarning(`Use of deprecated trailing slash pattern mapping "${e}" in the "exports" field module resolution of the package at ${s}${i?` imported from ${(0,_e.fileURLToPath)(i)}`:""}. Mapping specifiers ending in "/" is no longer supported.`,"DeprecationWarning","DEP0155"))}function packageExportsResolve(e,t,i,s,r){let n=i.exports;if(function(e,t,i){if("string"==typeof e||Array.isArray(e))return!0;if("object"!=typeof e||null===e)return!1;const s=Object.getOwnPropertyNames(e);let r=!1,n=0,a=-1;for(;++a<s.length;){const e=s[a],o=""===e||"."!==e[0];if(0===n++)r=o;else if(r!==o)throw new qe((0,_e.fileURLToPath)(t),i,"\"exports\" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.")}return r}(n,e,s)&&(n={".":n}),Ye.call(n,t)&&!t.includes("*")&&!t.endsWith("/")){const i=resolvePackageTarget(e,n[t],"",t,s,!1,!1,!1,r);if(null==i)throw exportsNotFound(t,e,s);return i}let a="",o="";const h=Object.getOwnPropertyNames(n);let c=-1;for(;++c<h.length;){const i=h[c],r=i.indexOf("*");if(-1!==r&&t.startsWith(i.slice(0,r))){t.endsWith("/")&&emitTrailingSlashPatternDeprecation(t,e,s);const n=i.slice(r+1);t.length>=i.length&&t.endsWith(n)&&1===patternKeyCompare(a,i)&&i.lastIndexOf("*")===r&&(a=i,o=t.slice(r,t.length-n.length))}}if(a){const i=resolvePackageTarget(e,n[a],o,a,s,!0,!1,t.endsWith("/"),r);if(null==i)throw exportsNotFound(t,e,s);return i}throw exportsNotFound(t,e,s)}function patternKeyCompare(e,t){const i=e.indexOf("*"),s=t.indexOf("*"),r=-1===i?e.length:i+1,n=-1===s?t.length:s+1;return r>n?-1:n>r||-1===i?1:-1===s||e.length>t.length?-1:t.length>e.length?1:0}function packageImportsResolve(e,t,i){if("#"===e||e.startsWith("#/")||e.endsWith("/")){throw new $e(e,"is not a valid internal imports specifier name",(0,_e.fileURLToPath)(t))}let s;const r=getPackageScopeConfig(t);if(r.exists){s=(0,_e.pathToFileURL)(r.pjsonPath);const n=r.imports;if(n)if(Ye.call(n,e)&&!e.includes("*")){const r=resolvePackageTarget(s,n[e],"",e,t,!1,!0,!1,i);if(null!=r)return r}else{let r="",a="";const o=Object.getOwnPropertyNames(n);let h=-1;for(;++h<o.length;){const t=o[h],i=t.indexOf("*");if(-1!==i&&e.startsWith(t.slice(0,-1))){const s=t.slice(i+1);e.length>=t.length&&e.endsWith(s)&&1===patternKeyCompare(r,t)&&t.lastIndexOf("*")===i&&(r=t,a=e.slice(i,e.length-s.length))}}if(r){const e=resolvePackageTarget(s,n[r],a,r,t,!0,!0,!1,i);if(null!=e)return e}}}throw function(e,t,i){return new He(e,t&&(0,_e.fileURLToPath)(new _e.URL(".",t)),(0,_e.fileURLToPath)(i))}(e,s,t)}function packageResolve(e,t,i){if(le.builtinModules.includes(e))return new _e.URL("node:"+e);const{packageName:s,packageSubpath:r,isScoped:n}=function(e,t){let i=e.indexOf("/"),s=!0,r=!1;"@"===e[0]&&(r=!0,-1===i||0===e.length?s=!1:i=e.indexOf("/",i+1));const n=-1===i?e:e.slice(0,i);if(null!==Xe.exec(n)&&(s=!1),!s)throw new $e(e,"is not a valid package name",(0,_e.fileURLToPath)(t));return{packageName:n,packageSubpath:"."+(-1===i?"":e.slice(i)),isScoped:r}}(e,t),a=getPackageScopeConfig(t);if(a.exists){const e=(0,_e.pathToFileURL)(a.pjsonPath);if(a.name===s&&void 0!==a.exports&&null!==a.exports)return packageExportsResolve(e,r,a,t,i)}let o,h=new _e.URL("./node_modules/"+s+"/package.json",t),c=(0,_e.fileURLToPath)(h);do{const a=tryStatSync(c.slice(0,-13));if(!a||!a.isDirectory()){o=c,h=new _e.URL((n?"../../../../node_modules/":"../../../node_modules/")+s+"/package.json",h),c=(0,_e.fileURLToPath)(h);continue}const p=read(c,{base:t,specifier:e});return void 0!==p.exports&&null!==p.exports?packageExportsResolve(h,r,p,t,i):"."===r?legacyMainResolve(h,p,t):new _e.URL(r,h)}while(c.length!==o.length);throw new Ge(s,(0,_e.fileURLToPath)(t),!1)}function moduleResolve(e,t,i,s){const r=t.protocol,n="data:"===r||"http:"===r||"https:"===r;let a;if(function(e){return""!==e&&("/"===e[0]||function(e){if("."===e[0]){if(1===e.length||"/"===e[1])return!0;if("."===e[1]&&(2===e.length||"/"===e[2]))return!0}return!1}(e))}(e))try{a=new _e.URL(e,t)}catch(i){const s=new Je(e,t);throw s.cause=i,s}else if("file:"===r&&"#"===e[0])a=packageImportsResolve(e,t,i);else try{a=new _e.URL(e)}catch(s){if(n&&!le.builtinModules.includes(e)){const i=new Je(e,t);throw i.cause=s,i}a=packageResolve(e,t,i)}return Ee(void 0!==a,"expected to be defined"),"file:"!==a.protocol?a:function(e,t){if(null!==tt.exec(e.pathname))throw new $e(e.pathname,'must not include encoded "/" or "\\" characters',(0,_e.fileURLToPath)(t));let i;try{i=(0,_e.fileURLToPath)(e)}catch(i){const s=i;throw Object.defineProperty(s,"input",{value:String(e)}),Object.defineProperty(s,"module",{value:String(t)}),s}const s=tryStatSync(i.endsWith("/")?i.slice(-1):i);if(s&&s.isDirectory()){const s=new ze(i,(0,_e.fileURLToPath)(t));throw s.url=String(e),s}if(!s||!s.isFile()){const s=new Ge(i||e.pathname,t&&(0,_e.fileURLToPath)(t),!0);throw s.url=String(e),s}{const t=(0,ue.realpathSync)(i),{search:s,hash:r}=e;(e=(0,_e.pathToFileURL)(t+(i.endsWith(Se.sep)?"/":""))).search=s,e.hash=r}return e}(a,t)}function fileURLToPath(e){return"string"!=typeof e||e.startsWith("file://")?normalizeSlash((0,_e.fileURLToPath)(e)):normalizeSlash(e)}function pathToFileURL(e){return(0,_e.pathToFileURL)(fileURLToPath(e)).toString()}const rt=new Set(["node","import"]),nt=[".mjs",".cjs",".js",".json"],at=new Set(["ERR_MODULE_NOT_FOUND","ERR_UNSUPPORTED_DIR_IMPORT","MODULE_NOT_FOUND","ERR_PACKAGE_PATH_NOT_EXPORTED"]);function _tryModuleResolve(e,t,i){try{return moduleResolve(e,t,i)}catch(e){if(!at.has(e?.code))throw e}}function _resolve(e,t={}){if("string"!=typeof e){if(!(e instanceof URL))throw new TypeError("input must be a `string` or `URL`");e=fileURLToPath(e)}if(/(?:node|data|http|https):/.test(e))return e;if(Ie.has(e))return"node:"+e;if(e.startsWith("file://")&&(e=fileURLToPath(e)),isAbsolute(e))try{if((0,ue.statSync)(e).isFile())return pathToFileURL(e)}catch(e){if("ENOENT"!==e?.code)throw e}const i=t.conditions?new Set(t.conditions):rt,s=(Array.isArray(t.url)?t.url:[t.url]).filter(Boolean).map(e=>new URL(function(e){return"string"!=typeof e&&(e=e.toString()),/(?:node|data|http|https|file):/.test(e)?e:Ie.has(e)?"node:"+e:"file://"+encodeURI(normalizeSlash(e))}(e.toString())));0===s.length&&s.push(new URL(pathToFileURL(process.cwd())));const r=[...s];for(const e of s)"file:"===e.protocol&&r.push(new URL("./",e),new URL(dist_joinURL(e.pathname,"_index.js"),e),new URL("node_modules",e));let n;for(const s of r){if(n=_tryModuleResolve(e,s,i),n)break;for(const r of["","/index"]){for(const a of t.extensions||nt)if(n=_tryModuleResolve(dist_joinURL(e,r)+a,s,i),n)break;if(n)break}if(n)break}if(!n){const t=new Error(`Cannot find module ${e} imported from ${r.join(", ")}`);throw t.code="ERR_MODULE_NOT_FOUND",t}return pathToFileURL(n)}function resolveSync(e,t){return _resolve(e,t)}function resolvePathSync(e,t){return fileURLToPath(resolveSync(e,t))}const ot=/(?:[\s;]|^)(?:import[\s\w*,{}]*from|import\s*["'*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m,ht=/\/\*.+?\*\/|\/\/.*(?=[nr])/g;function hasESMSyntax(e,t={}){return t.stripComments&&(e=e.replace(ht,"")),ot.test(e)}function escapeStringRegexp(e){if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}const ct=new Set(["/","\\",void 0]),pt=Symbol.for("pathe:normalizedAlias"),lt=/[/\\]/;function normalizeAliases(e){if(e[pt])return e;const t=Object.fromEntries(Object.entries(e).sort(([e],[t])=>function(e,t){return t.split("/").length-e.split("/").length}(e,t)));for(const e in t)for(const i in t)i===e||e.startsWith(i)||t[e]?.startsWith(i)&&ct.has(t[e][i.length])&&(t[e]=t[i]+t[e].slice(i.length));return Object.defineProperty(t,pt,{value:!0,enumerable:!1}),t}function utils_hasTrailingSlash(e="/"){const t=e[e.length-1];return"/"===t||"\\"===t}var ut={rE:"2.6.1"};const dt=__webpack_require__(7598);var ft=__nested_webpack_require_494__.n(dt);const mt=Object.create(null),dist_i=e=>globalThis.process?.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?mt:globalThis),gt=new Proxy(mt,{get:(e,t)=>dist_i()[t]??mt[t],has:(e,t)=>t in dist_i()||t in mt,set:(e,t,i)=>(dist_i(!0)[t]=i,!0),deleteProperty(e,t){if(!t)return!1;return delete dist_i(!0)[t],!0},ownKeys(){const e=dist_i(!0);return Object.keys(e)}}),xt=typeof process<"u"&&process.env&&process.env.NODE_ENV||"",vt=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:!0}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:!0}],["CLOUDFLARE_WORKERS","WORKERS_CI",{ci:!0}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:!1}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:!1}],["VERCEL","VERCEL_ENV",{ci:!1}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:!1}],["CODESANDBOX","CODESANDBOX_HOST",{ci:!1}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"],["ZEABUR"],["CODESPHERE","CODESPHERE_APP_ID",{ci:!0}],["RAILWAY","RAILWAY_PROJECT_ID"],["RAILWAY","RAILWAY_SERVICE_ID"],["DENO-DEPLOY","DENO_DEPLOYMENT_ID"],["FIREBASE_APP_HOSTING","FIREBASE_APP_HOSTING",{ci:!0}]];const yt=function(){if(globalThis.process?.env)for(const e of vt){const t=e[1]||e[0];if(globalThis.process?.env[t])return{name:e[0].toLowerCase(),...e[2]}}return"/bin/jsh"===globalThis.process?.env?.SHELL&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:!1}:{name:"",ci:!1}}();yt.name;function std_env_dist_n(e){return!!e&&"false"!==e}const _t=globalThis.process?.platform||"",Et=std_env_dist_n(gt.CI)||!1!==yt.ci,bt=std_env_dist_n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY),St=(std_env_dist_n(gt.DEBUG),"test"===xt||std_env_dist_n(gt.TEST)),kt=(std_env_dist_n(gt.MINIMAL),/^win/i.test(_t)),wt=(/^linux/i.test(_t),/^darwin/i.test(_t),!std_env_dist_n(gt.NO_COLOR)&&(std_env_dist_n(gt.FORCE_COLOR)||(bt||kt)&&gt.TERM),(globalThis.process?.versions?.node||"").replace(/^v/,"")||null),It=(Number(wt?.split(".")[0]),globalThis.process||Object.create(null)),Ct={versions:{}},Rt=(new Proxy(It,{get:(e,t)=>"env"===t?gt:t in e?e[t]:t in Ct?Ct[t]:void 0}),"node"===globalThis.process?.release?.name),Pt=!!globalThis.Bun||!!globalThis.process?.versions?.bun,Tt=!!globalThis.Deno,At=!!globalThis.fastly,Nt=[[!!globalThis.Netlify,"netlify"],[!!globalThis.EdgeRuntime,"edge-light"],["Cloudflare-Workers"===globalThis.navigator?.userAgent,"workerd"],[At,"fastly"],[Tt,"deno"],[Pt,"bun"],[Rt,"node"]];!function(){const e=Nt.find(e=>e[0]);if(e)e[1]}();const Lt=__webpack_require__(7066),Ot=Lt?.WriteStream?.prototype?.hasColors?.()??!1,base_format=(e,t)=>{if(!Ot)return e=>e;const i=`[${e}m`,s=`[${t}m`;return e=>{const r=e+"";let n=r.indexOf(s);if(-1===n)return i+r+s;let a=i,o=0;const h=(22===t?s:"")+i;for(;-1!==n;)a+=r.slice(o,n)+h,o=n+s.length,n=r.indexOf(s,o);return a+=r.slice(o)+s,a}},Dt=(base_format(0,0),base_format(1,22),base_format(2,22),base_format(3,23),base_format(4,24),base_format(53,55),base_format(7,27),base_format(8,28),base_format(9,29),base_format(30,39),base_format(31,39)),Vt=base_format(32,39),Ut=base_format(33,39),Mt=base_format(34,39),jt=(base_format(35,39),base_format(36,39)),Ft=(base_format(37,39),base_format(90,39));base_format(40,49),base_format(41,49),base_format(42,49),base_format(43,49),base_format(44,49),base_format(45,49),base_format(46,49),base_format(47,49),base_format(100,49),base_format(91,39),base_format(92,39),base_format(93,39),base_format(94,39),base_format(95,39),base_format(96,39),base_format(97,39),base_format(101,49),base_format(102,49),base_format(103,49),base_format(104,49),base_format(105,49),base_format(106,49),base_format(107,49);function isDir(e){if("string"!=typeof e||e.startsWith("file://"))return!1;try{return(0,ue.lstatSync)(e).isDirectory()}catch{return!1}}function utils_hash(e,t=8){return(function(){if(void 0!==$t)return $t;try{return $t=!!ft().getFips?.(),$t}catch{return $t=!1,$t}}()?ft().createHash("sha256"):ft().createHash("md5")).update(e).digest("hex").slice(0,t)}const Bt={true:Vt("true"),false:Ut("false"),"[rebuild]":Ut("[rebuild]"),"[esm]":Mt("[esm]"),"[cjs]":Vt("[cjs]"),"[import]":Mt("[import]"),"[require]":Vt("[require]"),"[native]":jt("[native]"),"[transpile]":Ut("[transpile]"),"[fallback]":Dt("[fallback]"),"[unknown]":Dt("[unknown]"),"[hit]":Vt("[hit]"),"[miss]":Ut("[miss]"),"[json]":Vt("[json]"),"[data]":Vt("[data]")};function debug(e,...t){if(!e.opts.debug)return;const i=process.cwd();console.log(Ft(["[jiti]",...t.map(e=>e in Bt?Bt[e]:"string"!=typeof e?JSON.stringify(e):e.replace(i,"."))].join(" ")))}function jitiInteropDefault(e,t){return e.opts.interopDefault?function(e){const t=typeof e;if(null===e||"object"!==t&&"function"!==t)return e;const i=e.default,s=typeof i,r=null==i,n="object"===s||"function"===s;if(r&&e instanceof Promise)return e;return new Proxy(e,{get(t,s,a){if("__esModule"===s)return!0;if("default"===s)return r?e:"function"==typeof i?.default&&e.__esModule?i.default:i;if(Reflect.has(t,s))return Reflect.get(t,s,a);if(n&&!(i instanceof Promise)){let e=Reflect.get(i,s,a);return"function"==typeof e&&(e=e.bind(i)),e}},apply:(e,t,r)=>"function"==typeof e?Reflect.apply(e,t,r):"function"===s?Reflect.apply(i,t,r):void 0})}(t):t}let $t;function _booleanEnv(e,t){const i=_jsonEnv(e,t);return Boolean(i)}function _jsonEnv(e,t){const i=process.env[e];if(!(e in process.env))return t;try{return JSON.parse(i)}catch{return t}}const qt=/\.(c|m)?j(sx?)$/,Wt=/\.(c|m)?t(sx?)$/;function jitiResolve(e,t,i){let s,r;if(e.isNativeRe.test(t))return t;e.alias&&(t=function(e,t){const i=pathe_M_eThtNZ_normalizeWindowsPath(e);t=normalizeAliases(t);for(const[e,s]of Object.entries(t)){if(!i.startsWith(e))continue;const t=utils_hasTrailingSlash(e)?e.slice(0,-1):e;if(utils_hasTrailingSlash(i[t.length]))return pathe_M_eThtNZ_join(s,i.slice(e.length))}return i}(t,e.alias));let n=i?.parentURL||e.url;isDir(n)&&(n=pathe_M_eThtNZ_join(n,"_index.js"));const a=(i?.async?[i?.conditions,["node","import"],["node","require"]]:[i?.conditions,["node","require"],["node","import"]]).filter(Boolean);for(const i of a){try{s=resolvePathSync(t,{url:n,conditions:i,extensions:e.opts.extensions})}catch(e){r=e}if(s)return s}try{return e.nativeRequire.resolve(t,{paths:i.paths})}catch(e){r=e}for(const r of e.additionalExts){if(s=tryNativeRequireResolve(e,t+r,n,i)||tryNativeRequireResolve(e,t+"/index"+r,n,i),s)return s;if((Wt.test(e.filename)||Wt.test(e.parentModule?.filename||"")||qt.test(t))&&(s=tryNativeRequireResolve(e,t.replace(qt,".$1t$2"),n,i),s))return s}if(!i?.try)throw r}function tryNativeRequireResolve(e,t,i,s){try{return e.nativeRequire.resolve(t,{...s,paths:[pathe_M_eThtNZ_dirname(fileURLToPath(i)),...s?.paths||[]]})}catch{}}const Gt=__webpack_require__(643),Ht=__webpack_require__(714);var Kt=__nested_webpack_require_494__.n(Ht);function jitiRequire(e,t,i){const s=e.parentCache||{};if(t.startsWith("node:"))return nativeImportOrRequire(e,t,i.async);if(t.startsWith("file:"))t=(0,_e.fileURLToPath)(t);else if(t.startsWith("data:")){if(!i.async)throw new Error("`data:` URLs are only supported in ESM context. Use `import` or `jiti.import` instead.");return debug(e,"[native]","[data]","[import]",t),nativeImportOrRequire(e,t,!0)}if(le.builtinModules.includes(t)||".pnp.js"===t)return nativeImportOrRequire(e,t,i.async);if(e.opts.tryNative&&!e.opts.transformOptions)try{if(!(t=jitiResolve(e,t,i))&&i.try)return;if(debug(e,"[try-native]",i.async&&e.nativeImport?"[import]":"[require]",t),i.async&&e.nativeImport)return e.nativeImport(t).then(i=>(!1===e.opts.moduleCache&&delete e.nativeRequire.cache[t],jitiInteropDefault(e,i)));{const i=e.nativeRequire(t);return!1===e.opts.moduleCache&&delete e.nativeRequire.cache[t],jitiInteropDefault(e,i)}}catch(i){debug(e,`[try-native] Using fallback for ${t} because of an error:`,i)}const r=jitiResolve(e,t,i);if(!r&&i.try)return;const n=extname(r);if(".json"===n){debug(e,"[json]",r);const t=e.nativeRequire(r);return t&&!("default"in t)&&Object.defineProperty(t,"default",{value:t,enumerable:!1}),t}if(n&&!e.opts.extensions.includes(n))return debug(e,"[native]","[unknown]",i.async?"[import]":"[require]",r),nativeImportOrRequire(e,r,i.async);if(e.isNativeRe.test(r))return debug(e,"[native]",i.async?"[import]":"[require]",r),nativeImportOrRequire(e,r,i.async);if(s[r])return jitiInteropDefault(e,s[r]?.exports);if(e.opts.moduleCache){const t=e.nativeRequire.cache[r];if(t?.loaded)return jitiInteropDefault(e,t.exports)}const a=(0,ue.readFileSync)(r,"utf8");return eval_evalModule(e,a,{id:t,filename:r,ext:n,cache:s,async:i.async})}function nativeImportOrRequire(e,t,i){return i&&e.nativeImport?e.nativeImport(function(e){return kt&&isAbsolute(e)?pathToFileURL(e):e}(t)).then(t=>jitiInteropDefault(e,t)):jitiInteropDefault(e,e.nativeRequire(t))}const zt="9";function getCache(e,t,i){if(!e.opts.fsCache||!t.filename)return i();const s=` /* v${zt}-${utils_hash(t.source,16)} */\n`;let r=`${basename(pathe_M_eThtNZ_dirname(t.filename))}-${function(e){const t=e.split(lt).pop();if(!t)return;const i=t.lastIndexOf(".");return i<=0?t:t.slice(0,i)}(t.filename)}`+(e.opts.sourceMaps?"+map":"")+(t.interopDefault?".i":"")+`.${utils_hash(t.filename)}`+(t.async?".mjs":".cjs");t.jsx&&t.filename.endsWith("x")&&(r+="x");const n=e.opts.fsCache,a=pathe_M_eThtNZ_join(n,r);if(!e.opts.rebuildFsCache&&(0,ue.existsSync)(a)){const i=(0,ue.readFileSync)(a,"utf8");if(i.endsWith(s))return debug(e,"[cache]","[hit]",t.filename,"~>",a),i}debug(e,"[cache]","[miss]",t.filename);const o=i();return o.includes("__JITI_ERROR__")||((0,ue.writeFileSync)(a,o+s,"utf8"),debug(e,"[cache]","[store]",t.filename,"~>",a)),o}function prepareCacheDir(t){if(!0===t.opts.fsCache&&(t.opts.fsCache=function(t){const i=t.filename&&pathe_M_eThtNZ_resolve(t.filename,"../node_modules");if(i&&(0,ue.existsSync)(i))return pathe_M_eThtNZ_join(i,".cache/jiti");let s=(0,e.tmpdir)();if(process.env.TMPDIR&&s===process.cwd()&&!process.env.JITI_RESPECT_TMPDIR_ENV){const t=process.env.TMPDIR;delete process.env.TMPDIR,s=(0,e.tmpdir)(),process.env.TMPDIR=t}return pathe_M_eThtNZ_join(s,"jiti")}(t)),t.opts.fsCache)try{if((0,ue.mkdirSync)(t.opts.fsCache,{recursive:!0}),!function(e){try{return(0,ue.accessSync)(e,ue.constants.W_OK),!0}catch{return!1}}(t.opts.fsCache))throw new Error("directory is not writable!")}catch(e){debug(t,"Error creating cache directory at ",t.opts.fsCache,e),t.opts.fsCache=!1}}function transform(e,t){let i=getCache(e,t,()=>{const i=e.opts.transform({...e.opts.transformOptions,babel:{...e.opts.sourceMaps?{sourceFileName:t.filename,sourceMaps:"inline"}:{},...e.opts.transformOptions?.babel},interopDefault:e.opts.interopDefault,...t});return i.error&&e.opts.debug&&debug(e,i.error),i.code});return i.startsWith("#!")&&(i="// "+i),i}function eval_evalModule(e,t,i={}){const s=i.id||(i.filename?basename(i.filename):`_jitiEval.${i.ext||(i.async?"mjs":"js")}`),r=i.filename||jitiResolve(e,s,{async:i.async}),n=i.ext||extname(r),a=i.cache||e.parentCache||{},o=/\.[cm]?tsx?$/.test(n),h=".mjs"===n||".js"===n&&"module"===function(e){for(;e&&"."!==e&&"/"!==e;){e=pathe_M_eThtNZ_join(e,"..");try{const t=(0,ue.readFileSync)(pathe_M_eThtNZ_join(e,"package.json"),"utf8");try{return JSON.parse(t)}catch{}break}catch{}}}(r)?.type,c=".cjs"===n,p=i.forceTranspile??(!c&&!(h&&i.async)&&(o||h||e.isTransformRe.test(r)||hasESMSyntax(t))),l=Gt.performance.now();if(p){t=transform(e,{filename:r,source:t,ts:o,async:i.async??!1,jsx:e.opts.jsx});const s=Math.round(1e3*(Gt.performance.now()-l))/1e3;debug(e,"[transpile]",i.async?"[esm]":"[cjs]",r,`(${s}ms)`)}else{if(debug(e,"[native]",i.async?"[import]":"[require]",r),i.async)return Promise.resolve(nativeImportOrRequire(e,r,i.async)).catch(s=>(debug(e,"Native import error:",s),debug(e,"[fallback]",r),eval_evalModule(e,t,{...i,forceTranspile:!0})));try{return nativeImportOrRequire(e,r,i.async)}catch(s){debug(e,"Native require error:",s),debug(e,"[fallback]",r),t=transform(e,{filename:r,source:t,ts:o,async:i.async??!1,jsx:e.opts.jsx})}}const u=new le.Module(r);u.filename=r,e.parentModule&&(u.parent=e.parentModule,Array.isArray(e.parentModule.children)&&!e.parentModule.children.includes(u)&&e.parentModule.children.push(u));const d=createJiti(r,e.opts,{parentModule:u,parentCache:a,nativeImport:e.nativeImport,onError:e.onError,createRequire:e.createRequire},!0);let f;u.require=d,u.path=pathe_M_eThtNZ_dirname(r),u.paths=le.Module._nodeModulePaths(u.path),a[r]=u,e.opts.moduleCache&&(e.nativeRequire.cache[r]=u);const m=function(e,t){return`(${t?.async?"async ":""}function (exports, require, module, __filename, __dirname, jitiImport, jitiESMResolve) { ${e}\n});`}(t,{async:i.async});try{f=Kt().runInThisContext(m,{filename:r,lineOffset:0,displayErrors:!1})}catch(t){"SyntaxError"===t.name&&i.async&&e.nativeImport?(debug(e,"[esm]","[import]","[fallback]",r),f=function(e,t){const i=`data:text/javascript;base64,${Buffer.from(`export default ${e}`).toString("base64")}`;return(...e)=>t(i).then(t=>t.default(...e))}(m,e.nativeImport)):(e.opts.moduleCache&&delete e.nativeRequire.cache[r],e.onError(t))}let g;try{g=f(u.exports,u.require,u,u.filename,pathe_M_eThtNZ_dirname(u.filename),d.import,d.esmResolve)}catch(t){e.opts.moduleCache&&delete e.nativeRequire.cache[r],e.onError(t)}function next(){if(u.exports&&u.exports.__JITI_ERROR__){const{filename:t,line:i,column:s,code:r,message:n}=u.exports.__JITI_ERROR__,a=new Error(`${r}: ${n} \n ${`${t}:${i}:${s}`}`);Error.captureStackTrace(a,jitiRequire),e.onError(a)}u.loaded=!0;return jitiInteropDefault(e,u.exports)}return i.async?Promise.resolve(g).then(next):next()}const Jt="win32"===(0,e.platform)();function createJiti(e,t={},i,s=!1){const r=s?t:function(e){const t={fsCache:_booleanEnv("JITI_FS_CACHE",_booleanEnv("JITI_CACHE",!0)),rebuildFsCache:_booleanEnv("JITI_REBUILD_FS_CACHE",!1),moduleCache:_booleanEnv("JITI_MODULE_CACHE",_booleanEnv("JITI_REQUIRE_CACHE",!0)),debug:_booleanEnv("JITI_DEBUG",!1),sourceMaps:_booleanEnv("JITI_SOURCE_MAPS",!1),interopDefault:_booleanEnv("JITI_INTEROP_DEFAULT",!0),extensions:_jsonEnv("JITI_EXTENSIONS",[".js",".mjs",".cjs",".ts",".tsx",".mts",".cts",".mtsx",".ctsx"]),alias:_jsonEnv("JITI_ALIAS",{}),nativeModules:_jsonEnv("JITI_NATIVE_MODULES",[]),transformModules:_jsonEnv("JITI_TRANSFORM_MODULES",[]),tryNative:_jsonEnv("JITI_TRY_NATIVE","Bun"in globalThis),jsx:_booleanEnv("JITI_JSX",!1)};t.jsx&&t.extensions.push(".jsx",".tsx");const i={};return void 0!==e.cache&&(i.fsCache=e.cache),void 0!==e.requireCache&&(i.moduleCache=e.requireCache),{...t,...i,...e}}(t),n=r.alias&&Object.keys(r.alias).length>0?normalizeAliases(r.alias||{}):void 0,a=["typescript","jiti",...r.nativeModules||[]],o=new RegExp(`node_modules/(${a.map(e=>escapeStringRegexp(e)).join("|")})/`),h=[...r.transformModules||[]],c=new RegExp(`node_modules/(${h.map(e=>escapeStringRegexp(e)).join("|")})/`);e||(e=process.cwd()),!s&&isDir(e)&&(e=pathe_M_eThtNZ_join(e,"_index.js"));const p=pathToFileURL(e),l=[...r.extensions].filter(e=>".js"!==e),u=i.createRequire(Jt?e.replace(/\//g,"\\"):e),d={filename:e,url:p,opts:r,alias:n,nativeModules:a,transformModules:h,isNativeRe:o,isTransformRe:c,additionalExts:l,nativeRequire:u,onError:i.onError,parentModule:i.parentModule,parentCache:i.parentCache,nativeImport:i.nativeImport,createRequire:i.createRequire};s||debug(d,"[init]",...[["version:",ut.rE],["module-cache:",r.moduleCache],["fs-cache:",r.fsCache],["rebuild-fs-cache:",r.rebuildFsCache],["interop-defaults:",r.interopDefault]].flat()),s||prepareCacheDir(d);const f=Object.assign(function(e){return jitiRequire(d,e,{async:!1})},{cache:r.moduleCache?u.cache:Object.create(null),extensions:u.extensions,main:u.main,options:r,resolve:Object.assign(function(e){return jitiResolve(d,e,{async:!1})},{paths:u.resolve.paths}),transform:e=>transform(d,e),evalModule:(e,t)=>eval_evalModule(d,e,t),async import(e,t){const i=await jitiRequire(d,e,{...t,async:!0});return t?.default?i?.default??i:i},esmResolve(e,t){"string"==typeof t&&(t={parentURL:t});const i=jitiResolve(d,e,{parentURL:p,...t,async:!0});return!i||"string"!=typeof i||i.startsWith("file://")?i:pathToFileURL(i)}});return f}})(),module.exports=i.default})();

/***/ }),

/***/ 7503:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  loadConfig: () => (/* reexport */ c12_8GPsgFQh_loadConfig)
});

// UNUSED EXPORTS: SUPPORTED_EXTENSIONS, createDefineConfig, loadDotenv, setupDotenv, watchConfig

// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__(3024);
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__(1455);
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__(3136);
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__(8161);
// EXTERNAL MODULE: ./node_modules/pathe/dist/shared/pathe.M-eThtNZ.mjs
var pathe_M_eThtNZ = __webpack_require__(2780);
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__(6760);
// EXTERNAL MODULE: external "node:assert"
var external_node_assert_ = __webpack_require__(4589);
// EXTERNAL MODULE: external "node:process"
var external_node_process_ = __webpack_require__(1708);
// EXTERNAL MODULE: external "node:v8"
var external_node_v8_ = __webpack_require__(8877);
// EXTERNAL MODULE: external "node:util"
var external_node_util_ = __webpack_require__(7975);
;// CONCATENATED MODULE: ./node_modules/exsolve/dist/index.mjs








const nodeBuiltins = [
  "_http_agent",
  "_http_client",
  "_http_common",
  "_http_incoming",
  "_http_outgoing",
  "_http_server",
  "_stream_duplex",
  "_stream_passthrough",
  "_stream_readable",
  "_stream_transform",
  "_stream_wrap",
  "_stream_writable",
  "_tls_common",
  "_tls_wrap",
  "assert",
  "assert/strict",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "dns/promises",
  "domain",
  "events",
  "fs",
  "fs/promises",
  "http",
  "http2",
  "https",
  "inspector",
  "inspector/promises",
  "module",
  "net",
  "os",
  "path",
  "path/posix",
  "path/win32",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "readline/promises",
  "repl",
  "stream",
  "stream/consumers",
  "stream/promises",
  "stream/web",
  "string_decoder",
  "sys",
  "timers",
  "timers/promises",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "util/types",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib"
];

const own$1 = {}.hasOwnProperty;
const classRegExp = /^([A-Z][a-z\d]*)+$/;
const kTypes = /* @__PURE__ */ new Set([
  "string",
  "function",
  "number",
  "object",
  // Accept 'Function' and 'Object' as alternative to the lower cased version.
  "Function",
  "Object",
  "boolean",
  "bigint",
  "symbol"
]);
const messages = /* @__PURE__ */ new Map();
const nodeInternalPrefix = "__node_internal_";
let userStackTraceLimit;
function formatList(array, type = "and") {
  return array.length < 3 ? array.join(` ${type} `) : `${array.slice(0, -1).join(", ")}, ${type} ${array.at(-1)}`;
}
function createError(sym, value, constructor) {
  messages.set(sym, value);
  return makeNodeErrorWithCode(constructor, sym);
}
function makeNodeErrorWithCode(Base, key) {
  return function NodeError(...parameters) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
    const error = new Base();
    if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = limit;
    const message = getMessage(key, parameters, error);
    Object.defineProperties(error, {
      // Note: no need to implement `kIsNodeError` symbol, would be hard,
      // probably.
      message: {
        value: message,
        enumerable: false,
        writable: true,
        configurable: true
      },
      toString: {
        /** @this {Error} */
        value() {
          return `${this.name} [${key}]: ${this.message}`;
        },
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    captureLargerStackTrace(error);
    error.code = key;
    return error;
  };
}
function isErrorStackTraceLimitWritable() {
  try {
    if (external_node_v8_.startupSnapshot.isBuildingSnapshot()) {
      return false;
    }
  } catch {
  }
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) {
    return Object.isExtensible(Error);
  }
  return own$1.call(desc, "writable") && desc.writable !== void 0 ? desc.writable : desc.set !== void 0;
}
function hideStackFrames(wrappedFunction) {
  const hidden = nodeInternalPrefix + wrappedFunction.name;
  Object.defineProperty(wrappedFunction, "name", { value: hidden });
  return wrappedFunction;
}
const captureLargerStackTrace = hideStackFrames(function(error) {
  const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
  if (stackTraceLimitIsWritable) {
    userStackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = Number.POSITIVE_INFINITY;
  }
  Error.captureStackTrace(error);
  if (stackTraceLimitIsWritable) Error.stackTraceLimit = userStackTraceLimit;
  return error;
});
function getMessage(key, parameters, self) {
  const message = messages.get(key);
  external_node_assert_(message !== void 0, "expected `message` to be found");
  if (typeof message === "function") {
    external_node_assert_(
      message.length <= parameters.length,
      // Default options do not count.
      `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${message.length}).`
    );
    return Reflect.apply(message, self, parameters);
  }
  const regex = /%[dfijoOs]/g;
  let expectedLength = 0;
  while (regex.exec(message) !== null) expectedLength++;
  external_node_assert_(
    expectedLength === parameters.length,
    `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${expectedLength}).`
  );
  if (parameters.length === 0) return message;
  parameters.unshift(message);
  return Reflect.apply(external_node_util_.format, null, parameters);
}
function determineSpecificType(value) {
  if (value === null || value === void 0) {
    return String(value);
  }
  if (typeof value === "function" && value.name) {
    return `function ${value.name}`;
  }
  if (typeof value === "object") {
    if (value.constructor && value.constructor.name) {
      return `an instance of ${value.constructor.name}`;
    }
    return `${(0,external_node_util_.inspect)(value, { depth: -1 })}`;
  }
  let inspected = (0,external_node_util_.inspect)(value, { colors: false });
  if (inspected.length > 28) {
    inspected = `${inspected.slice(0, 25)}...`;
  }
  return `type ${typeof value} (${inspected})`;
}
createError(
  "ERR_INVALID_ARG_TYPE",
  (name, expected, actual) => {
    external_node_assert_(typeof name === "string", "'name' must be a string");
    if (!Array.isArray(expected)) {
      expected = [expected];
    }
    let message = "The ";
    if (name.endsWith(" argument")) {
      message += `${name} `;
    } else {
      const type = name.includes(".") ? "property" : "argument";
      message += `"${name}" ${type} `;
    }
    message += "must be ";
    const types = [];
    const instances = [];
    const other = [];
    for (const value of expected) {
      external_node_assert_(
        typeof value === "string",
        "All expected entries have to be of type string"
      );
      if (kTypes.has(value)) {
        types.push(value.toLowerCase());
      } else if (classRegExp.exec(value) === null) {
        external_node_assert_(
          value !== "object",
          'The value "object" should be written as "Object"'
        );
        other.push(value);
      } else {
        instances.push(value);
      }
    }
    if (instances.length > 0) {
      const pos = types.indexOf("object");
      if (pos !== -1) {
        types.slice(pos, 1);
        instances.push("Object");
      }
    }
    if (types.length > 0) {
      message += `${types.length > 1 ? "one of type" : "of type"} ${formatList(
        types,
        "or"
      )}`;
      if (instances.length > 0 || other.length > 0) message += " or ";
    }
    if (instances.length > 0) {
      message += `an instance of ${formatList(instances, "or")}`;
      if (other.length > 0) message += " or ";
    }
    if (other.length > 0) {
      if (other.length > 1) {
        message += `one of ${formatList(other, "or")}`;
      } else {
        if (other[0]?.toLowerCase() !== other[0]) message += "an ";
        message += `${other[0]}`;
      }
    }
    message += `. Received ${determineSpecificType(actual)}`;
    return message;
  },
  TypeError
);
const ERR_INVALID_MODULE_SPECIFIER = createError(
  "ERR_INVALID_MODULE_SPECIFIER",
  /**
   * @param {string} request
   * @param {string} reason
   * @param {string} [base]
   */
  (request, reason, base) => {
    return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
  },
  TypeError
);
const ERR_INVALID_PACKAGE_CONFIG = createError(
  "ERR_INVALID_PACKAGE_CONFIG",
  (path, base, message) => {
    return `Invalid package config ${path}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
  },
  Error
);
const ERR_INVALID_PACKAGE_TARGET = createError(
  "ERR_INVALID_PACKAGE_TARGET",
  (packagePath, key, target, isImport = false, base) => {
    const relatedError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
    if (key === ".") {
      external_node_assert_(isImport === false);
      return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
    }
    return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(
      target
    )} defined for '${key}' in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
  },
  Error
);
const ERR_MODULE_NOT_FOUND = createError(
  "ERR_MODULE_NOT_FOUND",
  (path, base, exactUrl = false) => {
    return `Cannot find ${exactUrl ? "module" : "package"} '${path}' imported from ${base}`;
  },
  Error
);
createError(
  "ERR_NETWORK_IMPORT_DISALLOWED",
  "import of '%s' by %s is not supported: %s",
  Error
);
const ERR_PACKAGE_IMPORT_NOT_DEFINED = createError(
  "ERR_PACKAGE_IMPORT_NOT_DEFINED",
  (specifier, packagePath, base) => {
    return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath || ""}package.json` : ""} imported from ${base}`;
  },
  TypeError
);
const ERR_PACKAGE_PATH_NOT_EXPORTED = createError(
  "ERR_PACKAGE_PATH_NOT_EXPORTED",
  /**
   * @param {string} packagePath
   * @param {string} subpath
   * @param {string} [base]
   */
  (packagePath, subpath, base) => {
    if (subpath === ".")
      return `No "exports" main defined in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
    return `Package subpath '${subpath}' is not defined by "exports" in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
  },
  Error
);
const ERR_UNSUPPORTED_DIR_IMPORT = createError(
  "ERR_UNSUPPORTED_DIR_IMPORT",
  "Directory import '%s' is not supported resolving ES modules imported from %s",
  Error
);
const ERR_UNSUPPORTED_RESOLVE_REQUEST = createError(
  "ERR_UNSUPPORTED_RESOLVE_REQUEST",
  'Failed to resolve module specifier "%s" from "%s": Invalid relative URL or base scheme is not hierarchical.',
  TypeError
);
const ERR_UNKNOWN_FILE_EXTENSION = createError(
  "ERR_UNKNOWN_FILE_EXTENSION",
  (extension, path) => {
    return `Unknown file extension "${extension}" for ${path}`;
  },
  TypeError
);
createError(
  "ERR_INVALID_ARG_VALUE",
  (name, value, reason = "is invalid") => {
    let inspected = (0,external_node_util_.inspect)(value);
    if (inspected.length > 128) {
      inspected = `${inspected.slice(0, 128)}...`;
    }
    const type = name.includes(".") ? "property" : "argument";
    return `The ${type} '${name}' ${reason}. Received ${inspected}`;
  },
  TypeError
  // Note: extra classes have been shaken out.
  // , RangeError
);

const hasOwnProperty$1 = {}.hasOwnProperty;
const cache = /* @__PURE__ */ new Map();
function read(jsonPath, { base, specifier }) {
  const existing = cache.get(jsonPath);
  if (existing) {
    return existing;
  }
  let string;
  try {
    string = external_node_fs_.readFileSync(external_node_path_.toNamespacedPath(jsonPath), "utf8");
  } catch (error) {
    const exception = error;
    if (exception.code !== "ENOENT") {
      throw exception;
    }
  }
  const result = {
    exists: false,
    pjsonPath: jsonPath,
    main: void 0,
    name: void 0,
    type: "none",
    // Ignore unknown types for forwards compatibility
    exports: void 0,
    imports: void 0
  };
  if (string !== void 0) {
    let parsed;
    try {
      parsed = JSON.parse(string);
    } catch (error_) {
      const error = new ERR_INVALID_PACKAGE_CONFIG(
        jsonPath,
        (base ? `"${specifier}" from ` : "") + (0,external_node_url_.fileURLToPath)(base || specifier),
        error_.message
      );
      error.cause = error_;
      throw error;
    }
    result.exists = true;
    if (hasOwnProperty$1.call(parsed, "name") && typeof parsed.name === "string") {
      result.name = parsed.name;
    }
    if (hasOwnProperty$1.call(parsed, "main") && typeof parsed.main === "string") {
      result.main = parsed.main;
    }
    if (hasOwnProperty$1.call(parsed, "exports")) {
      result.exports = parsed.exports;
    }
    if (hasOwnProperty$1.call(parsed, "imports")) {
      result.imports = parsed.imports;
    }
    if (hasOwnProperty$1.call(parsed, "type") && (parsed.type === "commonjs" || parsed.type === "module")) {
      result.type = parsed.type;
    }
  }
  cache.set(jsonPath, result);
  return result;
}
function getPackageScopeConfig(resolved) {
  let packageJSONUrl = new URL("package.json", resolved);
  while (true) {
    const packageJSONPath2 = packageJSONUrl.pathname;
    if (packageJSONPath2.endsWith("node_modules/package.json")) {
      break;
    }
    const packageConfig = read((0,external_node_url_.fileURLToPath)(packageJSONUrl), {
      specifier: resolved
    });
    if (packageConfig.exists) {
      return packageConfig;
    }
    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL("../package.json", packageJSONUrl);
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) {
      break;
    }
  }
  const packageJSONPath = (0,external_node_url_.fileURLToPath)(packageJSONUrl);
  return {
    pjsonPath: packageJSONPath,
    exists: false,
    type: "none"
  };
}

const dist_hasOwnProperty = {}.hasOwnProperty;
const extensionFormatMap = {
  __proto__: null,
  ".json": "json",
  ".cjs": "commonjs",
  ".cts": "commonjs",
  ".js": "module",
  ".ts": "module",
  ".mts": "module",
  ".mjs": "module"
};
const protocolHandlers = {
  __proto__: null,
  "data:": getDataProtocolModuleFormat,
  "file:": getFileProtocolModuleFormat,
  "node:": () => "builtin"
};
function mimeToFormat(mime) {
  if (mime && /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(mime))
    return "module";
  if (mime === "application/json") return "json";
  return null;
}
function getDataProtocolModuleFormat(parsed) {
  const { 1: mime } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(
    parsed.pathname
  ) || [null, null, null];
  return mimeToFormat(mime);
}
function extname(url) {
  const pathname = url.pathname;
  let index = pathname.length;
  while (index--) {
    const code = pathname.codePointAt(index);
    if (code === 47) {
      return "";
    }
    if (code === 46) {
      return pathname.codePointAt(index - 1) === 47 ? "" : pathname.slice(index);
    }
  }
  return "";
}
function getFileProtocolModuleFormat(url, _context, ignoreErrors) {
  const ext = extname(url);
  if (ext === ".js") {
    const { type: packageType } = getPackageScopeConfig(url);
    if (packageType !== "none") {
      return packageType;
    }
    return "commonjs";
  }
  if (ext === "") {
    const { type: packageType } = getPackageScopeConfig(url);
    if (packageType === "none" || packageType === "commonjs") {
      return "commonjs";
    }
    return "module";
  }
  const format = extensionFormatMap[ext];
  if (format) return format;
  if (ignoreErrors) {
    return void 0;
  }
  const filepath = (0,external_node_url_.fileURLToPath)(url);
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
}
function defaultGetFormatWithoutErrors(url, context) {
  const protocol = url.protocol;
  if (!dist_hasOwnProperty.call(protocolHandlers, protocol)) {
    return null;
  }
  return protocolHandlers[protocol](url, context, true) || null;
}

const RegExpPrototypeSymbolReplace = RegExp.prototype[Symbol.replace];
const own = {}.hasOwnProperty;
const invalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
const deprecatedInvalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
const invalidPackageNameRegEx = /^\.|%|\\/;
const patternRegEx = /\*/g;
const encodedSeparatorRegEx = /%2f|%5c/i;
const emittedPackageWarnings = /* @__PURE__ */ new Set();
const doubleSlashRegEx = /[/\\]{2}/;
function emitInvalidSegmentDeprecation(target, request, match, packageJsonUrl, internal, base, isTarget) {
  if (external_node_process_.noDeprecation) {
    return;
  }
  const pjsonPath = (0,external_node_url_.fileURLToPath)(packageJsonUrl);
  const double = doubleSlashRegEx.exec(isTarget ? target : request) !== null;
  external_node_process_.emitWarning(
    `Use of deprecated ${double ? "double slash" : "leading or trailing slash matching"} resolving "${target}" for module request "${request}" ${request === match ? "" : `matched to "${match}" `}in the "${internal ? "imports" : "exports"}" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${(0,external_node_url_.fileURLToPath)(base)}` : ""}.`,
    "DeprecationWarning",
    "DEP0166"
  );
}
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
  if (external_node_process_.noDeprecation) {
    return;
  }
  const format = defaultGetFormatWithoutErrors(url, { parentURL: base.href });
  if (format !== "module") return;
  const urlPath = (0,external_node_url_.fileURLToPath)(url.href);
  const packagePath = (0,external_node_url_.fileURLToPath)(new external_node_url_.URL(".", packageJsonUrl));
  const basePath = (0,external_node_url_.fileURLToPath)(base);
  if (!main) {
    external_node_process_.emitWarning(
      `No "main" or "exports" field defined in the package.json for ${packagePath} resolving the main entry point "${urlPath.slice(
        packagePath.length
      )}", imported from ${basePath}.
Default "index" lookups for the main are deprecated for ES modules.`,
      "DeprecationWarning",
      "DEP0151"
    );
  } else if (external_node_path_.resolve(packagePath, main) !== urlPath) {
    external_node_process_.emitWarning(
      `Package ${packagePath} has a "main" field set to "${main}", excluding the full filename and extension to the resolved file at "${urlPath.slice(
        packagePath.length
      )}", imported from ${basePath}.
 Automatic extension resolution of the "main" field is deprecated for ES modules.`,
      "DeprecationWarning",
      "DEP0151"
    );
  }
}
function tryStatSync(path2) {
  try {
    return (0,external_node_fs_.statSync)(path2);
  } catch {
  }
}
function fileExists(url) {
  const stats = (0,external_node_fs_.statSync)(url, { throwIfNoEntry: false });
  const isFile = stats ? stats.isFile() : void 0;
  return isFile === null || isFile === void 0 ? false : isFile;
}
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
  let guess;
  if (packageConfig.main !== void 0) {
    guess = new external_node_url_.URL(packageConfig.main, packageJsonUrl);
    if (fileExists(guess)) return guess;
    const tries2 = [
      `./${packageConfig.main}.js`,
      `./${packageConfig.main}.json`,
      `./${packageConfig.main}.node`,
      `./${packageConfig.main}/index.js`,
      `./${packageConfig.main}/index.json`,
      `./${packageConfig.main}/index.node`
    ];
    let i2 = -1;
    while (++i2 < tries2.length) {
      guess = new external_node_url_.URL(tries2[i2], packageJsonUrl);
      if (fileExists(guess)) break;
      guess = void 0;
    }
    if (guess) {
      emitLegacyIndexDeprecation(
        guess,
        packageJsonUrl,
        base,
        packageConfig.main
      );
      return guess;
    }
  }
  const tries = ["./index.js", "./index.json", "./index.node"];
  let i = -1;
  while (++i < tries.length) {
    guess = new external_node_url_.URL(tries[i], packageJsonUrl);
    if (fileExists(guess)) break;
    guess = void 0;
  }
  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
    return guess;
  }
  throw new ERR_MODULE_NOT_FOUND(
    (0,external_node_url_.fileURLToPath)(new external_node_url_.URL(".", packageJsonUrl)),
    (0,external_node_url_.fileURLToPath)(base)
  );
}
function finalizeResolution(resolved, base, preserveSymlinks) {
  if (encodedSeparatorRegEx.exec(resolved.pathname) !== null) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved.pathname,
      String.raw`must not include encoded "/" or "\" characters`,
      (0,external_node_url_.fileURLToPath)(base)
    );
  }
  let filePath;
  try {
    filePath = (0,external_node_url_.fileURLToPath)(resolved);
  } catch (error) {
    Object.defineProperty(error, "input", { value: String(resolved) });
    Object.defineProperty(error, "module", { value: String(base) });
    throw error;
  }
  const stats = tryStatSync(
    filePath.endsWith("/") ? filePath.slice(-1) : filePath
  );
  if (stats && stats.isDirectory()) {
    const error = new ERR_UNSUPPORTED_DIR_IMPORT(filePath, (0,external_node_url_.fileURLToPath)(base));
    error.url = String(resolved);
    throw error;
  }
  if (!stats || !stats.isFile()) {
    const error = new ERR_MODULE_NOT_FOUND(
      filePath || resolved.pathname,
      base && (0,external_node_url_.fileURLToPath)(base),
      true
    );
    error.url = String(resolved);
    throw error;
  }
  {
    const real = (0,external_node_fs_.realpathSync)(filePath);
    const { search, hash } = resolved;
    resolved = (0,external_node_url_.pathToFileURL)(real + (filePath.endsWith(external_node_path_.sep) ? "/" : ""));
    resolved.search = search;
    resolved.hash = hash;
  }
  return resolved;
}
function importNotDefined(specifier, packageJsonUrl, base) {
  return new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier,
    packageJsonUrl && (0,external_node_url_.fileURLToPath)(new external_node_url_.URL(".", packageJsonUrl)),
    (0,external_node_url_.fileURLToPath)(base)
  );
}
function exportsNotFound(subpath, packageJsonUrl, base) {
  return new ERR_PACKAGE_PATH_NOT_EXPORTED(
    (0,external_node_url_.fileURLToPath)(new external_node_url_.URL(".", packageJsonUrl)),
    subpath,
    base && (0,external_node_url_.fileURLToPath)(base)
  );
}
function throwInvalidSubpath(request, match, packageJsonUrl, internal, base) {
  const reason = `request is not a valid match in pattern "${match}" for the "${internal ? "imports" : "exports"}" resolution of ${(0,external_node_url_.fileURLToPath)(packageJsonUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(
    request,
    reason,
    base && (0,external_node_url_.fileURLToPath)(base)
  );
}
function invalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
  target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
  return new ERR_INVALID_PACKAGE_TARGET(
    (0,external_node_url_.fileURLToPath)(new external_node_url_.URL(".", packageJsonUrl)),
    subpath,
    target,
    internal,
    base && (0,external_node_url_.fileURLToPath)(base)
  );
}
function resolvePackageTargetString(target, subpath, match, packageJsonUrl, base, pattern, internal, isPathMap, conditions) {
  if (subpath !== "" && !pattern && target.at(-1) !== "/")
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (!target.startsWith("./")) {
    if (internal && !target.startsWith("../") && !target.startsWith("/")) {
      let isURL = false;
      try {
        new external_node_url_.URL(target);
        isURL = true;
      } catch {
      }
      if (!isURL) {
        const exportTarget = pattern ? RegExpPrototypeSymbolReplace.call(
          patternRegEx,
          target,
          () => subpath
        ) : target + subpath;
        return packageResolve(exportTarget, packageJsonUrl, conditions);
      }
    }
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (invalidSegmentRegEx.exec(target.slice(2)) !== null) {
    if (deprecatedInvalidSegmentRegEx.exec(target.slice(2)) === null) {
      if (!isPathMap) {
        const request = pattern ? match.replace("*", () => subpath) : match + subpath;
        const resolvedTarget = pattern ? RegExpPrototypeSymbolReplace.call(
          patternRegEx,
          target,
          () => subpath
        ) : target;
        emitInvalidSegmentDeprecation(
          resolvedTarget,
          request,
          match,
          packageJsonUrl,
          internal,
          base,
          true
        );
      }
    } else {
      throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
    }
  }
  const resolved = new external_node_url_.URL(target, packageJsonUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new external_node_url_.URL(".", packageJsonUrl).pathname;
  if (!resolvedPath.startsWith(packagePath))
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (subpath === "") return resolved;
  if (invalidSegmentRegEx.exec(subpath) !== null) {
    const request = pattern ? match.replace("*", () => subpath) : match + subpath;
    if (deprecatedInvalidSegmentRegEx.exec(subpath) === null) {
      if (!isPathMap) {
        const resolvedTarget = pattern ? RegExpPrototypeSymbolReplace.call(
          patternRegEx,
          target,
          () => subpath
        ) : target;
        emitInvalidSegmentDeprecation(
          resolvedTarget,
          request,
          match,
          packageJsonUrl,
          internal,
          base,
          false
        );
      }
    } else {
      throwInvalidSubpath(request, match, packageJsonUrl, internal, base);
    }
  }
  if (pattern) {
    return new external_node_url_.URL(
      RegExpPrototypeSymbolReplace.call(
        patternRegEx,
        resolved.href,
        () => subpath
      )
    );
  }
  return new external_node_url_.URL(subpath, resolved);
}
function isArrayIndex(key) {
  const keyNumber = Number(key);
  if (`${keyNumber}` !== key) return false;
  return keyNumber >= 0 && keyNumber < 4294967295;
}
function resolvePackageTarget(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions) {
  if (typeof target === "string") {
    return resolvePackageTargetString(
      target,
      subpath,
      packageSubpath,
      packageJsonUrl,
      base,
      pattern,
      internal,
      isPathMap,
      conditions
    );
  }
  if (Array.isArray(target)) {
    const targetList = target;
    if (targetList.length === 0) return null;
    let lastException;
    let i = -1;
    while (++i < targetList.length) {
      const targetItem = targetList[i];
      let resolveResult;
      try {
        resolveResult = resolvePackageTarget(
          packageJsonUrl,
          targetItem,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          isPathMap,
          conditions
        );
      } catch (error) {
        const exception = error;
        lastException = exception;
        if (exception.code === "ERR_INVALID_PACKAGE_TARGET") continue;
        throw error;
      }
      if (resolveResult === void 0) continue;
      if (resolveResult === null) {
        lastException = null;
        continue;
      }
      return resolveResult;
    }
    if (lastException === void 0 || lastException === null) {
      return null;
    }
    throw lastException;
  }
  if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    let i = -1;
    while (++i < keys.length) {
      const key = keys[i];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          (0,external_node_url_.fileURLToPath)(packageJsonUrl),
          (0,external_node_url_.fileURLToPath)(base),
          '"exports" cannot contain numeric property keys.'
        );
      }
    }
    i = -1;
    while (++i < keys.length) {
      const key = keys[i];
      if (key === "default" || conditions && conditions.has(key)) {
        const conditionalTarget = target[key];
        const resolveResult = resolvePackageTarget(
          packageJsonUrl,
          conditionalTarget,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          isPathMap,
          conditions
        );
        if (resolveResult === void 0) continue;
        return resolveResult;
      }
    }
    return null;
  }
  if (target === null) {
    return null;
  }
  throw invalidPackageTarget(
    packageSubpath,
    target,
    packageJsonUrl,
    internal,
    base
  );
}
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
  if (typeof exports === "string" || Array.isArray(exports)) return true;
  if (typeof exports !== "object" || exports === null) return false;
  const keys = Object.getOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i = 0;
  let keyIndex = -1;
  while (++keyIndex < keys.length) {
    const key = keys[keyIndex];
    const currentIsConditionalSugar = key === "" || key[0] !== ".";
    if (i++ === 0) {
      isConditionalSugar = currentIsConditionalSugar;
    } else if (isConditionalSugar !== currentIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        (0,external_node_url_.fileURLToPath)(packageJsonUrl),
        (0,external_node_url_.fileURLToPath)(base),
        `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`
      );
    }
  }
  return isConditionalSugar;
}
function emitTrailingSlashPatternDeprecation(match, pjsonUrl, base) {
  if (external_node_process_.noDeprecation) {
    return;
  }
  const pjsonPath = (0,external_node_url_.fileURLToPath)(pjsonUrl);
  if (emittedPackageWarnings.has(pjsonPath + "|" + match)) return;
  emittedPackageWarnings.add(pjsonPath + "|" + match);
  external_node_process_.emitWarning(
    `Use of deprecated trailing slash pattern mapping "${match}" in the "exports" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${(0,external_node_url_.fileURLToPath)(base)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`,
    "DeprecationWarning",
    "DEP0155"
  );
}
function packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJsonUrl, base)) {
    exports = { ".": exports };
  }
  if (own.call(exports, packageSubpath) && !packageSubpath.includes("*") && !packageSubpath.endsWith("/")) {
    const target = exports[packageSubpath];
    const resolveResult = resolvePackageTarget(
      packageJsonUrl,
      target,
      "",
      packageSubpath,
      base,
      false,
      false,
      false,
      conditions
    );
    if (resolveResult === null || resolveResult === void 0) {
      throw exportsNotFound(packageSubpath, packageJsonUrl, base);
    }
    return resolveResult;
  }
  let bestMatch = "";
  let bestMatchSubpath = "";
  const keys = Object.getOwnPropertyNames(exports);
  let i = -1;
  while (++i < keys.length) {
    const key = keys[i];
    const patternIndex = key.indexOf("*");
    if (patternIndex !== -1 && packageSubpath.startsWith(key.slice(0, patternIndex))) {
      if (packageSubpath.endsWith("/")) {
        emitTrailingSlashPatternDeprecation(
          packageSubpath,
          packageJsonUrl,
          base
        );
      }
      const patternTrailer = key.slice(patternIndex + 1);
      if (packageSubpath.length >= key.length && packageSubpath.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
        bestMatch = key;
        bestMatchSubpath = packageSubpath.slice(
          patternIndex,
          packageSubpath.length - patternTrailer.length
        );
      }
    }
  }
  if (bestMatch) {
    const target = exports[bestMatch];
    const resolveResult = resolvePackageTarget(
      packageJsonUrl,
      target,
      bestMatchSubpath,
      bestMatch,
      base,
      true,
      false,
      packageSubpath.endsWith("/"),
      conditions
    );
    if (resolveResult === null || resolveResult === void 0) {
      throw exportsNotFound(packageSubpath, packageJsonUrl, base);
    }
    return resolveResult;
  }
  throw exportsNotFound(packageSubpath, packageJsonUrl, base);
}
function patternKeyCompare(a, b) {
  const aPatternIndex = a.indexOf("*");
  const bPatternIndex = b.indexOf("*");
  const baseLengthA = aPatternIndex === -1 ? a.length : aPatternIndex + 1;
  const baseLengthB = bPatternIndex === -1 ? b.length : bPatternIndex + 1;
  if (baseLengthA > baseLengthB) return -1;
  if (baseLengthB > baseLengthA) return 1;
  if (aPatternIndex === -1) return 1;
  if (bPatternIndex === -1) return -1;
  if (a.length > b.length) return -1;
  if (b.length > a.length) return 1;
  return 0;
}
function packageImportsResolve(name, base, conditions) {
  if (name === "#" || name.startsWith("#/") || name.endsWith("/")) {
    const reason = "is not a valid internal imports specifier name";
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, (0,external_node_url_.fileURLToPath)(base));
  }
  let packageJsonUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJsonUrl = (0,external_node_url_.pathToFileURL)(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (own.call(imports, name) && !name.includes("*")) {
        const resolveResult = resolvePackageTarget(
          packageJsonUrl,
          imports[name],
          "",
          name,
          base,
          false,
          true,
          false,
          conditions
        );
        if (resolveResult !== null && resolveResult !== void 0) {
          return resolveResult;
        }
      } else {
        let bestMatch = "";
        let bestMatchSubpath = "";
        const keys = Object.getOwnPropertyNames(imports);
        let i = -1;
        while (++i < keys.length) {
          const key = keys[i];
          const patternIndex = key.indexOf("*");
          if (patternIndex !== -1 && name.startsWith(key.slice(0, -1))) {
            const patternTrailer = key.slice(patternIndex + 1);
            if (name.length >= key.length && name.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
              bestMatch = key;
              bestMatchSubpath = name.slice(
                patternIndex,
                name.length - patternTrailer.length
              );
            }
          }
        }
        if (bestMatch) {
          const target = imports[bestMatch];
          const resolveResult = resolvePackageTarget(
            packageJsonUrl,
            target,
            bestMatchSubpath,
            bestMatch,
            base,
            true,
            true,
            false,
            conditions
          );
          if (resolveResult !== null && resolveResult !== void 0) {
            return resolveResult;
          }
        }
      }
    }
  }
  throw importNotDefined(name, packageJsonUrl, base);
}
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf("/");
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === "@") {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = specifier.indexOf("/", separatorIndex + 1);
    }
  }
  const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
  if (invalidPackageNameRegEx.exec(packageName) !== null) {
    validPackageName = false;
  }
  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier,
      "is not a valid package name",
      (0,external_node_url_.fileURLToPath)(base)
    );
  }
  const packageSubpath = "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex));
  return { packageName, packageSubpath, isScoped };
}
function packageResolve(specifier, base, conditions) {
  if (nodeBuiltins.includes(specifier)) {
    return new external_node_url_.URL("node:" + specifier);
  }
  const { packageName, packageSubpath, isScoped } = parsePackageName(
    specifier,
    base
  );
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists && packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) {
    const packageJsonUrl2 = (0,external_node_url_.pathToFileURL)(packageConfig.pjsonPath);
    return packageExportsResolve(
      packageJsonUrl2,
      packageSubpath,
      packageConfig,
      base,
      conditions
    );
  }
  let packageJsonUrl = new external_node_url_.URL(
    "./node_modules/" + packageName + "/package.json",
    base
  );
  let packageJsonPath = (0,external_node_url_.fileURLToPath)(packageJsonUrl);
  let lastPath;
  do {
    const stat = tryStatSync(packageJsonPath.slice(0, -13));
    if (!stat || !stat.isDirectory()) {
      lastPath = packageJsonPath;
      packageJsonUrl = new external_node_url_.URL(
        (isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json",
        packageJsonUrl
      );
      packageJsonPath = (0,external_node_url_.fileURLToPath)(packageJsonUrl);
      continue;
    }
    const packageConfig2 = read(packageJsonPath, { base, specifier });
    if (packageConfig2.exports !== void 0 && packageConfig2.exports !== null) {
      return packageExportsResolve(
        packageJsonUrl,
        packageSubpath,
        packageConfig2,
        base,
        conditions
      );
    }
    if (packageSubpath === ".") {
      return legacyMainResolve(packageJsonUrl, packageConfig2, base);
    }
    return new external_node_url_.URL(packageSubpath, packageJsonUrl);
  } while (packageJsonPath.length !== lastPath.length);
  throw new ERR_MODULE_NOT_FOUND(packageName, (0,external_node_url_.fileURLToPath)(base), false);
}
function isRelativeSpecifier(specifier) {
  if (specifier[0] === ".") {
    if (specifier.length === 1 || specifier[1] === "/") return true;
    if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) {
      return true;
    }
  }
  return false;
}
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === "") return false;
  if (specifier[0] === "/") return true;
  return isRelativeSpecifier(specifier);
}
function moduleResolve(specifier, base, conditions, preserveSymlinks) {
  const protocol = base.protocol;
  const isData = protocol === "data:";
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    try {
      resolved = new external_node_url_.URL(specifier, base);
    } catch (error_) {
      const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
      error.cause = error_;
      throw error;
    }
  } else if (protocol === "file:" && specifier[0] === "#") {
    resolved = packageImportsResolve(specifier, base, conditions);
  } else {
    try {
      resolved = new external_node_url_.URL(specifier);
    } catch (error_) {
      if (isData && !nodeBuiltins.includes(specifier)) {
        const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
        error.cause = error_;
        throw error;
      }
      resolved = packageResolve(specifier, base, conditions);
    }
  }
  external_node_assert_(resolved !== void 0, "expected to be defined");
  if (resolved.protocol !== "file:") {
    return resolved;
  }
  return finalizeResolution(resolved, base);
}

const DEFAULT_CONDITIONS_SET = /* @__PURE__ */ new Set(["node", "import"]);
const isWindows = /* @__PURE__ */ (() => process.platform === "win32")();
const NOT_FOUND_ERRORS = /* @__PURE__ */ new Set([
  "ERR_MODULE_NOT_FOUND",
  "ERR_UNSUPPORTED_DIR_IMPORT",
  "MODULE_NOT_FOUND",
  "ERR_PACKAGE_PATH_NOT_EXPORTED",
  "ERR_PACKAGE_IMPORT_NOT_DEFINED"
]);
const globalCache = /* @__PURE__ */ (() => (
  // eslint-disable-next-line unicorn/no-unreadable-iife
  globalThis["__EXSOLVE_CACHE__"] ||= /* @__PURE__ */ new Map()
))();
function resolveModuleURL(input, options) {
  const parsedInput = _parseInput(input);
  if ("external" in parsedInput) {
    return parsedInput.external;
  }
  const specifier = parsedInput.specifier;
  let url = parsedInput.url;
  let absolutePath = parsedInput.absolutePath;
  let cacheKey;
  let cacheObj;
  if (options?.cache !== false) {
    cacheKey = _cacheKey(absolutePath || specifier, options);
    cacheObj = options?.cache && typeof options?.cache === "object" ? options.cache : globalCache;
  }
  if (cacheObj) {
    const cached = cacheObj.get(cacheKey);
    if (typeof cached === "string") {
      return cached;
    }
    if (cached instanceof Error) {
      if (options?.try) {
        return void 0;
      }
      throw cached;
    }
  }
  if (absolutePath) {
    try {
      const stat = (0,external_node_fs_.lstatSync)(absolutePath);
      if (stat.isSymbolicLink()) {
        absolutePath = (0,external_node_fs_.realpathSync)(absolutePath);
        url = (0,external_node_url_.pathToFileURL)(absolutePath);
      }
      if (stat.isFile()) {
        if (cacheObj) {
          cacheObj.set(cacheKey, url.href);
        }
        return url.href;
      }
    } catch (error) {
      if (error?.code !== "ENOENT") {
        if (cacheObj) {
          cacheObj.set(cacheKey, error);
        }
        throw error;
      }
    }
  }
  const conditionsSet = options?.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET;
  const target = specifier || url.href;
  const bases = _normalizeBases(options?.from);
  const suffixes = options?.suffixes || [""];
  const extensions = options?.extensions ? ["", ...options.extensions] : [""];
  let resolved;
  for (const base of bases) {
    for (const suffix of suffixes) {
      let name = _join(target, suffix);
      if (name === ".") {
        name += "/.";
      }
      for (const extension of extensions) {
        resolved = _tryModuleResolve(name + extension, base, conditionsSet);
        if (resolved) {
          break;
        }
      }
      if (resolved) {
        break;
      }
    }
    if (resolved) {
      break;
    }
  }
  if (!resolved) {
    const error = new Error(
      `Cannot resolve module "${input}" (from: ${bases.map((u) => _fmtPath(u)).join(", ")})`
    );
    error.code = "ERR_MODULE_NOT_FOUND";
    if (cacheObj) {
      cacheObj.set(cacheKey, error);
    }
    if (options?.try) {
      return void 0;
    }
    throw error;
  }
  if (cacheObj) {
    cacheObj.set(cacheKey, resolved.href);
  }
  return resolved.href;
}
function resolveModulePath(id, options) {
  const resolved = resolveModuleURL(id, options);
  if (!resolved) {
    return void 0;
  }
  if (!resolved.startsWith("file://") && options?.try) {
    return void 0;
  }
  const absolutePath = (0,external_node_url_.fileURLToPath)(resolved);
  return isWindows ? _normalizeWinPath(absolutePath) : absolutePath;
}
function createResolver(defaults) {
  if (defaults?.from) {
    defaults = {
      ...defaults,
      from: _normalizeBases(defaults?.from)
    };
  }
  return {
    resolveModuleURL: (id, opts) => resolveModuleURL(id, { ...defaults, ...opts }),
    resolveModulePath: (id, opts) => resolveModulePath(id, { ...defaults, ...opts }),
    clearResolveCache: () => {
      if (defaults?.cache !== false) {
        if (defaults?.cache && typeof defaults?.cache === "object") {
          defaults.cache.clear();
        } else {
          globalCache.clear();
        }
      }
    }
  };
}
function clearResolveCache() {
  globalCache.clear();
}
function _tryModuleResolve(specifier, base, conditions) {
  try {
    return moduleResolve(specifier, base, conditions);
  } catch (error) {
    if (!NOT_FOUND_ERRORS.has(error?.code)) {
      throw error;
    }
  }
}
function _normalizeBases(inputs) {
  const urls = (Array.isArray(inputs) ? inputs : [inputs]).flatMap(
    (input) => _normalizeBase(input)
  );
  if (urls.length === 0) {
    return [(0,external_node_url_.pathToFileURL)("./")];
  }
  return urls;
}
function _normalizeBase(input) {
  if (!input) {
    return [];
  }
  if (_isURL(input)) {
    return [input];
  }
  if (typeof input !== "string") {
    return [];
  }
  if (/^(?:node|data|http|https|file):/.test(input)) {
    return new URL(input);
  }
  try {
    if (input.endsWith("/") || (0,external_node_fs_.statSync)(input).isDirectory()) {
      return (0,external_node_url_.pathToFileURL)(input + "/");
    }
    return (0,external_node_url_.pathToFileURL)(input);
  } catch {
    return [(0,external_node_url_.pathToFileURL)(input + "/"), (0,external_node_url_.pathToFileURL)(input)];
  }
}
function _fmtPath(input) {
  try {
    return (0,external_node_url_.fileURLToPath)(input);
  } catch {
    return input;
  }
}
function _cacheKey(id, opts) {
  return JSON.stringify([
    id,
    (opts?.conditions || ["node", "import"]).sort(),
    opts?.extensions,
    opts?.from,
    opts?.suffixes
  ]);
}
function _join(a, b) {
  if (!a || !b || b === "/") {
    return a;
  }
  return (a.endsWith("/") ? a : a + "/") + (b.startsWith("/") ? b.slice(1) : b);
}
function _normalizeWinPath(path) {
  return path.replace(/\\/g, "/").replace(/^[a-z]:\//, (r) => r.toUpperCase());
}
function _isURL(input) {
  return input instanceof URL || input?.constructor?.name === "URL";
}
function _parseInput(input) {
  if (typeof input === "string") {
    if (input.startsWith("file:")) {
      const url = new URL(input);
      return { url, absolutePath: (0,external_node_url_.fileURLToPath)(url) };
    }
    if ((0,external_node_path_.isAbsolute)(input)) {
      return { url: (0,external_node_url_.pathToFileURL)(input), absolutePath: input };
    }
    if (/^(?:node|data|http|https):/.test(input)) {
      return { external: input };
    }
    if (nodeBuiltins.includes(input) && !input.includes(":")) {
      return { external: `node:${input}` };
    }
    return { specifier: input };
  }
  if (_isURL(input)) {
    if (input.protocol === "file:") {
      return { url: input, absolutePath: (0,external_node_url_.fileURLToPath)(input) };
    }
    return { external: input.href };
  }
  throw new TypeError("id must be a `string` or `URL`");
}



// EXTERNAL MODULE: external "node:module"
var external_node_module_ = __webpack_require__(8995);
// EXTERNAL MODULE: ./node_modules/jiti/dist/jiti.cjs
var jiti = __webpack_require__(4780);
;// CONCATENATED MODULE: ./node_modules/jiti/lib/jiti.mjs



function onError(err) {
  throw err; /* ↓ Check stack trace ↓ */
}

const nativeImport = (id) => __webpack_require__(5439)(id);

let _transform;
function lazyTransform(...args) {
  if (!_transform) {
    _transform = (0,external_node_module_.createRequire)(require("url").pathToFileURL(__filename).href)("../dist/babel.cjs");
  }
  return _transform(...args);
}

function createJiti(id, opts = {}) {
  if (!opts.transform) {
    opts = { ...opts, transform: lazyTransform };
  }
  return jiti(id, opts, {
    onError,
    nativeImport,
    createRequire: external_node_module_.createRequire,
  });
}

/* harmony default export */ const lib_jiti = ((/* unused pure expression or super */ null && (createJiti)));

// EXTERNAL MODULE: ./node_modules/destr/dist/index.mjs
var dist = __webpack_require__(2899);
// EXTERNAL MODULE: ./node_modules/defu/dist/defu.mjs
var dist_defu = __webpack_require__(3545);
;// CONCATENATED MODULE: ./node_modules/rc9/dist/index.mjs






function isBuffer (obj) {
  return obj &&
    obj.constructor &&
    (typeof obj.constructor.isBuffer === 'function') &&
    obj.constructor.isBuffer(obj)
}

function keyIdentity (key) {
  return key
}

function flatten (target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};

  function step (object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function (key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      );

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output
}

function unflatten (target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const overwrite = opts.overwrite || false;
  const transformKey = opts.transformKey || keyIdentity;
  const result = {};

  const isbuffer = isBuffer(target);
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey (key) {
    const parsedKey = Number(key);

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1 ||
      opts.object
    )
      ? key
      : parsedKey
  }

  function addKeys (keyPrefix, recipient, target) {
    return Object.keys(target).reduce(function (result, key) {
      result[keyPrefix + delimiter + key] = target[key];

      return result
    }, recipient)
  }

  function isEmpty (val) {
    const type = Object.prototype.toString.call(val);
    const isArray = type === '[object Array]';
    const isObject = type === '[object Object]';

    if (!val) {
      return true
    } else if (isArray) {
      return !val.length
    } else if (isObject) {
      return !Object.keys(val).length
    }
  }

  target = Object.keys(target).reduce(function (result, key) {
    const type = Object.prototype.toString.call(target[key]);
    const isObject = (type === '[object Object]' || type === '[object Array]');
    if (!isObject || isEmpty(target[key])) {
      result[key] = target[key];
      return result
    } else {
      return addKeys(
        key,
        result,
        flatten(target[key], opts)
      )
    }
  }, {});

  Object.keys(target).forEach(function (key) {
    const split = key.split(delimiter).map(transformKey);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = result;

    while (key2 !== undefined) {
      if (key1 === '__proto__') {
        return
      }

      const type = Object.prototype.toString.call(recipient[key1]);
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      );

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object
            ? []
            : {}
        );
      }

      recipient = recipient[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts);
  });

  return result
}

const RE_KEY_VAL = /^\s*([^\s=]+)\s*=\s*(.*)?\s*$/;
const RE_LINES = /\n|\r|\r\n/;
const defaults = {
  name: ".conf",
  dir: process.cwd(),
  flat: false
};
function withDefaults(options) {
  if (typeof options === "string") {
    options = { name: options };
  }
  return { ...defaults, ...options };
}
function parse(contents, options = {}) {
  const config = {};
  const lines = contents.split(RE_LINES);
  for (const line of lines) {
    const match = line.match(RE_KEY_VAL);
    if (!match) {
      continue;
    }
    const key = match[1];
    if (!key || key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = (0,dist/* default */.Ay)(
      (match[2] || "").trim()
      /* val */
    );
    if (key.endsWith("[]")) {
      const nkey = key.slice(0, Math.max(0, key.length - 2));
      config[nkey] = (config[nkey] || []).concat(value);
      continue;
    }
    config[key] = value;
  }
  return options.flat ? config : unflatten(config, { overwrite: true });
}
function parseFile(path, options) {
  if (!(0,external_node_fs_.existsSync)(path)) {
    return {};
  }
  return parse((0,external_node_fs_.readFileSync)(path, "utf8"), options);
}
function dist_read(options) {
  options = withDefaults(options);
  return parseFile((0,external_node_path_.resolve)(options.dir, options.name), options);
}
function readUser(options) {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || (0,external_node_os_.homedir)();
  return dist_read(options);
}
function serialize(config) {
  return Object.entries(flatten(config)).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join("\n");
}
function write(config, options) {
  options = withDefaults(options);
  writeFileSync(resolve(options.dir, options.name), serialize(config), {
    encoding: "utf8"
  });
}
function writeUser(config, options) {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  write(config, options);
}
function update(config, options) {
  options = withDefaults(options);
  if (!options.flat) {
    config = unflatten(config, { overwrite: true });
  }
  const newConfig = defu(config, dist_read(options));
  write(newConfig, options);
  return newConfig;
}
function updateUser(config, options) {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  return update(config, options);
}



// EXTERNAL MODULE: ./node_modules/confbox/dist/shared/confbox.DnMsyigM.mjs
var confbox_DnMsyigM = __webpack_require__(5849);
;// CONCATENATED MODULE: ./node_modules/pkg-types/dist/index.mjs








const defaultFindOptions = {
  startingFrom: ".",
  rootPattern: /^node_modules$/,
  reverse: false,
  test: (filePath) => {
    try {
      if ((0,external_node_fs_.statSync)(filePath).isFile()) {
        return true;
      }
    } catch {
    }
  }
};
async function findFile(filename, _options = {}) {
  const filenames = Array.isArray(filename) ? filename : [filename];
  const options = { ...defaultFindOptions, ..._options };
  const basePath = (0,pathe_M_eThtNZ.r)(options.startingFrom);
  const leadingSlash = basePath[0] === "/";
  const segments = basePath.split("/").filter(Boolean);
  if (filenames.includes(segments.at(-1)) && await options.test(basePath)) {
    return basePath;
  }
  if (leadingSlash) {
    segments[0] = "/" + segments[0];
  }
  let root = segments.findIndex((r) => r.match(options.rootPattern));
  if (root === -1) {
    root = 0;
  }
  if (options.reverse) {
    for (let index = root + 1; index <= segments.length; index++) {
      for (const filename2 of filenames) {
        const filePath = (0,pathe_M_eThtNZ.j)(...segments.slice(0, index), filename2);
        if (await options.test(filePath)) {
          return filePath;
        }
      }
    }
  } else {
    for (let index = segments.length; index > root; index--) {
      for (const filename2 of filenames) {
        const filePath = (0,pathe_M_eThtNZ.j)(...segments.slice(0, index), filename2);
        if (await options.test(filePath)) {
          return filePath;
        }
      }
    }
  }
  throw new Error(
    `Cannot find matching ${filename} in ${options.startingFrom} or parent directories`
  );
}
function findNearestFile(filename, options = {}) {
  return findFile(filename, options);
}
function findFarthestFile(filename, options = {}) {
  return findFile(filename, { ...options, reverse: true });
}

function _resolvePath(id, opts = {}) {
  if (id instanceof URL || id.startsWith("file://")) {
    return (0,pathe_M_eThtNZ.n)((0,external_node_url_.fileURLToPath)(id));
  }
  if ((0,pathe_M_eThtNZ.i)(id)) {
    return (0,pathe_M_eThtNZ.n)(id);
  }
  return resolveModulePath(id, {
    ...opts,
    from: opts.from || opts.parent || opts.url
  });
}

const FileCache$1 = /* @__PURE__ */ new Map();
function defineTSConfig(tsconfig) {
  return tsconfig;
}
async function readTSConfig(id, options = {}) {
  const resolvedPath = await resolveTSConfig(id, options);
  const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache$1;
  if (options.cache && cache.has(resolvedPath)) {
    return cache.get(resolvedPath);
  }
  const text = await promises.readFile(resolvedPath, "utf8");
  const parsed = parseJSONC(text);
  cache.set(resolvedPath, parsed);
  return parsed;
}
async function writeTSConfig(path, tsconfig) {
  await promises.writeFile(path, stringifyJSONC(tsconfig));
}
async function resolveTSConfig(id = process.cwd(), options = {}) {
  return findNearestFile("tsconfig.json", {
    ...options,
    startingFrom: _resolvePath(id, options)
  });
}

const lockFiles = [
  "yarn.lock",
  "package-lock.json",
  "pnpm-lock.yaml",
  "npm-shrinkwrap.json",
  "bun.lockb",
  "bun.lock",
  "deno.lock"
];
const packageFiles = ["package.json", "package.json5", "package.yaml"];
const workspaceFiles = [
  "pnpm-workspace.yaml",
  "lerna.json",
  "turbo.json",
  "rush.json",
  "deno.json",
  "deno.jsonc"
];
const FileCache = /* @__PURE__ */ new Map();
function definePackageJSON(pkg) {
  return pkg;
}
async function findPackage(id = process.cwd(), options = {}) {
  return findNearestFile(packageFiles, {
    ...options,
    startingFrom: _resolvePath(id, options)
  });
}
async function readPackage(id, options = {}) {
  const resolvedPath = await findPackage(id, options);
  const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
  if (options.cache && cache.has(resolvedPath)) {
    return cache.get(resolvedPath);
  }
  const blob = await promises.readFile(resolvedPath, "utf8");
  let parsed;
  if (resolvedPath.endsWith(".json5")) {
    parsed = parseJSON5(blob);
  } else if (resolvedPath.endsWith(".yaml")) {
    parsed = parseYAML(blob);
  } else {
    try {
      parsed = parseJSON(blob);
    } catch {
      parsed = parseJSONC(blob);
    }
  }
  cache.set(resolvedPath, parsed);
  return parsed;
}
async function writePackage(path, pkg) {
  let content;
  if (path.endsWith(".json5")) {
    content = stringifyJSON5(pkg);
  } else if (path.endsWith(".yaml")) {
    content = stringifyYAML(pkg);
  } else {
    content = stringifyJSON(pkg);
  }
  await promises.writeFile(path, content);
}
async function readPackageJSON(id, options = {}) {
  const resolvedPath = await resolvePackageJSON(id, options);
  const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
  if (options.cache && cache.has(resolvedPath)) {
    return cache.get(resolvedPath);
  }
  const blob = await external_node_fs_.promises.readFile(resolvedPath, "utf8");
  let parsed;
  try {
    parsed = (0,confbox_DnMsyigM.a)(blob);
  } catch {
    parsed = (0,confbox_DnMsyigM.p)(blob);
  }
  cache.set(resolvedPath, parsed);
  return parsed;
}
async function writePackageJSON(path, pkg) {
  await promises.writeFile(path, stringifyJSON(pkg));
}
async function resolvePackageJSON(id = process.cwd(), options = {}) {
  return findNearestFile("package.json", {
    ...options,
    startingFrom: _resolvePath(id, options)
  });
}
async function resolveLockfile(id = process.cwd(), options = {}) {
  return findNearestFile(lockFiles, {
    ...options,
    startingFrom: _resolvePath(id, options)
  });
}
const workspaceTests = {
  workspaceFile: (opts) => findFile(workspaceFiles, opts).then((r) => (0,pathe_M_eThtNZ.d)(r)),
  gitConfig: (opts) => findFile(".git/config", opts).then((r) => (0,pathe_M_eThtNZ.r)(r, "../..")),
  lockFile: (opts) => findFile(lockFiles, opts).then((r) => (0,pathe_M_eThtNZ.d)(r)),
  packageJson: (opts) => findFile(packageFiles, opts).then((r) => (0,pathe_M_eThtNZ.d)(r))
};
async function findWorkspaceDir(id = process.cwd(), options = {}) {
  const startingFrom = _resolvePath(id, options);
  const tests = options.tests || ["workspaceFile", "gitConfig", "lockFile", "packageJson"];
  for (const testName of tests) {
    const test = workspaceTests[testName];
    if (options[testName] === false || !test) {
      continue;
    }
    const direction = options[testName] || (testName === "gitConfig" ? "closest" : "furthest");
    const detected = await test({
      ...options,
      startingFrom,
      reverse: direction === "furthest"
    }).catch(() => {
    });
    if (detected) {
      return detected;
    }
  }
  throw new Error(`Cannot detect workspace root from ${id}`);
}
async function updatePackage(id, callback, options = {}) {
  const resolvedPath = await findPackage(id, options);
  const pkg = await readPackage(id, options);
  const proxy = new Proxy(pkg, {
    get(target, prop) {
      if (typeof prop === "string" && objectKeys.has(prop) && !Object.hasOwn(target, prop)) {
        target[prop] = {};
      }
      return Reflect.get(target, prop);
    }
  });
  const updated = await callback(proxy) || pkg;
  await writePackage(resolvedPath, updated);
}
function sortPackage(pkg) {
  const sorted = {};
  const originalKeys = Object.keys(pkg);
  const knownKeysPresent = defaultFieldOrder.filter(
    (key) => Object.hasOwn(pkg, key)
  );
  for (const key of originalKeys) {
    const currentIndex = knownKeysPresent.indexOf(key);
    if (currentIndex === -1) {
      sorted[key] = pkg[key];
      continue;
    }
    for (let i = 0; i <= currentIndex; i++) {
      const knownKey = knownKeysPresent[i];
      if (!Object.hasOwn(sorted, knownKey)) {
        sorted[knownKey] = pkg[knownKey];
      }
    }
  }
  for (const key of [...dependencyKeys, "scripts"]) {
    const value = sorted[key];
    if (isObject(value)) {
      sorted[key] = sortObject(value);
    }
  }
  return sorted;
}
function normalizePackage(pkg) {
  const normalized = sortPackage(pkg);
  for (const key of dependencyKeys) {
    if (!Object.hasOwn(normalized, key)) {
      continue;
    }
    const value = normalized[key];
    if (!isObject(value)) {
      delete normalized[key];
    }
  }
  return normalized;
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function sortObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  );
}
const dependencyKeys = (/* unused pure expression or super */ null && ([
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies"
]));
const objectKeys = /* @__PURE__ */ new Set([
  "typesVersions",
  "scripts",
  "resolutions",
  "overrides",
  "dependencies",
  "devDependencies",
  "dependenciesMeta",
  "peerDependencies",
  "peerDependenciesMeta",
  "optionalDependencies",
  "engines",
  "publishConfig"
]);
const defaultFieldOrder = (/* unused pure expression or super */ null && ([
  "$schema",
  "name",
  "version",
  "private",
  "description",
  "keywords",
  "homepage",
  "bugs",
  "repository",
  "funding",
  "license",
  "author",
  "sideEffects",
  "type",
  "imports",
  "exports",
  "main",
  "module",
  "browser",
  "types",
  "typesVersions",
  "typings",
  "bin",
  "man",
  "files",
  "workspaces",
  "scripts",
  "resolutions",
  "overrides",
  "dependencies",
  "devDependencies",
  "dependenciesMeta",
  "peerDependencies",
  "peerDependenciesMeta",
  "optionalDependencies",
  "bundledDependencies",
  "bundleDependencies",
  "packageManager",
  "engines",
  "publishConfig"
]));

function defineGitConfig(config) {
  return config;
}
async function resolveGitConfig(dir, opts) {
  return findNearestFile(".git/config", { ...opts, startingFrom: dir });
}
async function readGitConfig(dir, opts) {
  const path = await resolveGitConfig(dir, opts);
  const ini = await readFile(path, "utf8");
  return parseGitConfig(ini);
}
async function writeGitConfig(path, config) {
  await writeFile(path, stringifyGitConfig(config));
}
function parseGitConfig(ini) {
  return parseINI(ini.replaceAll(/^\[(\w+) "(.+)"\]$/gm, "[$1.$2]"));
}
function stringifyGitConfig(config) {
  return stringifyINI(config).replaceAll(/^\[(\w+)\.(\w+)\]$/gm, '[$1 "$2"]');
}



// EXTERNAL MODULE: ./node_modules/dotenv/lib/main.js
var main = __webpack_require__(8889);
;// CONCATENATED MODULE: ./node_modules/c12/dist/shared/c12.8GPsgFQh.mjs












async function setupDotenv(options) {
  const targetEnvironment = options.env ?? process.env;
  const environment = await loadDotenv({
    cwd: options.cwd,
    fileName: options.fileName ?? ".env",
    env: targetEnvironment,
    interpolate: options.interpolate ?? true
  });
  const dotenvVars = getDotEnvVars(targetEnvironment);
  for (const key in environment) {
    if (key.startsWith("_")) {
      continue;
    }
    if (targetEnvironment[key] === void 0 || dotenvVars.has(key)) {
      targetEnvironment[key] = environment[key];
    }
  }
  return environment;
}
async function loadDotenv(options) {
  const environment = /* @__PURE__ */ Object.create(null);
  const cwd = (0,pathe_M_eThtNZ.r)(options.cwd || ".");
  const _fileName = options.fileName || ".env";
  const dotenvFiles = typeof _fileName === "string" ? [_fileName] : _fileName;
  const dotenvVars = getDotEnvVars(options.env || {});
  Object.assign(environment, options.env);
  for (const file of dotenvFiles) {
    const dotenvFile = (0,pathe_M_eThtNZ.r)(cwd, file);
    if (!(0,external_node_fs_.statSync)(dotenvFile, { throwIfNoEntry: false })?.isFile()) {
      continue;
    }
    const parsed = main.parse(await external_node_fs_.promises.readFile(dotenvFile, "utf8"));
    for (const key in parsed) {
      if (key in environment && !dotenvVars.has(key)) {
        continue;
      }
      environment[key] = parsed[key];
      dotenvVars.add(key);
    }
  }
  if (options.interpolate) {
    interpolate(environment);
  }
  return environment;
}
function interpolate(target, source = {}, parse = (v) => v) {
  function getValue(key) {
    return source[key] === void 0 ? target[key] : source[key];
  }
  function interpolate2(value, parents = []) {
    if (typeof value !== "string") {
      return value;
    }
    const matches = value.match(/(.?\${?(?:[\w:]+)?}?)/g) || [];
    return parse(
      // eslint-disable-next-line unicorn/no-array-reduce
      matches.reduce((newValue, match) => {
        const parts = /(.?)\${?([\w:]+)?}?/g.exec(match) || [];
        const prefix = parts[1];
        let value2, replacePart;
        if (prefix === "\\") {
          replacePart = parts[0] || "";
          value2 = replacePart.replace(String.raw`\$`, "$");
        } else {
          const key = parts[2];
          replacePart = (parts[0] || "").slice(prefix.length);
          if (parents.includes(key)) {
            console.warn(
              `Please avoid recursive environment variables ( loop: ${parents.join(
                " > "
              )} > ${key} )`
            );
            return "";
          }
          value2 = getValue(key);
          value2 = interpolate2(value2, [...parents, key]);
        }
        return value2 === void 0 ? newValue : newValue.replace(replacePart, value2);
      }, value)
    );
  }
  for (const key in target) {
    target[key] = interpolate2(getValue(key));
  }
}
function getDotEnvVars(targetEnvironment) {
  const globalRegistry = globalThis.__c12_dotenv_vars__ ||= /* @__PURE__ */ new Map();
  if (!globalRegistry.has(targetEnvironment)) {
    globalRegistry.set(targetEnvironment, /* @__PURE__ */ new Set());
  }
  return globalRegistry.get(targetEnvironment);
}

const _normalize = (p) => p?.replace(/\\/g, "/");
const ASYNC_LOADERS = {
  ".yaml": () => __webpack_require__.e(/* import() */ 599).then(__webpack_require__.bind(__webpack_require__, 7599)).then((r) => r.parseYAML),
  ".yml": () => __webpack_require__.e(/* import() */ 599).then(__webpack_require__.bind(__webpack_require__, 7599)).then((r) => r.parseYAML),
  ".jsonc": () => __webpack_require__.e(/* import() */ 571).then(__webpack_require__.bind(__webpack_require__, 9571)).then((r) => r.parseJSONC),
  ".json5": () => __webpack_require__.e(/* import() */ 413).then(__webpack_require__.bind(__webpack_require__, 7794)).then((r) => r.parseJSON5),
  ".toml": () => __webpack_require__.e(/* import() */ 618).then(__webpack_require__.bind(__webpack_require__, 9618)).then((r) => r.parseTOML)
};
const c12_8GPsgFQh_SUPPORTED_EXTENSIONS = Object.freeze([
  // with jiti
  ".js",
  ".ts",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
  ".json",
  // with confbox
  ".jsonc",
  ".json5",
  ".yaml",
  ".yml",
  ".toml"
]);
async function c12_8GPsgFQh_loadConfig(options) {
  options.cwd = (0,pathe_M_eThtNZ.r)(process.cwd(), options.cwd || ".");
  options.name = options.name || "config";
  options.envName = options.envName ?? process.env.NODE_ENV;
  options.configFile = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
  options.rcFile = options.rcFile ?? `.${options.name}rc`;
  if (options.extend !== false) {
    options.extend = {
      extendKey: "extends",
      ...options.extend
    };
  }
  const _merger = options.merger || dist_defu/* defu */.$Q;
  options.jiti = options.jiti || createJiti((0,pathe_M_eThtNZ.j)(options.cwd, options.configFile), {
    interopDefault: true,
    moduleCache: false,
    extensions: [...c12_8GPsgFQh_SUPPORTED_EXTENSIONS],
    ...options.jitiOptions
  });
  const r = {
    config: {},
    cwd: options.cwd,
    configFile: (0,pathe_M_eThtNZ.r)(options.cwd, options.configFile),
    layers: [],
    _configFile: void 0
  };
  const rawConfigs = {
    overrides: options.overrides,
    main: void 0,
    rc: void 0,
    packageJson: void 0,
    defaultConfig: options.defaultConfig
  };
  if (options.dotenv) {
    await setupDotenv({
      cwd: options.cwd,
      ...options.dotenv === true ? {} : options.dotenv
    });
  }
  const _mainConfig = await resolveConfig(".", options);
  if (_mainConfig.configFile) {
    rawConfigs.main = _mainConfig.config;
    r.configFile = _mainConfig.configFile;
    r._configFile = _mainConfig._configFile;
  }
  if (_mainConfig.meta) {
    r.meta = _mainConfig.meta;
  }
  if (options.rcFile) {
    const rcSources = [];
    rcSources.push(dist_read({ name: options.rcFile, dir: options.cwd }));
    if (options.globalRc) {
      const workspaceDir = await findWorkspaceDir(options.cwd).catch(() => {
      });
      if (workspaceDir) {
        rcSources.push(dist_read({ name: options.rcFile, dir: workspaceDir }));
      }
      rcSources.push(readUser({ name: options.rcFile, dir: options.cwd }));
    }
    rawConfigs.rc = _merger({}, ...rcSources);
  }
  if (options.packageJson) {
    const keys = (Array.isArray(options.packageJson) ? options.packageJson : [
      typeof options.packageJson === "string" ? options.packageJson : options.name
    ]).filter((t) => t && typeof t === "string");
    const pkgJsonFile = await readPackageJSON(options.cwd).catch(() => {
    });
    const values = keys.map((key) => pkgJsonFile?.[key]);
    rawConfigs.packageJson = _merger({}, ...values);
  }
  const configs = {};
  for (const key in rawConfigs) {
    const value = rawConfigs[key];
    configs[key] = await (typeof value === "function" ? value({ configs, rawConfigs }) : value);
  }
  if (Array.isArray(configs.main)) {
    r.config = configs.main;
  } else {
    r.config = _merger(
      configs.overrides,
      configs.main,
      configs.rc,
      configs.packageJson,
      configs.defaultConfig
    );
    if (options.extend) {
      await extendConfig(r.config, options);
      r.layers = r.config._layers;
      delete r.config._layers;
      r.config = _merger(r.config, ...r.layers.map((e) => e.config));
    }
  }
  const baseLayers = [
    configs.overrides && {
      config: configs.overrides,
      configFile: void 0,
      cwd: void 0
    },
    { config: configs.main, configFile: options.configFile, cwd: options.cwd },
    configs.rc && { config: configs.rc, configFile: options.rcFile },
    configs.packageJson && {
      config: configs.packageJson,
      configFile: "package.json"
    }
  ].filter((l) => l && l.config);
  r.layers = [...baseLayers, ...r.layers];
  if (options.defaults) {
    r.config = _merger(r.config, options.defaults);
  }
  if (options.omit$Keys) {
    for (const key in r.config) {
      if (key.startsWith("$")) {
        delete r.config[key];
      }
    }
  }
  if (options.configFileRequired && !r._configFile) {
    throw new Error(`Required config (${r.configFile}) cannot be resolved.`);
  }
  return r;
}
async function extendConfig(config, options) {
  config._layers = config._layers || [];
  if (!options.extend) {
    return;
  }
  let keys = options.extend.extendKey;
  if (typeof keys === "string") {
    keys = [keys];
  }
  const extendSources = [];
  for (const key of keys) {
    extendSources.push(
      ...(Array.isArray(config[key]) ? config[key] : [config[key]]).filter(
        Boolean
      )
    );
    delete config[key];
  }
  for (let extendSource of extendSources) {
    const originalExtendSource = extendSource;
    let sourceOptions = {};
    if (extendSource.source) {
      sourceOptions = extendSource.options || {};
      extendSource = extendSource.source;
    }
    if (Array.isArray(extendSource)) {
      sourceOptions = extendSource[1] || {};
      extendSource = extendSource[0];
    }
    if (typeof extendSource !== "string") {
      console.warn(
        `Cannot extend config from \`${JSON.stringify(
          originalExtendSource
        )}\` in ${options.cwd}`
      );
      continue;
    }
    const _config = await resolveConfig(extendSource, options, sourceOptions);
    if (!_config.config) {
      console.warn(
        `Cannot extend config from \`${extendSource}\` in ${options.cwd}`
      );
      continue;
    }
    await extendConfig(_config.config, { ...options, cwd: _config.cwd });
    config._layers.push(_config);
    if (_config.config._layers) {
      config._layers.push(..._config.config._layers);
      delete _config.config._layers;
    }
  }
}
const GIGET_PREFIXES = [
  "gh:",
  "github:",
  "gitlab:",
  "bitbucket:",
  "https://",
  "http://"
];
const NPM_PACKAGE_RE = /^(@[\da-z~-][\d._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*($|\/.*)/;
async function resolveConfig(source, options, sourceOptions = {}) {
  if (options.resolve) {
    const res2 = await options.resolve(source, options);
    if (res2) {
      return res2;
    }
  }
  const _merger = options.merger || dist_defu/* defu */.$Q;
  const customProviderKeys = Object.keys(
    sourceOptions.giget?.providers || {}
  ).map((key) => `${key}:`);
  const gigetPrefixes = customProviderKeys.length > 0 ? [.../* @__PURE__ */ new Set([...customProviderKeys, ...GIGET_PREFIXES])] : GIGET_PREFIXES;
  if (options.giget !== false && gigetPrefixes.some((prefix) => source.startsWith(prefix))) {
    const { downloadTemplate } = await __webpack_require__.e(/* import() */ 831).then(__webpack_require__.bind(__webpack_require__, 7831));
    const { digest } = await __webpack_require__.e(/* import() */ 179).then(__webpack_require__.bind(__webpack_require__, 7179));
    const cloneName = source.replace(/\W+/g, "_").split("_").splice(0, 3).join("_") + "_" + digest(source).slice(0, 10).replace(/[-_]/g, "");
    let cloneDir;
    const localNodeModules = (0,pathe_M_eThtNZ.r)(options.cwd, "node_modules");
    const parentDir = (0,pathe_M_eThtNZ.d)(options.cwd);
    if ((0,pathe_M_eThtNZ.c)(parentDir) === ".c12") {
      cloneDir = (0,pathe_M_eThtNZ.j)(parentDir, cloneName);
    } else if ((0,external_node_fs_.existsSync)(localNodeModules)) {
      cloneDir = (0,pathe_M_eThtNZ.j)(localNodeModules, ".c12", cloneName);
    } else {
      cloneDir = process.env.XDG_CACHE_HOME ? (0,pathe_M_eThtNZ.r)(process.env.XDG_CACHE_HOME, "c12", cloneName) : (0,pathe_M_eThtNZ.r)((0,external_node_os_.homedir)(), ".cache/c12", cloneName);
    }
    if ((0,external_node_fs_.existsSync)(cloneDir) && !sourceOptions.install) {
      await (0,promises_.rm)(cloneDir, { recursive: true });
    }
    const cloned = await downloadTemplate(source, {
      dir: cloneDir,
      install: sourceOptions.install,
      force: sourceOptions.install,
      auth: sourceOptions.auth,
      ...options.giget,
      ...sourceOptions.giget
    });
    source = cloned.dir;
  }
  if (NPM_PACKAGE_RE.test(source)) {
    source = tryResolve(source, options) || source;
  }
  const ext = (0,pathe_M_eThtNZ.e)(source);
  const isDir = !ext || ext === (0,pathe_M_eThtNZ.c)(source);
  const cwd = (0,pathe_M_eThtNZ.r)(options.cwd, isDir ? source : (0,pathe_M_eThtNZ.d)(source));
  if (isDir) {
    source = options.configFile;
  }
  const res = {
    config: void 0,
    configFile: void 0,
    cwd,
    source,
    sourceOptions
  };
  res.configFile = tryResolve((0,pathe_M_eThtNZ.r)(cwd, source), options) || tryResolve(
    (0,pathe_M_eThtNZ.r)(cwd, ".config", source.replace(/\.config$/, "")),
    options
  ) || tryResolve((0,pathe_M_eThtNZ.r)(cwd, ".config", source), options) || source;
  if (!(0,external_node_fs_.existsSync)(res.configFile)) {
    return res;
  }
  res._configFile = res.configFile;
  const configFileExt = (0,pathe_M_eThtNZ.e)(res.configFile) || "";
  if (configFileExt in ASYNC_LOADERS) {
    const asyncLoader = await ASYNC_LOADERS[configFileExt]();
    const contents = await (0,promises_.readFile)(res.configFile, "utf8");
    res.config = asyncLoader(contents);
  } else {
    res.config = await options.jiti.import(res.configFile, {
      default: true
    });
  }
  if (typeof res.config === "function") {
    res.config = await res.config(options.context);
  }
  if (options.envName) {
    const envConfig = {
      ...res.config["$" + options.envName],
      ...res.config.$env?.[options.envName]
    };
    if (Object.keys(envConfig).length > 0) {
      res.config = _merger(envConfig, res.config);
    }
  }
  res.meta = (0,dist_defu/* defu */.$Q)(res.sourceOptions.meta, res.config.$meta);
  delete res.config.$meta;
  if (res.sourceOptions.overrides) {
    res.config = _merger(res.sourceOptions.overrides, res.config);
  }
  res.configFile = _normalize(res.configFile);
  res.source = _normalize(res.source);
  return res;
}
function tryResolve(id, options) {
  const res = resolveModulePath(id, {
    try: true,
    from: (0,external_node_url_.pathToFileURL)((0,pathe_M_eThtNZ.j)(options.cwd || ".", options.configFile || "/")),
    suffixes: ["", "/index"],
    extensions: c12_8GPsgFQh_SUPPORTED_EXTENSIONS,
    cache: false
  });
  return res ? (0,pathe_M_eThtNZ.n)(res) : void 0;
}



;// CONCATENATED MODULE: ./node_modules/c12/dist/index.mjs















function createDefineConfig() {
  return (input) => input;
}

const eventMap = {
  add: "created",
  change: "updated",
  unlink: "removed"
};
async function watchConfig(options) {
  let config = await loadConfig(options);
  const configName = options.name || "config";
  const configFileName = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
  const watchingFiles = [
    ...new Set(
      (config.layers || []).filter((l) => l.cwd).flatMap((l) => [
        ...SUPPORTED_EXTENSIONS.flatMap((ext) => [
          resolve(l.cwd, configFileName + ext),
          resolve(l.cwd, ".config", configFileName + ext),
          resolve(
            l.cwd,
            ".config",
            configFileName.replace(/\.config$/, "") + ext
          )
        ]),
        l.source && resolve(l.cwd, l.source),
        // TODO: Support watching rc from home and workspace
        options.rcFile && resolve(
          l.cwd,
          typeof options.rcFile === "string" ? options.rcFile : `.${configName}rc`
        ),
        options.packageJson && resolve(l.cwd, "package.json")
      ]).filter(Boolean)
    )
  ];
  const watch = await __webpack_require__.e(/* import() */ 518).then(__webpack_require__.bind(__webpack_require__, 9518)).then((r) => r.watch || r.default || r);
  const { diff } = await __webpack_require__.e(/* import() */ 288).then(__webpack_require__.bind(__webpack_require__, 288));
  const _fswatcher = watch(watchingFiles, {
    ignoreInitial: true,
    ...options.chokidarOptions
  });
  const onChange = async (event, path) => {
    const type = eventMap[event];
    if (!type) {
      return;
    }
    if (options.onWatch) {
      await options.onWatch({
        type,
        path
      });
    }
    const oldConfig = config;
    try {
      config = await loadConfig(options);
    } catch (error) {
      console.warn(`Failed to load config ${path}
${error}`);
      return;
    }
    const changeCtx = {
      newConfig: config,
      oldConfig,
      getDiff: () => diff(oldConfig.config, config.config)
    };
    if (options.acceptHMR) {
      const changeHandled = await options.acceptHMR(changeCtx);
      if (changeHandled) {
        return;
      }
    }
    if (options.onUpdate) {
      await options.onUpdate(changeCtx);
    }
  };
  if (options.debounce === false) {
    _fswatcher.on("all", onChange);
  } else {
    _fswatcher.on("all", debounce(onChange, options.debounce ?? 100));
  }
  const utils = {
    watchingFiles,
    unwatch: async () => {
      await _fswatcher.close();
    }
  };
  return new Proxy(utils, {
    get(_, prop) {
      if (prop in utils) {
        return utils[prop];
      }
      return config[prop];
    }
  });
}




/***/ }),

/***/ 2206:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ C),
/* harmony export */   s: () => (/* binding */ N)
/* harmony export */ });
const b=/^(?:( )+|\t+)/,d="space",h="tab";function g(e,t){const n=new Map;let s=0,o,i;for(const c of e.split(/\n/g)){if(!c)continue;let f,a,l,p,r;const y=c.match(b);if(y===null)s=0,o="";else{if(f=y[0].length,a=y[1]?d:h,t&&a===d&&f===1)continue;a!==o&&(s=0),o=a,l=1,p=0;const u=f-s;if(s=f,u===0)l=0,p=1;else{const I=u>0?u:-u;i=T(a,I)}r=n.get(i),r=r===void 0?[1,0]:[r[0]+l,r[1]+p],n.set(i,r)}}return n}function T(e,t){return(e===d?"s":"t")+String(t)}function w(e){const n=e[0]==="s"?d:h,s=Number(e.slice(1));return{type:n,amount:s}}function E(e){let t,n=0,s=0;for(const[o,[i,c]]of e)(i>n||i===n&&c>s)&&(n=i,s=c,t=o);return t}function S(e,t){return(e===d?" ":"	").repeat(t)}function _(e){if(typeof e!="string")throw new TypeError("Expected a string");let t=g(e,!0);t.size===0&&(t=g(e,!1));const n=E(t);let s,o=0,i="";return n!==void 0&&({type:s,amount:o}=w(n),i=S(s,o)),{amount:o,type:s,indent:i}}const m=Symbol.for("__confbox_fmt__"),k=/^(\s+)/,v=/(\s+)$/;function x(e,t={}){const n=t.indent===void 0&&t.preserveIndentation!==!1&&e.slice(0,t?.sampleSize||1024),s=t.preserveWhitespace===!1?void 0:{start:k.exec(e)?.[0]||"",end:v.exec(e)?.[0]||""};return{sample:n,whiteSpace:s}}function N(e,t,n){!t||typeof t!="object"||Object.defineProperty(t,m,{enumerable:!1,configurable:!0,writable:!0,value:x(e,n)})}function C(e,t){if(!e||typeof e!="object"||!(m in e))return{indent:t?.indent??2,whitespace:{start:"",end:""}};const n=e[m];return{indent:t?.indent||_(n.sample||"").indent,whitespace:n.whiteSpace||{start:"",end:""}}}


/***/ }),

/***/ 5849:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ x),
/* harmony export */   p: () => (/* binding */ h),
/* harmony export */   s: () => (/* binding */ d)
/* harmony export */ });
/* unused harmony export b */
/* harmony import */ var _confbox_DA7CpUDY_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2206);
function $(n,l=!1){const g=n.length;let e=0,u="",p=0,k=16,A=0,o=0,O=0,B=0,b=0;function I(i,T){let s=0,c=0;for(;s<i;){let t=n.charCodeAt(e);if(t>=48&&t<=57)c=c*16+t-48;else if(t>=65&&t<=70)c=c*16+t-65+10;else if(t>=97&&t<=102)c=c*16+t-97+10;else break;e++,s++}return s<i&&(c=-1),c}function V(i){e=i,u="",p=0,k=16,b=0}function F(){let i=e;if(n.charCodeAt(e)===48)e++;else for(e++;e<n.length&&L(n.charCodeAt(e));)e++;if(e<n.length&&n.charCodeAt(e)===46)if(e++,e<n.length&&L(n.charCodeAt(e)))for(e++;e<n.length&&L(n.charCodeAt(e));)e++;else return b=3,n.substring(i,e);let T=e;if(e<n.length&&(n.charCodeAt(e)===69||n.charCodeAt(e)===101))if(e++,(e<n.length&&n.charCodeAt(e)===43||n.charCodeAt(e)===45)&&e++,e<n.length&&L(n.charCodeAt(e))){for(e++;e<n.length&&L(n.charCodeAt(e));)e++;T=e}else b=3;return n.substring(i,T)}function a(){let i="",T=e;for(;;){if(e>=g){i+=n.substring(T,e),b=2;break}const s=n.charCodeAt(e);if(s===34){i+=n.substring(T,e),e++;break}if(s===92){if(i+=n.substring(T,e),e++,e>=g){b=2;break}switch(n.charCodeAt(e++)){case 34:i+='"';break;case 92:i+="\\";break;case 47:i+="/";break;case 98:i+="\b";break;case 102:i+="\f";break;case 110:i+=`
`;break;case 114:i+="\r";break;case 116:i+="	";break;case 117:const t=I(4);t>=0?i+=String.fromCharCode(t):b=4;break;default:b=5}T=e;continue}if(s>=0&&s<=31)if(r(s)){i+=n.substring(T,e),b=2;break}else b=6;e++}return i}function w(){if(u="",b=0,p=e,o=A,B=O,e>=g)return p=g,k=17;let i=n.charCodeAt(e);if(J(i)){do e++,u+=String.fromCharCode(i),i=n.charCodeAt(e);while(J(i));return k=15}if(r(i))return e++,u+=String.fromCharCode(i),i===13&&n.charCodeAt(e)===10&&(e++,u+=`
`),A++,O=e,k=14;switch(i){case 123:return e++,k=1;case 125:return e++,k=2;case 91:return e++,k=3;case 93:return e++,k=4;case 58:return e++,k=6;case 44:return e++,k=5;case 34:return e++,u=a(),k=10;case 47:const T=e-1;if(n.charCodeAt(e+1)===47){for(e+=2;e<g&&!r(n.charCodeAt(e));)e++;return u=n.substring(T,e),k=12}if(n.charCodeAt(e+1)===42){e+=2;const s=g-1;let c=!1;for(;e<s;){const t=n.charCodeAt(e);if(t===42&&n.charCodeAt(e+1)===47){e+=2,c=!0;break}e++,r(t)&&(t===13&&n.charCodeAt(e)===10&&e++,A++,O=e)}return c||(e++,b=1),u=n.substring(T,e),k=13}return u+=String.fromCharCode(i),e++,k=16;case 45:if(u+=String.fromCharCode(i),e++,e===g||!L(n.charCodeAt(e)))return k=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return u+=F(),k=11;default:for(;e<g&&v(i);)e++,i=n.charCodeAt(e);if(p!==e){switch(u=n.substring(p,e),u){case"true":return k=8;case"false":return k=9;case"null":return k=7}return k=16}return u+=String.fromCharCode(i),e++,k=16}}function v(i){if(J(i)||r(i))return!1;switch(i){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return!1}return!0}function j(){let i;do i=w();while(i>=12&&i<=15);return i}return{setPosition:V,getPosition:()=>e,scan:l?j:w,getToken:()=>k,getTokenValue:()=>u,getTokenOffset:()=>p,getTokenLength:()=>e-p,getTokenStartLine:()=>o,getTokenStartCharacter:()=>p-B,getTokenError:()=>b}}function J(n){return n===32||n===9}function r(n){return n===10||n===13}function L(n){return n>=48&&n<=57}var Q;(function(n){n[n.lineFeed=10]="lineFeed",n[n.carriageReturn=13]="carriageReturn",n[n.space=32]="space",n[n._0=48]="_0",n[n._1=49]="_1",n[n._2=50]="_2",n[n._3=51]="_3",n[n._4=52]="_4",n[n._5=53]="_5",n[n._6=54]="_6",n[n._7=55]="_7",n[n._8=56]="_8",n[n._9=57]="_9",n[n.a=97]="a",n[n.b=98]="b",n[n.c=99]="c",n[n.d=100]="d",n[n.e=101]="e",n[n.f=102]="f",n[n.g=103]="g",n[n.h=104]="h",n[n.i=105]="i",n[n.j=106]="j",n[n.k=107]="k",n[n.l=108]="l",n[n.m=109]="m",n[n.n=110]="n",n[n.o=111]="o",n[n.p=112]="p",n[n.q=113]="q",n[n.r=114]="r",n[n.s=115]="s",n[n.t=116]="t",n[n.u=117]="u",n[n.v=118]="v",n[n.w=119]="w",n[n.x=120]="x",n[n.y=121]="y",n[n.z=122]="z",n[n.A=65]="A",n[n.B=66]="B",n[n.C=67]="C",n[n.D=68]="D",n[n.E=69]="E",n[n.F=70]="F",n[n.G=71]="G",n[n.H=72]="H",n[n.I=73]="I",n[n.J=74]="J",n[n.K=75]="K",n[n.L=76]="L",n[n.M=77]="M",n[n.N=78]="N",n[n.O=79]="O",n[n.P=80]="P",n[n.Q=81]="Q",n[n.R=82]="R",n[n.S=83]="S",n[n.T=84]="T",n[n.U=85]="U",n[n.V=86]="V",n[n.W=87]="W",n[n.X=88]="X",n[n.Y=89]="Y",n[n.Z=90]="Z",n[n.asterisk=42]="asterisk",n[n.backslash=92]="backslash",n[n.closeBrace=125]="closeBrace",n[n.closeBracket=93]="closeBracket",n[n.colon=58]="colon",n[n.comma=44]="comma",n[n.dot=46]="dot",n[n.doubleQuote=34]="doubleQuote",n[n.minus=45]="minus",n[n.openBrace=123]="openBrace",n[n.openBracket=91]="openBracket",n[n.plus=43]="plus",n[n.slash=47]="slash",n[n.formFeed=12]="formFeed",n[n.tab=9]="tab"})(Q||(Q={})),new Array(20).fill(0).map((n,l)=>" ".repeat(l));const N=200;new Array(N).fill(0).map((n,l)=>`
`+" ".repeat(l)),new Array(N).fill(0).map((n,l)=>"\r"+" ".repeat(l)),new Array(N).fill(0).map((n,l)=>`\r
`+" ".repeat(l)),new Array(N).fill(0).map((n,l)=>`
`+"	".repeat(l)),new Array(N).fill(0).map((n,l)=>"\r"+"	".repeat(l)),new Array(N).fill(0).map((n,l)=>`\r
`+"	".repeat(l));var U;(function(n){n.DEFAULT={allowTrailingComma:!1}})(U||(U={}));function S(n,l=[],g=U.DEFAULT){let e=null,u=[];const p=[];function k(o){Array.isArray(u)?u.push(o):e!==null&&(u[e]=o)}return P(n,{onObjectBegin:()=>{const o={};k(o),p.push(u),u=o,e=null},onObjectProperty:o=>{e=o},onObjectEnd:()=>{u=p.pop()},onArrayBegin:()=>{const o=[];k(o),p.push(u),u=o,e=null},onArrayEnd:()=>{u=p.pop()},onLiteralValue:k,onError:(o,O,B)=>{l.push({error:o,offset:O,length:B})}},g),u[0]}function P(n,l,g=U.DEFAULT){const e=$(n,!1),u=[];let p=0;function k(f){return f?()=>p===0&&f(e.getTokenOffset(),e.getTokenLength(),e.getTokenStartLine(),e.getTokenStartCharacter()):()=>!0}function A(f){return f?m=>p===0&&f(m,e.getTokenOffset(),e.getTokenLength(),e.getTokenStartLine(),e.getTokenStartCharacter()):()=>!0}function o(f){return f?m=>p===0&&f(m,e.getTokenOffset(),e.getTokenLength(),e.getTokenStartLine(),e.getTokenStartCharacter(),()=>u.slice()):()=>!0}function O(f){return f?()=>{p>0?p++:f(e.getTokenOffset(),e.getTokenLength(),e.getTokenStartLine(),e.getTokenStartCharacter(),()=>u.slice())===!1&&(p=1)}:()=>!0}function B(f){return f?()=>{p>0&&p--,p===0&&f(e.getTokenOffset(),e.getTokenLength(),e.getTokenStartLine(),e.getTokenStartCharacter())}:()=>!0}const b=O(l.onObjectBegin),I=o(l.onObjectProperty),V=B(l.onObjectEnd),F=O(l.onArrayBegin),a=B(l.onArrayEnd),w=o(l.onLiteralValue),v=A(l.onSeparator),j=k(l.onComment),i=A(l.onError),T=g&&g.disallowComments,s=g&&g.allowTrailingComma;function c(){for(;;){const f=e.scan();switch(e.getTokenError()){case 4:t(14);break;case 5:t(15);break;case 3:t(13);break;case 1:T||t(11);break;case 2:t(12);break;case 6:t(16);break}switch(f){case 12:case 13:T?t(10):j();break;case 16:t(1);break;case 15:case 14:break;default:return f}}}function t(f,m=[],y=[]){if(i(f),m.length+y.length>0){let _=e.getToken();for(;_!==17;){if(m.indexOf(_)!==-1){c();break}else if(y.indexOf(_)!==-1)break;_=c()}}}function D(f){const m=e.getTokenValue();return f?w(m):(I(m),u.push(m)),c(),!0}function G(){switch(e.getToken()){case 11:const f=e.getTokenValue();let m=Number(f);isNaN(m)&&(t(2),m=0),w(m);break;case 7:w(null);break;case 8:w(!0);break;case 9:w(!1);break;default:return!1}return c(),!0}function M(){return e.getToken()!==10?(t(3,[],[2,5]),!1):(D(!1),e.getToken()===6?(v(":"),c(),E()||t(4,[],[2,5])):t(5,[],[2,5]),u.pop(),!0)}function X(){b(),c();let f=!1;for(;e.getToken()!==2&&e.getToken()!==17;){if(e.getToken()===5){if(f||t(4,[],[]),v(","),c(),e.getToken()===2&&s)break}else f&&t(6,[],[]);M()||t(4,[],[2,5]),f=!0}return V(),e.getToken()!==2?t(7,[2],[]):c(),!0}function Y(){F(),c();let f=!0,m=!1;for(;e.getToken()!==4&&e.getToken()!==17;){if(e.getToken()===5){if(m||t(4,[],[]),v(","),c(),e.getToken()===4&&s)break}else m&&t(6,[],[]);f?(u.push(0),f=!1):u[u.length-1]++,E()||t(4,[],[4,5]),m=!0}return a(),f||u.pop(),e.getToken()!==4?t(8,[4],[]):c(),!0}function E(){switch(e.getToken()){case 3:return Y();case 1:return X();case 10:return D(!0);default:return G()}}return c(),e.getToken()===17?g.allowEmptyContent?!0:(t(4,[],[]),!1):E()?(e.getToken()!==17&&t(9,[],[]),!0):(t(4,[],[]),!1)}var W;(function(n){n[n.None=0]="None",n[n.UnexpectedEndOfComment=1]="UnexpectedEndOfComment",n[n.UnexpectedEndOfString=2]="UnexpectedEndOfString",n[n.UnexpectedEndOfNumber=3]="UnexpectedEndOfNumber",n[n.InvalidUnicode=4]="InvalidUnicode",n[n.InvalidEscapeCharacter=5]="InvalidEscapeCharacter",n[n.InvalidCharacter=6]="InvalidCharacter"})(W||(W={}));var H;(function(n){n[n.OpenBraceToken=1]="OpenBraceToken",n[n.CloseBraceToken=2]="CloseBraceToken",n[n.OpenBracketToken=3]="OpenBracketToken",n[n.CloseBracketToken=4]="CloseBracketToken",n[n.CommaToken=5]="CommaToken",n[n.ColonToken=6]="ColonToken",n[n.NullKeyword=7]="NullKeyword",n[n.TrueKeyword=8]="TrueKeyword",n[n.FalseKeyword=9]="FalseKeyword",n[n.StringLiteral=10]="StringLiteral",n[n.NumericLiteral=11]="NumericLiteral",n[n.LineCommentTrivia=12]="LineCommentTrivia",n[n.BlockCommentTrivia=13]="BlockCommentTrivia",n[n.LineBreakTrivia=14]="LineBreakTrivia",n[n.Trivia=15]="Trivia",n[n.Unknown=16]="Unknown",n[n.EOF=17]="EOF"})(H||(H={}));const K=S;var q;(function(n){n[n.InvalidSymbol=1]="InvalidSymbol",n[n.InvalidNumberFormat=2]="InvalidNumberFormat",n[n.PropertyNameExpected=3]="PropertyNameExpected",n[n.ValueExpected=4]="ValueExpected",n[n.ColonExpected=5]="ColonExpected",n[n.CommaExpected=6]="CommaExpected",n[n.CloseBraceExpected=7]="CloseBraceExpected",n[n.CloseBracketExpected=8]="CloseBracketExpected",n[n.EndOfFileExpected=9]="EndOfFileExpected",n[n.InvalidCommentToken=10]="InvalidCommentToken",n[n.UnexpectedEndOfComment=11]="UnexpectedEndOfComment",n[n.UnexpectedEndOfString=12]="UnexpectedEndOfString",n[n.UnexpectedEndOfNumber=13]="UnexpectedEndOfNumber",n[n.InvalidUnicode=14]="InvalidUnicode",n[n.InvalidEscapeCharacter=15]="InvalidEscapeCharacter",n[n.InvalidCharacter=16]="InvalidCharacter"})(q||(q={}));function x(n,l){const g=JSON.parse(n,l?.reviver);return (0,_confbox_DA7CpUDY_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(n,g,l),g}function z(n,l){const g=(0,_confbox_DA7CpUDY_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(n,l),e=JSON.stringify(n,l?.replacer,g.indent);return g.whitespace.start+e+g.whitespace.end}function h(n,l){const g=K(n,l?.errors,l);return (0,_confbox_DA7CpUDY_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(n,g,l),g}function d(n,l){return z(n,l)}


/***/ }),

/***/ 3545:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $Q: () => (/* binding */ defu)
/* harmony export */ });
/* unused harmony exports createDefu, default, defuArrayFn, defuFn */
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const defuArrayFn = createDefu((object, key, currentValue) => {
  if (Array.isArray(object[key]) && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});




/***/ }),

/***/ 2780:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ basename),
/* harmony export */   d: () => (/* binding */ dirname),
/* harmony export */   e: () => (/* binding */ extname),
/* harmony export */   i: () => (/* binding */ isAbsolute),
/* harmony export */   j: () => (/* binding */ join),
/* harmony export */   n: () => (/* binding */ normalize),
/* harmony export */   r: () => (/* binding */ resolve)
/* harmony export */ });
/* unused harmony exports _, a, b, f, g, m, p, s, t */
let _lazyMatch = () => { var __lib__=(()=>{var m=Object.defineProperty,V=Object.getOwnPropertyDescriptor,G=Object.getOwnPropertyNames,T=Object.prototype.hasOwnProperty,q=(r,e)=>{for(var n in e)m(r,n,{get:e[n],enumerable:true});},H=(r,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of G(e))!T.call(r,t)&&t!==n&&m(r,t,{get:()=>e[t],enumerable:!(a=V(e,t))||a.enumerable});return r},J=r=>H(m({},"__esModule",{value:true}),r),w={};q(w,{default:()=>re});var A=r=>Array.isArray(r),d=r=>typeof r=="function",Q=r=>r.length===0,W=r=>typeof r=="number",K=r=>typeof r=="object"&&r!==null,X=r=>r instanceof RegExp,b=r=>typeof r=="string",h=r=>r===void 0,Y=r=>{const e=new Map;return n=>{const a=e.get(n);if(a)return a;const t=r(n);return e.set(n,t),t}},rr=(r,e,n={})=>{const a={cache:{},input:r,index:0,indexMax:0,options:n,output:[]};if(v(e)(a)&&a.index===r.length)return a.output;throw new Error(`Failed to parse at index ${a.indexMax}`)},i=(r,e)=>A(r)?er(r,e):b(r)?ar(r,e):nr(r,e),er=(r,e)=>{const n={};for(const a of r){if(a.length!==1)throw new Error(`Invalid character: "${a}"`);const t=a.charCodeAt(0);n[t]=true;}return a=>{const t=a.index,o=a.input;for(;a.index<o.length&&o.charCodeAt(a.index)in n;)a.index+=1;const u=a.index;if(u>t){if(!h(e)&&!a.options.silent){const s=a.input.slice(t,u),c=d(e)?e(s,o,String(t)):e;h(c)||a.output.push(c);}a.indexMax=Math.max(a.indexMax,a.index);}return  true}},nr=(r,e)=>{const n=r.source,a=r.flags.replace(/y|$/,"y"),t=new RegExp(n,a);return g(o=>{t.lastIndex=o.index;const u=t.exec(o.input);if(u){if(!h(e)&&!o.options.silent){const s=d(e)?e(...u,o.input,String(o.index)):e;h(s)||o.output.push(s);}return o.index+=u[0].length,o.indexMax=Math.max(o.indexMax,o.index),true}else return  false})},ar=(r,e)=>n=>{if(n.input.startsWith(r,n.index)){if(!h(e)&&!n.options.silent){const t=d(e)?e(r,n.input,String(n.index)):e;h(t)||n.output.push(t);}return n.index+=r.length,n.indexMax=Math.max(n.indexMax,n.index),true}else return  false},C=(r,e,n,a)=>{const t=v(r);return g(_(M(o=>{let u=0;for(;u<n;){const s=o.index;if(!t(o)||(u+=1,o.index===s))break}return u>=e})))},tr=(r,e)=>C(r,0,1),f=(r,e)=>C(r,0,1/0),x=(r,e)=>{const n=r.map(v);return g(_(M(a=>{for(let t=0,o=n.length;t<o;t++)if(!n[t](a))return  false;return  true})))},l=(r,e)=>{const n=r.map(v);return g(_(a=>{for(let t=0,o=n.length;t<o;t++)if(n[t](a))return  true;return  false}))},M=(r,e=false)=>{const n=v(r);return a=>{const t=a.index,o=a.output.length,u=n(a);return (!u||e)&&(a.index=t,a.output.length!==o&&(a.output.length=o)),u}},_=(r,e)=>{const n=v(r);return n},g=(()=>{let r=0;return e=>{const n=v(e),a=r+=1;return t=>{var o;if(t.options.memoization===false)return n(t);const u=t.index,s=(o=t.cache)[a]||(o[a]=new Map),c=s.get(u);if(c===false)return  false;if(W(c))return t.index=c,true;if(c)return t.index=c.index,c.output?.length&&t.output.push(...c.output),true;{const Z=t.output.length;if(n(t)){const D=t.index,U=t.output.length;if(U>Z){const ee=t.output.slice(Z,U);s.set(u,{index:D,output:ee});}else s.set(u,D);return  true}else return s.set(u,false),false}}}})(),E=r=>{let e;return n=>(e||(e=v(r())),e(n))},v=Y(r=>{if(d(r))return Q(r)?E(r):r;if(b(r)||X(r))return i(r);if(A(r))return x(r);if(K(r))return l(Object.values(r));throw new Error("Invalid rule")}),P="abcdefghijklmnopqrstuvwxyz",ir=r=>{let e="";for(;r>0;){const n=(r-1)%26;e=P[n]+e,r=Math.floor((r-1)/26);}return e},O=r=>{let e=0;for(let n=0,a=r.length;n<a;n++)e=e*26+P.indexOf(r[n])+1;return e},S=(r,e)=>{if(e<r)return S(e,r);const n=[];for(;r<=e;)n.push(r++);return n},or=(r,e,n)=>S(r,e).map(a=>String(a).padStart(n,"0")),R=(r,e)=>S(O(r),O(e)).map(ir),p=r=>r,z=r=>ur(e=>rr(e,r,{memoization:false}).join("")),ur=r=>{const e={};return n=>e[n]??(e[n]=r(n))},sr=i(/^\*\*\/\*$/,".*"),cr=i(/^\*\*\/(\*)?([ a-zA-Z0-9._-]+)$/,(r,e,n)=>`.*${e?"":"(?:^|/)"}${n.replaceAll(".","\\.")}`),lr=i(/^\*\*\/(\*)?([ a-zA-Z0-9._-]*)\{([ a-zA-Z0-9._-]+(?:,[ a-zA-Z0-9._-]+)*)\}$/,(r,e,n,a)=>`.*${e?"":"(?:^|/)"}${n.replaceAll(".","\\.")}(?:${a.replaceAll(",","|").replaceAll(".","\\.")})`),y=i(/\\./,p),pr=i(/[$.*+?^(){}[\]\|]/,r=>`\\${r}`),vr=i(/./,p),hr=i(/^(?:!!)*!(.*)$/,(r,e)=>`(?!^${L(e)}$).*?`),dr=i(/^(!!)+/,""),fr=l([hr,dr]),xr=i(/\/(\*\*\/)+/,"(?:/.+/|/)"),gr=i(/^(\*\*\/)+/,"(?:^|.*/)"),mr=i(/\/(\*\*)$/,"(?:/.*|$)"),_r=i(/\*\*/,".*"),j=l([xr,gr,mr,_r]),Sr=i(/\*\/(?!\*\*\/)/,"[^/]*/"),yr=i(/\*/,"[^/]*"),N=l([Sr,yr]),k=i("?","[^/]"),$r=i("[",p),wr=i("]",p),Ar=i(/[!^]/,"^/"),br=i(/[a-z]-[a-z]|[0-9]-[0-9]/i,p),Cr=i(/[$.*+?^(){}[\|]/,r=>`\\${r}`),Mr=i(/[^\]]/,p),Er=l([y,Cr,br,Mr]),B=x([$r,tr(Ar),f(Er),wr]),Pr=i("{","(?:"),Or=i("}",")"),Rr=i(/(\d+)\.\.(\d+)/,(r,e,n)=>or(+e,+n,Math.min(e.length,n.length)).join("|")),zr=i(/([a-z]+)\.\.([a-z]+)/,(r,e,n)=>R(e,n).join("|")),jr=i(/([A-Z]+)\.\.([A-Z]+)/,(r,e,n)=>R(e.toLowerCase(),n.toLowerCase()).join("|").toUpperCase()),Nr=l([Rr,zr,jr]),I=x([Pr,Nr,Or]),kr=i("{","(?:"),Br=i("}",")"),Ir=i(",","|"),Fr=i(/[$.*+?^(){[\]\|]/,r=>`\\${r}`),Lr=i(/[^}]/,p),Zr=E(()=>F),Dr=l([j,N,k,B,I,Zr,y,Fr,Ir,Lr]),F=x([kr,f(Dr),Br]),Ur=f(l([sr,cr,lr,fr,j,N,k,B,I,F,y,pr,vr])),Vr=Ur,Gr=z(Vr),L=Gr,Tr=i(/\\./,p),qr=i(/./,p),Hr=i(/\*\*\*+/,"*"),Jr=i(/([^/{[(!])\*\*/,(r,e)=>`${e}*`),Qr=i(/(^|.)\*\*(?=[^*/)\]}])/,(r,e)=>`${e}*`),Wr=f(l([Tr,Hr,Jr,Qr,qr])),Kr=Wr,Xr=z(Kr),Yr=Xr,$=(r,e)=>{const n=Array.isArray(r)?r:[r];if(!n.length)return  false;const a=n.map($.compile),t=n.every(s=>/(\/(?:\*\*)?|\[\/\])$/.test(s)),o=e.replace(/[\\\/]+/g,"/").replace(/\/$/,t?"/":"");return a.some(s=>s.test(o))};$.compile=r=>new RegExp(`^${L(Yr(r))}$`,"s");var re=$;return J(w)})();
 return __lib__.default || __lib__; };
let _match;
const zeptomatch = (path, pattern) => {
  if (!_match) {
    _match = _lazyMatch();
    _lazyMatch = null;
  }
  return _match(path, pattern);
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}

const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;
const _EXTNAME_RE = /.(\.[^./]+|\.)$/;
const _PATH_ROOT_RE = /^[/\\]|^[a-zA-Z]:[/\\]/;
const sep = "/";
const normalize = function(path) {
  if (path.length === 0) {
    return ".";
  }
  path = normalizeWindowsPath(path);
  const isUNCPath = path.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";
  path = normalizeString(path, !isPathAbsolute);
  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }
  if (_DRIVE_LETTER_RE.test(path)) {
    path += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }
  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};
const join = function(...segments) {
  let path = "";
  for (const seg of segments) {
    if (!seg) {
      continue;
    }
    if (path.length > 0) {
      const pathTrailing = path[path.length - 1] === "/";
      const segLeading = seg[0] === "/";
      const both = pathTrailing && segLeading;
      if (both) {
        path += seg.slice(1);
      } else {
        path += pathTrailing || segLeading ? seg : `/${seg}`;
      }
    } else {
      path += seg;
    }
  }
  return normalize(path);
};
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const toNamespacedPath = function(p) {
  return normalizeWindowsPath(p);
};
const extname = function(p) {
  if (p === "..") return "";
  const match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
  return match && match[1] || "";
};
const relative = function(from, to) {
  const _from = resolve(from).replace(_ROOT_FOLDER_RE, "$1").split("/");
  const _to = resolve(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
    return _to.join("/");
  }
  const _fromCopy = [..._from];
  for (const segment of _fromCopy) {
    if (_to[0] !== segment) {
      break;
    }
    _from.shift();
    _to.shift();
  }
  return [..._from.map(() => ".."), ..._to].join("/");
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};
const format = function(p) {
  const ext = p.ext ? p.ext.startsWith(".") ? p.ext : `.${p.ext}` : "";
  const segments = [p.root, p.dir, p.base ?? (p.name ?? "") + ext].filter(
    Boolean
  );
  return normalizeWindowsPath(
    p.root ? resolve(...segments) : segments.join("/")
  );
};
const basename = function(p, extension) {
  const segments = normalizeWindowsPath(p).split("/");
  let lastSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i];
    if (val) {
      lastSegment = val;
      break;
    }
  }
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};
const parse = function(p) {
  const root = _PATH_ROOT_RE.exec(p)?.[0]?.replace(/\\/g, "/") || "";
  const base = basename(p);
  const extension = extname(base);
  return {
    root,
    dir: dirname(p),
    base,
    ext: extension,
    name: base.slice(0, base.length - extension.length)
  };
};
const matchesGlob = (path, pattern) => {
  return zeptomatch(pattern, normalize(path));
};

const _path = {
  __proto__: null,
  basename: basename,
  dirname: dirname,
  extname: extname,
  format: format,
  isAbsolute: isAbsolute,
  join: join,
  matchesGlob: matchesGlob,
  normalize: normalize,
  normalizeString: normalizeString,
  parse: parse,
  relative: relative,
  resolve: resolve,
  sep: sep,
  toNamespacedPath: toNamespacedPath
};




/***/ }),

/***/ 56:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"dotenv","version":"17.2.3","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","pretest":"npm run lint && npm run dts-check","test":"tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000","test:coverage":"tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"homepage":"https://github.com/motdotla/dotenv#readme","funding":"https://dotenvx.com","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@types/node":"^18.11.3","decache":"^4.6.2","sinon":"^14.0.1","standard":"^17.0.0","standard-version":"^9.5.0","tap":"^19.2.0","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}');

/***/ })

};
;