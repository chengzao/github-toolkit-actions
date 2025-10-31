exports.id = 23;
exports.ids = [23];
exports.modules = {

/***/ 4006:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const pico = __webpack_require__(8016);
const utils = __webpack_require__(4059);

function picomatch(glob, options, returnState = false) {
  // default to os.platform()
  if (options && (options.windows === null || options.windows === undefined)) {
    // don't mutate the original options object
    options = { ...options, windows: utils.isWindows() };
  }

  return pico(glob, options, returnState);
}

Object.assign(picomatch, pico);
module.exports = picomatch;


/***/ }),

/***/ 5595:
/***/ ((module) => {

"use strict";


const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;
const SEP = '/';

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR,
  SEP
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
  SEP: '\\'
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    __proto__: null,
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 8265:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const constants = __webpack_require__(5595);
const utils = __webpack_require__(4059);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(opts.windows);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = opts => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index] || '';
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };

  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren') {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.output = (prev.output || prev.value) + tok.value;
      prev.value += tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');
    let rest;

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
        // In this case, we need to parse the string and use it in the output of the original pattern.
        // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
        //
        // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
        const expression = parse(rest, { ...options, fastpaths: false }).output;

        output = token.close = `)${expression})${extglobStar})`;
      }

      if (token.prev.type === 'bos') {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance();
      } else {
        value += advance();
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(opts.windows);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = opts => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 8016:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const scan = __webpack_require__(1781);
const parse = __webpack_require__(8265);
const utils = __webpack_require__(4059);
const constants = __webpack_require__(5595);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = opts.windows;
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(utils.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Compile a regular expression from the `state` object returned by the
 * [parse()](#parse) method.
 *
 * @param {Object} `state`
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
 * @return {RegExp}
 * @api public
 */

picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return state.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${state.output})${append}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }

  return regex;
};

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  let parsed = { negated: false, fastpaths: true };

  if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    parsed.output = parse.fastpaths(input, options);
  }

  if (!parsed.output) {
    parsed = parse(input, options);
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 1781:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const utils = __webpack_require__(4059);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(5595);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let negatedExtglob = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start) {
          negatedExtglob = true;
        }

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;
          break;
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated,
    negatedExtglob
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 4059:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*global navigator*/


const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(5595);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.isWindows = () => {
  if (typeof navigator !== 'undefined' && navigator.platform) {
    const platform = navigator.platform.toLowerCase();
    return platform === 'win32' || platform === 'windows';
  }

  if (typeof process !== 'undefined' && process.platform) {
    return process.platform === 'win32';
  }

  return false;
};

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};

exports.basename = (path, { windows } = {}) => {
  const segs = path.split(windows ? /[\\/]/ : '/');
  const last = segs[segs.length - 1];

  if (last === '') {
    return segs[segs.length - 2];
  }

  return last;
};


/***/ }),

/***/ 9379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = __webpack_require__(356)
const { safeRe: re, t } = __webpack_require__(5471)
const cmp = __webpack_require__(8646)
const debug = __webpack_require__(1159)
const SemVer = __webpack_require__(7163)
const Range = __webpack_require__(6782)


/***/ }),

/***/ 6782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SPACE_CHARACTERS = /\s+/g

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.formatted = undefined
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range.trim().replace(SPACE_CHARACTERS, ' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.formatted = undefined
  }

  get range () {
    if (this.formatted === undefined) {
      this.formatted = ''
      for (let i = 0; i < this.set.length; i++) {
        if (i > 0) {
          this.formatted += '||'
        }
        const comps = this.set[i]
        for (let k = 0; k < comps.length; k++) {
          if (k > 0) {
            this.formatted += ' '
          }
          this.formatted += comps[k].toString().trim()
        }
      }
    }
    return this.formatted
  }

  format () {
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = __webpack_require__(1383)
const cache = new LRU()

const parseOptions = __webpack_require__(356)
const Comparator = __webpack_require__(9379)
const debug = __webpack_require__(1159)
const SemVer = __webpack_require__(7163)
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __webpack_require__(5471)
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __webpack_require__(5101)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  comp = comp.replace(re[t.BUILD], '')
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 7163:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const debug = __webpack_require__(1159)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(5101)
const { safeRe: re, t } = __webpack_require__(5471)

const parseOptions = __webpack_require__(356)
const { compareIdentifiers } = __webpack_require__(3348)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
        version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    if (this.major < other.major) {
      return -1
    }
    if (this.major > other.major) {
      return 1
    }
    if (this.minor < other.minor) {
      return -1
    }
    if (this.minor > other.minor) {
      return 1
    }
    if (this.patch < other.patch) {
      return -1
    }
    if (this.patch > other.patch) {
      return 1
    }
    return 0
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('build compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    if (release.startsWith('pre')) {
      if (!identifier && identifierBase === false) {
        throw new Error('invalid increment argument: identifier is empty')
      }
      // Avoid an invalid semver results
      if (identifier) {
        const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE])
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`)
        }
      }
    }

    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break
      case 'release':
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`)
        }
        this.prerelease.length = 0
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 1799:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const parse = __webpack_require__(6353)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 8646:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const eq = __webpack_require__(5082)
const neq = __webpack_require__(4974)
const gt = __webpack_require__(6599)
const gte = __webpack_require__(1236)
const lt = __webpack_require__(3872)
const lte = __webpack_require__(6717)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 5385:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const parse = __webpack_require__(6353)
const { safeRe: re, t } = __webpack_require__(5471)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL]
    let next
    while ((next = coerceRtlRegex.exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    coerceRtlRegex.lastIndex = -1
  }

  if (match === null) {
    return null
  }

  const major = match[2]
  const minor = match[3] || '0'
  const patch = match[4] || '0'
  const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : ''
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : ''

  return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options)
}
module.exports = coerce


/***/ }),

/***/ 7648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 6874:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 8469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 711:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const parse = __webpack_require__(6353)

const diff = (version1, version2) => {
  const v1 = parse(version1, null, true)
  const v2 = parse(version2, null, true)
  const comparison = v1.compare(v2)

  if (comparison === 0) {
    return null
  }

  const v1Higher = comparison > 0
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length

  if (lowHasPre && !highHasPre) {
    // Going from prerelease -> no prerelease requires some special casing

    // If the low version has only a major, then it will always be a major
    // Some examples:
    // 1.0.0-1 -> 1.0.0
    // 1.0.0-1 -> 1.1.1
    // 1.0.0-1 -> 2.0.0
    if (!lowVersion.patch && !lowVersion.minor) {
      return 'major'
    }

    // If the main part has no difference
    if (lowVersion.compareMain(highVersion) === 0) {
      if (lowVersion.minor && !lowVersion.patch) {
        return 'minor'
      }
      return 'patch'
    }
  }

  // add the `pre` prefix if we are going to a prerelease version
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  // high and low are preleases
  return 'prerelease'
}

module.exports = diff


/***/ }),

/***/ 5082:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 6599:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 1236:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 2338:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 3872:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 6717:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 8511:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 4974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 6353:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse


/***/ }),

/***/ 8756:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 5714:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const parse = __webpack_require__(6353)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 2173:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compare = __webpack_require__(8469)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 7192:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compareBuild = __webpack_require__(7648)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 8011:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Range = __webpack_require__(6782)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 9872:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const compareBuild = __webpack_require__(7648)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 8780:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const parse = __webpack_require__(6353)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 2088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// just pre-load all the stuff that index.js lazily exports
const internalRe = __webpack_require__(5471)
const constants = __webpack_require__(5101)
const SemVer = __webpack_require__(7163)
const identifiers = __webpack_require__(3348)
const parse = __webpack_require__(6353)
const valid = __webpack_require__(8780)
const clean = __webpack_require__(1799)
const inc = __webpack_require__(2338)
const diff = __webpack_require__(711)
const major = __webpack_require__(8511)
const minor = __webpack_require__(2603)
const patch = __webpack_require__(8756)
const prerelease = __webpack_require__(5714)
const compare = __webpack_require__(8469)
const rcompare = __webpack_require__(2173)
const compareLoose = __webpack_require__(6874)
const compareBuild = __webpack_require__(7648)
const sort = __webpack_require__(9872)
const rsort = __webpack_require__(7192)
const gt = __webpack_require__(6599)
const lt = __webpack_require__(3872)
const eq = __webpack_require__(5082)
const neq = __webpack_require__(4974)
const gte = __webpack_require__(1236)
const lte = __webpack_require__(6717)
const cmp = __webpack_require__(8646)
const coerce = __webpack_require__(5385)
const Comparator = __webpack_require__(9379)
const Range = __webpack_require__(6782)
const satisfies = __webpack_require__(8011)
const toComparators = __webpack_require__(4750)
const maxSatisfying = __webpack_require__(5574)
const minSatisfying = __webpack_require__(8595)
const minVersion = __webpack_require__(1866)
const validRange = __webpack_require__(4737)
const outside = __webpack_require__(280)
const gtr = __webpack_require__(2276)
const ltr = __webpack_require__(5213)
const intersects = __webpack_require__(3465)
const simplifyRange = __webpack_require__(2028)
const subset = __webpack_require__(1489)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 5101:
/***/ ((module) => {

"use strict";


// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ 1159:
/***/ ((module) => {

"use strict";


const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 3348:
/***/ ((module) => {

"use strict";


const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b ? 0 : a < b ? -1 : 1
  }

  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 1383:
/***/ ((module) => {

"use strict";


class LRUCache {
  constructor () {
    this.max = 1000
    this.map = new Map()
  }

  get (key) {
    const value = this.map.get(key)
    if (value === undefined) {
      return undefined
    } else {
      // Remove the key from the map and add it to the end
      this.map.delete(key)
      this.map.set(key, value)
      return value
    }
  }

  delete (key) {
    return this.map.delete(key)
  }

  set (key, value) {
    const deleted = this.delete(key)

    if (!deleted && value !== undefined) {
      // If cache is full, delete the least recently used item
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value
        this.delete(firstKey)
      }

      this.map.set(key, value)
    }

    return this
  }
}

module.exports = LRUCache


/***/ }),

/***/ 356:
/***/ ((module) => {

"use strict";


// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ 5471:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __webpack_require__(5101)
const debug = __webpack_require__(1159)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const safeSrc = exports.safeSrc = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  safeSrc[index] = safe
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
// Non-numberic identifiers include numberic identifiers but can be longer.
// Therefore non-numberic identifiers must go first.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NONNUMERICIDENTIFIER]
}|${src[t.NUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NONNUMERICIDENTIFIER]
}|${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`)
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`)
createToken('COERCEFULL', src[t.COERCEPLAIN] +
              `(?:${src[t.PRERELEASE]})?` +
              `(?:${src[t.BUILD]})?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)
createToken('COERCERTLFULL', src[t.COERCEFULL], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 2276:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// Determine if version is greater than all the versions possible in the range.
const outside = __webpack_require__(280)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 3465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Range = __webpack_require__(6782)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects


/***/ }),

/***/ 5213:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const outside = __webpack_require__(280)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 5574:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const Range = __webpack_require__(6782)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 8595:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const Range = __webpack_require__(6782)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 1866:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const Range = __webpack_require__(6782)
const gt = __webpack_require__(6599)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 280:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const SemVer = __webpack_require__(7163)
const Comparator = __webpack_require__(9379)
const { ANY } = Comparator
const Range = __webpack_require__(6782)
const satisfies = __webpack_require__(8011)
const gt = __webpack_require__(6599)
const lt = __webpack_require__(3872)
const lte = __webpack_require__(6717)
const gte = __webpack_require__(1236)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 2028:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __webpack_require__(8011)
const compare = __webpack_require__(8469)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 1489:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Range = __webpack_require__(6782)
const Comparator = __webpack_require__(9379)
const { ANY } = Comparator
const satisfies = __webpack_require__(8011)
const compare = __webpack_require__(8469)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 4750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Range = __webpack_require__(6782)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 4737:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Range = __webpack_require__(6782)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 8319:
/***/ ((module) => {

let e,t,r,{defineProperty:l,setPrototypeOf:n,create:o,keys:s}=Object,i="",{round:c,max:a}=Math,p=e=>{let t=/([a-f\d]{3,6})/i.exec(e)?.[1],r=t?.length,l=parseInt(6^r?3^r?"0":t[0]+t[0]+t[1]+t[1]+t[2]+t[2]:t,16);return[l>>16&255,l>>8&255,255&l]},u=(e,t,r)=>e^t||t^r?16+36*c(e/51)+6*c(t/51)+c(r/51):8>e?16:e>248?231:c(24*(e-8)/247)+232,d=e=>{let t,r,l,n,o;return 8>e?30+e:16>e?e-8+90:(232>e?(o=(e-=16)%36,t=(e/36|0)/5,r=(o/6|0)/5,l=o%6/5):t=r=l=(10*(e-232)+8)/255,n=2*a(t,r,l),n?30+(c(l)<<2|c(r)<<1|c(t))+(2^n?0:60):30)},f=(()=>{let r=e=>o.some((t=>e.test(t))),l=globalThis,n=l.process??{},o=n.argv??[],i=n.env??{},c=-1;try{e=","+s(i).join(",")}catch(e){i={},c=0}let a="FORCE_COLOR",p={false:0,0:0,1:1,2:2,3:3}[i[a]]??-1,u=a in i&&p||r(/^--color=?(true|always)?$/);return u&&(c=p),~c||(c=((r,l,n)=>(t=r.TERM,{"24bit":3,truecolor:3,ansi256:2,ansi:1}[r.COLORTERM]||(r.CI?/,GITHUB/.test(e)?3:1:l&&"dumb"!==t?n?3:/-256/.test(t)?2:1:0)))(i,!!i.PM2_HOME||i.NEXT_RUNTIME?.includes("edge")||!!n.stdout?.isTTY,"win32"===n.platform)),!p||i.NO_COLOR||r(/^--(no-color|color=(false|never))$/)?0:l.window?.chrome||u&&!c?3:c})(),g={open:i,close:i},h=39,b=49,O={},m=({p:e},{open:t,close:l})=>{let o=(e,...r)=>{if(!e){if(t&&t===l)return t;if((e??i)===i)return i}let n,s=e.raw?String.raw({raw:e},...r):i+e,c=o.p,a=c.o,p=c.c;if(s.includes(""))for(;c;c=c.p){let{open:e,close:t}=c,r=t.length,l=i,o=0;if(r)for(;~(n=s.indexOf(t,o));o=n+r)l+=s.slice(o,n)+e;s=l+s.slice(o)}return a+(s.includes("\n")?s.replace(/(\r?\n)/g,p+"$1"+a):s)+p},s=t,c=l;return e&&(s=e.o+t,c=l+e.c),n(o,r),o.p={open:t,close:l,o:s,c,p:e},o.open=s,o.close=c,o};const w=new function e(t=f){let s={Ansis:e,level:t,isSupported:()=>a,strip:e=>e.replace(/[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,i),extend(e){for(let t in e){let r=e[t],l=(typeof r)[0];"s"===l?(c(t,T(...p(r))),c(_(t),v(...p(r)))):c(t,r,"f"===l)}return r=o({},O),n(s,r),s}},c=(e,t,r)=>{O[e]={get(){let n=r?(...e)=>m(this,t(...e)):m(this,t);return l(this,e,{value:n}),n}}},a=t>0,w=(e,t)=>a?{open:`[${e}m`,close:`[${t}m`}:g,y=e=>t=>e(...p(t)),R=(e,t)=>(r,l,n)=>w(`${e}8;2;${r};${l};${n}`,t),$=(e,t)=>(r,l,n)=>w(((e,t,r)=>d(u(e,t,r)))(r,l,n)+e,t),x=e=>(t,r,l)=>e(u(t,r,l)),T=R(3,h),v=R(4,b),C=e=>w("38;5;"+e,h),E=e=>w("48;5;"+e,b);2===t?(T=x(C),v=x(E)):1===t&&(T=$(0,h),v=$(10,b),C=e=>w(d(e),h),E=e=>w(d(e)+10,b));let M,I={fg:C,bg:E,rgb:T,bgRgb:v,hex:y(T),bgHex:y(v),visible:g,reset:w(0,0),bold:w(1,22),dim:w(2,22),italic:w(3,23),underline:w(4,24),inverse:w(7,27),hidden:w(8,28),strikethrough:w(9,29)},_=e=>"bg"+e[0].toUpperCase()+e.slice(1),k="Bright";return"black,red,green,yellow,blue,magenta,cyan,white,gray".split(",").map(((e,t)=>{M=_(e),8>t?(I[e+k]=w(90+t,h),I[M+k]=w(100+t,b)):t=60,I[e]=w(30+t,h),I[M]=w(40+t,b)})),s.extend(I)};module.exports=w,w.default=w;


/***/ }),

/***/ 1404:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  defineConfig: () => (/* reexport */ defineConfig),
  generate: () => (/* reexport */ generate),
  generateMarkdown: () => (/* reexport */ generateMarkdown),
  getCurrentGitBranch: () => (/* reexport */ changelogithub_CY0qmmq7_getCurrentGitBranch),
  getFirstGitCommit: () => (/* reexport */ getFirstGitCommit),
  getGitHubRepo: () => (/* reexport */ getGitHubRepo),
  getGitTags: () => (/* reexport */ getGitTags),
  getLastMatchingTag: () => (/* reexport */ getLastMatchingTag),
  getSafeTagTemplate: () => (/* reexport */ getSafeTagTemplate),
  hasTagOnGitHub: () => (/* reexport */ hasTagOnGitHub),
  isPrerelease: () => (/* reexport */ isPrerelease),
  isRefGitTag: () => (/* reexport */ isRefGitTag),
  isRepoShallow: () => (/* reexport */ isRepoShallow),
  parseCommits: () => (/* reexport */ changelogithub_CY0qmmq7_parseCommits),
  resolveAuthorInfo: () => (/* reexport */ resolveAuthorInfo),
  resolveAuthors: () => (/* reexport */ resolveAuthors),
  resolveConfig: () => (/* reexport */ resolveConfig),
  sendRelease: () => (/* reexport */ sendRelease),
  uploadAssets: () => (/* reexport */ uploadAssets)
});

// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__(3024);
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__(8161);
// EXTERNAL MODULE: ./node_modules/node-fetch-native/dist/node.mjs
var node = __webpack_require__(4522);
// EXTERNAL MODULE: external "node:http"
var external_node_http_ = __webpack_require__(7067);
// EXTERNAL MODULE: external "node:https"
var external_node_https_ = __webpack_require__(4708);
// EXTERNAL MODULE: external "node:zlib"
var external_node_zlib_ = __webpack_require__(8522);
// EXTERNAL MODULE: external "node:stream"
var external_node_stream_ = __webpack_require__(7075);
// EXTERNAL MODULE: external "node:buffer"
var external_node_buffer_ = __webpack_require__(4573);
// EXTERNAL MODULE: external "node:util"
var external_node_util_ = __webpack_require__(7975);
// EXTERNAL MODULE: ./node_modules/node-fetch-native/dist/shared/node-fetch-native.DfbY2q-x.mjs
var node_fetch_native_DfbY2q_x = __webpack_require__(5008);
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__(3136);
// EXTERNAL MODULE: external "node:net"
var external_node_net_ = __webpack_require__(7030);
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__(6760);
;// CONCATENATED MODULE: ./node_modules/node-fetch-native/dist/index.mjs
const o=!!globalThis.process?.env?.FORCE_NODE_FETCH,r=!o&&globalThis.fetch||node/* fetch */.hd,p=!o&&globalThis.Blob||node/* Blob */.YQ,F=!o&&globalThis.File||node/* File */.ZH,h=!o&&globalThis.FormData||node/* FormData */.fS,n=!o&&globalThis.Headers||node/* Headers */.Lr,c=!o&&globalThis.Request||node/* Request */.Kd,R=!o&&globalThis.Response||node/* Response */.YK,T=!o&&globalThis.AbortController||node/* AbortController */.z1;

// EXTERNAL MODULE: external "node:child_process"
var external_node_child_process_ = __webpack_require__(1421);
;// CONCATENATED MODULE: ./node_modules/changelogen/dist/shared/changelogen.a79f5d5c.mjs












function execCommand(cmd, cwd) {
  return (0,external_node_child_process_.execSync)(cmd, { encoding: "utf8", cwd }).trim();
}

async function getLastGitTag() {
  try {
    return execCommand("git describe --tags --abbrev=0")?.split("\n").at(-1);
  } catch {
  }
}
function getCurrentGitBranch() {
  return execCommand("git rev-parse --abbrev-ref HEAD");
}
function getCurrentGitTag() {
  return execCommand("git tag --points-at HEAD");
}
function getCurrentGitRef() {
  return getCurrentGitTag() || getCurrentGitBranch();
}
function getGitRemoteURL(cwd, remote = "origin") {
  return execCommand(`git --work-tree="${cwd}" remote get-url "${remote}"`);
}
async function getCurrentGitStatus() {
  return execCommand("git status --porcelain");
}
async function getGitDiff(from, to = "HEAD") {
  const r = execCommand(
    `git --no-pager log "${from ? `${from}...` : ""}${to}" --pretty="----%n%s|%h|%an|%ae%n%b" --name-status`
  );
  return r.split("----\n").splice(1).map((line) => {
    const [firstLine, ..._body] = line.split("\n");
    const [message, shortHash, authorName, authorEmail] = firstLine.split("|");
    const r2 = {
      message,
      shortHash,
      author: { name: authorName, email: authorEmail },
      body: _body.join("\n")
    };
    return r2;
  });
}
function parseCommits(commits, config) {
  return commits.map((commit) => parseGitCommit(commit, config)).filter(Boolean);
}
const ConventionalCommitRegex = /(?<emoji>:.+:|(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF])|[\u2600-\u2B55])?( *)?(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;
const CoAuthoredByRegex = /co-authored-by:\s*(?<name>.+)(<(?<email>.+)>)/gim;
const PullRequestRE = /\([ a-z]*(#\d+)\s*\)/gm;
const IssueRE = /(#\d+)/gm;
function parseGitCommit(commit, config) {
  const match = commit.message.match(ConventionalCommitRegex);
  if (!match) {
    return null;
  }
  const type = match.groups.type;
  let scope = match.groups.scope || "";
  scope = config.scopeMap[scope] || scope;
  const isBreaking = Boolean(match.groups.breaking);
  let description = match.groups.description;
  const references = [];
  for (const m of description.matchAll(PullRequestRE)) {
    references.push({ type: "pull-request", value: m[1] });
  }
  for (const m of description.matchAll(IssueRE)) {
    if (!references.some((i) => i.value === m[1])) {
      references.push({ type: "issue", value: m[1] });
    }
  }
  references.push({ value: commit.shortHash, type: "hash" });
  description = description.replace(PullRequestRE, "").trim();
  const authors = [commit.author];
  for (const match2 of commit.body.matchAll(CoAuthoredByRegex)) {
    authors.push({
      name: (match2.groups.name || "").trim(),
      email: (match2.groups.email || "").trim()
    });
  }
  return {
    ...commit,
    authors,
    description,
    type,
    scope,
    references,
    isBreaking
  };
}

async function listGithubReleases(config) {
  return await githubFetch(config, `/repos/${config.repo.repo}/releases`, {
    query: { per_page: 100 }
  });
}
async function getGithubReleaseByTag(config, tag) {
  return await githubFetch(
    config,
    `/repos/${config.repo.repo}/releases/tags/${tag}`
  );
}
async function getGithubChangelog(config) {
  return await githubFetch(
    config,
    `https://raw.githubusercontent.com/${config.repo.repo}/main/CHANGELOG.md`
  );
}
async function createGithubRelease(config, body) {
  return await githubFetch(config, `/repos/${config.repo.repo}/releases`, {
    method: "POST",
    body
  });
}
async function updateGithubRelease(config, id, body) {
  return await githubFetch(
    config,
    `/repos/${config.repo.repo}/releases/${id}`,
    {
      method: "PATCH",
      body
    }
  );
}
async function syncGithubRelease(config, release) {
  const currentGhRelease = await getGithubReleaseByTag(
    config,
    `v${release.version}`
  ).catch(() => {
  });
  const ghRelease = {
    tag_name: `v${release.version}`,
    name: `v${release.version}`,
    body: release.body
  };
  if (!config.tokens.github) {
    return {
      status: "manual",
      url: githubNewReleaseURL(config, release)
    };
  }
  try {
    const newGhRelease = await (currentGhRelease ? updateGithubRelease(config, currentGhRelease.id, ghRelease) : createGithubRelease(config, ghRelease));
    return {
      status: currentGhRelease ? "updated" : "created",
      id: newGhRelease.id
    };
  } catch (error) {
    return {
      status: "manual",
      error,
      url: githubNewReleaseURL(config, release)
    };
  }
}
function githubNewReleaseURL(config, release) {
  return `https://${config.repo.domain}/${config.repo.repo}/releases/new?tag=v${release.version}&title=v${release.version}&body=${encodeURIComponent(release.body)}`;
}
async function resolveGithubToken(config) {
  const env = process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (env) {
    return env;
  }
  const configHome = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  const ghCLIPath = join(configHome, "gh", "hosts.yml");
  if (existsSync(ghCLIPath)) {
    const yamlContents = await promises.readFile(ghCLIPath, "utf8");
    const parseYAML = await __webpack_require__.e(/* import() */ 815).then(__webpack_require__.t.bind(__webpack_require__, 8815, 19)).then((r) => r.parse);
    const ghCLIConfig = parseYAML(yamlContents);
    if (ghCLIConfig && ghCLIConfig[config.repo.domain]) {
      return ghCLIConfig["github.com"].oauth_token;
    }
  }
}
async function githubFetch(config, url, opts = {}) {
  return await $fetch(url, {
    ...opts,
    baseURL: config.repo.domain === "github.com" ? "https://api.github.com" : `https://${config.repo.domain}/api/v3`,
    headers: {
      "x-github-api-version": "2022-11-28",
      ...opts.headers,
      authorization: config.tokens.github ? `Bearer ${config.tokens.github}` : void 0
    }
  });
}

const providerToRefSpec = {
  github: { "pull-request": "pull", hash: "commit", issue: "issues" },
  gitlab: { "pull-request": "merge_requests", hash: "commit", issue: "issues" },
  bitbucket: {
    "pull-request": "pull-requests",
    hash: "commit",
    issue: "issues"
  }
};
const providerToDomain = {
  github: "github.com",
  gitlab: "gitlab.com",
  bitbucket: "bitbucket.org"
};
const domainToProvider = {
  "github.com": "github",
  "gitlab.com": "gitlab",
  "bitbucket.org": "bitbucket"
};
const providerURLRegex = /^(?:(?<user>[\w-]+)@)?(?:(?<provider>[^/:]+):)?(?<repo>[\w-]+\/(?:\w|\.(?!git$)|-)+)(?:\.git)?$/;
function baseUrl(config) {
  return `https://${config.domain}/${config.repo}`;
}
function formatReference(ref, repo) {
  if (!repo || !(repo.provider in providerToRefSpec)) {
    return ref.value;
  }
  const refSpec = providerToRefSpec[repo.provider];
  return `[${ref.value}](${baseUrl(repo)}/${refSpec[ref.type]}/${ref.value.replace(/^#/, "")})`;
}
function formatCompareChanges(v, config) {
  const part = config.repo.provider === "bitbucket" ? "branches/compare" : "compare";
  return `[compare changes](${baseUrl(config.repo)}/${part}/${config.from}...${v || config.to})`;
}
async function resolveRepoConfig(cwd) {
  const pkg = await readPackageJSON(cwd).catch(() => {
  });
  if (pkg && pkg.repository) {
    const url = typeof pkg.repository === "string" ? pkg.repository : pkg.repository.url;
    return getRepoConfig(url);
  }
  try {
    const gitRemote = getGitRemoteURL(cwd);
    if (gitRemote) {
      return getRepoConfig(gitRemote);
    }
  } catch {
  }
}
function getRepoConfig(repoUrl = "") {
  let provider;
  let repo;
  let domain;
  let url;
  try {
    url = new URL(repoUrl);
  } catch {
  }
  const m = repoUrl.match(providerURLRegex)?.groups ?? {};
  if (m.repo && m.provider) {
    repo = m.repo;
    provider = m.provider in domainToProvider ? domainToProvider[m.provider] : m.provider;
    domain = provider in providerToDomain ? providerToDomain[provider] : provider;
  } else if (url) {
    domain = url.hostname;
    const paths = url.pathname.split("/");
    repo = paths.slice(1, paths.length).join("/").replace(/\.git$/, "");
    provider = domainToProvider[domain];
  } else if (m.repo) {
    repo = m.repo;
    provider = "github";
    domain = providerToDomain[provider];
  }
  return {
    provider,
    repo,
    domain
  };
}

async function generateMarkDown(commits, config) {
  const typeGroups = groupBy(commits, "type");
  const markdown = [];
  const breakingChanges = [];
  const v = config.newVersion && `v${config.newVersion}`;
  markdown.push("", "## " + (v || `${config.from || ""}...${config.to}`), "");
  if (config.repo && config.from) {
    markdown.push(formatCompareChanges(v, config));
  }
  for (const type in config.types) {
    const group = typeGroups[type];
    if (!group || group.length === 0) {
      continue;
    }
    markdown.push("", "### " + config.types[type].title, "");
    for (const commit of group.reverse()) {
      const line = formatCommit(commit, config);
      markdown.push(line);
      if (commit.isBreaking) {
        breakingChanges.push(line);
      }
    }
  }
  if (breakingChanges.length > 0) {
    markdown.push("", "#### \u26A0\uFE0F Breaking Changes", "", ...breakingChanges);
  }
  const _authors = /* @__PURE__ */ new Map();
  for (const commit of commits) {
    if (!commit.author) {
      continue;
    }
    const name = formatName(commit.author.name);
    if (!name || name.includes("[bot]")) {
      continue;
    }
    if (config.excludeAuthors && config.excludeAuthors.some(
      (v2) => name.includes(v2) || commit.author.email?.includes(v2)
    )) {
      continue;
    }
    if (_authors.has(name)) {
      const entry = _authors.get(name);
      entry.email.add(commit.author.email);
    } else {
      _authors.set(name, { email: /* @__PURE__ */ new Set([commit.author.email]) });
    }
  }
  await Promise.all(
    [..._authors.keys()].map(async (authorName) => {
      const meta = _authors.get(authorName);
      for (const email of meta.email) {
        const { user } = await fetch(`https://ungh.cc/users/find/${email}`).then((r) => r.json()).catch(() => ({ user: null }));
        if (user) {
          meta.github = user.username;
          break;
        }
      }
    })
  );
  const authors = [..._authors.entries()].map((e) => ({ name: e[0], ...e[1] }));
  if (authors.length > 0) {
    markdown.push(
      "",
      "### \u2764\uFE0F Contributors",
      "",
      ...authors.map((i) => {
        const _email = [...i.email].find(
          (e) => !e.includes("noreply.github.com")
        );
        const email = _email ? `<${_email}>` : "";
        const github = i.github ? `([@${i.github}](http://github.com/${i.github}))` : "";
        return `- ${i.name} ${github || email}`;
      })
    );
  }
  return convert(markdown.join("\n").trim(), true);
}
function parseChangelogMarkdown(contents) {
  const headings = [...contents.matchAll(CHANGELOG_RELEASE_HEAD_RE)];
  const releases = [];
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const nextHeading = headings[i + 1];
    const [, title] = heading;
    const version = title.match(VERSION_RE);
    const release = {
      version: version ? version[1] : void 0,
      body: contents.slice(
        heading.index + heading[0].length,
        nextHeading?.index ?? contents.length
      ).trim()
    };
    releases.push(release);
  }
  return {
    releases
  };
}
function formatCommit(commit, config) {
  return "- " + (commit.scope ? `**${commit.scope.trim()}:** ` : "") + (commit.isBreaking ? "\u26A0\uFE0F  " : "") + upperFirst(commit.description) + formatReferences(commit.references, config);
}
function formatReferences(references, config) {
  const pr = references.filter((ref) => ref.type === "pull-request");
  const issue = references.filter((ref) => ref.type === "issue");
  if (pr.length > 0 || issue.length > 0) {
    return " (" + [...pr, ...issue].map((ref) => formatReference(ref, config.repo)).join(", ") + ")";
  }
  if (references.length > 0) {
    return " (" + formatReference(references[0], config.repo) + ")";
  }
  return "";
}
function formatName(name = "") {
  return name.split(" ").map((p) => upperFirst(p.trim())).join(" ");
}
function groupBy(items, key) {
  const groups = {};
  for (const item of items) {
    groups[item[key]] = groups[item[key]] || [];
    groups[item[key]].push(item);
  }
  return groups;
}
const CHANGELOG_RELEASE_HEAD_RE = /^#{2,}\s+.*(v?(\d+\.\d+\.\d+)).*$/gm;
const VERSION_RE = /^v?(\d+\.\d+\.\d+)$/;

const defaultOutput = "CHANGELOG.md";
const getDefaultConfig = () => ({
  types: {
    feat: { title: "\u{1F680} Enhancements", semver: "minor" },
    perf: { title: "\u{1F525} Performance", semver: "patch" },
    fix: { title: "\u{1FA79} Fixes", semver: "patch" },
    refactor: { title: "\u{1F485} Refactors", semver: "patch" },
    docs: { title: "\u{1F4D6} Documentation", semver: "patch" },
    build: { title: "\u{1F4E6} Build", semver: "patch" },
    types: { title: "\u{1F30A} Types", semver: "patch" },
    chore: { title: "\u{1F3E1} Chore" },
    examples: { title: "\u{1F3C0} Examples" },
    test: { title: "\u2705 Tests" },
    style: { title: "\u{1F3A8} Styles" },
    ci: { title: "\u{1F916} CI" }
  },
  cwd: null,
  from: "",
  to: "",
  output: defaultOutput,
  scopeMap: {},
  tokens: {
    github: process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  },
  publish: {
    private: false,
    tag: "latest",
    args: []
  },
  templates: {
    commitMessage: "chore(release): v{{newVersion}}",
    tagMessage: "v{{newVersion}}",
    tagBody: "v{{newVersion}}"
  },
  excludeAuthors: []
});
async function loadChangelogConfig(cwd, overrides) {
  await setupDotenv({ cwd });
  const defaults = getDefaultConfig();
  const { config } = await loadConfig({
    cwd,
    name: "changelog",
    packageJson: true,
    defaults,
    overrides: {
      cwd,
      ...overrides
    }
  });
  return await resolveChangelogConfig(config, cwd);
}
async function resolveChangelogConfig(config, cwd) {
  if (!config.from) {
    config.from = await getLastGitTag();
  }
  if (!config.to) {
    config.to = await getCurrentGitRef();
  }
  if (config.output) {
    config.output = config.output === true ? defaultOutput : resolve(cwd, config.output);
  } else {
    config.output = false;
  }
  if (!config.repo) {
    config.repo = await resolveRepoConfig(cwd);
  }
  if (typeof config.repo === "string") {
    config.repo = getRepoConfig(config.repo);
  }
  return config;
}



// EXTERNAL MODULE: ./node_modules/semver/index.js
var semver = __webpack_require__(2088);
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__(1455);
// EXTERNAL MODULE: ./node_modules/ansis/index.cjs
var ansis = __webpack_require__(8319);
;// CONCATENATED MODULE: ./node_modules/ansis/index.mjs
/* harmony default export */ const node_modules_ansis = ((/* unused pure expression or super */ null && (a)));const{Ansis,fg,bg,rgb,bgRgb,hex,bgHex,reset: ansis_reset,inverse,hidden: ansis_hidden,visible,bold,dim,italic,underline,strikethrough,black,red,green,yellow,blue,magenta,cyan,white,gray,redBright,greenBright,yellowBright,blueBright,magentaBright,cyanBright,whiteBright,bgBlack,bgRed,bgGreen,bgYellow,bgBlue,bgMagenta,bgCyan,bgWhite,bgGray,bgRedBright,bgGreenBright,bgYellowBright,bgBlueBright,bgMagentaBright,bgCyanBright,bgWhiteBright}=ansis;
// EXTERNAL MODULE: ./node_modules/destr/dist/index.mjs
var dist = __webpack_require__(2899);
;// CONCATENATED MODULE: ./node_modules/ufo/dist/index.mjs
const dist_n = /[^\0-\x7E]/;
const t = /[\x2E\u3002\uFF0E\uFF61]/g;
const dist_o = {
  overflow: "Overflow Error",
  "not-basic": "Illegal Input",
  "invalid-input": "Invalid Input"
};
const e = Math.floor;
const dist_r = String.fromCharCode;
function s(n2) {
  throw new RangeError(dist_o[n2]);
}
const dist_c = function(n2, t2) {
  return n2 + 22 + 75 * (n2 < 26) - ((t2 != 0) << 5);
};
const u = function(n2, t2, o2) {
  let r2 = 0;
  for (n2 = o2 ? e(n2 / 700) : n2 >> 1, n2 += e(n2 / t2); n2 > 455; r2 += 36) {
    n2 = e(n2 / 35);
  }
  return e(r2 + 36 * n2 / (n2 + 38));
};
function toASCII(o2) {
  return function(n2, o3) {
    const e2 = n2.split("@");
    let r2 = "";
    e2.length > 1 && (r2 = e2[0] + "@", n2 = e2[1]);
    const s2 = function(n3, t2) {
      const o4 = [];
      let e3 = n3.length;
      for (; e3--; ) {
        o4[e3] = t2(n3[e3]);
      }
      return o4;
    }((n2 = n2.replace(t, ".")).split("."), o3).join(".");
    return r2 + s2;
  }(o2, function(t2) {
    return dist_n.test(t2) ? "xn--" + function(n2) {
      const t3 = [];
      const o3 = (n2 = function(n3) {
        const t4 = [];
        let o4 = 0;
        const e2 = n3.length;
        for (; o4 < e2; ) {
          const r2 = n3.charCodeAt(o4++);
          if (r2 >= 55296 && r2 <= 56319 && o4 < e2) {
            const e3 = n3.charCodeAt(o4++);
            (64512 & e3) == 56320 ? t4.push(((1023 & r2) << 10) + (1023 & e3) + 65536) : (t4.push(r2), o4--);
          } else {
            t4.push(r2);
          }
        }
        return t4;
      }(n2)).length;
      let f = 128;
      let i = 0;
      let l = 72;
      for (const o4 of n2) {
        o4 < 128 && t3.push(dist_r(o4));
      }
      const h = t3.length;
      let p = h;
      for (h && t3.push("-"); p < o3; ) {
        let o4 = 2147483647;
        for (const t4 of n2) {
          t4 >= f && t4 < o4 && (o4 = t4);
        }
        const a = p + 1;
        o4 - f > e((2147483647 - i) / a) && s("overflow"), i += (o4 - f) * a, f = o4;
        for (const o5 of n2) {
          if (o5 < f && ++i > 2147483647 && s("overflow"), o5 == f) {
            let n3 = i;
            for (let o6 = 36; ; o6 += 36) {
              const s2 = o6 <= l ? 1 : o6 >= l + 26 ? 26 : o6 - l;
              if (n3 < s2) {
                break;
              }
              const u2 = n3 - s2;
              const f2 = 36 - s2;
              t3.push(dist_r(dist_c(s2 + u2 % f2, 0))), n3 = e(u2 / f2);
            }
            t3.push(dist_r(dist_c(n3, 0))), l = u(i, a, p == h), i = 0, ++p;
          }
        }
        ++i, ++f;
      }
      return t3.join("");
    }(t2) : t2;
  });
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_CURLY_OPEN_RE = /%7b/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_CURLY_CLOSE_RE = /%7d/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeHash(text) {
  return encode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function encodeHost(name = "") {
  return toASCII(name);
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function isRelative(inputString) {
  return ["./", "../"].some((string_) => inputString.startsWith(string_));
}
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function cleanDoubleSlashes(input = "") {
  return input.split("://").map((string_) => string_.replace(/\/{2,}/g, "/")).join("://");
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function filterQuery(input, predicate) {
  if (!input.includes("?")) {
    return input;
  }
  const parsed = parseURL(input);
  const query = parseQuery(parsed.search);
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([key, value]) => predicate(key, value))
  );
  parsed.search = stringifyQuery(filteredQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}
function withHttp(input) {
  return withProtocol(input, "http://");
}
function withHttps(input) {
  return withProtocol(input, "https://");
}
function withoutProtocol(input) {
  return withProtocol(input, "");
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX);
  if (!match) {
    match = input.match(/^\/{2,}/);
  }
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}
function normalizeURL(input) {
  const parsed = parseURL(input);
  parsed.pathname = encodePath(decodePath(parsed.pathname));
  parsed.hash = encodeHash(decode(parsed.hash));
  parsed.host = encodeHost(decode(parsed.host));
  parsed.search = stringifyQuery(parseQuery(parsed.search));
  return stringifyParsedURL(parsed);
}
function resolveURL(base = "", ...inputs) {
  if (typeof base !== "string") {
    throw new TypeError(
      `URL input should be string received ${typeof base} (${base})`
    );
  }
  const filteredInputs = inputs.filter((input) => isNonEmptyURL(input));
  if (filteredInputs.length === 0) {
    return base;
  }
  const url = parseURL(base);
  for (const inputSegment of filteredInputs) {
    const urlSegment = parseURL(inputSegment);
    if (urlSegment.pathname) {
      url.pathname = withTrailingSlash(url.pathname) + withoutLeadingSlash(urlSegment.pathname);
    }
    if (urlSegment.hash && urlSegment.hash !== "#") {
      url.hash = urlSegment.hash;
    }
    if (urlSegment.search && urlSegment.search !== "?") {
      if (url.search && url.search !== "?") {
        const queryString = stringifyQuery({
          ...parseQuery(url.search),
          ...parseQuery(urlSegment.search)
        });
        url.search = queryString.length > 0 ? "?" + queryString : "";
      } else {
        url.search = urlSegment.search;
      }
    }
  }
  return stringifyParsedURL(url);
}
function isSamePath(p1, p2) {
  return decode(withoutTrailingSlash(p1)) === decode(withoutTrailingSlash(p2));
}
function isEqual(a, b, options = {}) {
  if (!options.trailingSlash) {
    a = withTrailingSlash(a);
    b = withTrailingSlash(b);
  }
  if (!options.leadingSlash) {
    a = withLeadingSlash(a);
    b = withLeadingSlash(b);
  }
  if (!options.encoding) {
    a = decode(a);
    b = decode(b);
  }
  return a === b;
}
function withFragment(input, hash) {
  if (!hash || hash === "#") {
    return input;
  }
  const parsed = parseURL(input);
  parsed.hash = hash === "" ? "" : "#" + encodeHash(hash);
  return stringifyParsedURL(parsed);
}
function withoutFragment(input) {
  return stringifyParsedURL({ ...parseURL(input), hash: "" });
}
function withoutHost(input) {
  const parsed = parseURL(input);
  return (parsed.pathname || "/") + parsed.search + parsed.hash;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function parseAuth(input = "") {
  const [username, password] = input.split(":");
  return {
    username: decode(username),
    password: decode(password)
  };
}
function parseHost(input = "") {
  const [hostname, port] = (input.match(/([^/:]*):?(\d+)?/) || []).splice(1);
  return {
    hostname: decode(hostname),
    port
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}
const FILENAME_STRICT_REGEX = /\/([^/]+\.[^/]+)$/;
const FILENAME_REGEX = /\/([^/]+)$/;
function parseFilename(input = "", opts) {
  const { pathname } = parseURL(input);
  const matches = opts?.strict ? pathname.match(FILENAME_STRICT_REGEX) : pathname.match(FILENAME_REGEX);
  return matches ? matches[1] : void 0;
}

class $URL {
  protocol;
  host;
  auth;
  pathname;
  query = {};
  hash;
  constructor(input = "") {
    if (typeof input !== "string") {
      throw new TypeError(
        `URL input should be string received ${typeof input} (${input})`
      );
    }
    const parsed = parseURL(input);
    this.protocol = decode(parsed.protocol);
    this.host = decode(parsed.host);
    this.auth = decode(parsed.auth);
    this.pathname = decodePath(parsed.pathname);
    this.query = parseQuery(parsed.search);
    this.hash = decode(parsed.hash);
  }
  get hostname() {
    return parseHost(this.host).hostname;
  }
  get port() {
    return parseHost(this.host).port || "";
  }
  get username() {
    return parseAuth(this.auth).username;
  }
  get password() {
    return parseAuth(this.auth).password || "";
  }
  get hasProtocol() {
    return this.protocol.length;
  }
  get isAbsolute() {
    return this.hasProtocol || this.pathname[0] === "/";
  }
  get search() {
    const q = stringifyQuery(this.query);
    return q.length > 0 ? "?" + q : "";
  }
  get searchParams() {
    const p = new URLSearchParams();
    for (const name in this.query) {
      const value = this.query[name];
      if (Array.isArray(value)) {
        for (const v of value) {
          p.append(name, v);
        }
      } else {
        p.append(
          name,
          typeof value === "string" ? value : JSON.stringify(value)
        );
      }
    }
    return p;
  }
  get origin() {
    return (this.protocol ? this.protocol + "//" : "") + encodeHost(this.host);
  }
  get fullpath() {
    return encodePath(this.pathname) + this.search + encodeHash(this.hash);
  }
  get encodedAuth() {
    if (!this.auth) {
      return "";
    }
    const { username, password } = parseAuth(this.auth);
    return encodeURIComponent(username) + (password ? ":" + encodeURIComponent(password) : "");
  }
  get href() {
    const auth = this.encodedAuth;
    const originWithAuth = (this.protocol ? this.protocol + "//" : "") + (auth ? auth + "@" : "") + encodeHost(this.host);
    return this.hasProtocol && this.isAbsolute ? originWithAuth + this.fullpath : this.fullpath;
  }
  append(url) {
    if (url.hasProtocol) {
      throw new Error("Cannot append a URL with protocol");
    }
    Object.assign(this.query, url.query);
    if (url.pathname) {
      this.pathname = withTrailingSlash(this.pathname) + withoutLeadingSlash(url.pathname);
    }
    if (url.hash) {
      this.hash = url.hash;
    }
  }
  toJSON() {
    return this.href;
  }
  toString() {
    return this.href;
  }
}
function createURL(input) {
  return new $URL(input);
}



;// CONCATENATED MODULE: ./node_modules/ofetch/dist/shared/ofetch.DCGFE0NK.mjs



class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        context.options.headers = new Headers(context.options.headers || {});
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || dist/* default */.Ay;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}



;// CONCATENATED MODULE: ./node_modules/ofetch/dist/node.mjs








function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return r;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new external_node_http_.Agent(agentOptions);
  const httpsAgent = new external_node_https_.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return r(input, { ...nodeFetchOptions, ...init });
  };
}
const node_fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers = globalThis.Headers || n;
const AbortController = globalThis.AbortController || T;
const ofetch = createFetch({ fetch: node_fetch, Headers, AbortController });
const node_$fetch = ofetch;



// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(9896);
var external_fs_namespaceObject = /*#__PURE__*/__webpack_require__.t(external_fs_, 2);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(6928);
// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(7016);
// EXTERNAL MODULE: external "module"
var external_module_ = __webpack_require__(3339);
;// CONCATENATED MODULE: ./node_modules/fdir/dist/index.mjs




//#region rolldown:runtime
var __require = /* @__PURE__ */ (0,external_module_.createRequire)(require("url").pathToFileURL(__filename).href);

//#endregion
//#region src/utils.ts
function cleanPath(path) {
	let normalized = (0,external_path_.normalize)(path);
	if (normalized.length > 1 && normalized[normalized.length - 1] === external_path_.sep) normalized = normalized.substring(0, normalized.length - 1);
	return normalized;
}
const SLASHES_REGEX = /[\\/]/g;
function convertSlashes(path, separator) {
	return path.replace(SLASHES_REGEX, separator);
}
const WINDOWS_ROOT_DIR_REGEX = /^[a-z]:[\\/]$/i;
function isRootDirectory(path) {
	return path === "/" || WINDOWS_ROOT_DIR_REGEX.test(path);
}
function normalizePath(path, options) {
	const { resolvePaths, normalizePath: normalizePath$1, pathSeparator } = options;
	const pathNeedsCleaning = process.platform === "win32" && path.includes("/") || path.startsWith(".");
	if (resolvePaths) path = (0,external_path_.resolve)(path);
	if (normalizePath$1 || pathNeedsCleaning) path = cleanPath(path);
	if (path === ".") return "";
	const needsSeperator = path[path.length - 1] !== pathSeparator;
	return convertSlashes(needsSeperator ? path + pathSeparator : path, pathSeparator);
}

//#endregion
//#region src/api/functions/join-path.ts
function joinPathWithBasePath(filename, directoryPath) {
	return directoryPath + filename;
}
function joinPathWithRelativePath(root, options) {
	return function(filename, directoryPath) {
		const sameRoot = directoryPath.startsWith(root);
		if (sameRoot) return directoryPath.slice(root.length) + filename;
		else return convertSlashes((0,external_path_.relative)(root, directoryPath), options.pathSeparator) + options.pathSeparator + filename;
	};
}
function joinPath(filename) {
	return filename;
}
function joinDirectoryPath(filename, directoryPath, separator) {
	return directoryPath + filename + separator;
}
function build$7(root, options) {
	const { relativePaths, includeBasePath } = options;
	return relativePaths && root ? joinPathWithRelativePath(root, options) : includeBasePath ? joinPathWithBasePath : joinPath;
}

//#endregion
//#region src/api/functions/push-directory.ts
function pushDirectoryWithRelativePath(root) {
	return function(directoryPath, paths) {
		paths.push(directoryPath.substring(root.length) || ".");
	};
}
function pushDirectoryFilterWithRelativePath(root) {
	return function(directoryPath, paths, filters) {
		const relativePath = directoryPath.substring(root.length) || ".";
		if (filters.every((filter) => filter(relativePath, true))) paths.push(relativePath);
	};
}
const pushDirectory = (directoryPath, paths) => {
	paths.push(directoryPath || ".");
};
const pushDirectoryFilter = (directoryPath, paths, filters) => {
	const path = directoryPath || ".";
	if (filters.every((filter) => filter(path, true))) paths.push(path);
};
const empty$2 = () => {};
function build$6(root, options) {
	const { includeDirs, filters, relativePaths } = options;
	if (!includeDirs) return empty$2;
	if (relativePaths) return filters && filters.length ? pushDirectoryFilterWithRelativePath(root) : pushDirectoryWithRelativePath(root);
	return filters && filters.length ? pushDirectoryFilter : pushDirectory;
}

//#endregion
//#region src/api/functions/push-file.ts
const pushFileFilterAndCount = (filename, _paths, counts, filters) => {
	if (filters.every((filter) => filter(filename, false))) counts.files++;
};
const pushFileFilter = (filename, paths, _counts, filters) => {
	if (filters.every((filter) => filter(filename, false))) paths.push(filename);
};
const pushFileCount = (_filename, _paths, counts, _filters) => {
	counts.files++;
};
const pushFile = (filename, paths) => {
	paths.push(filename);
};
const empty$1 = () => {};
function build$5(options) {
	const { excludeFiles, filters, onlyCounts } = options;
	if (excludeFiles) return empty$1;
	if (filters && filters.length) return onlyCounts ? pushFileFilterAndCount : pushFileFilter;
	else if (onlyCounts) return pushFileCount;
	else return pushFile;
}

//#endregion
//#region src/api/functions/get-array.ts
const getArray = (paths) => {
	return paths;
};
const getArrayGroup = () => {
	return [""].slice(0, 0);
};
function build$4(options) {
	return options.group ? getArrayGroup : getArray;
}

//#endregion
//#region src/api/functions/group-files.ts
const groupFiles = (groups, directory, files) => {
	groups.push({
		directory,
		files,
		dir: directory
	});
};
const empty = () => {};
function build$3(options) {
	return options.group ? groupFiles : empty;
}

//#endregion
//#region src/api/functions/resolve-symlink.ts
const resolveSymlinksAsync = function(path, state, callback$1) {
	const { queue, fs, options: { suppressErrors } } = state;
	queue.enqueue();
	fs.realpath(path, (error, resolvedPath) => {
		if (error) return queue.dequeue(suppressErrors ? null : error, state);
		fs.stat(resolvedPath, (error$1, stat) => {
			if (error$1) return queue.dequeue(suppressErrors ? null : error$1, state);
			if (stat.isDirectory() && isRecursive(path, resolvedPath, state)) return queue.dequeue(null, state);
			callback$1(stat, resolvedPath);
			queue.dequeue(null, state);
		});
	});
};
const resolveSymlinks = function(path, state, callback$1) {
	const { queue, fs, options: { suppressErrors } } = state;
	queue.enqueue();
	try {
		const resolvedPath = fs.realpathSync(path);
		const stat = fs.statSync(resolvedPath);
		if (stat.isDirectory() && isRecursive(path, resolvedPath, state)) return;
		callback$1(stat, resolvedPath);
	} catch (e) {
		if (!suppressErrors) throw e;
	}
};
function build$2(options, isSynchronous) {
	if (!options.resolveSymlinks || options.excludeSymlinks) return null;
	return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
}
function isRecursive(path, resolved, state) {
	if (state.options.useRealPaths) return isRecursiveUsingRealPaths(resolved, state);
	let parent = (0,external_path_.dirname)(path);
	let depth = 1;
	while (parent !== state.root && depth < 2) {
		const resolvedPath = state.symlinks.get(parent);
		const isSameRoot = !!resolvedPath && (resolvedPath === resolved || resolvedPath.startsWith(resolved) || resolved.startsWith(resolvedPath));
		if (isSameRoot) depth++;
		else parent = (0,external_path_.dirname)(parent);
	}
	state.symlinks.set(path, resolved);
	return depth > 1;
}
function isRecursiveUsingRealPaths(resolved, state) {
	return state.visited.includes(resolved + state.options.pathSeparator);
}

//#endregion
//#region src/api/functions/invoke-callback.ts
const onlyCountsSync = (state) => {
	return state.counts;
};
const groupsSync = (state) => {
	return state.groups;
};
const defaultSync = (state) => {
	return state.paths;
};
const limitFilesSync = (state) => {
	return state.paths.slice(0, state.options.maxFiles);
};
const onlyCountsAsync = (state, error, callback$1) => {
	report(error, callback$1, state.counts, state.options.suppressErrors);
	return null;
};
const defaultAsync = (state, error, callback$1) => {
	report(error, callback$1, state.paths, state.options.suppressErrors);
	return null;
};
const limitFilesAsync = (state, error, callback$1) => {
	report(error, callback$1, state.paths.slice(0, state.options.maxFiles), state.options.suppressErrors);
	return null;
};
const groupsAsync = (state, error, callback$1) => {
	report(error, callback$1, state.groups, state.options.suppressErrors);
	return null;
};
function report(error, callback$1, output, suppressErrors) {
	if (error && !suppressErrors) callback$1(error, output);
	else callback$1(null, output);
}
function build$1(options, isSynchronous) {
	const { onlyCounts, group, maxFiles } = options;
	if (onlyCounts) return isSynchronous ? onlyCountsSync : onlyCountsAsync;
	else if (group) return isSynchronous ? groupsSync : groupsAsync;
	else if (maxFiles) return isSynchronous ? limitFilesSync : limitFilesAsync;
	else return isSynchronous ? defaultSync : defaultAsync;
}

//#endregion
//#region src/api/functions/walk-directory.ts
const readdirOpts = { withFileTypes: true };
const walkAsync = (state, crawlPath, directoryPath, currentDepth, callback$1) => {
	state.queue.enqueue();
	if (currentDepth < 0) return state.queue.dequeue(null, state);
	const { fs } = state;
	state.visited.push(crawlPath);
	state.counts.directories++;
	fs.readdir(crawlPath || ".", readdirOpts, (error, entries = []) => {
		callback$1(entries, directoryPath, currentDepth);
		state.queue.dequeue(state.options.suppressErrors ? null : error, state);
	});
};
const walkSync = (state, crawlPath, directoryPath, currentDepth, callback$1) => {
	const { fs } = state;
	if (currentDepth < 0) return;
	state.visited.push(crawlPath);
	state.counts.directories++;
	let entries = [];
	try {
		entries = fs.readdirSync(crawlPath || ".", readdirOpts);
	} catch (e) {
		if (!state.options.suppressErrors) throw e;
	}
	callback$1(entries, directoryPath, currentDepth);
};
function build(isSynchronous) {
	return isSynchronous ? walkSync : walkAsync;
}

//#endregion
//#region src/api/queue.ts
/**
* This is a custom stateless queue to track concurrent async fs calls.
* It increments a counter whenever a call is queued and decrements it
* as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
*/
var Queue = class {
	count = 0;
	constructor(onQueueEmpty) {
		this.onQueueEmpty = onQueueEmpty;
	}
	enqueue() {
		this.count++;
		return this.count;
	}
	dequeue(error, output) {
		if (this.onQueueEmpty && (--this.count <= 0 || error)) {
			this.onQueueEmpty(error, output);
			if (error) {
				output.controller.abort();
				this.onQueueEmpty = void 0;
			}
		}
	}
};

//#endregion
//#region src/api/counter.ts
var Counter = class {
	_files = 0;
	_directories = 0;
	set files(num) {
		this._files = num;
	}
	get files() {
		return this._files;
	}
	set directories(num) {
		this._directories = num;
	}
	get directories() {
		return this._directories;
	}
	/**
	* @deprecated use `directories` instead
	*/
	/* c8 ignore next 3 */
	get dirs() {
		return this._directories;
	}
};

//#endregion
//#region src/api/aborter.ts
/**
* AbortController is not supported on Node 14 so we use this until we can drop
* support for Node 14.
*/
var Aborter = class {
	aborted = false;
	abort() {
		this.aborted = true;
	}
};

//#endregion
//#region src/api/walker.ts
var Walker = class {
	root;
	isSynchronous;
	state;
	joinPath;
	pushDirectory;
	pushFile;
	getArray;
	groupFiles;
	resolveSymlink;
	walkDirectory;
	callbackInvoker;
	constructor(root, options, callback$1) {
		this.isSynchronous = !callback$1;
		this.callbackInvoker = build$1(options, this.isSynchronous);
		this.root = normalizePath(root, options);
		this.state = {
			root: isRootDirectory(this.root) ? this.root : this.root.slice(0, -1),
			paths: [""].slice(0, 0),
			groups: [],
			counts: new Counter(),
			options,
			queue: new Queue((error, state) => this.callbackInvoker(state, error, callback$1)),
			symlinks: /* @__PURE__ */ new Map(),
			visited: [""].slice(0, 0),
			controller: new Aborter(),
			fs: options.fs || external_fs_namespaceObject
		};
		this.joinPath = build$7(this.root, options);
		this.pushDirectory = build$6(this.root, options);
		this.pushFile = build$5(options);
		this.getArray = build$4(options);
		this.groupFiles = build$3(options);
		this.resolveSymlink = build$2(options, this.isSynchronous);
		this.walkDirectory = build(this.isSynchronous);
	}
	start() {
		this.pushDirectory(this.root, this.state.paths, this.state.options.filters);
		this.walkDirectory(this.state, this.root, this.root, this.state.options.maxDepth, this.walk);
		return this.isSynchronous ? this.callbackInvoker(this.state, null) : null;
	}
	walk = (entries, directoryPath, depth) => {
		const { paths, options: { filters, resolveSymlinks: resolveSymlinks$1, excludeSymlinks, exclude, maxFiles, signal, useRealPaths, pathSeparator }, controller } = this.state;
		if (controller.aborted || signal && signal.aborted || maxFiles && paths.length > maxFiles) return;
		const files = this.getArray(this.state.paths);
		for (let i = 0; i < entries.length; ++i) {
			const entry = entries[i];
			if (entry.isFile() || entry.isSymbolicLink() && !resolveSymlinks$1 && !excludeSymlinks) {
				const filename = this.joinPath(entry.name, directoryPath);
				this.pushFile(filename, files, this.state.counts, filters);
			} else if (entry.isDirectory()) {
				let path = joinDirectoryPath(entry.name, directoryPath, this.state.options.pathSeparator);
				if (exclude && exclude(entry.name, path)) continue;
				this.pushDirectory(path, paths, filters);
				this.walkDirectory(this.state, path, path, depth - 1, this.walk);
			} else if (this.resolveSymlink && entry.isSymbolicLink()) {
				let path = joinPathWithBasePath(entry.name, directoryPath);
				this.resolveSymlink(path, this.state, (stat, resolvedPath) => {
					if (stat.isDirectory()) {
						resolvedPath = normalizePath(resolvedPath, this.state.options);
						if (exclude && exclude(entry.name, useRealPaths ? resolvedPath : path + pathSeparator)) return;
						this.walkDirectory(this.state, resolvedPath, useRealPaths ? resolvedPath : path + pathSeparator, depth - 1, this.walk);
					} else {
						resolvedPath = useRealPaths ? resolvedPath : path;
						const filename = (0,external_path_.basename)(resolvedPath);
						const directoryPath$1 = normalizePath((0,external_path_.dirname)(resolvedPath), this.state.options);
						resolvedPath = this.joinPath(filename, directoryPath$1);
						this.pushFile(resolvedPath, files, this.state.counts, filters);
					}
				});
			}
		}
		this.groupFiles(this.state.groups, directoryPath, files);
	};
};

//#endregion
//#region src/api/async.ts
function promise(root, options) {
	return new Promise((resolve$1, reject) => {
		callback(root, options, (err, output) => {
			if (err) return reject(err);
			resolve$1(output);
		});
	});
}
function callback(root, options, callback$1) {
	let walker = new Walker(root, options, callback$1);
	walker.start();
}

//#endregion
//#region src/api/sync.ts
function sync(root, options) {
	const walker = new Walker(root, options);
	return walker.start();
}

//#endregion
//#region src/builder/api-builder.ts
var APIBuilder = class {
	constructor(root, options) {
		this.root = root;
		this.options = options;
	}
	withPromise() {
		return promise(this.root, this.options);
	}
	withCallback(cb) {
		callback(this.root, this.options, cb);
	}
	sync() {
		return sync(this.root, this.options);
	}
};

//#endregion
//#region src/builder/index.ts
let pm = null;
/* c8 ignore next 6 */
try {
	__require.resolve("picomatch");
	pm = __require("picomatch");
} catch {}
var Builder = class {
	globCache = {};
	options = {
		maxDepth: Infinity,
		suppressErrors: true,
		pathSeparator: external_path_.sep,
		filters: []
	};
	globFunction;
	constructor(options) {
		this.options = {
			...this.options,
			...options
		};
		this.globFunction = this.options.globFunction;
	}
	group() {
		this.options.group = true;
		return this;
	}
	withPathSeparator(separator) {
		this.options.pathSeparator = separator;
		return this;
	}
	withBasePath() {
		this.options.includeBasePath = true;
		return this;
	}
	withRelativePaths() {
		this.options.relativePaths = true;
		return this;
	}
	withDirs() {
		this.options.includeDirs = true;
		return this;
	}
	withMaxDepth(depth) {
		this.options.maxDepth = depth;
		return this;
	}
	withMaxFiles(limit) {
		this.options.maxFiles = limit;
		return this;
	}
	withFullPaths() {
		this.options.resolvePaths = true;
		this.options.includeBasePath = true;
		return this;
	}
	withErrors() {
		this.options.suppressErrors = false;
		return this;
	}
	withSymlinks({ resolvePaths = true } = {}) {
		this.options.resolveSymlinks = true;
		this.options.useRealPaths = resolvePaths;
		return this.withFullPaths();
	}
	withAbortSignal(signal) {
		this.options.signal = signal;
		return this;
	}
	normalize() {
		this.options.normalizePath = true;
		return this;
	}
	filter(predicate) {
		this.options.filters.push(predicate);
		return this;
	}
	onlyDirs() {
		this.options.excludeFiles = true;
		this.options.includeDirs = true;
		return this;
	}
	exclude(predicate) {
		this.options.exclude = predicate;
		return this;
	}
	onlyCounts() {
		this.options.onlyCounts = true;
		return this;
	}
	crawl(root) {
		return new APIBuilder(root || ".", this.options);
	}
	withGlobFunction(fn) {
		this.globFunction = fn;
		return this;
	}
	/**
	* @deprecated Pass options using the constructor instead:
	* ```ts
	* new fdir(options).crawl("/path/to/root");
	* ```
	* This method will be removed in v7.0
	*/
	/* c8 ignore next 4 */
	crawlWithOptions(root, options) {
		this.options = {
			...this.options,
			...options
		};
		return new APIBuilder(root || ".", this.options);
	}
	glob(...patterns) {
		if (this.globFunction) return this.globWithOptions(patterns);
		return this.globWithOptions(patterns, ...[{ dot: true }]);
	}
	globWithOptions(patterns, ...options) {
		const globFn = this.globFunction || pm;
		/* c8 ignore next 5 */
		if (!globFn) throw new Error("Please specify a glob function to use glob matching.");
		var isMatch = this.globCache[patterns.join("\0")];
		if (!isMatch) {
			isMatch = globFn(patterns, ...options);
			this.globCache[patterns.join("\0")] = isMatch;
		}
		this.options.filters.push((path) => isMatch(path));
		return this;
	}
};

//#endregion

// EXTERNAL MODULE: ./node_modules/picomatch/index.js
var picomatch = __webpack_require__(4006);
;// CONCATENATED MODULE: ./node_modules/tinyglobby/dist/index.mjs






//#region src/utils.ts
const isReadonlyArray = Array.isArray;
const isWin = process.platform === "win32";
const ONLY_PARENT_DIRECTORIES = /^(\/?\.\.)+$/;
function getPartialMatcher(patterns, options = {}) {
	const patternsCount = patterns.length;
	const patternsParts = Array(patternsCount);
	const matchers = Array(patternsCount);
	const globstarEnabled = !options.noglobstar;
	for (let i = 0; i < patternsCount; i++) {
		const parts = splitPattern(patterns[i]);
		patternsParts[i] = parts;
		const partsCount = parts.length;
		const partMatchers = Array(partsCount);
		for (let j = 0; j < partsCount; j++) partMatchers[j] = picomatch(parts[j], options);
		matchers[i] = partMatchers;
	}
	return (input) => {
		const inputParts = input.split("/");
		if (inputParts[0] === ".." && ONLY_PARENT_DIRECTORIES.test(input)) return true;
		for (let i = 0; i < patterns.length; i++) {
			const patternParts = patternsParts[i];
			const matcher = matchers[i];
			const inputPatternCount = inputParts.length;
			const minParts = Math.min(inputPatternCount, patternParts.length);
			let j = 0;
			while (j < minParts) {
				const part = patternParts[j];
				if (part.includes("/")) return true;
				const match = matcher[j](inputParts[j]);
				if (!match) break;
				if (globstarEnabled && part === "**") return true;
				j++;
			}
			if (j === inputPatternCount) return true;
		}
		return false;
	};
}
/* node:coverage ignore next 2 */
const WIN32_ROOT_DIR = /^[A-Z]:\/$/i;
const isRoot = isWin ? (p) => WIN32_ROOT_DIR.test(p) : (p) => p === "/";
function buildFormat(cwd, root, absolute) {
	if (cwd === root || root.startsWith(`${cwd}/`)) {
		if (absolute) {
			const start = isRoot(cwd) ? cwd.length : cwd.length + 1;
			return (p, isDir) => p.slice(start, isDir ? -1 : void 0) || ".";
		}
		const prefix = root.slice(cwd.length + 1);
		if (prefix) return (p, isDir) => {
			if (p === ".") return prefix;
			const result = `${prefix}/${p}`;
			return isDir ? result.slice(0, -1) : result;
		};
		return (p, isDir) => isDir && p !== "." ? p.slice(0, -1) : p;
	}
	if (absolute) return (p) => external_path_.posix.relative(cwd, p) || ".";
	return (p) => external_path_.posix.relative(cwd, `${root}/${p}`) || ".";
}
function buildRelative(cwd, root) {
	if (root.startsWith(`${cwd}/`)) {
		const prefix = root.slice(cwd.length + 1);
		return (p) => `${prefix}/${p}`;
	}
	return (p) => {
		const result = external_path_.posix.relative(cwd, `${root}/${p}`);
		if (p.endsWith("/") && result !== "") return `${result}/`;
		return result || ".";
	};
}
const splitPatternOptions = { parts: true };
function splitPattern(path$1) {
	var _result$parts;
	const result = picomatch.scan(path$1, splitPatternOptions);
	return ((_result$parts = result.parts) === null || _result$parts === void 0 ? void 0 : _result$parts.length) ? result.parts : [path$1];
}
const ESCAPED_WIN32_BACKSLASHES = /\\(?![()[\]{}!+@])/g;
function convertPosixPathToPattern(path$1) {
	return escapePosixPath(path$1);
}
function convertWin32PathToPattern(path$1) {
	return escapeWin32Path(path$1).replace(ESCAPED_WIN32_BACKSLASHES, "/");
}
/**
* Converts a path to a pattern depending on the platform.
* Identical to {@link escapePath} on POSIX systems.
* @see {@link https://superchupu.dev/tinyglobby/documentation#convertPathToPattern}
*/
/* node:coverage ignore next 3 */
const convertPathToPattern = (/* unused pure expression or super */ null && (isWin ? convertWin32PathToPattern : convertPosixPathToPattern));
const POSIX_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}*?|]|^!|[!+@](?=\()|\\(?![()[\]{}!*+?@|]))/g;
const WIN32_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}]|^!|[!+@](?=\())/g;
const escapePosixPath = (path$1) => path$1.replace(POSIX_UNESCAPED_GLOB_SYMBOLS, "\\$&");
const escapeWin32Path = (path$1) => path$1.replace(WIN32_UNESCAPED_GLOB_SYMBOLS, "\\$&");
/**
* Escapes a path's special characters depending on the platform.
* @see {@link https://superchupu.dev/tinyglobby/documentation#escapePath}
*/
/* node:coverage ignore next */
const escapePath = isWin ? escapeWin32Path : escapePosixPath;
/**
* Checks if a pattern has dynamic parts.
*
* Has a few minor differences with [`fast-glob`](https://github.com/mrmlnc/fast-glob) for better accuracy:
*
* - Doesn't necessarily return `false` on patterns that include `\`.
* - Returns `true` if the pattern includes parentheses, regardless of them representing one single pattern or not.
* - Returns `true` for unfinished glob extensions i.e. `(h`, `+(h`.
* - Returns `true` for unfinished brace expansions as long as they include `,` or `..`.
*
* @see {@link https://superchupu.dev/tinyglobby/documentation#isDynamicPattern}
*/
function isDynamicPattern(pattern, options) {
	if ((options === null || options === void 0 ? void 0 : options.caseSensitiveMatch) === false) return true;
	const scan = picomatch.scan(pattern);
	return scan.isGlob || scan.negated;
}
function log(...tasks) {
	console.log(`[tinyglobby ${(/* @__PURE__ */ new Date()).toLocaleTimeString("es")}]`, ...tasks);
}

//#endregion
//#region src/index.ts
const PARENT_DIRECTORY = /^(\/?\.\.)+/;
const ESCAPING_BACKSLASHES = /\\(?=[()[\]{}!*+?@|])/g;
const BACKSLASHES = /\\/g;
function normalizePattern(pattern, expandDirectories, cwd, props, isIgnore) {
	let result = pattern;
	if (pattern.endsWith("/")) result = pattern.slice(0, -1);
	if (!result.endsWith("*") && expandDirectories) result += "/**";
	const escapedCwd = escapePath(cwd);
	if (external_path_.isAbsolute(result.replace(ESCAPING_BACKSLASHES, ""))) result = external_path_.posix.relative(escapedCwd, result);
	else result = external_path_.posix.normalize(result);
	const parentDirectoryMatch = PARENT_DIRECTORY.exec(result);
	const parts = splitPattern(result);
	if (parentDirectoryMatch === null || parentDirectoryMatch === void 0 ? void 0 : parentDirectoryMatch[0]) {
		const n = (parentDirectoryMatch[0].length + 1) / 3;
		let i = 0;
		const cwdParts = escapedCwd.split("/");
		while (i < n && parts[i + n] === cwdParts[cwdParts.length + i - n]) {
			result = result.slice(0, (n - i - 1) * 3) + result.slice((n - i) * 3 + parts[i + n].length + 1) || ".";
			i++;
		}
		const potentialRoot = external_path_.posix.join(cwd, parentDirectoryMatch[0].slice(i * 3));
		if (!potentialRoot.startsWith(".") && props.root.length > potentialRoot.length) {
			props.root = potentialRoot;
			props.depthOffset = -n + i;
		}
	}
	if (!isIgnore && props.depthOffset >= 0) {
		var _props$commonPath;
		(_props$commonPath = props.commonPath) !== null && _props$commonPath !== void 0 || (props.commonPath = parts);
		const newCommonPath = [];
		const length = Math.min(props.commonPath.length, parts.length);
		for (let i = 0; i < length; i++) {
			const part = parts[i];
			if (part === "**" && !parts[i + 1]) {
				newCommonPath.pop();
				break;
			}
			if (part !== props.commonPath[i] || isDynamicPattern(part) || i === parts.length - 1) break;
			newCommonPath.push(part);
		}
		props.depthOffset = newCommonPath.length;
		props.commonPath = newCommonPath;
		props.root = newCommonPath.length > 0 ? external_path_.posix.join(cwd, ...newCommonPath) : cwd;
	}
	return result;
}
function processPatterns({ patterns = ["**/*"], ignore = [], expandDirectories = true }, cwd, props) {
	if (typeof patterns === "string") patterns = [patterns];
	if (typeof ignore === "string") ignore = [ignore];
	const matchPatterns = [];
	const ignorePatterns = [];
	for (const pattern of ignore) {
		if (!pattern) continue;
		if (pattern[0] !== "!" || pattern[1] === "(") ignorePatterns.push(normalizePattern(pattern, expandDirectories, cwd, props, true));
	}
	for (const pattern of patterns) {
		if (!pattern) continue;
		if (pattern[0] !== "!" || pattern[1] === "(") matchPatterns.push(normalizePattern(pattern, expandDirectories, cwd, props, false));
		else if (pattern[1] !== "!" || pattern[2] === "(") ignorePatterns.push(normalizePattern(pattern.slice(1), expandDirectories, cwd, props, true));
	}
	return {
		match: matchPatterns,
		ignore: ignorePatterns
	};
}
function formatPaths(paths, relative) {
	for (let i = paths.length - 1; i >= 0; i--) {
		const path$1 = paths[i];
		paths[i] = relative(path$1);
	}
	return paths;
}
function normalizeCwd(cwd) {
	if (!cwd) return process.cwd().replace(BACKSLASHES, "/");
	if (cwd instanceof URL) return (0,external_url_.fileURLToPath)(cwd).replace(BACKSLASHES, "/");
	return external_path_.resolve(cwd).replace(BACKSLASHES, "/");
}
function getCrawler(patterns, inputOptions = {}) {
	const options = process.env.TINYGLOBBY_DEBUG ? {
		...inputOptions,
		debug: true
	} : inputOptions;
	const cwd = normalizeCwd(options.cwd);
	if (options.debug) log("globbing with:", {
		patterns,
		options,
		cwd
	});
	if (Array.isArray(patterns) && patterns.length === 0) return [{
		sync: () => [],
		withPromise: async () => []
	}, false];
	const props = {
		root: cwd,
		commonPath: null,
		depthOffset: 0
	};
	const processed = processPatterns({
		...options,
		patterns
	}, cwd, props);
	if (options.debug) log("internal processing patterns:", processed);
	const matchOptions = {
		dot: options.dot,
		nobrace: options.braceExpansion === false,
		nocase: options.caseSensitiveMatch === false,
		noextglob: options.extglob === false,
		noglobstar: options.globstar === false,
		posix: true
	};
	const matcher = picomatch(processed.match, {
		...matchOptions,
		ignore: processed.ignore
	});
	const ignore = picomatch(processed.ignore, matchOptions);
	const partialMatcher = getPartialMatcher(processed.match, matchOptions);
	const format = buildFormat(cwd, props.root, options.absolute);
	const formatExclude = options.absolute ? format : buildFormat(cwd, props.root, true);
	const fdirOptions = {
		filters: [options.debug ? (p, isDirectory) => {
			const path$1 = format(p, isDirectory);
			const matches = matcher(path$1);
			if (matches) log(`matched ${path$1}`);
			return matches;
		} : (p, isDirectory) => matcher(format(p, isDirectory))],
		exclude: options.debug ? (_, p) => {
			const relativePath = formatExclude(p, true);
			const skipped = relativePath !== "." && !partialMatcher(relativePath) || ignore(relativePath);
			if (skipped) log(`skipped ${p}`);
			else log(`crawling ${p}`);
			return skipped;
		} : (_, p) => {
			const relativePath = formatExclude(p, true);
			return relativePath !== "." && !partialMatcher(relativePath) || ignore(relativePath);
		},
		fs: options.fs ? {
			readdir: options.fs.readdir || external_fs_.readdir,
			readdirSync: options.fs.readdirSync || external_fs_.readdirSync,
			realpath: options.fs.realpath || external_fs_.realpath,
			realpathSync: options.fs.realpathSync || external_fs_.realpathSync,
			stat: options.fs.stat || external_fs_.stat,
			statSync: options.fs.statSync || external_fs_.statSync
		} : void 0,
		pathSeparator: "/",
		relativePaths: true,
		resolveSymlinks: true,
		signal: options.signal
	};
	if (options.deep !== void 0) fdirOptions.maxDepth = Math.round(options.deep - props.depthOffset);
	if (options.absolute) {
		fdirOptions.relativePaths = false;
		fdirOptions.resolvePaths = true;
		fdirOptions.includeBasePath = true;
	}
	if (options.followSymbolicLinks === false) {
		fdirOptions.resolveSymlinks = false;
		fdirOptions.excludeSymlinks = true;
	}
	if (options.onlyDirectories) {
		fdirOptions.excludeFiles = true;
		fdirOptions.includeDirs = true;
	} else if (options.onlyFiles === false) fdirOptions.includeDirs = true;
	props.root = props.root.replace(BACKSLASHES, "");
	const root = props.root;
	if (options.debug) log("internal properties:", props);
	const relative = cwd !== root && !options.absolute && buildRelative(cwd, props.root);
	return [new Builder(fdirOptions).crawl(root), relative];
}
async function glob(patternsOrOptions, options) {
	if (patternsOrOptions && (options === null || options === void 0 ? void 0 : options.patterns)) throw new Error("Cannot pass patterns as both an argument and an option");
	const isModern = isReadonlyArray(patternsOrOptions) || typeof patternsOrOptions === "string";
	const opts = isModern ? options : patternsOrOptions;
	const patterns = isModern ? patternsOrOptions : patternsOrOptions.patterns;
	const [crawler, relative] = getCrawler(patterns, opts);
	if (!relative) return crawler.withPromise();
	return formatPaths(await crawler.withPromise(), relative);
}
function globSync(patternsOrOptions, options) {
	if (patternsOrOptions && (options === null || options === void 0 ? void 0 : options.patterns)) throw new Error("Cannot pass patterns as both an argument and an option");
	const isModern = isReadonlyArray(patternsOrOptions) || typeof patternsOrOptions === "string";
	const opts = isModern ? options : patternsOrOptions;
	const patterns = isModern ? patternsOrOptions : patternsOrOptions.patterns;
	const [crawler, relative] = getCrawler(patterns, opts);
	if (!relative) return crawler.sync();
	return formatPaths(crawler.sync(), relative);
}

//#endregion

;// CONCATENATED MODULE: ./node_modules/convert-gitmoji/dist/index.mjs
const gitmojis = {
  ":art:": "\u{1F3A8}",
  ":zap:": "\u26A1\uFE0F",
  ":fire:": "\u{1F525}",
  ":bug:": "\u{1F41B}",
  ":ambulance:": "\u{1F691}\uFE0F",
  ":sparkles:": "\u2728",
  ":memo:": "\u{1F4DD}",
  ":rocket:": "\u{1F680}",
  ":lipstick:": "\u{1F484}",
  ":tada:": "\u{1F389}",
  ":white_check_mark:": "\u2705",
  ":lock:": "\u{1F512}\uFE0F",
  ":closed_lock_with_key:": "\u{1F510}",
  ":bookmark:": "\u{1F516}",
  ":rotating_light:": "\u{1F6A8}",
  ":construction:": "\u{1F6A7}",
  ":green_heart:": "\u{1F49A}",
  ":arrow_down:": "\u2B07\uFE0F",
  ":arrow_up:": "\u2B06\uFE0F",
  ":pushpin:": "\u{1F4CC}",
  ":construction_worker:": "\u{1F477}",
  ":chart_with_upwards_trend:": "\u{1F4C8}",
  ":recycle:": "\u267B\uFE0F",
  ":heavy_plus_sign:": "\u2795",
  ":heavy_minus_sign:": "\u2796",
  ":wrench:": "\u{1F527}",
  ":hammer:": "\u{1F528}",
  ":globe_with_meridians:": "\u{1F310}",
  ":pencil2:": "\u270F\uFE0F",
  ":pencil:": "\u270F\uFE0F",
  ":poop:": "\u{1F4A9}",
  ":rewind:": "\u23EA\uFE0F",
  ":twisted_rightwards_arrows:": "\u{1F500}",
  ":package:": "\u{1F4E6}\uFE0F",
  ":alien:": "\u{1F47D}\uFE0F",
  ":truck:": "\u{1F69A}",
  ":page_facing_up:": "\u{1F4C4}",
  ":boom:": "\u{1F4A5}",
  ":bento:": "\u{1F371}",
  ":wheelchair:": "\u267F\uFE0F",
  ":bulb:": "\u{1F4A1}",
  ":beers:": "\u{1F37B}",
  ":speech_balloon:": "\u{1F4AC}",
  ":card_file_box:": "\u{1F5C3}\uFE0F",
  ":loud_sound:": "\u{1F50A}",
  ":mute:": "\u{1F507}",
  ":busts_in_silhouette:": "\u{1F465}",
  ":children_crossing:": "\u{1F6B8}",
  ":building_construction:": "\u{1F3D7}\uFE0F",
  ":iphone:": "\u{1F4F1}",
  ":clown_face:": "\u{1F921}",
  ":egg:": "\u{1F95A}",
  ":see_no_evil:": "\u{1F648}",
  ":camera_flash:": "\u{1F4F8}",
  ":alembic:": "\u2697\uFE0F",
  ":mag:": "\u{1F50D}\uFE0F",
  ":label:": "\u{1F3F7}\uFE0F",
  ":seedling:": "\u{1F331}",
  ":triangular_flag_on_post:": "\u{1F6A9}",
  ":goal_net:": "\u{1F945}",
  ":dizzy:": "\u{1F4AB}",
  ":wastebasket:": "\u{1F5D1}\uFE0F",
  ":passport_control:": "\u{1F6C2}",
  ":adhesive_bandage:": "\u{1FA79}",
  ":monocle_face:": "\u{1F9D0}",
  ":coffin:": "\u26B0\uFE0F",
  ":test_tube:": "\u{1F9EA}",
  ":necktie:": "\u{1F454}",
  ":stethoscope:": "\u{1FA7A}",
  ":bricks:": "\u{1F9F1}",
  ":technologist:": "\u{1F9D1}\u200D\u{1F4BB}",
  ":money_with_wings:": "\u{1F4B8}",
  ":thread:": "\u{1F9F5}",
  ":safety_vest:": "\u{1F9BA}"
};
function dist_convert(content, withSpace) {
  const re = new RegExp(Object.keys(gitmojis).join("|"), "gi");
  return content.replace(re, function(matched) {
    switch (withSpace) {
      case true:
      case "trailing":
        return `${gitmojis[matched.toLowerCase()]} `;
      case "leading":
        return ` ${gitmojis[matched.toLowerCase()]}`;
      case "both":
        return ` ${gitmojis[matched.toLowerCase()]} `;
      default:
        return gitmojis[matched.toLowerCase()];
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/changelogithub/dist/shared/changelogithub.CY0qmmq7.mjs









async function getGitHubRepo(baseUrl) {
  const url = await changelogithub_CY0qmmq7_execCommand("git", ["config", "--get", "remote.origin.url"]);
  const escapedBaseUrl = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escapedBaseUrl}[/:]([\\w\\d._-]+?)\\/([\\w\\d._-]+?)(\\.git)?$`, "i");
  const match = regex.exec(url);
  if (!match)
    throw new Error(`Can not parse GitHub repo from url ${url}`);
  return `${match[1]}/${match[2]}`;
}
async function changelogithub_CY0qmmq7_getCurrentGitBranch() {
  return await changelogithub_CY0qmmq7_execCommand("git", ["tag", "--points-at", "HEAD"]) || await changelogithub_CY0qmmq7_execCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
}
async function isRepoShallow() {
  return (await changelogithub_CY0qmmq7_execCommand("git", ["rev-parse", "--is-shallow-repository"])).trim() === "true";
}
function getSafeTagTemplate(template) {
  return template.includes("%s") ? template : `${template}%s`;
}
function getVersionString(template, tag) {
  const pattern = template.replace(/%s/g, "(.+)");
  const regex = new RegExp(`^${pattern}$`);
  const match = regex.exec(tag);
  return match ? match[1] : tag;
}
async function getGitTags() {
  const output = await changelogithub_CY0qmmq7_execCommand("git", [
    "log",
    "--simplify-by-decoration",
    '--pretty=format:"%d"'
  ]);
  const tagRegex = /tag: ([^,)]+)/g;
  const tagList = [];
  let match;
  while (match !== null) {
    const tag = match?.[1].trim();
    if (tag) {
      tagList.push(tag);
    }
    match = tagRegex.exec(output);
  }
  return tagList;
}
async function getLastMatchingTag(inputTag, tagFilter, tagTemplate) {
  const inputVersionString = getVersionString(tagTemplate, inputTag);
  const isVersion = semver.valid(inputVersionString) !== null;
  const isPrerelease2 = semver.prerelease(inputVersionString) !== null;
  const tags = await getGitTags();
  const filteredTags = tags.filter(tagFilter);
  let tag;
  if (!isPrerelease2 && isVersion) {
    tag = filteredTags.find((tag2) => {
      const versionString = getVersionString(tagTemplate, tag2);
      return versionString !== inputVersionString && semver.valid(versionString) !== null && semver.prerelease(versionString) === null;
    });
  }
  tag ||= filteredTags.find((tag2) => tag2 !== inputTag);
  return tag;
}
async function isRefGitTag(to) {
  const { execa } = await __webpack_require__.e(/* import() */ 993).then(__webpack_require__.bind(__webpack_require__, 6993));
  try {
    await execa("git", ["show-ref", "--verify", `refs/tags/${to}`], { reject: true });
  } catch {
    return false;
  }
}
async function getFirstGitCommit() {
  return await changelogithub_CY0qmmq7_execCommand("git", ["rev-list", "--max-parents=0", "HEAD"]);
}
function isPrerelease(version) {
  return !/^[^.]*(?:\.[\d.]*|\d)$/.test(version);
}
async function changelogithub_CY0qmmq7_execCommand(cmd, args) {
  const { execa } = await __webpack_require__.e(/* import() */ 993).then(__webpack_require__.bind(__webpack_require__, 6993));
  const res = await execa(cmd, args);
  return res.stdout.trim();
}

function defineConfig(config) {
  return config;
}
const defaultConfig = {
  scopeMap: {},
  types: {
    feat: { title: "\u{1F680} Features" },
    fix: { title: "\u{1F41E} Bug Fixes" },
    perf: { title: "\u{1F3CE} Performance" }
  },
  titles: {
    breakingChanges: "\u{1F6A8} Breaking Changes"
  },
  contributors: true,
  capitalize: true,
  group: true,
  tag: "v%s"
};
async function resolveConfig(options) {
  const { loadConfig } = await Promise.all(/* import() */[__webpack_require__.e(503), __webpack_require__.e(439)]).then(__webpack_require__.bind(__webpack_require__, 7503));
  const config = await loadConfig({
    name: "changelogithub",
    defaults: defaultConfig,
    overrides: options,
    packageJson: "changelogithub"
  }).then((r) => r.config || defaultConfig);
  config.baseUrl = config.baseUrl ?? "github.com";
  config.baseUrlApi = config.baseUrlApi ?? "api.github.com";
  config.to = config.to || await changelogithub_CY0qmmq7_getCurrentGitBranch();
  config.tagFilter = config.tagFilter ?? (() => true);
  config.tag = getSafeTagTemplate(config.tag ?? defaultConfig.tag);
  config.from = config.from || await getLastMatchingTag(
    config.to,
    config.tagFilter,
    config.tag
  ) || await getFirstGitCommit();
  config.repo = config.repo || config.github || await getGitHubRepo(config.baseUrl);
  config.releaseRepo = config.releaseRepo || config.releaseGithub || config.repo;
  config.prerelease = config.prerelease ?? isPrerelease(config.to);
  if (typeof config.repo !== "string")
    throw new Error(`Invalid GitHub repository, expected a string but got ${JSON.stringify(config.repo)}`);
  return config;
}

function partition(array, ...filters) {
  const result = Array.from({ length: filters.length + 1 }).fill(null).map(() => []);
  array.forEach((e, idx, arr) => {
    let i = 0;
    for (const filter of filters) {
      if (filter(e, idx, arr)) {
        result[i].push(e);
        return;
      }
      i += 1;
    }
    result[i].push(e);
  });
  return result;
}

function notNullish(v) {
  return v != null;
}

async function sendRelease(options, content) {
  const headers = getHeaders(options);
  let url = `https://${options.baseUrlApi}/repos/${options.releaseRepo}/releases`;
  let method = "POST";
  try {
    const exists = await node_$fetch(`https://${options.baseUrlApi}/repos/${options.releaseRepo}/releases/tags/${options.to}`, {
      headers
    });
    if (exists.url) {
      url = exists.url;
      method = "PATCH";
    }
  } catch {
  }
  const body = {
    body: content,
    draft: options.draft || false,
    name: options.name || options.to,
    prerelease: options.prerelease,
    tag_name: options.to
  };
  console.log(
    cyan(method === "POST" ? "Creating release notes..." : "Updating release notes...")
  );
  const res = await node_$fetch(url, {
    method,
    body: JSON.stringify(body),
    headers
  });
  console.log(green(`Released on ${res.html_url}`));
  return res;
}
function getHeaders(options) {
  return {
    accept: "application/vnd.github.v3+json",
    authorization: `token ${options.token}`
  };
}
const excludeAuthors = [
  /\[bot\]/i,
  /dependabot/i,
  /\(bot\)/i
];
async function resolveAuthorInfo(options, info) {
  if (info.login)
    return info;
  if (!options.token)
    return info;
  try {
    const q = encodeURIComponent(`${info.email} type:user in:email`);
    const data = await node_$fetch(`https://${options.baseUrlApi}/search/users?q=${q}`, {
      headers: getHeaders(options)
    });
    info.login = data.items[0].login;
  } catch {
  }
  if (info.login)
    return info;
  if (info.commits.length) {
    try {
      const data = await node_$fetch(`https://${options.baseUrlApi}/repos/${options.repo}/commits/${info.commits[0]}`, {
        headers: getHeaders(options)
      });
      info.login = data.author.login;
    } catch {
    }
  }
  return info;
}
async function resolveAuthors(commits, options) {
  const map = /* @__PURE__ */ new Map();
  commits.forEach((commit) => {
    commit.resolvedAuthors = commit.authors.map((a, idx) => {
      if (!a.email || !a.name)
        return null;
      if (excludeAuthors.some((re) => re.test(a.name)))
        return null;
      if (!map.has(a.email)) {
        map.set(a.email, {
          commits: [],
          name: a.name,
          email: a.email
        });
      }
      const info = map.get(a.email);
      if (idx === 0)
        info.commits.push(commit.shortHash);
      return info;
    }).filter(notNullish);
  });
  const authors = Array.from(map.values());
  const resolved = await Promise.all(authors.map((info) => resolveAuthorInfo(options, info)));
  const loginSet = /* @__PURE__ */ new Set();
  const nameSet = /* @__PURE__ */ new Set();
  return resolved.sort((a, b) => (a.login || a.name).localeCompare(b.login || b.name)).filter((i) => {
    if (i.login && loginSet.has(i.login))
      return false;
    if (i.login) {
      loginSet.add(i.login);
    } else {
      if (nameSet.has(i.name))
        return false;
      nameSet.add(i.name);
    }
    return true;
  });
}
async function hasTagOnGitHub(tag, options) {
  try {
    await node_$fetch(`https://${options.baseUrlApi}/repos/${options.repo}/git/ref/tags/${tag}`, {
      headers: getHeaders(options)
    });
    return true;
  } catch {
    return false;
  }
}
async function uploadAssets(options, assets, releaseResponse) {
  const headers = getHeaders(options);
  let assetList = [];
  if (typeof assets === "string") {
    assetList = assets.split(",").map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(assets)) {
    assetList = assets.flatMap(
      (item) => typeof item === "string" ? item.split(",").map((s) => s.trim()) : []
    ).filter(Boolean);
  }
  const expandedAssets = [];
  for (const pattern of assetList) {
    try {
      const matches = await glob(pattern);
      if (matches.length) {
        expandedAssets.push(...matches);
      } else {
        expandedAssets.push(pattern);
      }
    } catch (error) {
      console.error(red(`Failed to process glob pattern "${pattern}": ${error}`));
      expandedAssets.push(pattern);
    }
  }
  const release = releaseResponse ?? await node_$fetch(`https://${options.baseUrlApi}/repos/${options.releaseRepo}/releases/tags/${options.to}`, {
    headers
  });
  for (const asset of expandedAssets) {
    const filePath = external_node_path_.resolve(asset);
    try {
      const fileData = await promises_.readFile(filePath);
      const fileName = external_node_path_.basename(filePath);
      const contentType = "application/octet-stream";
      const uploadUrl = release.upload_url.replace("{?name,label}", `?name=${encodeURIComponent(fileName)}`);
      console.log(cyan(`Uploading ${fileName}...`));
      try {
        await node_$fetch(uploadUrl, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": contentType
          },
          body: fileData
        });
        console.log(green(`Uploaded ${fileName} successfully.`));
      } catch (error) {
        console.error(red(`Failed to upload ${fileName}: ${error}`));
      }
    } catch (error) {
      console.error(red(`Failed to read file ${filePath}: ${error}`));
    }
  }
}

const emojisRE = /([\u2700-\u27BF\uE000-\uF8FF\u2011-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/g;
function changelogithub_CY0qmmq7_formatReferences(references, baseUrl, github, type) {
  const refs = references.filter((i) => {
    if (type === "issues")
      return i.type === "issue" || i.type === "pull-request";
    return i.type === "hash";
  }).map((ref) => {
    if (!github)
      return ref.value;
    if (ref.type === "pull-request" || ref.type === "issue")
      return `https://${baseUrl}/${github}/issues/${ref.value.slice(1)}`;
    return `[<samp>(${ref.value.slice(0, 5)})</samp>](https://${baseUrl}/${github}/commit/${ref.value})`;
  });
  const referencesString = changelogithub_CY0qmmq7_join(refs).trim();
  if (type === "issues")
    return referencesString && `in ${referencesString}`;
  return referencesString;
}
function formatLine(commit, options) {
  const prRefs = changelogithub_CY0qmmq7_formatReferences(commit.references, options.baseUrl, options.repo, "issues");
  const hashRefs = changelogithub_CY0qmmq7_formatReferences(commit.references, options.baseUrl, options.repo, "hash");
  let authors = changelogithub_CY0qmmq7_join([...new Set(commit.resolvedAuthors?.map((i) => i.login ? `@${i.login}` : `**${i.name}**`))])?.trim();
  if (authors)
    authors = `by ${authors}`;
  let refs = [authors, prRefs, hashRefs].filter((i) => i?.trim()).join(" ");
  if (refs)
    refs = `&nbsp;-&nbsp; ${refs}`;
  const description = options.capitalize ? capitalize(commit.description) : commit.description;
  return [description, refs].filter((i) => i?.trim()).join(" ");
}
function formatTitle(name, options) {
  if (!options.emoji)
    name = name.replace(emojisRE, "");
  return `### &nbsp;&nbsp;&nbsp;${name.trim()}`;
}
function formatSection(commits, sectionName, options) {
  if (!commits.length)
    return [];
  const lines = [
    "",
    formatTitle(sectionName, options),
    ""
  ];
  const scopes = changelogithub_CY0qmmq7_groupBy(commits, "scope");
  let useScopeGroup = options.group;
  if (!Object.entries(scopes).some(([k, v]) => k && v.length > 1))
    useScopeGroup = false;
  Object.keys(scopes).sort().forEach((scope) => {
    let padding = "";
    let prefix = "";
    const scopeText = `**${options.scopeMap[scope] || scope}**`;
    if (scope && (useScopeGroup === true || useScopeGroup === "multiple" && scopes[scope].length > 1)) {
      lines.push(`- ${scopeText}:`);
      padding = "  ";
    } else if (scope) {
      prefix = `${scopeText}: `;
    }
    lines.push(
      ...scopes[scope].reverse().map((commit) => `${padding}- ${prefix}${formatLine(commit, options)}`)
    );
  });
  return lines;
}
function generateMarkdown(commits, options) {
  const lines = [];
  const [breaking, changes] = partition(commits, (c) => c.isBreaking);
  const group = changelogithub_CY0qmmq7_groupBy(changes, "type");
  lines.push(
    ...formatSection(breaking, options.titles.breakingChanges, options)
  );
  for (const type of Object.keys(options.types)) {
    const items = group[type] || [];
    lines.push(
      ...formatSection(items, options.types[type].title, options)
    );
  }
  if (!lines.length)
    lines.push("*No significant changes*");
  const url = `https://${options.baseUrl}/${options.repo}/compare/${options.from}...${options.to}`;
  lines.push("", `##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](${url})`);
  return dist_convert(lines.join("\n").trim(), true);
}
function changelogithub_CY0qmmq7_groupBy(items, key, groups = {}) {
  for (const item of items) {
    const v = item[key];
    groups[v] = groups[v] || [];
    groups[v].push(item);
  }
  return groups;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function changelogithub_CY0qmmq7_join(array, glue = ", ", finalGlue = " and ") {
  if (!array || array.length === 0)
    return "";
  if (array.length === 1)
    return array[0];
  if (array.length === 2)
    return array.join(finalGlue);
  return `${array.slice(0, -1).join(glue)}${finalGlue}${array.slice(-1)}`;
}

function changelogithub_CY0qmmq7_parseCommits(commits, config) {
  return commits.map((commit) => parseGitCommit(commit, config)).filter(notNullish);
}

async function generate(options) {
  const resolved = await resolveConfig(options);
  const rawCommits = await getGitDiff(resolved.from, resolved.to);
  const commits = changelogithub_CY0qmmq7_parseCommits(rawCommits, resolved);
  if (resolved.contributors)
    await resolveAuthors(commits, resolved);
  const md = generateMarkdown(commits, resolved);
  return { config: resolved, md, commits };
}



;// CONCATENATED MODULE: ./node_modules/changelogithub/dist/index.mjs











/***/ }),

/***/ 2899:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ destr)
/* harmony export */ });
/* unused harmony exports destr, safeDestr */
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
function safeDestr(value, options = {}) {
  return destr(value, { ...options, strict: true });
}




/***/ }),

/***/ 4522:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Kd: () => (/* binding */ dt),
/* harmony export */   Lr: () => (/* binding */ ye),
/* harmony export */   YK: () => (/* binding */ le),
/* harmony export */   YQ: () => (/* binding */ ut),
/* harmony export */   ZH: () => (/* binding */ qn),
/* harmony export */   fS: () => (/* binding */ br),
/* harmony export */   hd: () => (/* binding */ Mi),
/* harmony export */   z1: () => (/* binding */ Mn)
/* harmony export */ });
/* unused harmony exports AbortError, FetchError, blobFrom, blobFromSync, default, fileFrom, fileFromSync, isRedirect */
/* harmony import */ var node_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7067);
/* harmony import */ var node_https__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4708);
/* harmony import */ var node_zlib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8522);
/* harmony import */ var node_stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7075);
/* harmony import */ var node_buffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4573);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7975);
/* harmony import */ var _shared_node_fetch_native_DfbY2q_x_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5008);
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3136);
/* harmony import */ var node_net__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7030);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3024);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(6760);
var Os=Object.defineProperty;var fi=i=>{throw TypeError(i)};var n=(i,o)=>Os(i,"name",{value:o,configurable:!0});var ci=(i,o,a)=>o.has(i)||fi("Cannot "+a);var O=(i,o,a)=>(ci(i,o,"read from private field"),a?a.call(i):o.get(i)),be=(i,o,a)=>o.has(i)?fi("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(i):o.set(i,a),X=(i,o,a,f)=>(ci(i,o,"write to private field"),f?f.call(i,a):o.set(i,a),a);var ve,zt,bt,Cr,ze,It,Ft,mt,ee,yt,He,Ve,gt;function Us(i){if(!/^data:/i.test(i))throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');i=i.replace(/\r?\n/g,"");const o=i.indexOf(",");if(o===-1||o<=4)throw new TypeError("malformed data: URI");const a=i.substring(5,o).split(";");let f="",l=!1;const p=a[0]||"text/plain";let h=p;for(let A=1;A<a.length;A++)a[A]==="base64"?l=!0:a[A]&&(h+=`;${a[A]}`,a[A].indexOf("charset=")===0&&(f=a[A].substring(8)));!a[0]&&!f.length&&(h+=";charset=US-ASCII",f="US-ASCII");const S=l?"base64":"ascii",v=unescape(i.substring(o+1)),w=Buffer.from(v,S);return w.type=p,w.typeFull=h,w.charset=f,w}n(Us,"dataUriToBuffer");var pi={},kt={exports:{}};/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */var xs=kt.exports,bi;function Ns(){return bi||(bi=1,function(i,o){(function(a,f){f(o)})(xs,function(a){function f(){}n(f,"noop");function l(e){return typeof e=="object"&&e!==null||typeof e=="function"}n(l,"typeIsObject");const p=f;function h(e,t){try{Object.defineProperty(e,"name",{value:t,configurable:!0})}catch{}}n(h,"setFunctionName");const S=Promise,v=Promise.prototype.then,w=Promise.reject.bind(S);function A(e){return new S(e)}n(A,"newPromise");function T(e){return A(t=>t(e))}n(T,"promiseResolvedWith");function b(e){return w(e)}n(b,"promiseRejectedWith");function q(e,t,r){return v.call(e,t,r)}n(q,"PerformPromiseThen");function g(e,t,r){q(q(e,t,r),void 0,p)}n(g,"uponPromise");function V(e,t){g(e,t)}n(V,"uponFulfillment");function I(e,t){g(e,void 0,t)}n(I,"uponRejection");function F(e,t,r){return q(e,t,r)}n(F,"transformPromiseWith");function Q(e){q(e,void 0,p)}n(Q,"setPromiseIsHandledToTrue");let ge=n(e=>{if(typeof queueMicrotask=="function")ge=queueMicrotask;else{const t=T(void 0);ge=n(r=>q(t,r),"_queueMicrotask")}return ge(e)},"_queueMicrotask");function z(e,t,r){if(typeof e!="function")throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,t,r)}n(z,"reflectCall");function j(e,t,r){try{return T(z(e,t,r))}catch(s){return b(s)}}n(j,"promiseCall");const U=16384,bn=class bn{constructor(){this._cursor=0,this._size=0,this._front={_elements:[],_next:void 0},this._back=this._front,this._cursor=0,this._size=0}get length(){return this._size}push(t){const r=this._back;let s=r;r._elements.length===U-1&&(s={_elements:[],_next:void 0}),r._elements.push(t),s!==r&&(this._back=s,r._next=s),++this._size}shift(){const t=this._front;let r=t;const s=this._cursor;let u=s+1;const c=t._elements,d=c[s];return u===U&&(r=t._next,u=0),--this._size,this._cursor=u,t!==r&&(this._front=r),c[s]=void 0,d}forEach(t){let r=this._cursor,s=this._front,u=s._elements;for(;(r!==u.length||s._next!==void 0)&&!(r===u.length&&(s=s._next,u=s._elements,r=0,u.length===0));)t(u[r]),++r}peek(){const t=this._front,r=this._cursor;return t._elements[r]}};n(bn,"SimpleQueue");let D=bn;const jt=Symbol("[[AbortSteps]]"),Qn=Symbol("[[ErrorSteps]]"),Ar=Symbol("[[CancelSteps]]"),Br=Symbol("[[PullSteps]]"),kr=Symbol("[[ReleaseSteps]]");function Yn(e,t){e._ownerReadableStream=t,t._reader=e,t._state==="readable"?qr(e):t._state==="closed"?xi(e):Gn(e,t._storedError)}n(Yn,"ReadableStreamReaderGenericInitialize");function Wr(e,t){const r=e._ownerReadableStream;return ie(r,t)}n(Wr,"ReadableStreamReaderGenericCancel");function _e(e){const t=e._ownerReadableStream;t._state==="readable"?Or(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):Ni(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),t._readableStreamController[kr](),t._reader=void 0,e._ownerReadableStream=void 0}n(_e,"ReadableStreamReaderGenericRelease");function Lt(e){return new TypeError("Cannot "+e+" a stream using a released reader")}n(Lt,"readerLockException");function qr(e){e._closedPromise=A((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r})}n(qr,"defaultReaderClosedPromiseInitialize");function Gn(e,t){qr(e),Or(e,t)}n(Gn,"defaultReaderClosedPromiseInitializeAsRejected");function xi(e){qr(e),Zn(e)}n(xi,"defaultReaderClosedPromiseInitializeAsResolved");function Or(e,t){e._closedPromise_reject!==void 0&&(Q(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0)}n(Or,"defaultReaderClosedPromiseReject");function Ni(e,t){Gn(e,t)}n(Ni,"defaultReaderClosedPromiseResetToRejected");function Zn(e){e._closedPromise_resolve!==void 0&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0)}n(Zn,"defaultReaderClosedPromiseResolve");const Kn=Number.isFinite||function(e){return typeof e=="number"&&isFinite(e)},Hi=Math.trunc||function(e){return e<0?Math.ceil(e):Math.floor(e)};function Vi(e){return typeof e=="object"||typeof e=="function"}n(Vi,"isDictionary");function ue(e,t){if(e!==void 0&&!Vi(e))throw new TypeError(`${t} is not an object.`)}n(ue,"assertDictionary");function Z(e,t){if(typeof e!="function")throw new TypeError(`${t} is not a function.`)}n(Z,"assertFunction");function Qi(e){return typeof e=="object"&&e!==null||typeof e=="function"}n(Qi,"isObject");function Jn(e,t){if(!Qi(e))throw new TypeError(`${t} is not an object.`)}n(Jn,"assertObject");function Se(e,t,r){if(e===void 0)throw new TypeError(`Parameter ${t} is required in '${r}'.`)}n(Se,"assertRequiredArgument");function zr(e,t,r){if(e===void 0)throw new TypeError(`${t} is required in '${r}'.`)}n(zr,"assertRequiredField");function Ir(e){return Number(e)}n(Ir,"convertUnrestrictedDouble");function Xn(e){return e===0?0:e}n(Xn,"censorNegativeZero");function Yi(e){return Xn(Hi(e))}n(Yi,"integerPart");function Fr(e,t){const s=Number.MAX_SAFE_INTEGER;let u=Number(e);if(u=Xn(u),!Kn(u))throw new TypeError(`${t} is not a finite number`);if(u=Yi(u),u<0||u>s)throw new TypeError(`${t} is outside the accepted range of 0 to ${s}, inclusive`);return!Kn(u)||u===0?0:u}n(Fr,"convertUnsignedLongLongWithEnforceRange");function jr(e,t){if(!We(e))throw new TypeError(`${t} is not a ReadableStream.`)}n(jr,"assertReadableStream");function Qe(e){return new fe(e)}n(Qe,"AcquireReadableStreamDefaultReader");function eo(e,t){e._reader._readRequests.push(t)}n(eo,"ReadableStreamAddReadRequest");function Lr(e,t,r){const u=e._reader._readRequests.shift();r?u._closeSteps():u._chunkSteps(t)}n(Lr,"ReadableStreamFulfillReadRequest");function $t(e){return e._reader._readRequests.length}n($t,"ReadableStreamGetNumReadRequests");function to(e){const t=e._reader;return!(t===void 0||!Ee(t))}n(to,"ReadableStreamHasDefaultReader");const mn=class mn{constructor(t){if(Se(t,1,"ReadableStreamDefaultReader"),jr(t,"First parameter"),qe(t))throw new TypeError("This stream has already been locked for exclusive reading by another reader");Yn(this,t),this._readRequests=new D}get closed(){return Ee(this)?this._closedPromise:b(Dt("closed"))}cancel(t=void 0){return Ee(this)?this._ownerReadableStream===void 0?b(Lt("cancel")):Wr(this,t):b(Dt("cancel"))}read(){if(!Ee(this))return b(Dt("read"));if(this._ownerReadableStream===void 0)return b(Lt("read from"));let t,r;const s=A((c,d)=>{t=c,r=d});return _t(this,{_chunkSteps:n(c=>t({value:c,done:!1}),"_chunkSteps"),_closeSteps:n(()=>t({value:void 0,done:!0}),"_closeSteps"),_errorSteps:n(c=>r(c),"_errorSteps")}),s}releaseLock(){if(!Ee(this))throw Dt("releaseLock");this._ownerReadableStream!==void 0&&Gi(this)}};n(mn,"ReadableStreamDefaultReader");let fe=mn;Object.defineProperties(fe.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),h(fe.prototype.cancel,"cancel"),h(fe.prototype.read,"read"),h(fe.prototype.releaseLock,"releaseLock"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(fe.prototype,Symbol.toStringTag,{value:"ReadableStreamDefaultReader",configurable:!0});function Ee(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_readRequests")?!1:e instanceof fe}n(Ee,"IsReadableStreamDefaultReader");function _t(e,t){const r=e._ownerReadableStream;r._disturbed=!0,r._state==="closed"?t._closeSteps():r._state==="errored"?t._errorSteps(r._storedError):r._readableStreamController[Br](t)}n(_t,"ReadableStreamDefaultReaderRead");function Gi(e){_e(e);const t=new TypeError("Reader was released");ro(e,t)}n(Gi,"ReadableStreamDefaultReaderRelease");function ro(e,t){const r=e._readRequests;e._readRequests=new D,r.forEach(s=>{s._errorSteps(t)})}n(ro,"ReadableStreamDefaultReaderErrorReadRequests");function Dt(e){return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`)}n(Dt,"defaultReaderBrandCheckException");const Zi=Object.getPrototypeOf(Object.getPrototypeOf(async function*(){}).prototype),yn=class yn{constructor(t,r){this._ongoingPromise=void 0,this._isFinished=!1,this._reader=t,this._preventCancel=r}next(){const t=n(()=>this._nextSteps(),"nextSteps");return this._ongoingPromise=this._ongoingPromise?F(this._ongoingPromise,t,t):t(),this._ongoingPromise}return(t){const r=n(()=>this._returnSteps(t),"returnSteps");return this._ongoingPromise?F(this._ongoingPromise,r,r):r()}_nextSteps(){if(this._isFinished)return Promise.resolve({value:void 0,done:!0});const t=this._reader;let r,s;const u=A((d,m)=>{r=d,s=m});return _t(t,{_chunkSteps:n(d=>{this._ongoingPromise=void 0,ge(()=>r({value:d,done:!1}))},"_chunkSteps"),_closeSteps:n(()=>{this._ongoingPromise=void 0,this._isFinished=!0,_e(t),r({value:void 0,done:!0})},"_closeSteps"),_errorSteps:n(d=>{this._ongoingPromise=void 0,this._isFinished=!0,_e(t),s(d)},"_errorSteps")}),u}_returnSteps(t){if(this._isFinished)return Promise.resolve({value:t,done:!0});this._isFinished=!0;const r=this._reader;if(!this._preventCancel){const s=Wr(r,t);return _e(r),F(s,()=>({value:t,done:!0}))}return _e(r),T({value:t,done:!0})}};n(yn,"ReadableStreamAsyncIteratorImpl");let Mt=yn;const no={next(){return oo(this)?this._asyncIteratorImpl.next():b(io("next"))},return(e){return oo(this)?this._asyncIteratorImpl.return(e):b(io("return"))}};Object.setPrototypeOf(no,Zi);function Ki(e,t){const r=Qe(e),s=new Mt(r,t),u=Object.create(no);return u._asyncIteratorImpl=s,u}n(Ki,"AcquireReadableStreamAsyncIterator");function oo(e){if(!l(e)||!Object.prototype.hasOwnProperty.call(e,"_asyncIteratorImpl"))return!1;try{return e._asyncIteratorImpl instanceof Mt}catch{return!1}}n(oo,"IsReadableStreamAsyncIterator");function io(e){return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`)}n(io,"streamAsyncIteratorBrandCheckException");const ao=Number.isNaN||function(e){return e!==e};var $r,Dr,Mr;function St(e){return e.slice()}n(St,"CreateArrayFromList");function so(e,t,r,s,u){new Uint8Array(e).set(new Uint8Array(r,s,u),t)}n(so,"CopyDataBlockBytes");let we=n(e=>(typeof e.transfer=="function"?we=n(t=>t.transfer(),"TransferArrayBuffer"):typeof structuredClone=="function"?we=n(t=>structuredClone(t,{transfer:[t]}),"TransferArrayBuffer"):we=n(t=>t,"TransferArrayBuffer"),we(e)),"TransferArrayBuffer"),Ae=n(e=>(typeof e.detached=="boolean"?Ae=n(t=>t.detached,"IsDetachedBuffer"):Ae=n(t=>t.byteLength===0,"IsDetachedBuffer"),Ae(e)),"IsDetachedBuffer");function lo(e,t,r){if(e.slice)return e.slice(t,r);const s=r-t,u=new ArrayBuffer(s);return so(u,0,e,t,s),u}n(lo,"ArrayBufferSlice");function Ut(e,t){const r=e[t];if(r!=null){if(typeof r!="function")throw new TypeError(`${String(t)} is not a function`);return r}}n(Ut,"GetMethod");function Ji(e){const t={[Symbol.iterator]:()=>e.iterator},r=async function*(){return yield*t}(),s=r.next;return{iterator:r,nextMethod:s,done:!1}}n(Ji,"CreateAsyncFromSyncIterator");const Ur=(Mr=($r=Symbol.asyncIterator)!==null&&$r!==void 0?$r:(Dr=Symbol.for)===null||Dr===void 0?void 0:Dr.call(Symbol,"Symbol.asyncIterator"))!==null&&Mr!==void 0?Mr:"@@asyncIterator";function uo(e,t="sync",r){if(r===void 0)if(t==="async"){if(r=Ut(e,Ur),r===void 0){const c=Ut(e,Symbol.iterator),d=uo(e,"sync",c);return Ji(d)}}else r=Ut(e,Symbol.iterator);if(r===void 0)throw new TypeError("The object is not iterable");const s=z(r,e,[]);if(!l(s))throw new TypeError("The iterator method must return an object");const u=s.next;return{iterator:s,nextMethod:u,done:!1}}n(uo,"GetIterator");function Xi(e){const t=z(e.nextMethod,e.iterator,[]);if(!l(t))throw new TypeError("The iterator.next() method must return an object");return t}n(Xi,"IteratorNext");function ea(e){return!!e.done}n(ea,"IteratorComplete");function ta(e){return e.value}n(ta,"IteratorValue");function ra(e){return!(typeof e!="number"||ao(e)||e<0)}n(ra,"IsNonNegativeNumber");function fo(e){const t=lo(e.buffer,e.byteOffset,e.byteOffset+e.byteLength);return new Uint8Array(t)}n(fo,"CloneAsUint8Array");function xr(e){const t=e._queue.shift();return e._queueTotalSize-=t.size,e._queueTotalSize<0&&(e._queueTotalSize=0),t.value}n(xr,"DequeueValue");function Nr(e,t,r){if(!ra(r)||r===1/0)throw new RangeError("Size must be a finite, non-NaN, non-negative number.");e._queue.push({value:t,size:r}),e._queueTotalSize+=r}n(Nr,"EnqueueValueWithSize");function na(e){return e._queue.peek().value}n(na,"PeekQueueValue");function Be(e){e._queue=new D,e._queueTotalSize=0}n(Be,"ResetQueue");function co(e){return e===DataView}n(co,"isDataViewConstructor");function oa(e){return co(e.constructor)}n(oa,"isDataView");function ia(e){return co(e)?1:e.BYTES_PER_ELEMENT}n(ia,"arrayBufferViewElementSize");const gn=class gn{constructor(){throw new TypeError("Illegal constructor")}get view(){if(!Hr(this))throw Zr("view");return this._view}respond(t){if(!Hr(this))throw Zr("respond");if(Se(t,1,"respond"),t=Fr(t,"First parameter"),this._associatedReadableByteStreamController===void 0)throw new TypeError("This BYOB request has been invalidated");if(Ae(this._view.buffer))throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");Vt(this._associatedReadableByteStreamController,t)}respondWithNewView(t){if(!Hr(this))throw Zr("respondWithNewView");if(Se(t,1,"respondWithNewView"),!ArrayBuffer.isView(t))throw new TypeError("You can only respond with array buffer views");if(this._associatedReadableByteStreamController===void 0)throw new TypeError("This BYOB request has been invalidated");if(Ae(t.buffer))throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");Qt(this._associatedReadableByteStreamController,t)}};n(gn,"ReadableStreamBYOBRequest");let Re=gn;Object.defineProperties(Re.prototype,{respond:{enumerable:!0},respondWithNewView:{enumerable:!0},view:{enumerable:!0}}),h(Re.prototype.respond,"respond"),h(Re.prototype.respondWithNewView,"respondWithNewView"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Re.prototype,Symbol.toStringTag,{value:"ReadableStreamBYOBRequest",configurable:!0});const _n=class _n{constructor(){throw new TypeError("Illegal constructor")}get byobRequest(){if(!Ie(this))throw Rt("byobRequest");return Gr(this)}get desiredSize(){if(!Ie(this))throw Rt("desiredSize");return Ro(this)}close(){if(!Ie(this))throw Rt("close");if(this._closeRequested)throw new TypeError("The stream has already been closed; do not close it again!");const t=this._controlledReadableByteStream._state;if(t!=="readable")throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be closed`);wt(this)}enqueue(t){if(!Ie(this))throw Rt("enqueue");if(Se(t,1,"enqueue"),!ArrayBuffer.isView(t))throw new TypeError("chunk must be an array buffer view");if(t.byteLength===0)throw new TypeError("chunk must have non-zero byteLength");if(t.buffer.byteLength===0)throw new TypeError("chunk's buffer must have non-zero byteLength");if(this._closeRequested)throw new TypeError("stream is closed or draining");const r=this._controlledReadableByteStream._state;if(r!=="readable")throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);Ht(this,t)}error(t=void 0){if(!Ie(this))throw Rt("error");K(this,t)}[Ar](t){ho(this),Be(this);const r=this._cancelAlgorithm(t);return Nt(this),r}[Br](t){const r=this._controlledReadableByteStream;if(this._queueTotalSize>0){wo(this,t);return}const s=this._autoAllocateChunkSize;if(s!==void 0){let u;try{u=new ArrayBuffer(s)}catch(d){t._errorSteps(d);return}const c={buffer:u,bufferByteLength:s,byteOffset:0,byteLength:s,bytesFilled:0,minimumFill:1,elementSize:1,viewConstructor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(c)}eo(r,t),Fe(this)}[kr](){if(this._pendingPullIntos.length>0){const t=this._pendingPullIntos.peek();t.readerType="none",this._pendingPullIntos=new D,this._pendingPullIntos.push(t)}}};n(_n,"ReadableByteStreamController");let te=_n;Object.defineProperties(te.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},byobRequest:{enumerable:!0},desiredSize:{enumerable:!0}}),h(te.prototype.close,"close"),h(te.prototype.enqueue,"enqueue"),h(te.prototype.error,"error"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(te.prototype,Symbol.toStringTag,{value:"ReadableByteStreamController",configurable:!0});function Ie(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledReadableByteStream")?!1:e instanceof te}n(Ie,"IsReadableByteStreamController");function Hr(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")?!1:e instanceof Re}n(Hr,"IsReadableStreamBYOBRequest");function Fe(e){if(!fa(e))return;if(e._pulling){e._pullAgain=!0;return}e._pulling=!0;const r=e._pullAlgorithm();g(r,()=>(e._pulling=!1,e._pullAgain&&(e._pullAgain=!1,Fe(e)),null),s=>(K(e,s),null))}n(Fe,"ReadableByteStreamControllerCallPullIfNeeded");function ho(e){Qr(e),e._pendingPullIntos=new D}n(ho,"ReadableByteStreamControllerClearPendingPullIntos");function Vr(e,t){let r=!1;e._state==="closed"&&(r=!0);const s=po(t);t.readerType==="default"?Lr(e,s,r):ma(e,s,r)}n(Vr,"ReadableByteStreamControllerCommitPullIntoDescriptor");function po(e){const t=e.bytesFilled,r=e.elementSize;return new e.viewConstructor(e.buffer,e.byteOffset,t/r)}n(po,"ReadableByteStreamControllerConvertPullIntoDescriptor");function xt(e,t,r,s){e._queue.push({buffer:t,byteOffset:r,byteLength:s}),e._queueTotalSize+=s}n(xt,"ReadableByteStreamControllerEnqueueChunkToQueue");function bo(e,t,r,s){let u;try{u=lo(t,r,r+s)}catch(c){throw K(e,c),c}xt(e,u,0,s)}n(bo,"ReadableByteStreamControllerEnqueueClonedChunkToQueue");function mo(e,t){t.bytesFilled>0&&bo(e,t.buffer,t.byteOffset,t.bytesFilled),Ye(e)}n(mo,"ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");function yo(e,t){const r=Math.min(e._queueTotalSize,t.byteLength-t.bytesFilled),s=t.bytesFilled+r;let u=r,c=!1;const d=s%t.elementSize,m=s-d;m>=t.minimumFill&&(u=m-t.bytesFilled,c=!0);const R=e._queue;for(;u>0;){const y=R.peek(),C=Math.min(u,y.byteLength),P=t.byteOffset+t.bytesFilled;so(t.buffer,P,y.buffer,y.byteOffset,C),y.byteLength===C?R.shift():(y.byteOffset+=C,y.byteLength-=C),e._queueTotalSize-=C,go(e,C,t),u-=C}return c}n(yo,"ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");function go(e,t,r){r.bytesFilled+=t}n(go,"ReadableByteStreamControllerFillHeadPullIntoDescriptor");function _o(e){e._queueTotalSize===0&&e._closeRequested?(Nt(e),At(e._controlledReadableByteStream)):Fe(e)}n(_o,"ReadableByteStreamControllerHandleQueueDrain");function Qr(e){e._byobRequest!==null&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=null,e._byobRequest=null)}n(Qr,"ReadableByteStreamControllerInvalidateBYOBRequest");function Yr(e){for(;e._pendingPullIntos.length>0;){if(e._queueTotalSize===0)return;const t=e._pendingPullIntos.peek();yo(e,t)&&(Ye(e),Vr(e._controlledReadableByteStream,t))}}n(Yr,"ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");function aa(e){const t=e._controlledReadableByteStream._reader;for(;t._readRequests.length>0;){if(e._queueTotalSize===0)return;const r=t._readRequests.shift();wo(e,r)}}n(aa,"ReadableByteStreamControllerProcessReadRequestsUsingQueue");function sa(e,t,r,s){const u=e._controlledReadableByteStream,c=t.constructor,d=ia(c),{byteOffset:m,byteLength:R}=t,y=r*d;let C;try{C=we(t.buffer)}catch(B){s._errorSteps(B);return}const P={buffer:C,bufferByteLength:C.byteLength,byteOffset:m,byteLength:R,bytesFilled:0,minimumFill:y,elementSize:d,viewConstructor:c,readerType:"byob"};if(e._pendingPullIntos.length>0){e._pendingPullIntos.push(P),Po(u,s);return}if(u._state==="closed"){const B=new c(P.buffer,P.byteOffset,0);s._closeSteps(B);return}if(e._queueTotalSize>0){if(yo(e,P)){const B=po(P);_o(e),s._chunkSteps(B);return}if(e._closeRequested){const B=new TypeError("Insufficient bytes to fill elements in the given buffer");K(e,B),s._errorSteps(B);return}}e._pendingPullIntos.push(P),Po(u,s),Fe(e)}n(sa,"ReadableByteStreamControllerPullInto");function la(e,t){t.readerType==="none"&&Ye(e);const r=e._controlledReadableByteStream;if(Kr(r))for(;vo(r)>0;){const s=Ye(e);Vr(r,s)}}n(la,"ReadableByteStreamControllerRespondInClosedState");function ua(e,t,r){if(go(e,t,r),r.readerType==="none"){mo(e,r),Yr(e);return}if(r.bytesFilled<r.minimumFill)return;Ye(e);const s=r.bytesFilled%r.elementSize;if(s>0){const u=r.byteOffset+r.bytesFilled;bo(e,r.buffer,u-s,s)}r.bytesFilled-=s,Vr(e._controlledReadableByteStream,r),Yr(e)}n(ua,"ReadableByteStreamControllerRespondInReadableState");function So(e,t){const r=e._pendingPullIntos.peek();Qr(e),e._controlledReadableByteStream._state==="closed"?la(e,r):ua(e,t,r),Fe(e)}n(So,"ReadableByteStreamControllerRespondInternal");function Ye(e){return e._pendingPullIntos.shift()}n(Ye,"ReadableByteStreamControllerShiftPendingPullInto");function fa(e){const t=e._controlledReadableByteStream;return t._state!=="readable"||e._closeRequested||!e._started?!1:!!(to(t)&&$t(t)>0||Kr(t)&&vo(t)>0||Ro(e)>0)}n(fa,"ReadableByteStreamControllerShouldCallPull");function Nt(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0}n(Nt,"ReadableByteStreamControllerClearAlgorithms");function wt(e){const t=e._controlledReadableByteStream;if(!(e._closeRequested||t._state!=="readable")){if(e._queueTotalSize>0){e._closeRequested=!0;return}if(e._pendingPullIntos.length>0){const r=e._pendingPullIntos.peek();if(r.bytesFilled%r.elementSize!==0){const s=new TypeError("Insufficient bytes to fill elements in the given buffer");throw K(e,s),s}}Nt(e),At(t)}}n(wt,"ReadableByteStreamControllerClose");function Ht(e,t){const r=e._controlledReadableByteStream;if(e._closeRequested||r._state!=="readable")return;const{buffer:s,byteOffset:u,byteLength:c}=t;if(Ae(s))throw new TypeError("chunk's buffer is detached and so cannot be enqueued");const d=we(s);if(e._pendingPullIntos.length>0){const m=e._pendingPullIntos.peek();if(Ae(m.buffer))throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");Qr(e),m.buffer=we(m.buffer),m.readerType==="none"&&mo(e,m)}if(to(r))if(aa(e),$t(r)===0)xt(e,d,u,c);else{e._pendingPullIntos.length>0&&Ye(e);const m=new Uint8Array(d,u,c);Lr(r,m,!1)}else Kr(r)?(xt(e,d,u,c),Yr(e)):xt(e,d,u,c);Fe(e)}n(Ht,"ReadableByteStreamControllerEnqueue");function K(e,t){const r=e._controlledReadableByteStream;r._state==="readable"&&(ho(e),Be(e),Nt(e),Zo(r,t))}n(K,"ReadableByteStreamControllerError");function wo(e,t){const r=e._queue.shift();e._queueTotalSize-=r.byteLength,_o(e);const s=new Uint8Array(r.buffer,r.byteOffset,r.byteLength);t._chunkSteps(s)}n(wo,"ReadableByteStreamControllerFillReadRequestFromQueue");function Gr(e){if(e._byobRequest===null&&e._pendingPullIntos.length>0){const t=e._pendingPullIntos.peek(),r=new Uint8Array(t.buffer,t.byteOffset+t.bytesFilled,t.byteLength-t.bytesFilled),s=Object.create(Re.prototype);da(s,e,r),e._byobRequest=s}return e._byobRequest}n(Gr,"ReadableByteStreamControllerGetBYOBRequest");function Ro(e){const t=e._controlledReadableByteStream._state;return t==="errored"?null:t==="closed"?0:e._strategyHWM-e._queueTotalSize}n(Ro,"ReadableByteStreamControllerGetDesiredSize");function Vt(e,t){const r=e._pendingPullIntos.peek();if(e._controlledReadableByteStream._state==="closed"){if(t!==0)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream")}else{if(t===0)throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");if(r.bytesFilled+t>r.byteLength)throw new RangeError("bytesWritten out of range")}r.buffer=we(r.buffer),So(e,t)}n(Vt,"ReadableByteStreamControllerRespond");function Qt(e,t){const r=e._pendingPullIntos.peek();if(e._controlledReadableByteStream._state==="closed"){if(t.byteLength!==0)throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream")}else if(t.byteLength===0)throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");if(r.byteOffset+r.bytesFilled!==t.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(r.bufferByteLength!==t.buffer.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");if(r.bytesFilled+t.byteLength>r.byteLength)throw new RangeError("The region specified by view is larger than byobRequest");const u=t.byteLength;r.buffer=we(t.buffer),So(e,u)}n(Qt,"ReadableByteStreamControllerRespondWithNewView");function To(e,t,r,s,u,c,d){t._controlledReadableByteStream=e,t._pullAgain=!1,t._pulling=!1,t._byobRequest=null,t._queue=t._queueTotalSize=void 0,Be(t),t._closeRequested=!1,t._started=!1,t._strategyHWM=c,t._pullAlgorithm=s,t._cancelAlgorithm=u,t._autoAllocateChunkSize=d,t._pendingPullIntos=new D,e._readableStreamController=t;const m=r();g(T(m),()=>(t._started=!0,Fe(t),null),R=>(K(t,R),null))}n(To,"SetUpReadableByteStreamController");function ca(e,t,r){const s=Object.create(te.prototype);let u,c,d;t.start!==void 0?u=n(()=>t.start(s),"startAlgorithm"):u=n(()=>{},"startAlgorithm"),t.pull!==void 0?c=n(()=>t.pull(s),"pullAlgorithm"):c=n(()=>T(void 0),"pullAlgorithm"),t.cancel!==void 0?d=n(R=>t.cancel(R),"cancelAlgorithm"):d=n(()=>T(void 0),"cancelAlgorithm");const m=t.autoAllocateChunkSize;if(m===0)throw new TypeError("autoAllocateChunkSize must be greater than 0");To(e,s,u,c,d,r,m)}n(ca,"SetUpReadableByteStreamControllerFromUnderlyingSource");function da(e,t,r){e._associatedReadableByteStreamController=t,e._view=r}n(da,"SetUpReadableStreamBYOBRequest");function Zr(e){return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`)}n(Zr,"byobRequestBrandCheckException");function Rt(e){return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`)}n(Rt,"byteStreamControllerBrandCheckException");function ha(e,t){ue(e,t);const r=e?.mode;return{mode:r===void 0?void 0:pa(r,`${t} has member 'mode' that`)}}n(ha,"convertReaderOptions");function pa(e,t){if(e=`${e}`,e!=="byob")throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);return e}n(pa,"convertReadableStreamReaderMode");function ba(e,t){var r;ue(e,t);const s=(r=e?.min)!==null&&r!==void 0?r:1;return{min:Fr(s,`${t} has member 'min' that`)}}n(ba,"convertByobReadOptions");function Co(e){return new ce(e)}n(Co,"AcquireReadableStreamBYOBReader");function Po(e,t){e._reader._readIntoRequests.push(t)}n(Po,"ReadableStreamAddReadIntoRequest");function ma(e,t,r){const u=e._reader._readIntoRequests.shift();r?u._closeSteps(t):u._chunkSteps(t)}n(ma,"ReadableStreamFulfillReadIntoRequest");function vo(e){return e._reader._readIntoRequests.length}n(vo,"ReadableStreamGetNumReadIntoRequests");function Kr(e){const t=e._reader;return!(t===void 0||!je(t))}n(Kr,"ReadableStreamHasBYOBReader");const Sn=class Sn{constructor(t){if(Se(t,1,"ReadableStreamBYOBReader"),jr(t,"First parameter"),qe(t))throw new TypeError("This stream has already been locked for exclusive reading by another reader");if(!Ie(t._readableStreamController))throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");Yn(this,t),this._readIntoRequests=new D}get closed(){return je(this)?this._closedPromise:b(Yt("closed"))}cancel(t=void 0){return je(this)?this._ownerReadableStream===void 0?b(Lt("cancel")):Wr(this,t):b(Yt("cancel"))}read(t,r={}){if(!je(this))return b(Yt("read"));if(!ArrayBuffer.isView(t))return b(new TypeError("view must be an array buffer view"));if(t.byteLength===0)return b(new TypeError("view must have non-zero byteLength"));if(t.buffer.byteLength===0)return b(new TypeError("view's buffer must have non-zero byteLength"));if(Ae(t.buffer))return b(new TypeError("view's buffer has been detached"));let s;try{s=ba(r,"options")}catch(y){return b(y)}const u=s.min;if(u===0)return b(new TypeError("options.min must be greater than 0"));if(oa(t)){if(u>t.byteLength)return b(new RangeError("options.min must be less than or equal to view's byteLength"))}else if(u>t.length)return b(new RangeError("options.min must be less than or equal to view's length"));if(this._ownerReadableStream===void 0)return b(Lt("read from"));let c,d;const m=A((y,C)=>{c=y,d=C});return Eo(this,t,u,{_chunkSteps:n(y=>c({value:y,done:!1}),"_chunkSteps"),_closeSteps:n(y=>c({value:y,done:!0}),"_closeSteps"),_errorSteps:n(y=>d(y),"_errorSteps")}),m}releaseLock(){if(!je(this))throw Yt("releaseLock");this._ownerReadableStream!==void 0&&ya(this)}};n(Sn,"ReadableStreamBYOBReader");let ce=Sn;Object.defineProperties(ce.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),h(ce.prototype.cancel,"cancel"),h(ce.prototype.read,"read"),h(ce.prototype.releaseLock,"releaseLock"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ce.prototype,Symbol.toStringTag,{value:"ReadableStreamBYOBReader",configurable:!0});function je(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")?!1:e instanceof ce}n(je,"IsReadableStreamBYOBReader");function Eo(e,t,r,s){const u=e._ownerReadableStream;u._disturbed=!0,u._state==="errored"?s._errorSteps(u._storedError):sa(u._readableStreamController,t,r,s)}n(Eo,"ReadableStreamBYOBReaderRead");function ya(e){_e(e);const t=new TypeError("Reader was released");Ao(e,t)}n(ya,"ReadableStreamBYOBReaderRelease");function Ao(e,t){const r=e._readIntoRequests;e._readIntoRequests=new D,r.forEach(s=>{s._errorSteps(t)})}n(Ao,"ReadableStreamBYOBReaderErrorReadIntoRequests");function Yt(e){return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`)}n(Yt,"byobReaderBrandCheckException");function Tt(e,t){const{highWaterMark:r}=e;if(r===void 0)return t;if(ao(r)||r<0)throw new RangeError("Invalid highWaterMark");return r}n(Tt,"ExtractHighWaterMark");function Gt(e){const{size:t}=e;return t||(()=>1)}n(Gt,"ExtractSizeAlgorithm");function Zt(e,t){ue(e,t);const r=e?.highWaterMark,s=e?.size;return{highWaterMark:r===void 0?void 0:Ir(r),size:s===void 0?void 0:ga(s,`${t} has member 'size' that`)}}n(Zt,"convertQueuingStrategy");function ga(e,t){return Z(e,t),r=>Ir(e(r))}n(ga,"convertQueuingStrategySize");function _a(e,t){ue(e,t);const r=e?.abort,s=e?.close,u=e?.start,c=e?.type,d=e?.write;return{abort:r===void 0?void 0:Sa(r,e,`${t} has member 'abort' that`),close:s===void 0?void 0:wa(s,e,`${t} has member 'close' that`),start:u===void 0?void 0:Ra(u,e,`${t} has member 'start' that`),write:d===void 0?void 0:Ta(d,e,`${t} has member 'write' that`),type:c}}n(_a,"convertUnderlyingSink");function Sa(e,t,r){return Z(e,r),s=>j(e,t,[s])}n(Sa,"convertUnderlyingSinkAbortCallback");function wa(e,t,r){return Z(e,r),()=>j(e,t,[])}n(wa,"convertUnderlyingSinkCloseCallback");function Ra(e,t,r){return Z(e,r),s=>z(e,t,[s])}n(Ra,"convertUnderlyingSinkStartCallback");function Ta(e,t,r){return Z(e,r),(s,u)=>j(e,t,[s,u])}n(Ta,"convertUnderlyingSinkWriteCallback");function Bo(e,t){if(!Ge(e))throw new TypeError(`${t} is not a WritableStream.`)}n(Bo,"assertWritableStream");function Ca(e){if(typeof e!="object"||e===null)return!1;try{return typeof e.aborted=="boolean"}catch{return!1}}n(Ca,"isAbortSignal");const Pa=typeof AbortController=="function";function va(){if(Pa)return new AbortController}n(va,"createAbortController");const wn=class wn{constructor(t={},r={}){t===void 0?t=null:Jn(t,"First parameter");const s=Zt(r,"Second parameter"),u=_a(t,"First parameter");if(Wo(this),u.type!==void 0)throw new RangeError("Invalid type is specified");const d=Gt(s),m=Tt(s,1);Da(this,u,m,d)}get locked(){if(!Ge(this))throw tr("locked");return Ze(this)}abort(t=void 0){return Ge(this)?Ze(this)?b(new TypeError("Cannot abort a stream that already has a writer")):Kt(this,t):b(tr("abort"))}close(){return Ge(this)?Ze(this)?b(new TypeError("Cannot close a stream that already has a writer")):he(this)?b(new TypeError("Cannot close an already-closing stream")):qo(this):b(tr("close"))}getWriter(){if(!Ge(this))throw tr("getWriter");return ko(this)}};n(wn,"WritableStream");let de=wn;Object.defineProperties(de.prototype,{abort:{enumerable:!0},close:{enumerable:!0},getWriter:{enumerable:!0},locked:{enumerable:!0}}),h(de.prototype.abort,"abort"),h(de.prototype.close,"close"),h(de.prototype.getWriter,"getWriter"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(de.prototype,Symbol.toStringTag,{value:"WritableStream",configurable:!0});function ko(e){return new re(e)}n(ko,"AcquireWritableStreamDefaultWriter");function Ea(e,t,r,s,u=1,c=()=>1){const d=Object.create(de.prototype);Wo(d);const m=Object.create(ke.prototype);return Lo(d,m,e,t,r,s,u,c),d}n(Ea,"CreateWritableStream");function Wo(e){e._state="writable",e._storedError=void 0,e._writer=void 0,e._writableStreamController=void 0,e._writeRequests=new D,e._inFlightWriteRequest=void 0,e._closeRequest=void 0,e._inFlightCloseRequest=void 0,e._pendingAbortRequest=void 0,e._backpressure=!1}n(Wo,"InitializeWritableStream");function Ge(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")?!1:e instanceof de}n(Ge,"IsWritableStream");function Ze(e){return e._writer!==void 0}n(Ze,"IsWritableStreamLocked");function Kt(e,t){var r;if(e._state==="closed"||e._state==="errored")return T(void 0);e._writableStreamController._abortReason=t,(r=e._writableStreamController._abortController)===null||r===void 0||r.abort(t);const s=e._state;if(s==="closed"||s==="errored")return T(void 0);if(e._pendingAbortRequest!==void 0)return e._pendingAbortRequest._promise;let u=!1;s==="erroring"&&(u=!0,t=void 0);const c=A((d,m)=>{e._pendingAbortRequest={_promise:void 0,_resolve:d,_reject:m,_reason:t,_wasAlreadyErroring:u}});return e._pendingAbortRequest._promise=c,u||Xr(e,t),c}n(Kt,"WritableStreamAbort");function qo(e){const t=e._state;if(t==="closed"||t==="errored")return b(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));const r=A((u,c)=>{const d={_resolve:u,_reject:c};e._closeRequest=d}),s=e._writer;return s!==void 0&&e._backpressure&&t==="writable"&&ln(s),Ma(e._writableStreamController),r}n(qo,"WritableStreamClose");function Aa(e){return A((r,s)=>{const u={_resolve:r,_reject:s};e._writeRequests.push(u)})}n(Aa,"WritableStreamAddWriteRequest");function Jr(e,t){if(e._state==="writable"){Xr(e,t);return}en(e)}n(Jr,"WritableStreamDealWithRejection");function Xr(e,t){const r=e._writableStreamController;e._state="erroring",e._storedError=t;const s=e._writer;s!==void 0&&zo(s,t),!Oa(e)&&r._started&&en(e)}n(Xr,"WritableStreamStartErroring");function en(e){e._state="errored",e._writableStreamController[Qn]();const t=e._storedError;if(e._writeRequests.forEach(u=>{u._reject(t)}),e._writeRequests=new D,e._pendingAbortRequest===void 0){Jt(e);return}const r=e._pendingAbortRequest;if(e._pendingAbortRequest=void 0,r._wasAlreadyErroring){r._reject(t),Jt(e);return}const s=e._writableStreamController[jt](r._reason);g(s,()=>(r._resolve(),Jt(e),null),u=>(r._reject(u),Jt(e),null))}n(en,"WritableStreamFinishErroring");function Ba(e){e._inFlightWriteRequest._resolve(void 0),e._inFlightWriteRequest=void 0}n(Ba,"WritableStreamFinishInFlightWrite");function ka(e,t){e._inFlightWriteRequest._reject(t),e._inFlightWriteRequest=void 0,Jr(e,t)}n(ka,"WritableStreamFinishInFlightWriteWithError");function Wa(e){e._inFlightCloseRequest._resolve(void 0),e._inFlightCloseRequest=void 0,e._state==="erroring"&&(e._storedError=void 0,e._pendingAbortRequest!==void 0&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)),e._state="closed";const r=e._writer;r!==void 0&&Uo(r)}n(Wa,"WritableStreamFinishInFlightClose");function qa(e,t){e._inFlightCloseRequest._reject(t),e._inFlightCloseRequest=void 0,e._pendingAbortRequest!==void 0&&(e._pendingAbortRequest._reject(t),e._pendingAbortRequest=void 0),Jr(e,t)}n(qa,"WritableStreamFinishInFlightCloseWithError");function he(e){return!(e._closeRequest===void 0&&e._inFlightCloseRequest===void 0)}n(he,"WritableStreamCloseQueuedOrInFlight");function Oa(e){return!(e._inFlightWriteRequest===void 0&&e._inFlightCloseRequest===void 0)}n(Oa,"WritableStreamHasOperationMarkedInFlight");function za(e){e._inFlightCloseRequest=e._closeRequest,e._closeRequest=void 0}n(za,"WritableStreamMarkCloseRequestInFlight");function Ia(e){e._inFlightWriteRequest=e._writeRequests.shift()}n(Ia,"WritableStreamMarkFirstWriteRequestInFlight");function Jt(e){e._closeRequest!==void 0&&(e._closeRequest._reject(e._storedError),e._closeRequest=void 0);const t=e._writer;t!==void 0&&an(t,e._storedError)}n(Jt,"WritableStreamRejectCloseAndClosedPromiseIfNeeded");function tn(e,t){const r=e._writer;r!==void 0&&t!==e._backpressure&&(t?Ya(r):ln(r)),e._backpressure=t}n(tn,"WritableStreamUpdateBackpressure");const Rn=class Rn{constructor(t){if(Se(t,1,"WritableStreamDefaultWriter"),Bo(t,"First parameter"),Ze(t))throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=t,t._writer=this;const r=t._state;if(r==="writable")!he(t)&&t._backpressure?nr(this):xo(this),rr(this);else if(r==="erroring")sn(this,t._storedError),rr(this);else if(r==="closed")xo(this),Va(this);else{const s=t._storedError;sn(this,s),Mo(this,s)}}get closed(){return Le(this)?this._closedPromise:b($e("closed"))}get desiredSize(){if(!Le(this))throw $e("desiredSize");if(this._ownerWritableStream===void 0)throw Pt("desiredSize");return $a(this)}get ready(){return Le(this)?this._readyPromise:b($e("ready"))}abort(t=void 0){return Le(this)?this._ownerWritableStream===void 0?b(Pt("abort")):Fa(this,t):b($e("abort"))}close(){if(!Le(this))return b($e("close"));const t=this._ownerWritableStream;return t===void 0?b(Pt("close")):he(t)?b(new TypeError("Cannot close an already-closing stream")):Oo(this)}releaseLock(){if(!Le(this))throw $e("releaseLock");this._ownerWritableStream!==void 0&&Io(this)}write(t=void 0){return Le(this)?this._ownerWritableStream===void 0?b(Pt("write to")):Fo(this,t):b($e("write"))}};n(Rn,"WritableStreamDefaultWriter");let re=Rn;Object.defineProperties(re.prototype,{abort:{enumerable:!0},close:{enumerable:!0},releaseLock:{enumerable:!0},write:{enumerable:!0},closed:{enumerable:!0},desiredSize:{enumerable:!0},ready:{enumerable:!0}}),h(re.prototype.abort,"abort"),h(re.prototype.close,"close"),h(re.prototype.releaseLock,"releaseLock"),h(re.prototype.write,"write"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(re.prototype,Symbol.toStringTag,{value:"WritableStreamDefaultWriter",configurable:!0});function Le(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")?!1:e instanceof re}n(Le,"IsWritableStreamDefaultWriter");function Fa(e,t){const r=e._ownerWritableStream;return Kt(r,t)}n(Fa,"WritableStreamDefaultWriterAbort");function Oo(e){const t=e._ownerWritableStream;return qo(t)}n(Oo,"WritableStreamDefaultWriterClose");function ja(e){const t=e._ownerWritableStream,r=t._state;return he(t)||r==="closed"?T(void 0):r==="errored"?b(t._storedError):Oo(e)}n(ja,"WritableStreamDefaultWriterCloseWithErrorPropagation");function La(e,t){e._closedPromiseState==="pending"?an(e,t):Qa(e,t)}n(La,"WritableStreamDefaultWriterEnsureClosedPromiseRejected");function zo(e,t){e._readyPromiseState==="pending"?No(e,t):Ga(e,t)}n(zo,"WritableStreamDefaultWriterEnsureReadyPromiseRejected");function $a(e){const t=e._ownerWritableStream,r=t._state;return r==="errored"||r==="erroring"?null:r==="closed"?0:$o(t._writableStreamController)}n($a,"WritableStreamDefaultWriterGetDesiredSize");function Io(e){const t=e._ownerWritableStream,r=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");zo(e,r),La(e,r),t._writer=void 0,e._ownerWritableStream=void 0}n(Io,"WritableStreamDefaultWriterRelease");function Fo(e,t){const r=e._ownerWritableStream,s=r._writableStreamController,u=Ua(s,t);if(r!==e._ownerWritableStream)return b(Pt("write to"));const c=r._state;if(c==="errored")return b(r._storedError);if(he(r)||c==="closed")return b(new TypeError("The stream is closing or closed and cannot be written to"));if(c==="erroring")return b(r._storedError);const d=Aa(r);return xa(s,t,u),d}n(Fo,"WritableStreamDefaultWriterWrite");const jo={},Tn=class Tn{constructor(){throw new TypeError("Illegal constructor")}get abortReason(){if(!rn(this))throw on("abortReason");return this._abortReason}get signal(){if(!rn(this))throw on("signal");if(this._abortController===void 0)throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");return this._abortController.signal}error(t=void 0){if(!rn(this))throw on("error");this._controlledWritableStream._state==="writable"&&Do(this,t)}[jt](t){const r=this._abortAlgorithm(t);return Xt(this),r}[Qn](){Be(this)}};n(Tn,"WritableStreamDefaultController");let ke=Tn;Object.defineProperties(ke.prototype,{abortReason:{enumerable:!0},signal:{enumerable:!0},error:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ke.prototype,Symbol.toStringTag,{value:"WritableStreamDefaultController",configurable:!0});function rn(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledWritableStream")?!1:e instanceof ke}n(rn,"IsWritableStreamDefaultController");function Lo(e,t,r,s,u,c,d,m){t._controlledWritableStream=e,e._writableStreamController=t,t._queue=void 0,t._queueTotalSize=void 0,Be(t),t._abortReason=void 0,t._abortController=va(),t._started=!1,t._strategySizeAlgorithm=m,t._strategyHWM=d,t._writeAlgorithm=s,t._closeAlgorithm=u,t._abortAlgorithm=c;const R=nn(t);tn(e,R);const y=r(),C=T(y);g(C,()=>(t._started=!0,er(t),null),P=>(t._started=!0,Jr(e,P),null))}n(Lo,"SetUpWritableStreamDefaultController");function Da(e,t,r,s){const u=Object.create(ke.prototype);let c,d,m,R;t.start!==void 0?c=n(()=>t.start(u),"startAlgorithm"):c=n(()=>{},"startAlgorithm"),t.write!==void 0?d=n(y=>t.write(y,u),"writeAlgorithm"):d=n(()=>T(void 0),"writeAlgorithm"),t.close!==void 0?m=n(()=>t.close(),"closeAlgorithm"):m=n(()=>T(void 0),"closeAlgorithm"),t.abort!==void 0?R=n(y=>t.abort(y),"abortAlgorithm"):R=n(()=>T(void 0),"abortAlgorithm"),Lo(e,u,c,d,m,R,r,s)}n(Da,"SetUpWritableStreamDefaultControllerFromUnderlyingSink");function Xt(e){e._writeAlgorithm=void 0,e._closeAlgorithm=void 0,e._abortAlgorithm=void 0,e._strategySizeAlgorithm=void 0}n(Xt,"WritableStreamDefaultControllerClearAlgorithms");function Ma(e){Nr(e,jo,0),er(e)}n(Ma,"WritableStreamDefaultControllerClose");function Ua(e,t){try{return e._strategySizeAlgorithm(t)}catch(r){return Ct(e,r),1}}n(Ua,"WritableStreamDefaultControllerGetChunkSize");function $o(e){return e._strategyHWM-e._queueTotalSize}n($o,"WritableStreamDefaultControllerGetDesiredSize");function xa(e,t,r){try{Nr(e,t,r)}catch(u){Ct(e,u);return}const s=e._controlledWritableStream;if(!he(s)&&s._state==="writable"){const u=nn(e);tn(s,u)}er(e)}n(xa,"WritableStreamDefaultControllerWrite");function er(e){const t=e._controlledWritableStream;if(!e._started||t._inFlightWriteRequest!==void 0)return;if(t._state==="erroring"){en(t);return}if(e._queue.length===0)return;const s=na(e);s===jo?Na(e):Ha(e,s)}n(er,"WritableStreamDefaultControllerAdvanceQueueIfNeeded");function Ct(e,t){e._controlledWritableStream._state==="writable"&&Do(e,t)}n(Ct,"WritableStreamDefaultControllerErrorIfNeeded");function Na(e){const t=e._controlledWritableStream;za(t),xr(e);const r=e._closeAlgorithm();Xt(e),g(r,()=>(Wa(t),null),s=>(qa(t,s),null))}n(Na,"WritableStreamDefaultControllerProcessClose");function Ha(e,t){const r=e._controlledWritableStream;Ia(r);const s=e._writeAlgorithm(t);g(s,()=>{Ba(r);const u=r._state;if(xr(e),!he(r)&&u==="writable"){const c=nn(e);tn(r,c)}return er(e),null},u=>(r._state==="writable"&&Xt(e),ka(r,u),null))}n(Ha,"WritableStreamDefaultControllerProcessWrite");function nn(e){return $o(e)<=0}n(nn,"WritableStreamDefaultControllerGetBackpressure");function Do(e,t){const r=e._controlledWritableStream;Xt(e),Xr(r,t)}n(Do,"WritableStreamDefaultControllerError");function tr(e){return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`)}n(tr,"streamBrandCheckException$2");function on(e){return new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`)}n(on,"defaultControllerBrandCheckException$2");function $e(e){return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`)}n($e,"defaultWriterBrandCheckException");function Pt(e){return new TypeError("Cannot "+e+" a stream using a released writer")}n(Pt,"defaultWriterLockException");function rr(e){e._closedPromise=A((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r,e._closedPromiseState="pending"})}n(rr,"defaultWriterClosedPromiseInitialize");function Mo(e,t){rr(e),an(e,t)}n(Mo,"defaultWriterClosedPromiseInitializeAsRejected");function Va(e){rr(e),Uo(e)}n(Va,"defaultWriterClosedPromiseInitializeAsResolved");function an(e,t){e._closedPromise_reject!==void 0&&(Q(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="rejected")}n(an,"defaultWriterClosedPromiseReject");function Qa(e,t){Mo(e,t)}n(Qa,"defaultWriterClosedPromiseResetToRejected");function Uo(e){e._closedPromise_resolve!==void 0&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="resolved")}n(Uo,"defaultWriterClosedPromiseResolve");function nr(e){e._readyPromise=A((t,r)=>{e._readyPromise_resolve=t,e._readyPromise_reject=r}),e._readyPromiseState="pending"}n(nr,"defaultWriterReadyPromiseInitialize");function sn(e,t){nr(e),No(e,t)}n(sn,"defaultWriterReadyPromiseInitializeAsRejected");function xo(e){nr(e),ln(e)}n(xo,"defaultWriterReadyPromiseInitializeAsResolved");function No(e,t){e._readyPromise_reject!==void 0&&(Q(e._readyPromise),e._readyPromise_reject(t),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="rejected")}n(No,"defaultWriterReadyPromiseReject");function Ya(e){nr(e)}n(Ya,"defaultWriterReadyPromiseReset");function Ga(e,t){sn(e,t)}n(Ga,"defaultWriterReadyPromiseResetToRejected");function ln(e){e._readyPromise_resolve!==void 0&&(e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="fulfilled")}n(ln,"defaultWriterReadyPromiseResolve");function Za(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof _shared_node_fetch_native_DfbY2q_x_mjs__WEBPACK_IMPORTED_MODULE_6__.c<"u")return _shared_node_fetch_native_DfbY2q_x_mjs__WEBPACK_IMPORTED_MODULE_6__.c}n(Za,"getGlobals");const un=Za();function Ka(e){if(!(typeof e=="function"||typeof e=="object")||e.name!=="DOMException")return!1;try{return new e,!0}catch{return!1}}n(Ka,"isDOMExceptionConstructor");function Ja(){const e=un?.DOMException;return Ka(e)?e:void 0}n(Ja,"getFromGlobal");function Xa(){const e=n(function(r,s){this.message=r||"",this.name=s||"Error",Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)},"DOMException");return h(e,"DOMException"),e.prototype=Object.create(Error.prototype),Object.defineProperty(e.prototype,"constructor",{value:e,writable:!0,configurable:!0}),e}n(Xa,"createPolyfill");const es=Ja()||Xa();function Ho(e,t,r,s,u,c){const d=Qe(e),m=ko(t);e._disturbed=!0;let R=!1,y=T(void 0);return A((C,P)=>{let B;if(c!==void 0){if(B=n(()=>{const _=c.reason!==void 0?c.reason:new es("Aborted","AbortError"),E=[];s||E.push(()=>t._state==="writable"?Kt(t,_):T(void 0)),u||E.push(()=>e._state==="readable"?ie(e,_):T(void 0)),N(()=>Promise.all(E.map(k=>k())),!0,_)},"abortAlgorithm"),c.aborted){B();return}c.addEventListener("abort",B)}function ae(){return A((_,E)=>{function k(Y){Y?_():q(nt(),k,E)}n(k,"next"),k(!1)})}n(ae,"pipeLoop");function nt(){return R?T(!0):q(m._readyPromise,()=>A((_,E)=>{_t(d,{_chunkSteps:n(k=>{y=q(Fo(m,k),void 0,f),_(!1)},"_chunkSteps"),_closeSteps:n(()=>_(!0),"_closeSteps"),_errorSteps:E})}))}if(n(nt,"pipeStep"),Te(e,d._closedPromise,_=>(s?J(!0,_):N(()=>Kt(t,_),!0,_),null)),Te(t,m._closedPromise,_=>(u?J(!0,_):N(()=>ie(e,_),!0,_),null)),x(e,d._closedPromise,()=>(r?J():N(()=>ja(m)),null)),he(t)||t._state==="closed"){const _=new TypeError("the destination writable stream closed before all data could be piped to it");u?J(!0,_):N(()=>ie(e,_),!0,_)}Q(ae());function Oe(){const _=y;return q(y,()=>_!==y?Oe():void 0)}n(Oe,"waitForWritesToFinish");function Te(_,E,k){_._state==="errored"?k(_._storedError):I(E,k)}n(Te,"isOrBecomesErrored");function x(_,E,k){_._state==="closed"?k():V(E,k)}n(x,"isOrBecomesClosed");function N(_,E,k){if(R)return;R=!0,t._state==="writable"&&!he(t)?V(Oe(),Y):Y();function Y(){return g(_(),()=>Ce(E,k),ot=>Ce(!0,ot)),null}n(Y,"doTheRest")}n(N,"shutdownWithAction");function J(_,E){R||(R=!0,t._state==="writable"&&!he(t)?V(Oe(),()=>Ce(_,E)):Ce(_,E))}n(J,"shutdown");function Ce(_,E){return Io(m),_e(d),c!==void 0&&c.removeEventListener("abort",B),_?P(E):C(void 0),null}n(Ce,"finalize")})}n(Ho,"ReadableStreamPipeTo");const Cn=class Cn{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!or(this))throw ar("desiredSize");return fn(this)}close(){if(!or(this))throw ar("close");if(!Je(this))throw new TypeError("The stream is not in a state that permits close");De(this)}enqueue(t=void 0){if(!or(this))throw ar("enqueue");if(!Je(this))throw new TypeError("The stream is not in a state that permits enqueue");return Ke(this,t)}error(t=void 0){if(!or(this))throw ar("error");oe(this,t)}[Ar](t){Be(this);const r=this._cancelAlgorithm(t);return ir(this),r}[Br](t){const r=this._controlledReadableStream;if(this._queue.length>0){const s=xr(this);this._closeRequested&&this._queue.length===0?(ir(this),At(r)):vt(this),t._chunkSteps(s)}else eo(r,t),vt(this)}[kr](){}};n(Cn,"ReadableStreamDefaultController");let ne=Cn;Object.defineProperties(ne.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},desiredSize:{enumerable:!0}}),h(ne.prototype.close,"close"),h(ne.prototype.enqueue,"enqueue"),h(ne.prototype.error,"error"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ne.prototype,Symbol.toStringTag,{value:"ReadableStreamDefaultController",configurable:!0});function or(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledReadableStream")?!1:e instanceof ne}n(or,"IsReadableStreamDefaultController");function vt(e){if(!Vo(e))return;if(e._pulling){e._pullAgain=!0;return}e._pulling=!0;const r=e._pullAlgorithm();g(r,()=>(e._pulling=!1,e._pullAgain&&(e._pullAgain=!1,vt(e)),null),s=>(oe(e,s),null))}n(vt,"ReadableStreamDefaultControllerCallPullIfNeeded");function Vo(e){const t=e._controlledReadableStream;return!Je(e)||!e._started?!1:!!(qe(t)&&$t(t)>0||fn(e)>0)}n(Vo,"ReadableStreamDefaultControllerShouldCallPull");function ir(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0,e._strategySizeAlgorithm=void 0}n(ir,"ReadableStreamDefaultControllerClearAlgorithms");function De(e){if(!Je(e))return;const t=e._controlledReadableStream;e._closeRequested=!0,e._queue.length===0&&(ir(e),At(t))}n(De,"ReadableStreamDefaultControllerClose");function Ke(e,t){if(!Je(e))return;const r=e._controlledReadableStream;if(qe(r)&&$t(r)>0)Lr(r,t,!1);else{let s;try{s=e._strategySizeAlgorithm(t)}catch(u){throw oe(e,u),u}try{Nr(e,t,s)}catch(u){throw oe(e,u),u}}vt(e)}n(Ke,"ReadableStreamDefaultControllerEnqueue");function oe(e,t){const r=e._controlledReadableStream;r._state==="readable"&&(Be(e),ir(e),Zo(r,t))}n(oe,"ReadableStreamDefaultControllerError");function fn(e){const t=e._controlledReadableStream._state;return t==="errored"?null:t==="closed"?0:e._strategyHWM-e._queueTotalSize}n(fn,"ReadableStreamDefaultControllerGetDesiredSize");function ts(e){return!Vo(e)}n(ts,"ReadableStreamDefaultControllerHasBackpressure");function Je(e){const t=e._controlledReadableStream._state;return!e._closeRequested&&t==="readable"}n(Je,"ReadableStreamDefaultControllerCanCloseOrEnqueue");function Qo(e,t,r,s,u,c,d){t._controlledReadableStream=e,t._queue=void 0,t._queueTotalSize=void 0,Be(t),t._started=!1,t._closeRequested=!1,t._pullAgain=!1,t._pulling=!1,t._strategySizeAlgorithm=d,t._strategyHWM=c,t._pullAlgorithm=s,t._cancelAlgorithm=u,e._readableStreamController=t;const m=r();g(T(m),()=>(t._started=!0,vt(t),null),R=>(oe(t,R),null))}n(Qo,"SetUpReadableStreamDefaultController");function rs(e,t,r,s){const u=Object.create(ne.prototype);let c,d,m;t.start!==void 0?c=n(()=>t.start(u),"startAlgorithm"):c=n(()=>{},"startAlgorithm"),t.pull!==void 0?d=n(()=>t.pull(u),"pullAlgorithm"):d=n(()=>T(void 0),"pullAlgorithm"),t.cancel!==void 0?m=n(R=>t.cancel(R),"cancelAlgorithm"):m=n(()=>T(void 0),"cancelAlgorithm"),Qo(e,u,c,d,m,r,s)}n(rs,"SetUpReadableStreamDefaultControllerFromUnderlyingSource");function ar(e){return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`)}n(ar,"defaultControllerBrandCheckException$1");function ns(e,t){return Ie(e._readableStreamController)?is(e):os(e)}n(ns,"ReadableStreamTee");function os(e,t){const r=Qe(e);let s=!1,u=!1,c=!1,d=!1,m,R,y,C,P;const B=A(x=>{P=x});function ae(){return s?(u=!0,T(void 0)):(s=!0,_t(r,{_chunkSteps:n(N=>{ge(()=>{u=!1;const J=N,Ce=N;c||Ke(y._readableStreamController,J),d||Ke(C._readableStreamController,Ce),s=!1,u&&ae()})},"_chunkSteps"),_closeSteps:n(()=>{s=!1,c||De(y._readableStreamController),d||De(C._readableStreamController),(!c||!d)&&P(void 0)},"_closeSteps"),_errorSteps:n(()=>{s=!1},"_errorSteps")}),T(void 0))}n(ae,"pullAlgorithm");function nt(x){if(c=!0,m=x,d){const N=St([m,R]),J=ie(e,N);P(J)}return B}n(nt,"cancel1Algorithm");function Oe(x){if(d=!0,R=x,c){const N=St([m,R]),J=ie(e,N);P(J)}return B}n(Oe,"cancel2Algorithm");function Te(){}return n(Te,"startAlgorithm"),y=Et(Te,ae,nt),C=Et(Te,ae,Oe),I(r._closedPromise,x=>(oe(y._readableStreamController,x),oe(C._readableStreamController,x),(!c||!d)&&P(void 0),null)),[y,C]}n(os,"ReadableStreamDefaultTee");function is(e){let t=Qe(e),r=!1,s=!1,u=!1,c=!1,d=!1,m,R,y,C,P;const B=A(_=>{P=_});function ae(_){I(_._closedPromise,E=>(_!==t||(K(y._readableStreamController,E),K(C._readableStreamController,E),(!c||!d)&&P(void 0)),null))}n(ae,"forwardReaderError");function nt(){je(t)&&(_e(t),t=Qe(e),ae(t)),_t(t,{_chunkSteps:n(E=>{ge(()=>{s=!1,u=!1;const k=E;let Y=E;if(!c&&!d)try{Y=fo(E)}catch(ot){K(y._readableStreamController,ot),K(C._readableStreamController,ot),P(ie(e,ot));return}c||Ht(y._readableStreamController,k),d||Ht(C._readableStreamController,Y),r=!1,s?Te():u&&x()})},"_chunkSteps"),_closeSteps:n(()=>{r=!1,c||wt(y._readableStreamController),d||wt(C._readableStreamController),y._readableStreamController._pendingPullIntos.length>0&&Vt(y._readableStreamController,0),C._readableStreamController._pendingPullIntos.length>0&&Vt(C._readableStreamController,0),(!c||!d)&&P(void 0)},"_closeSteps"),_errorSteps:n(()=>{r=!1},"_errorSteps")})}n(nt,"pullWithDefaultReader");function Oe(_,E){Ee(t)&&(_e(t),t=Co(e),ae(t));const k=E?C:y,Y=E?y:C;Eo(t,_,1,{_chunkSteps:n(it=>{ge(()=>{s=!1,u=!1;const at=E?d:c;if(E?c:d)at||Qt(k._readableStreamController,it);else{let ui;try{ui=fo(it)}catch(kn){K(k._readableStreamController,kn),K(Y._readableStreamController,kn),P(ie(e,kn));return}at||Qt(k._readableStreamController,it),Ht(Y._readableStreamController,ui)}r=!1,s?Te():u&&x()})},"_chunkSteps"),_closeSteps:n(it=>{r=!1;const at=E?d:c,cr=E?c:d;at||wt(k._readableStreamController),cr||wt(Y._readableStreamController),it!==void 0&&(at||Qt(k._readableStreamController,it),!cr&&Y._readableStreamController._pendingPullIntos.length>0&&Vt(Y._readableStreamController,0)),(!at||!cr)&&P(void 0)},"_closeSteps"),_errorSteps:n(()=>{r=!1},"_errorSteps")})}n(Oe,"pullWithBYOBReader");function Te(){if(r)return s=!0,T(void 0);r=!0;const _=Gr(y._readableStreamController);return _===null?nt():Oe(_._view,!1),T(void 0)}n(Te,"pull1Algorithm");function x(){if(r)return u=!0,T(void 0);r=!0;const _=Gr(C._readableStreamController);return _===null?nt():Oe(_._view,!0),T(void 0)}n(x,"pull2Algorithm");function N(_){if(c=!0,m=_,d){const E=St([m,R]),k=ie(e,E);P(k)}return B}n(N,"cancel1Algorithm");function J(_){if(d=!0,R=_,c){const E=St([m,R]),k=ie(e,E);P(k)}return B}n(J,"cancel2Algorithm");function Ce(){}return n(Ce,"startAlgorithm"),y=Go(Ce,Te,N),C=Go(Ce,x,J),ae(t),[y,C]}n(is,"ReadableByteStreamTee");function as(e){return l(e)&&typeof e.getReader<"u"}n(as,"isReadableStreamLike");function ss(e){return as(e)?us(e.getReader()):ls(e)}n(ss,"ReadableStreamFrom");function ls(e){let t;const r=uo(e,"async"),s=f;function u(){let d;try{d=Xi(r)}catch(R){return b(R)}const m=T(d);return F(m,R=>{if(!l(R))throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");if(ea(R))De(t._readableStreamController);else{const C=ta(R);Ke(t._readableStreamController,C)}})}n(u,"pullAlgorithm");function c(d){const m=r.iterator;let R;try{R=Ut(m,"return")}catch(P){return b(P)}if(R===void 0)return T(void 0);let y;try{y=z(R,m,[d])}catch(P){return b(P)}const C=T(y);return F(C,P=>{if(!l(P))throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object")})}return n(c,"cancelAlgorithm"),t=Et(s,u,c,0),t}n(ls,"ReadableStreamFromIterable");function us(e){let t;const r=f;function s(){let c;try{c=e.read()}catch(d){return b(d)}return F(c,d=>{if(!l(d))throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");if(d.done)De(t._readableStreamController);else{const m=d.value;Ke(t._readableStreamController,m)}})}n(s,"pullAlgorithm");function u(c){try{return T(e.cancel(c))}catch(d){return b(d)}}return n(u,"cancelAlgorithm"),t=Et(r,s,u,0),t}n(us,"ReadableStreamFromDefaultReader");function fs(e,t){ue(e,t);const r=e,s=r?.autoAllocateChunkSize,u=r?.cancel,c=r?.pull,d=r?.start,m=r?.type;return{autoAllocateChunkSize:s===void 0?void 0:Fr(s,`${t} has member 'autoAllocateChunkSize' that`),cancel:u===void 0?void 0:cs(u,r,`${t} has member 'cancel' that`),pull:c===void 0?void 0:ds(c,r,`${t} has member 'pull' that`),start:d===void 0?void 0:hs(d,r,`${t} has member 'start' that`),type:m===void 0?void 0:ps(m,`${t} has member 'type' that`)}}n(fs,"convertUnderlyingDefaultOrByteSource");function cs(e,t,r){return Z(e,r),s=>j(e,t,[s])}n(cs,"convertUnderlyingSourceCancelCallback");function ds(e,t,r){return Z(e,r),s=>j(e,t,[s])}n(ds,"convertUnderlyingSourcePullCallback");function hs(e,t,r){return Z(e,r),s=>z(e,t,[s])}n(hs,"convertUnderlyingSourceStartCallback");function ps(e,t){if(e=`${e}`,e!=="bytes")throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);return e}n(ps,"convertReadableStreamType");function bs(e,t){return ue(e,t),{preventCancel:!!e?.preventCancel}}n(bs,"convertIteratorOptions");function Yo(e,t){ue(e,t);const r=e?.preventAbort,s=e?.preventCancel,u=e?.preventClose,c=e?.signal;return c!==void 0&&ms(c,`${t} has member 'signal' that`),{preventAbort:!!r,preventCancel:!!s,preventClose:!!u,signal:c}}n(Yo,"convertPipeOptions");function ms(e,t){if(!Ca(e))throw new TypeError(`${t} is not an AbortSignal.`)}n(ms,"assertAbortSignal");function ys(e,t){ue(e,t);const r=e?.readable;zr(r,"readable","ReadableWritablePair"),jr(r,`${t} has member 'readable' that`);const s=e?.writable;return zr(s,"writable","ReadableWritablePair"),Bo(s,`${t} has member 'writable' that`),{readable:r,writable:s}}n(ys,"convertReadableWritablePair");const Pn=class Pn{constructor(t={},r={}){t===void 0?t=null:Jn(t,"First parameter");const s=Zt(r,"Second parameter"),u=fs(t,"First parameter");if(cn(this),u.type==="bytes"){if(s.size!==void 0)throw new RangeError("The strategy for a byte stream cannot have a size function");const c=Tt(s,0);ca(this,u,c)}else{const c=Gt(s),d=Tt(s,1);rs(this,u,d,c)}}get locked(){if(!We(this))throw Me("locked");return qe(this)}cancel(t=void 0){return We(this)?qe(this)?b(new TypeError("Cannot cancel a stream that already has a reader")):ie(this,t):b(Me("cancel"))}getReader(t=void 0){if(!We(this))throw Me("getReader");return ha(t,"First parameter").mode===void 0?Qe(this):Co(this)}pipeThrough(t,r={}){if(!We(this))throw Me("pipeThrough");Se(t,1,"pipeThrough");const s=ys(t,"First parameter"),u=Yo(r,"Second parameter");if(qe(this))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");if(Ze(s.writable))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");const c=Ho(this,s.writable,u.preventClose,u.preventAbort,u.preventCancel,u.signal);return Q(c),s.readable}pipeTo(t,r={}){if(!We(this))return b(Me("pipeTo"));if(t===void 0)return b("Parameter 1 is required in 'pipeTo'.");if(!Ge(t))return b(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));let s;try{s=Yo(r,"Second parameter")}catch(u){return b(u)}return qe(this)?b(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")):Ze(t)?b(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")):Ho(this,t,s.preventClose,s.preventAbort,s.preventCancel,s.signal)}tee(){if(!We(this))throw Me("tee");const t=ns(this);return St(t)}values(t=void 0){if(!We(this))throw Me("values");const r=bs(t,"First parameter");return Ki(this,r.preventCancel)}[Ur](t){return this.values(t)}static from(t){return ss(t)}};n(Pn,"ReadableStream");let L=Pn;Object.defineProperties(L,{from:{enumerable:!0}}),Object.defineProperties(L.prototype,{cancel:{enumerable:!0},getReader:{enumerable:!0},pipeThrough:{enumerable:!0},pipeTo:{enumerable:!0},tee:{enumerable:!0},values:{enumerable:!0},locked:{enumerable:!0}}),h(L.from,"from"),h(L.prototype.cancel,"cancel"),h(L.prototype.getReader,"getReader"),h(L.prototype.pipeThrough,"pipeThrough"),h(L.prototype.pipeTo,"pipeTo"),h(L.prototype.tee,"tee"),h(L.prototype.values,"values"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(L.prototype,Symbol.toStringTag,{value:"ReadableStream",configurable:!0}),Object.defineProperty(L.prototype,Ur,{value:L.prototype.values,writable:!0,configurable:!0});function Et(e,t,r,s=1,u=()=>1){const c=Object.create(L.prototype);cn(c);const d=Object.create(ne.prototype);return Qo(c,d,e,t,r,s,u),c}n(Et,"CreateReadableStream");function Go(e,t,r){const s=Object.create(L.prototype);cn(s);const u=Object.create(te.prototype);return To(s,u,e,t,r,0,void 0),s}n(Go,"CreateReadableByteStream");function cn(e){e._state="readable",e._reader=void 0,e._storedError=void 0,e._disturbed=!1}n(cn,"InitializeReadableStream");function We(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")?!1:e instanceof L}n(We,"IsReadableStream");function qe(e){return e._reader!==void 0}n(qe,"IsReadableStreamLocked");function ie(e,t){if(e._disturbed=!0,e._state==="closed")return T(void 0);if(e._state==="errored")return b(e._storedError);At(e);const r=e._reader;if(r!==void 0&&je(r)){const u=r._readIntoRequests;r._readIntoRequests=new D,u.forEach(c=>{c._closeSteps(void 0)})}const s=e._readableStreamController[Ar](t);return F(s,f)}n(ie,"ReadableStreamCancel");function At(e){e._state="closed";const t=e._reader;if(t!==void 0&&(Zn(t),Ee(t))){const r=t._readRequests;t._readRequests=new D,r.forEach(s=>{s._closeSteps()})}}n(At,"ReadableStreamClose");function Zo(e,t){e._state="errored",e._storedError=t;const r=e._reader;r!==void 0&&(Or(r,t),Ee(r)?ro(r,t):Ao(r,t))}n(Zo,"ReadableStreamError");function Me(e){return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`)}n(Me,"streamBrandCheckException$1");function Ko(e,t){ue(e,t);const r=e?.highWaterMark;return zr(r,"highWaterMark","QueuingStrategyInit"),{highWaterMark:Ir(r)}}n(Ko,"convertQueuingStrategyInit");const Jo=n(e=>e.byteLength,"byteLengthSizeFunction");h(Jo,"size");const vn=class vn{constructor(t){Se(t,1,"ByteLengthQueuingStrategy"),t=Ko(t,"First parameter"),this._byteLengthQueuingStrategyHighWaterMark=t.highWaterMark}get highWaterMark(){if(!ei(this))throw Xo("highWaterMark");return this._byteLengthQueuingStrategyHighWaterMark}get size(){if(!ei(this))throw Xo("size");return Jo}};n(vn,"ByteLengthQueuingStrategy");let Xe=vn;Object.defineProperties(Xe.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Xe.prototype,Symbol.toStringTag,{value:"ByteLengthQueuingStrategy",configurable:!0});function Xo(e){return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`)}n(Xo,"byteLengthBrandCheckException");function ei(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_byteLengthQueuingStrategyHighWaterMark")?!1:e instanceof Xe}n(ei,"IsByteLengthQueuingStrategy");const ti=n(()=>1,"countSizeFunction");h(ti,"size");const En=class En{constructor(t){Se(t,1,"CountQueuingStrategy"),t=Ko(t,"First parameter"),this._countQueuingStrategyHighWaterMark=t.highWaterMark}get highWaterMark(){if(!ni(this))throw ri("highWaterMark");return this._countQueuingStrategyHighWaterMark}get size(){if(!ni(this))throw ri("size");return ti}};n(En,"CountQueuingStrategy");let et=En;Object.defineProperties(et.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(et.prototype,Symbol.toStringTag,{value:"CountQueuingStrategy",configurable:!0});function ri(e){return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`)}n(ri,"countBrandCheckException");function ni(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_countQueuingStrategyHighWaterMark")?!1:e instanceof et}n(ni,"IsCountQueuingStrategy");function gs(e,t){ue(e,t);const r=e?.cancel,s=e?.flush,u=e?.readableType,c=e?.start,d=e?.transform,m=e?.writableType;return{cancel:r===void 0?void 0:Rs(r,e,`${t} has member 'cancel' that`),flush:s===void 0?void 0:_s(s,e,`${t} has member 'flush' that`),readableType:u,start:c===void 0?void 0:Ss(c,e,`${t} has member 'start' that`),transform:d===void 0?void 0:ws(d,e,`${t} has member 'transform' that`),writableType:m}}n(gs,"convertTransformer");function _s(e,t,r){return Z(e,r),s=>j(e,t,[s])}n(_s,"convertTransformerFlushCallback");function Ss(e,t,r){return Z(e,r),s=>z(e,t,[s])}n(Ss,"convertTransformerStartCallback");function ws(e,t,r){return Z(e,r),(s,u)=>j(e,t,[s,u])}n(ws,"convertTransformerTransformCallback");function Rs(e,t,r){return Z(e,r),s=>j(e,t,[s])}n(Rs,"convertTransformerCancelCallback");const An=class An{constructor(t={},r={},s={}){t===void 0&&(t=null);const u=Zt(r,"Second parameter"),c=Zt(s,"Third parameter"),d=gs(t,"First parameter");if(d.readableType!==void 0)throw new RangeError("Invalid readableType specified");if(d.writableType!==void 0)throw new RangeError("Invalid writableType specified");const m=Tt(c,0),R=Gt(c),y=Tt(u,1),C=Gt(u);let P;const B=A(ae=>{P=ae});Ts(this,B,y,C,m,R),Ps(this,d),d.start!==void 0?P(d.start(this._transformStreamController)):P(void 0)}get readable(){if(!oi(this))throw li("readable");return this._readable}get writable(){if(!oi(this))throw li("writable");return this._writable}};n(An,"TransformStream");let tt=An;Object.defineProperties(tt.prototype,{readable:{enumerable:!0},writable:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(tt.prototype,Symbol.toStringTag,{value:"TransformStream",configurable:!0});function Ts(e,t,r,s,u,c){function d(){return t}n(d,"startAlgorithm");function m(B){return As(e,B)}n(m,"writeAlgorithm");function R(B){return Bs(e,B)}n(R,"abortAlgorithm");function y(){return ks(e)}n(y,"closeAlgorithm"),e._writable=Ea(d,m,y,R,r,s);function C(){return Ws(e)}n(C,"pullAlgorithm");function P(B){return qs(e,B)}n(P,"cancelAlgorithm"),e._readable=Et(d,C,P,u,c),e._backpressure=void 0,e._backpressureChangePromise=void 0,e._backpressureChangePromise_resolve=void 0,sr(e,!0),e._transformStreamController=void 0}n(Ts,"InitializeTransformStream");function oi(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_transformStreamController")?!1:e instanceof tt}n(oi,"IsTransformStream");function ii(e,t){oe(e._readable._readableStreamController,t),dn(e,t)}n(ii,"TransformStreamError");function dn(e,t){ur(e._transformStreamController),Ct(e._writable._writableStreamController,t),hn(e)}n(dn,"TransformStreamErrorWritableAndUnblockWrite");function hn(e){e._backpressure&&sr(e,!1)}n(hn,"TransformStreamUnblockWrite");function sr(e,t){e._backpressureChangePromise!==void 0&&e._backpressureChangePromise_resolve(),e._backpressureChangePromise=A(r=>{e._backpressureChangePromise_resolve=r}),e._backpressure=t}n(sr,"TransformStreamSetBackpressure");const Bn=class Bn{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!lr(this))throw fr("desiredSize");const t=this._controlledTransformStream._readable._readableStreamController;return fn(t)}enqueue(t=void 0){if(!lr(this))throw fr("enqueue");ai(this,t)}error(t=void 0){if(!lr(this))throw fr("error");vs(this,t)}terminate(){if(!lr(this))throw fr("terminate");Es(this)}};n(Bn,"TransformStreamDefaultController");let pe=Bn;Object.defineProperties(pe.prototype,{enqueue:{enumerable:!0},error:{enumerable:!0},terminate:{enumerable:!0},desiredSize:{enumerable:!0}}),h(pe.prototype.enqueue,"enqueue"),h(pe.prototype.error,"error"),h(pe.prototype.terminate,"terminate"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(pe.prototype,Symbol.toStringTag,{value:"TransformStreamDefaultController",configurable:!0});function lr(e){return!l(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledTransformStream")?!1:e instanceof pe}n(lr,"IsTransformStreamDefaultController");function Cs(e,t,r,s,u){t._controlledTransformStream=e,e._transformStreamController=t,t._transformAlgorithm=r,t._flushAlgorithm=s,t._cancelAlgorithm=u,t._finishPromise=void 0,t._finishPromise_resolve=void 0,t._finishPromise_reject=void 0}n(Cs,"SetUpTransformStreamDefaultController");function Ps(e,t){const r=Object.create(pe.prototype);let s,u,c;t.transform!==void 0?s=n(d=>t.transform(d,r),"transformAlgorithm"):s=n(d=>{try{return ai(r,d),T(void 0)}catch(m){return b(m)}},"transformAlgorithm"),t.flush!==void 0?u=n(()=>t.flush(r),"flushAlgorithm"):u=n(()=>T(void 0),"flushAlgorithm"),t.cancel!==void 0?c=n(d=>t.cancel(d),"cancelAlgorithm"):c=n(()=>T(void 0),"cancelAlgorithm"),Cs(e,r,s,u,c)}n(Ps,"SetUpTransformStreamDefaultControllerFromTransformer");function ur(e){e._transformAlgorithm=void 0,e._flushAlgorithm=void 0,e._cancelAlgorithm=void 0}n(ur,"TransformStreamDefaultControllerClearAlgorithms");function ai(e,t){const r=e._controlledTransformStream,s=r._readable._readableStreamController;if(!Je(s))throw new TypeError("Readable side is not in a state that permits enqueue");try{Ke(s,t)}catch(c){throw dn(r,c),r._readable._storedError}ts(s)!==r._backpressure&&sr(r,!0)}n(ai,"TransformStreamDefaultControllerEnqueue");function vs(e,t){ii(e._controlledTransformStream,t)}n(vs,"TransformStreamDefaultControllerError");function si(e,t){const r=e._transformAlgorithm(t);return F(r,void 0,s=>{throw ii(e._controlledTransformStream,s),s})}n(si,"TransformStreamDefaultControllerPerformTransform");function Es(e){const t=e._controlledTransformStream,r=t._readable._readableStreamController;De(r);const s=new TypeError("TransformStream terminated");dn(t,s)}n(Es,"TransformStreamDefaultControllerTerminate");function As(e,t){const r=e._transformStreamController;if(e._backpressure){const s=e._backpressureChangePromise;return F(s,()=>{const u=e._writable;if(u._state==="erroring")throw u._storedError;return si(r,t)})}return si(r,t)}n(As,"TransformStreamDefaultSinkWriteAlgorithm");function Bs(e,t){const r=e._transformStreamController;if(r._finishPromise!==void 0)return r._finishPromise;const s=e._readable;r._finishPromise=A((c,d)=>{r._finishPromise_resolve=c,r._finishPromise_reject=d});const u=r._cancelAlgorithm(t);return ur(r),g(u,()=>(s._state==="errored"?rt(r,s._storedError):(oe(s._readableStreamController,t),pn(r)),null),c=>(oe(s._readableStreamController,c),rt(r,c),null)),r._finishPromise}n(Bs,"TransformStreamDefaultSinkAbortAlgorithm");function ks(e){const t=e._transformStreamController;if(t._finishPromise!==void 0)return t._finishPromise;const r=e._readable;t._finishPromise=A((u,c)=>{t._finishPromise_resolve=u,t._finishPromise_reject=c});const s=t._flushAlgorithm();return ur(t),g(s,()=>(r._state==="errored"?rt(t,r._storedError):(De(r._readableStreamController),pn(t)),null),u=>(oe(r._readableStreamController,u),rt(t,u),null)),t._finishPromise}n(ks,"TransformStreamDefaultSinkCloseAlgorithm");function Ws(e){return sr(e,!1),e._backpressureChangePromise}n(Ws,"TransformStreamDefaultSourcePullAlgorithm");function qs(e,t){const r=e._transformStreamController;if(r._finishPromise!==void 0)return r._finishPromise;const s=e._writable;r._finishPromise=A((c,d)=>{r._finishPromise_resolve=c,r._finishPromise_reject=d});const u=r._cancelAlgorithm(t);return ur(r),g(u,()=>(s._state==="errored"?rt(r,s._storedError):(Ct(s._writableStreamController,t),hn(e),pn(r)),null),c=>(Ct(s._writableStreamController,c),hn(e),rt(r,c),null)),r._finishPromise}n(qs,"TransformStreamDefaultSourceCancelAlgorithm");function fr(e){return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`)}n(fr,"defaultControllerBrandCheckException");function pn(e){e._finishPromise_resolve!==void 0&&(e._finishPromise_resolve(),e._finishPromise_resolve=void 0,e._finishPromise_reject=void 0)}n(pn,"defaultControllerFinishPromiseResolve");function rt(e,t){e._finishPromise_reject!==void 0&&(Q(e._finishPromise),e._finishPromise_reject(t),e._finishPromise_resolve=void 0,e._finishPromise_reject=void 0)}n(rt,"defaultControllerFinishPromiseReject");function li(e){return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`)}n(li,"streamBrandCheckException"),a.ByteLengthQueuingStrategy=Xe,a.CountQueuingStrategy=et,a.ReadableByteStreamController=te,a.ReadableStream=L,a.ReadableStreamBYOBReader=ce,a.ReadableStreamBYOBRequest=Re,a.ReadableStreamDefaultController=ne,a.ReadableStreamDefaultReader=fe,a.TransformStream=tt,a.TransformStreamDefaultController=pe,a.WritableStream=de,a.WritableStreamDefaultController=ke,a.WritableStreamDefaultWriter=re})}(kt,kt.exports)),kt.exports}n(Ns,"requirePonyfill_es2018");var mi;function Hs(){if(mi)return pi;mi=1;const i=65536;if(!globalThis.ReadableStream)try{const o=require("node:process"),{emitWarning:a}=o;try{o.emitWarning=()=>{},Object.assign(globalThis,require("node:stream/web")),o.emitWarning=a}catch(f){throw o.emitWarning=a,f}}catch{Object.assign(globalThis,Ns())}try{const{Blob:o}=require("buffer");o&&!o.prototype.stream&&(o.prototype.stream=n(function(f){let l=0;const p=this;return new ReadableStream({type:"bytes",async pull(h){const v=await p.slice(l,Math.min(p.size,l+i)).arrayBuffer();l+=v.byteLength,h.enqueue(new Uint8Array(v)),l===p.size&&h.close()}})},"name"))}catch{}return pi}n(Hs,"requireStreams"),Hs();/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */const yi=65536;async function*Wn(i,o=!0){for(const a of i)if("stream"in a)yield*a.stream();else if(ArrayBuffer.isView(a))if(o){let f=a.byteOffset;const l=a.byteOffset+a.byteLength;for(;f!==l;){const p=Math.min(l-f,yi),h=a.buffer.slice(f,f+p);f+=h.byteLength,yield new Uint8Array(h)}}else yield a;else{let f=0,l=a;for(;f!==l.size;){const h=await l.slice(f,Math.min(l.size,f+yi)).arrayBuffer();f+=h.byteLength,yield new Uint8Array(h)}}}n(Wn,"toIterator");const gi=(ze=class{constructor(o=[],a={}){be(this,ve,[]);be(this,zt,"");be(this,bt,0);be(this,Cr,"transparent");if(typeof o!="object"||o===null)throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");if(typeof o[Symbol.iterator]!="function")throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");if(typeof a!="object"&&typeof a!="function")throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");a===null&&(a={});const f=new TextEncoder;for(const p of o){let h;ArrayBuffer.isView(p)?h=new Uint8Array(p.buffer.slice(p.byteOffset,p.byteOffset+p.byteLength)):p instanceof ArrayBuffer?h=new Uint8Array(p.slice(0)):p instanceof ze?h=p:h=f.encode(`${p}`),X(this,bt,O(this,bt)+(ArrayBuffer.isView(h)?h.byteLength:h.size)),O(this,ve).push(h)}X(this,Cr,`${a.endings===void 0?"transparent":a.endings}`);const l=a.type===void 0?"":String(a.type);X(this,zt,/^[\x20-\x7E]*$/.test(l)?l:"")}get size(){return O(this,bt)}get type(){return O(this,zt)}async text(){const o=new TextDecoder;let a="";for await(const f of Wn(O(this,ve),!1))a+=o.decode(f,{stream:!0});return a+=o.decode(),a}async arrayBuffer(){const o=new Uint8Array(this.size);let a=0;for await(const f of Wn(O(this,ve),!1))o.set(f,a),a+=f.length;return o.buffer}stream(){const o=Wn(O(this,ve),!0);return new globalThis.ReadableStream({type:"bytes",async pull(a){const f=await o.next();f.done?a.close():a.enqueue(f.value)},async cancel(){await o.return()}})}slice(o=0,a=this.size,f=""){const{size:l}=this;let p=o<0?Math.max(l+o,0):Math.min(o,l),h=a<0?Math.max(l+a,0):Math.min(a,l);const S=Math.max(h-p,0),v=O(this,ve),w=[];let A=0;for(const b of v){if(A>=S)break;const q=ArrayBuffer.isView(b)?b.byteLength:b.size;if(p&&q<=p)p-=q,h-=q;else{let g;ArrayBuffer.isView(b)?(g=b.subarray(p,Math.min(q,h)),A+=g.byteLength):(g=b.slice(p,Math.min(q,h)),A+=g.size),h-=q,w.push(g),p=0}}const T=new ze([],{type:String(f).toLowerCase()});return X(T,bt,S),X(T,ve,w),T}get[Symbol.toStringTag](){return"Blob"}static[Symbol.hasInstance](o){return o&&typeof o=="object"&&typeof o.constructor=="function"&&(typeof o.stream=="function"||typeof o.arrayBuffer=="function")&&/^(Blob|File)$/.test(o[Symbol.toStringTag])}},ve=new WeakMap,zt=new WeakMap,bt=new WeakMap,Cr=new WeakMap,n(ze,"Blob"),ze);Object.defineProperties(gi.prototype,{size:{enumerable:!0},type:{enumerable:!0},slice:{enumerable:!0}});const ut=gi,Vs=(mt=class extends ut{constructor(a,f,l={}){if(arguments.length<2)throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);super(a,l);be(this,It,0);be(this,Ft,"");l===null&&(l={});const p=l.lastModified===void 0?Date.now():Number(l.lastModified);Number.isNaN(p)||X(this,It,p),X(this,Ft,String(f))}get name(){return O(this,Ft)}get lastModified(){return O(this,It)}get[Symbol.toStringTag](){return"File"}static[Symbol.hasInstance](a){return!!a&&a instanceof ut&&/^(File)$/.test(a[Symbol.toStringTag])}},It=new WeakMap,Ft=new WeakMap,n(mt,"File"),mt),qn=Vs;/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */var{toStringTag:Wt,iterator:Qs,hasInstance:Ys}=Symbol,_i=Math.random,Gs="append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","),Si=n((i,o,a)=>(i+="",/^(Blob|File)$/.test(o&&o[Wt])?[(a=a!==void 0?a+"":o[Wt]=="File"?o.name:"blob",i),o.name!==a||o[Wt]=="blob"?new qn([o],a,o):o]:[i,o+""]),"f"),On=n((i,o)=>(o?i:i.replace(/\r?\n|\r/g,`\r
`)).replace(/\n/g,"%0A").replace(/\r/g,"%0D").replace(/"/g,"%22"),"e$1"),Ue=n((i,o,a)=>{if(o.length<a)throw new TypeError(`Failed to execute '${i}' on 'FormData': ${a} arguments required, but only ${o.length} present.`)},"x");const br=(yt=class{constructor(...o){be(this,ee,[]);if(o.length)throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.")}get[Wt](){return"FormData"}[Qs](){return this.entries()}static[Ys](o){return o&&typeof o=="object"&&o[Wt]==="FormData"&&!Gs.some(a=>typeof o[a]!="function")}append(...o){Ue("append",arguments,2),O(this,ee).push(Si(...o))}delete(o){Ue("delete",arguments,1),o+="",X(this,ee,O(this,ee).filter(([a])=>a!==o))}get(o){Ue("get",arguments,1),o+="";for(var a=O(this,ee),f=a.length,l=0;l<f;l++)if(a[l][0]===o)return a[l][1];return null}getAll(o,a){return Ue("getAll",arguments,1),a=[],o+="",O(this,ee).forEach(f=>f[0]===o&&a.push(f[1])),a}has(o){return Ue("has",arguments,1),o+="",O(this,ee).some(a=>a[0]===o)}forEach(o,a){Ue("forEach",arguments,1);for(var[f,l]of this)o.call(a,l,f,this)}set(...o){Ue("set",arguments,2);var a=[],f=!0;o=Si(...o),O(this,ee).forEach(l=>{l[0]===o[0]?f&&(f=!a.push(o)):a.push(l)}),f&&a.push(o),X(this,ee,a)}*entries(){yield*O(this,ee)}*keys(){for(var[o]of this)yield o}*values(){for(var[,o]of this)yield o}},ee=new WeakMap,n(yt,"FormData"),yt);function Zs(i,o=ut){var a=`${_i()}${_i()}`.replace(/\./g,"").slice(-28).padStart(32,"-"),f=[],l=`--${a}\r
Content-Disposition: form-data; name="`;return i.forEach((p,h)=>typeof p=="string"?f.push(l+On(h)+`"\r
\r
${p.replace(/\r(?!\n)|(?<!\r)\n/g,`\r
`)}\r
`):f.push(l+On(h)+`"; filename="${On(p.name,1)}"\r
Content-Type: ${p.type||"application/octet-stream"}\r
\r
`,p,`\r
`)),f.push(`--${a}--`),new o(f,{type:"multipart/form-data; boundary="+a})}n(Zs,"formDataToBlob");const Un=class Un extends Error{constructor(o,a){super(o),Error.captureStackTrace(this,this.constructor),this.type=a}get name(){return this.constructor.name}get[Symbol.toStringTag](){return this.constructor.name}};n(Un,"FetchBaseError");let ft=Un;const xn=class xn extends ft{constructor(o,a,f){super(o,a),f&&(this.code=this.errno=f.code,this.erroredSysCall=f.syscall)}};n(xn,"FetchError");let G=xn;const mr=Symbol.toStringTag,wi=n(i=>typeof i=="object"&&typeof i.append=="function"&&typeof i.delete=="function"&&typeof i.get=="function"&&typeof i.getAll=="function"&&typeof i.has=="function"&&typeof i.set=="function"&&typeof i.sort=="function"&&i[mr]==="URLSearchParams","isURLSearchParameters"),yr=n(i=>i&&typeof i=="object"&&typeof i.arrayBuffer=="function"&&typeof i.type=="string"&&typeof i.stream=="function"&&typeof i.constructor=="function"&&/^(Blob|File)$/.test(i[mr]),"isBlob"),Ks=n(i=>typeof i=="object"&&(i[mr]==="AbortSignal"||i[mr]==="EventTarget"),"isAbortSignal"),Js=n((i,o)=>{const a=new URL(o).hostname,f=new URL(i).hostname;return a===f||a.endsWith(`.${f}`)},"isDomainOrSubdomain"),Xs=n((i,o)=>{const a=new URL(o).protocol,f=new URL(i).protocol;return a===f},"isSameProtocol"),el=(0,node_util__WEBPACK_IMPORTED_MODULE_5__.promisify)(node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline),H=Symbol("Body internals"),Nn=class Nn{constructor(o,{size:a=0}={}){let f=null;o===null?o=null:wi(o)?o=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.from(o.toString()):yr(o)||node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.isBuffer(o)||(node_util__WEBPACK_IMPORTED_MODULE_5__.types.isAnyArrayBuffer(o)?o=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.from(o):ArrayBuffer.isView(o)?o=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.from(o.buffer,o.byteOffset,o.byteLength):o instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__||(o instanceof br?(o=Zs(o),f=o.type.split("=")[1]):o=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.from(String(o))));let l=o;node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.isBuffer(o)?l=node_stream__WEBPACK_IMPORTED_MODULE_3__.Readable.from(o):yr(o)&&(l=node_stream__WEBPACK_IMPORTED_MODULE_3__.Readable.from(o.stream())),this[H]={body:o,stream:l,boundary:f,disturbed:!1,error:null},this.size=a,o instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__&&o.on("error",p=>{const h=p instanceof ft?p:new G(`Invalid response body while trying to fetch ${this.url}: ${p.message}`,"system",p);this[H].error=h})}get body(){return this[H].stream}get bodyUsed(){return this[H].disturbed}async arrayBuffer(){const{buffer:o,byteOffset:a,byteLength:f}=await zn(this);return o.slice(a,a+f)}async formData(){const o=this.headers.get("content-type");if(o.startsWith("application/x-www-form-urlencoded")){const f=new br,l=new URLSearchParams(await this.text());for(const[p,h]of l)f.append(p,h);return f}const{toFormData:a}=await __webpack_require__.e(/* import() */ 43).then(__webpack_require__.bind(__webpack_require__, 43));return a(this.body,o)}async blob(){const o=this.headers&&this.headers.get("content-type")||this[H].body&&this[H].body.type||"",a=await this.arrayBuffer();return new ut([a],{type:o})}async json(){const o=await this.text();return JSON.parse(o)}async text(){const o=await zn(this);return new TextDecoder().decode(o)}buffer(){return zn(this)}};n(Nn,"Body");let xe=Nn;xe.prototype.buffer=(0,node_util__WEBPACK_IMPORTED_MODULE_5__.deprecate)(xe.prototype.buffer,"Please use 'response.arrayBuffer()' instead of 'response.buffer()'","node-fetch#buffer"),Object.defineProperties(xe.prototype,{body:{enumerable:!0},bodyUsed:{enumerable:!0},arrayBuffer:{enumerable:!0},blob:{enumerable:!0},json:{enumerable:!0},text:{enumerable:!0},data:{get:(0,node_util__WEBPACK_IMPORTED_MODULE_5__.deprecate)(()=>{},"data doesn't exist, use json(), text(), arrayBuffer(), or body instead","https://github.com/node-fetch/node-fetch/issues/1000 (response)")}});async function zn(i){if(i[H].disturbed)throw new TypeError(`body used already for: ${i.url}`);if(i[H].disturbed=!0,i[H].error)throw i[H].error;const{body:o}=i;if(o===null)return node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.alloc(0);if(!(o instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__))return node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.alloc(0);const a=[];let f=0;try{for await(const l of o){if(i.size>0&&f+l.length>i.size){const p=new G(`content size at ${i.url} over limit: ${i.size}`,"max-size");throw o.destroy(p),p}f+=l.length,a.push(l)}}catch(l){throw l instanceof ft?l:new G(`Invalid response body while trying to fetch ${i.url}: ${l.message}`,"system",l)}if(o.readableEnded===!0||o._readableState.ended===!0)try{return a.every(l=>typeof l=="string")?node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.from(a.join("")):node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.concat(a,f)}catch(l){throw new G(`Could not create Buffer from response body for ${i.url}: ${l.message}`,"system",l)}else throw new G(`Premature close of server response while trying to fetch ${i.url}`)}n(zn,"consumeBody");const In=n((i,o)=>{let a,f,{body:l}=i[H];if(i.bodyUsed)throw new Error("cannot clone body after it is used");return l instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__&&typeof l.getBoundary!="function"&&(a=new node_stream__WEBPACK_IMPORTED_MODULE_3__.PassThrough({highWaterMark:o}),f=new node_stream__WEBPACK_IMPORTED_MODULE_3__.PassThrough({highWaterMark:o}),l.pipe(a),l.pipe(f),i[H].stream=a,l=f),l},"clone"),tl=(0,node_util__WEBPACK_IMPORTED_MODULE_5__.deprecate)(i=>i.getBoundary(),"form-data doesn't follow the spec and requires special treatment. Use alternative package","https://github.com/node-fetch/node-fetch/issues/1167"),Ri=n((i,o)=>i===null?null:typeof i=="string"?"text/plain;charset=UTF-8":wi(i)?"application/x-www-form-urlencoded;charset=UTF-8":yr(i)?i.type||null:node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.isBuffer(i)||node_util__WEBPACK_IMPORTED_MODULE_5__.types.isAnyArrayBuffer(i)||ArrayBuffer.isView(i)?null:i instanceof br?`multipart/form-data; boundary=${o[H].boundary}`:i&&typeof i.getBoundary=="function"?`multipart/form-data;boundary=${tl(i)}`:i instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__?null:"text/plain;charset=UTF-8","extractContentType"),rl=n(i=>{const{body:o}=i[H];return o===null?0:yr(o)?o.size:node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.isBuffer(o)?o.length:o&&typeof o.getLengthSync=="function"&&o.hasKnownLength&&o.hasKnownLength()?o.getLengthSync():null},"getTotalBytes"),nl=n(async(i,{body:o})=>{o===null?i.end():await el(o,i)},"writeToStream"),gr=typeof node_http__WEBPACK_IMPORTED_MODULE_0__.validateHeaderName=="function"?node_http__WEBPACK_IMPORTED_MODULE_0__.validateHeaderName:i=>{if(!/^[\^`\-\w!#$%&'*+.|~]+$/.test(i)){const o=new TypeError(`Header name must be a valid HTTP token [${i}]`);throw Object.defineProperty(o,"code",{value:"ERR_INVALID_HTTP_TOKEN"}),o}},Fn=typeof node_http__WEBPACK_IMPORTED_MODULE_0__.validateHeaderValue=="function"?node_http__WEBPACK_IMPORTED_MODULE_0__.validateHeaderValue:(i,o)=>{if(/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o)){const a=new TypeError(`Invalid character in header content ["${i}"]`);throw Object.defineProperty(a,"code",{value:"ERR_INVALID_CHAR"}),a}},Pr=class Pr extends URLSearchParams{constructor(o){let a=[];if(o instanceof Pr){const f=o.raw();for(const[l,p]of Object.entries(f))a.push(...p.map(h=>[l,h]))}else if(o!=null)if(typeof o=="object"&&!node_util__WEBPACK_IMPORTED_MODULE_5__.types.isBoxedPrimitive(o)){const f=o[Symbol.iterator];if(f==null)a.push(...Object.entries(o));else{if(typeof f!="function")throw new TypeError("Header pairs must be iterable");a=[...o].map(l=>{if(typeof l!="object"||node_util__WEBPACK_IMPORTED_MODULE_5__.types.isBoxedPrimitive(l))throw new TypeError("Each header pair must be an iterable object");return[...l]}).map(l=>{if(l.length!==2)throw new TypeError("Each header pair must be a name/value tuple");return[...l]})}}else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");return a=a.length>0?a.map(([f,l])=>(gr(f),Fn(f,String(l)),[String(f).toLowerCase(),String(l)])):void 0,super(a),new Proxy(this,{get(f,l,p){switch(l){case"append":case"set":return(h,S)=>(gr(h),Fn(h,String(S)),URLSearchParams.prototype[l].call(f,String(h).toLowerCase(),String(S)));case"delete":case"has":case"getAll":return h=>(gr(h),URLSearchParams.prototype[l].call(f,String(h).toLowerCase()));case"keys":return()=>(f.sort(),new Set(URLSearchParams.prototype.keys.call(f)).keys());default:return Reflect.get(f,l,p)}}})}get[Symbol.toStringTag](){return this.constructor.name}toString(){return Object.prototype.toString.call(this)}get(o){const a=this.getAll(o);if(a.length===0)return null;let f=a.join(", ");return/^content-encoding$/i.test(o)&&(f=f.toLowerCase()),f}forEach(o,a=void 0){for(const f of this.keys())Reflect.apply(o,a,[this.get(f),f,this])}*values(){for(const o of this.keys())yield this.get(o)}*entries(){for(const o of this.keys())yield[o,this.get(o)]}[Symbol.iterator](){return this.entries()}raw(){return[...this.keys()].reduce((o,a)=>(o[a]=this.getAll(a),o),{})}[Symbol.for("nodejs.util.inspect.custom")](){return[...this.keys()].reduce((o,a)=>{const f=this.getAll(a);return a==="host"?o[a]=f[0]:o[a]=f.length>1?f:f[0],o},{})}};n(Pr,"Headers");let ye=Pr;Object.defineProperties(ye.prototype,["get","entries","forEach","values"].reduce((i,o)=>(i[o]={enumerable:!0},i),{}));function ol(i=[]){return new ye(i.reduce((o,a,f,l)=>(f%2===0&&o.push(l.slice(f,f+2)),o),[]).filter(([o,a])=>{try{return gr(o),Fn(o,String(a)),!0}catch{return!1}}))}n(ol,"fromRawHeaders");const il=new Set([301,302,303,307,308]),jn=n(i=>il.has(i),"isRedirect"),se=Symbol("Response internals"),Ne=class Ne extends xe{constructor(o=null,a={}){super(o,a);const f=a.status!=null?a.status:200,l=new ye(a.headers);if(o!==null&&!l.has("Content-Type")){const p=Ri(o,this);p&&l.append("Content-Type",p)}this[se]={type:"default",url:a.url,status:f,statusText:a.statusText||"",headers:l,counter:a.counter,highWaterMark:a.highWaterMark}}get type(){return this[se].type}get url(){return this[se].url||""}get status(){return this[se].status}get ok(){return this[se].status>=200&&this[se].status<300}get redirected(){return this[se].counter>0}get statusText(){return this[se].statusText}get headers(){return this[se].headers}get highWaterMark(){return this[se].highWaterMark}clone(){return new Ne(In(this,this.highWaterMark),{type:this.type,url:this.url,status:this.status,statusText:this.statusText,headers:this.headers,ok:this.ok,redirected:this.redirected,size:this.size,highWaterMark:this.highWaterMark})}static redirect(o,a=302){if(!jn(a))throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');return new Ne(null,{headers:{location:new URL(o).toString()},status:a})}static error(){const o=new Ne(null,{status:0,statusText:""});return o[se].type="error",o}static json(o=void 0,a={}){const f=JSON.stringify(o);if(f===void 0)throw new TypeError("data is not JSON serializable");const l=new ye(a&&a.headers);return l.has("content-type")||l.set("content-type","application/json"),new Ne(f,{...a,headers:l})}get[Symbol.toStringTag](){return"Response"}};n(Ne,"Response");let le=Ne;Object.defineProperties(le.prototype,{type:{enumerable:!0},url:{enumerable:!0},status:{enumerable:!0},ok:{enumerable:!0},redirected:{enumerable:!0},statusText:{enumerable:!0},headers:{enumerable:!0},clone:{enumerable:!0}});const al=n(i=>{if(i.search)return i.search;const o=i.href.length-1,a=i.hash||(i.href[o]==="#"?"#":"");return i.href[o-a.length]==="?"?"?":""},"getSearch");function Ti(i,o=!1){return i==null||(i=new URL(i),/^(about|blob|data):$/.test(i.protocol))?"no-referrer":(i.username="",i.password="",i.hash="",o&&(i.pathname="",i.search=""),i)}n(Ti,"stripURLForUseAsAReferrer");const Ci=new Set(["","no-referrer","no-referrer-when-downgrade","same-origin","origin","strict-origin","origin-when-cross-origin","strict-origin-when-cross-origin","unsafe-url"]),sl="strict-origin-when-cross-origin";function ll(i){if(!Ci.has(i))throw new TypeError(`Invalid referrerPolicy: ${i}`);return i}n(ll,"validateReferrerPolicy");function ul(i){if(/^(http|ws)s:$/.test(i.protocol))return!0;const o=i.host.replace(/(^\[)|(]$)/g,""),a=(0,node_net__WEBPACK_IMPORTED_MODULE_8__.isIP)(o);return a===4&&/^127\./.test(o)||a===6&&/^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o)?!0:i.host==="localhost"||i.host.endsWith(".localhost")?!1:i.protocol==="file:"}n(ul,"isOriginPotentiallyTrustworthy");function ct(i){return/^about:(blank|srcdoc)$/.test(i)||i.protocol==="data:"||/^(blob|filesystem):$/.test(i.protocol)?!0:ul(i)}n(ct,"isUrlPotentiallyTrustworthy");function fl(i,{referrerURLCallback:o,referrerOriginCallback:a}={}){if(i.referrer==="no-referrer"||i.referrerPolicy==="")return null;const f=i.referrerPolicy;if(i.referrer==="about:client")return"no-referrer";const l=i.referrer;let p=Ti(l),h=Ti(l,!0);p.toString().length>4096&&(p=h),o&&(p=o(p)),a&&(h=a(h));const S=new URL(i.url);switch(f){case"no-referrer":return"no-referrer";case"origin":return h;case"unsafe-url":return p;case"strict-origin":return ct(p)&&!ct(S)?"no-referrer":h.toString();case"strict-origin-when-cross-origin":return p.origin===S.origin?p:ct(p)&&!ct(S)?"no-referrer":h;case"same-origin":return p.origin===S.origin?p:"no-referrer";case"origin-when-cross-origin":return p.origin===S.origin?p:h;case"no-referrer-when-downgrade":return ct(p)&&!ct(S)?"no-referrer":p;default:throw new TypeError(`Invalid referrerPolicy: ${f}`)}}n(fl,"determineRequestsReferrer");function cl(i){const o=(i.get("referrer-policy")||"").split(/[,\s]+/);let a="";for(const f of o)f&&Ci.has(f)&&(a=f);return a}n(cl,"parseReferrerPolicyFromHeader");const $=Symbol("Request internals"),qt=n(i=>typeof i=="object"&&typeof i[$]=="object","isRequest"),dl=(0,node_util__WEBPACK_IMPORTED_MODULE_5__.deprecate)(()=>{},".data is not a valid RequestInit property, use .body instead","https://github.com/node-fetch/node-fetch/issues/1000 (request)"),vr=class vr extends xe{constructor(o,a={}){let f;if(qt(o)?f=new URL(o.url):(f=new URL(o),o={}),f.username!==""||f.password!=="")throw new TypeError(`${f} is an url with embedded credentials.`);let l=a.method||o.method||"GET";if(/^(delete|get|head|options|post|put)$/i.test(l)&&(l=l.toUpperCase()),!qt(a)&&"data"in a&&dl(),(a.body!=null||qt(o)&&o.body!==null)&&(l==="GET"||l==="HEAD"))throw new TypeError("Request with GET/HEAD method cannot have body");const p=a.body?a.body:qt(o)&&o.body!==null?In(o):null;super(p,{size:a.size||o.size||0});const h=new ye(a.headers||o.headers||{});if(p!==null&&!h.has("Content-Type")){const w=Ri(p,this);w&&h.set("Content-Type",w)}let S=qt(o)?o.signal:null;if("signal"in a&&(S=a.signal),S!=null&&!Ks(S))throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");let v=a.referrer==null?o.referrer:a.referrer;if(v==="")v="no-referrer";else if(v){const w=new URL(v);v=/^about:(\/\/)?client$/.test(w)?"client":w}else v=void 0;this[$]={method:l,redirect:a.redirect||o.redirect||"follow",headers:h,parsedURL:f,signal:S,referrer:v},this.follow=a.follow===void 0?o.follow===void 0?20:o.follow:a.follow,this.compress=a.compress===void 0?o.compress===void 0?!0:o.compress:a.compress,this.counter=a.counter||o.counter||0,this.agent=a.agent||o.agent,this.highWaterMark=a.highWaterMark||o.highWaterMark||16384,this.insecureHTTPParser=a.insecureHTTPParser||o.insecureHTTPParser||!1,this.referrerPolicy=a.referrerPolicy||o.referrerPolicy||""}get method(){return this[$].method}get url(){return (0,node_url__WEBPACK_IMPORTED_MODULE_7__.format)(this[$].parsedURL)}get headers(){return this[$].headers}get redirect(){return this[$].redirect}get signal(){return this[$].signal}get referrer(){if(this[$].referrer==="no-referrer")return"";if(this[$].referrer==="client")return"about:client";if(this[$].referrer)return this[$].referrer.toString()}get referrerPolicy(){return this[$].referrerPolicy}set referrerPolicy(o){this[$].referrerPolicy=ll(o)}clone(){return new vr(this)}get[Symbol.toStringTag](){return"Request"}};n(vr,"Request");let dt=vr;Object.defineProperties(dt.prototype,{method:{enumerable:!0},url:{enumerable:!0},headers:{enumerable:!0},redirect:{enumerable:!0},clone:{enumerable:!0},signal:{enumerable:!0},referrer:{enumerable:!0},referrerPolicy:{enumerable:!0}});const hl=n(i=>{const{parsedURL:o}=i[$],a=new ye(i[$].headers);a.has("Accept")||a.set("Accept","*/*");let f=null;if(i.body===null&&/^(post|put)$/i.test(i.method)&&(f="0"),i.body!==null){const S=rl(i);typeof S=="number"&&!Number.isNaN(S)&&(f=String(S))}f&&a.set("Content-Length",f),i.referrerPolicy===""&&(i.referrerPolicy=sl),i.referrer&&i.referrer!=="no-referrer"?i[$].referrer=fl(i):i[$].referrer="no-referrer",i[$].referrer instanceof URL&&a.set("Referer",i.referrer),a.has("User-Agent")||a.set("User-Agent","node-fetch"),i.compress&&!a.has("Accept-Encoding")&&a.set("Accept-Encoding","gzip, deflate, br");let{agent:l}=i;typeof l=="function"&&(l=l(o));const p=al(o),h={path:o.pathname+p,method:i.method,headers:a[Symbol.for("nodejs.util.inspect.custom")](),insecureHTTPParser:i.insecureHTTPParser,agent:l};return{parsedURL:o,options:h}},"getNodeRequestOptions"),Hn=class Hn extends ft{constructor(o,a="aborted"){super(o,a)}};n(Hn,"AbortError");let _r=Hn;/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */var Ln,Pi;function pl(){if(Pi)return Ln;if(Pi=1,!globalThis.DOMException)try{const{MessageChannel:i}=require("worker_threads"),o=new i().port1,a=new ArrayBuffer;o.postMessage(a,[a,a])}catch(i){i.constructor.name==="DOMException"&&(globalThis.DOMException=i.constructor)}return Ln=globalThis.DOMException,Ln}n(pl,"requireNodeDomexception");var bl=pl();const ml=(0,_shared_node_fetch_native_DfbY2q_x_mjs__WEBPACK_IMPORTED_MODULE_6__.g)(bl),{stat:$n}=node_fs__WEBPACK_IMPORTED_MODULE_9__.promises,yl=n((i,o)=>vi((0,node_fs__WEBPACK_IMPORTED_MODULE_9__.statSync)(i),i,o),"blobFromSync"),gl=n((i,o)=>$n(i).then(a=>vi(a,i,o)),"blobFrom"),_l=n((i,o)=>$n(i).then(a=>Ei(a,i,o)),"fileFrom"),Sl=n((i,o)=>Ei((0,node_fs__WEBPACK_IMPORTED_MODULE_9__.statSync)(i),i,o),"fileFromSync"),vi=n((i,o,a="")=>new ut([new Sr({path:o,size:i.size,lastModified:i.mtimeMs,start:0})],{type:a}),"fromBlob"),Ei=n((i,o,a="")=>new qn([new Sr({path:o,size:i.size,lastModified:i.mtimeMs,start:0})],(0,node_path__WEBPACK_IMPORTED_MODULE_10__.basename)(o),{type:a,lastModified:i.mtimeMs}),"fromFile"),Er=class Er{constructor(o){be(this,He);be(this,Ve);X(this,He,o.path),X(this,Ve,o.start),this.size=o.size,this.lastModified=o.lastModified}slice(o,a){return new Er({path:O(this,He),lastModified:this.lastModified,size:a-o,start:O(this,Ve)+o})}async*stream(){const{mtimeMs:o}=await $n(O(this,He));if(o>this.lastModified)throw new ml("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.","NotReadableError");yield*(0,node_fs__WEBPACK_IMPORTED_MODULE_9__.createReadStream)(O(this,He),{start:O(this,Ve),end:O(this,Ve)+this.size-1})}get[Symbol.toStringTag](){return"Blob"}};He=new WeakMap,Ve=new WeakMap,n(Er,"BlobDataItem");let Sr=Er;const wl=new Set(["data:","http:","https:"]);async function Ai(i,o){return new Promise((a,f)=>{const l=new dt(i,o),{parsedURL:p,options:h}=hl(l);if(!wl.has(p.protocol))throw new TypeError(`node-fetch cannot load ${i}. URL scheme "${p.protocol.replace(/:$/,"")}" is not supported.`);if(p.protocol==="data:"){const g=Us(l.url),V=new le(g,{headers:{"Content-Type":g.typeFull}});a(V);return}const S=(p.protocol==="https:"?node_https__WEBPACK_IMPORTED_MODULE_1__:node_http__WEBPACK_IMPORTED_MODULE_0__).request,{signal:v}=l;let w=null;const A=n(()=>{const g=new _r("The operation was aborted.");f(g),l.body&&l.body instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__.Readable&&l.body.destroy(g),!(!w||!w.body)&&w.body.emit("error",g)},"abort");if(v&&v.aborted){A();return}const T=n(()=>{A(),q()},"abortAndFinalize"),b=S(p.toString(),h);v&&v.addEventListener("abort",T);const q=n(()=>{b.abort(),v&&v.removeEventListener("abort",T)},"finalize");b.on("error",g=>{f(new G(`request to ${l.url} failed, reason: ${g.message}`,"system",g)),q()}),Rl(b,g=>{w&&w.body&&w.body.destroy(g)}),process.version<"v14"&&b.on("socket",g=>{let V;g.prependListener("end",()=>{V=g._eventsCount}),g.prependListener("close",I=>{if(w&&V<g._eventsCount&&!I){const F=new Error("Premature close");F.code="ERR_STREAM_PREMATURE_CLOSE",w.body.emit("error",F)}})}),b.on("response",g=>{b.setTimeout(0);const V=ol(g.rawHeaders);if(jn(g.statusCode)){const z=V.get("Location");let j=null;try{j=z===null?null:new URL(z,l.url)}catch{if(l.redirect!=="manual"){f(new G(`uri requested responds with an invalid redirect URL: ${z}`,"invalid-redirect")),q();return}}switch(l.redirect){case"error":f(new G(`uri requested responds with a redirect, redirect mode is set to error: ${l.url}`,"no-redirect")),q();return;case"manual":break;case"follow":{if(j===null)break;if(l.counter>=l.follow){f(new G(`maximum redirect reached at: ${l.url}`,"max-redirect")),q();return}const U={headers:new ye(l.headers),follow:l.follow,counter:l.counter+1,agent:l.agent,compress:l.compress,method:l.method,body:In(l),signal:l.signal,size:l.size,referrer:l.referrer,referrerPolicy:l.referrerPolicy};if(!Js(l.url,j)||!Xs(l.url,j))for(const jt of["authorization","www-authenticate","cookie","cookie2"])U.headers.delete(jt);if(g.statusCode!==303&&l.body&&o.body instanceof node_stream__WEBPACK_IMPORTED_MODULE_3__.Readable){f(new G("Cannot follow redirect with body being a readable stream","unsupported-redirect")),q();return}(g.statusCode===303||(g.statusCode===301||g.statusCode===302)&&l.method==="POST")&&(U.method="GET",U.body=void 0,U.headers.delete("content-length"));const D=cl(V);D&&(U.referrerPolicy=D),a(Ai(new dt(j,U))),q();return}default:return f(new TypeError(`Redirect option '${l.redirect}' is not a valid value of RequestRedirect`))}}v&&g.once("end",()=>{v.removeEventListener("abort",T)});let I=(0,node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline)(g,new node_stream__WEBPACK_IMPORTED_MODULE_3__.PassThrough,z=>{z&&f(z)});process.version<"v12.10"&&g.on("aborted",T);const F={url:l.url,status:g.statusCode,statusText:g.statusMessage,headers:V,size:l.size,counter:l.counter,highWaterMark:l.highWaterMark},Q=V.get("Content-Encoding");if(!l.compress||l.method==="HEAD"||Q===null||g.statusCode===204||g.statusCode===304){w=new le(I,F),a(w);return}const ge={flush:node_zlib__WEBPACK_IMPORTED_MODULE_2__.Z_SYNC_FLUSH,finishFlush:node_zlib__WEBPACK_IMPORTED_MODULE_2__.Z_SYNC_FLUSH};if(Q==="gzip"||Q==="x-gzip"){I=(0,node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline)(I,node_zlib__WEBPACK_IMPORTED_MODULE_2__.createGunzip(ge),z=>{z&&f(z)}),w=new le(I,F),a(w);return}if(Q==="deflate"||Q==="x-deflate"){const z=(0,node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline)(g,new node_stream__WEBPACK_IMPORTED_MODULE_3__.PassThrough,j=>{j&&f(j)});z.once("data",j=>{(j[0]&15)===8?I=(0,node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline)(I,node_zlib__WEBPACK_IMPORTED_MODULE_2__.createInflate(),U=>{U&&f(U)}):I=(0,node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline)(I,node_zlib__WEBPACK_IMPORTED_MODULE_2__.createInflateRaw(),U=>{U&&f(U)}),w=new le(I,F),a(w)}),z.once("end",()=>{w||(w=new le(I,F),a(w))});return}if(Q==="br"){I=(0,node_stream__WEBPACK_IMPORTED_MODULE_3__.pipeline)(I,node_zlib__WEBPACK_IMPORTED_MODULE_2__.createBrotliDecompress(),z=>{z&&f(z)}),w=new le(I,F),a(w);return}w=new le(I,F),a(w)}),nl(b,l).catch(f)})}n(Ai,"fetch$1");function Rl(i,o){const a=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.from(`0\r
\r
`);let f=!1,l=!1,p;i.on("response",h=>{const{headers:S}=h;f=S["transfer-encoding"]==="chunked"&&!S["content-length"]}),i.on("socket",h=>{const S=n(()=>{if(f&&!l){const w=new Error("Premature close");w.code="ERR_STREAM_PREMATURE_CLOSE",o(w)}},"onSocketClose"),v=n(w=>{l=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.compare(w.slice(-5),a)===0,!l&&p&&(l=node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.compare(p.slice(-3),a.slice(0,3))===0&&node_buffer__WEBPACK_IMPORTED_MODULE_4__.Buffer.compare(w.slice(-2),a.slice(3))===0),p=w},"onData");h.prependListener("close",S),h.on("data",v),i.on("close",()=>{h.removeListener("close",S),h.removeListener("data",v)})})}n(Rl,"fixResponseChunkedTransferBadEnding");const Bi=new WeakMap,Dn=new WeakMap;function W(i){const o=Bi.get(i);return console.assert(o!=null,"'this' is expected an Event object, but got",i),o}n(W,"pd");function ki(i){if(i.passiveListener!=null){typeof console<"u"&&typeof console.error=="function"&&console.error("Unable to preventDefault inside passive event listener invocation.",i.passiveListener);return}i.event.cancelable&&(i.canceled=!0,typeof i.event.preventDefault=="function"&&i.event.preventDefault())}n(ki,"setCancelFlag");function ht(i,o){Bi.set(this,{eventTarget:i,event:o,eventPhase:2,currentTarget:i,canceled:!1,stopped:!1,immediateStopped:!1,passiveListener:null,timeStamp:o.timeStamp||Date.now()}),Object.defineProperty(this,"isTrusted",{value:!1,enumerable:!0});const a=Object.keys(o);for(let f=0;f<a.length;++f){const l=a[f];l in this||Object.defineProperty(this,l,Wi(l))}}n(ht,"Event"),ht.prototype={get type(){return W(this).event.type},get target(){return W(this).eventTarget},get currentTarget(){return W(this).currentTarget},composedPath(){const i=W(this).currentTarget;return i==null?[]:[i]},get NONE(){return 0},get CAPTURING_PHASE(){return 1},get AT_TARGET(){return 2},get BUBBLING_PHASE(){return 3},get eventPhase(){return W(this).eventPhase},stopPropagation(){const i=W(this);i.stopped=!0,typeof i.event.stopPropagation=="function"&&i.event.stopPropagation()},stopImmediatePropagation(){const i=W(this);i.stopped=!0,i.immediateStopped=!0,typeof i.event.stopImmediatePropagation=="function"&&i.event.stopImmediatePropagation()},get bubbles(){return!!W(this).event.bubbles},get cancelable(){return!!W(this).event.cancelable},preventDefault(){ki(W(this))},get defaultPrevented(){return W(this).canceled},get composed(){return!!W(this).event.composed},get timeStamp(){return W(this).timeStamp},get srcElement(){return W(this).eventTarget},get cancelBubble(){return W(this).stopped},set cancelBubble(i){if(!i)return;const o=W(this);o.stopped=!0,typeof o.event.cancelBubble=="boolean"&&(o.event.cancelBubble=!0)},get returnValue(){return!W(this).canceled},set returnValue(i){i||ki(W(this))},initEvent(){}},Object.defineProperty(ht.prototype,"constructor",{value:ht,configurable:!0,writable:!0}),typeof window<"u"&&typeof window.Event<"u"&&(Object.setPrototypeOf(ht.prototype,window.Event.prototype),Dn.set(window.Event.prototype,ht));function Wi(i){return{get(){return W(this).event[i]},set(o){W(this).event[i]=o},configurable:!0,enumerable:!0}}n(Wi,"defineRedirectDescriptor");function Tl(i){return{value(){const o=W(this).event;return o[i].apply(o,arguments)},configurable:!0,enumerable:!0}}n(Tl,"defineCallDescriptor");function Cl(i,o){const a=Object.keys(o);if(a.length===0)return i;function f(l,p){i.call(this,l,p)}n(f,"CustomEvent"),f.prototype=Object.create(i.prototype,{constructor:{value:f,configurable:!0,writable:!0}});for(let l=0;l<a.length;++l){const p=a[l];if(!(p in i.prototype)){const S=typeof Object.getOwnPropertyDescriptor(o,p).value=="function";Object.defineProperty(f.prototype,p,S?Tl(p):Wi(p))}}return f}n(Cl,"defineWrapper");function qi(i){if(i==null||i===Object.prototype)return ht;let o=Dn.get(i);return o==null&&(o=Cl(qi(Object.getPrototypeOf(i)),i),Dn.set(i,o)),o}n(qi,"getWrapper");function Pl(i,o){const a=qi(Object.getPrototypeOf(o));return new a(i,o)}n(Pl,"wrapEvent");function vl(i){return W(i).immediateStopped}n(vl,"isStopped");function El(i,o){W(i).eventPhase=o}n(El,"setEventPhase");function Al(i,o){W(i).currentTarget=o}n(Al,"setCurrentTarget");function Oi(i,o){W(i).passiveListener=o}n(Oi,"setPassiveListener");const zi=new WeakMap,Ii=1,Fi=2,wr=3;function Rr(i){return i!==null&&typeof i=="object"}n(Rr,"isObject");function Ot(i){const o=zi.get(i);if(o==null)throw new TypeError("'this' is expected an EventTarget object, but got another value.");return o}n(Ot,"getListeners");function Bl(i){return{get(){let a=Ot(this).get(i);for(;a!=null;){if(a.listenerType===wr)return a.listener;a=a.next}return null},set(o){typeof o!="function"&&!Rr(o)&&(o=null);const a=Ot(this);let f=null,l=a.get(i);for(;l!=null;)l.listenerType===wr?f!==null?f.next=l.next:l.next!==null?a.set(i,l.next):a.delete(i):f=l,l=l.next;if(o!==null){const p={listener:o,listenerType:wr,passive:!1,once:!1,next:null};f===null?a.set(i,p):f.next=p}},configurable:!0,enumerable:!0}}n(Bl,"defineEventAttributeDescriptor");function ji(i,o){Object.defineProperty(i,`on${o}`,Bl(o))}n(ji,"defineEventAttribute");function Li(i){function o(){Pe.call(this)}n(o,"CustomEventTarget"),o.prototype=Object.create(Pe.prototype,{constructor:{value:o,configurable:!0,writable:!0}});for(let a=0;a<i.length;++a)ji(o.prototype,i[a]);return o}n(Li,"defineCustomEventTarget");function Pe(){if(this instanceof Pe){zi.set(this,new Map);return}if(arguments.length===1&&Array.isArray(arguments[0]))return Li(arguments[0]);if(arguments.length>0){const i=new Array(arguments.length);for(let o=0;o<arguments.length;++o)i[o]=arguments[o];return Li(i)}throw new TypeError("Cannot call a class as a function")}n(Pe,"EventTarget"),Pe.prototype={addEventListener(i,o,a){if(o==null)return;if(typeof o!="function"&&!Rr(o))throw new TypeError("'listener' should be a function or an object.");const f=Ot(this),l=Rr(a),h=(l?!!a.capture:!!a)?Ii:Fi,S={listener:o,listenerType:h,passive:l&&!!a.passive,once:l&&!!a.once,next:null};let v=f.get(i);if(v===void 0){f.set(i,S);return}let w=null;for(;v!=null;){if(v.listener===o&&v.listenerType===h)return;w=v,v=v.next}w.next=S},removeEventListener(i,o,a){if(o==null)return;const f=Ot(this),p=(Rr(a)?!!a.capture:!!a)?Ii:Fi;let h=null,S=f.get(i);for(;S!=null;){if(S.listener===o&&S.listenerType===p){h!==null?h.next=S.next:S.next!==null?f.set(i,S.next):f.delete(i);return}h=S,S=S.next}},dispatchEvent(i){if(i==null||typeof i.type!="string")throw new TypeError('"event.type" should be a string.');const o=Ot(this),a=i.type;let f=o.get(a);if(f==null)return!0;const l=Pl(this,i);let p=null;for(;f!=null;){if(f.once?p!==null?p.next=f.next:f.next!==null?o.set(a,f.next):o.delete(a):p=f,Oi(l,f.passive?f.listener:null),typeof f.listener=="function")try{f.listener.call(this,l)}catch(h){typeof console<"u"&&typeof console.error=="function"&&console.error(h)}else f.listenerType!==wr&&typeof f.listener.handleEvent=="function"&&f.listener.handleEvent(l);if(vl(l))break;f=f.next}return Oi(l,null),El(l,0),Al(l,null),!l.defaultPrevented}},Object.defineProperty(Pe.prototype,"constructor",{value:Pe,configurable:!0,writable:!0}),typeof window<"u"&&typeof window.EventTarget<"u"&&Object.setPrototypeOf(Pe.prototype,window.EventTarget.prototype);const Vn=class Vn extends Pe{constructor(){throw super(),new TypeError("AbortSignal cannot be constructed directly")}get aborted(){const o=Tr.get(this);if(typeof o!="boolean")throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this===null?"null":typeof this}`);return o}};n(Vn,"AbortSignal");let pt=Vn;ji(pt.prototype,"abort");function kl(){const i=Object.create(pt.prototype);return Pe.call(i),Tr.set(i,!1),i}n(kl,"createAbortSignal");function Wl(i){Tr.get(i)===!1&&(Tr.set(i,!0),i.dispatchEvent({type:"abort"}))}n(Wl,"abortSignal");const Tr=new WeakMap;Object.defineProperties(pt.prototype,{aborted:{enumerable:!0}}),typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(pt.prototype,Symbol.toStringTag,{configurable:!0,value:"AbortSignal"});let Mn=(gt=class{constructor(){$i.set(this,kl())}get signal(){return Di(this)}abort(){Wl(Di(this))}},n(gt,"AbortController"),gt);const $i=new WeakMap;function Di(i){const o=$i.get(i);if(o==null)throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${i===null?"null":typeof i}`);return o}n(Di,"getSignal"),Object.defineProperties(Mn.prototype,{signal:{enumerable:!0},abort:{enumerable:!0}}),typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Mn.prototype,Symbol.toStringTag,{configurable:!0,value:"AbortController"});var ql=Object.defineProperty,Ol=n((i,o)=>ql(i,"name",{value:o,configurable:!0}),"e");const Mi=Ai;Ui();function Ui(){!globalThis.process?.versions?.node&&!globalThis.process?.env?.DISABLE_NODE_FETCH_NATIVE_WARN&&console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.")}n(Ui,"s"),Ol(Ui,"checkNodeEnvironment");


/***/ }),

/***/ 5008:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ n),
/* harmony export */   g: () => (/* binding */ f)
/* harmony export */ });
var t=Object.defineProperty;var o=(e,l)=>t(e,"name",{value:l,configurable:!0});var n=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function f(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}o(f,"getDefaultExportFromCjs");


/***/ })

};
;