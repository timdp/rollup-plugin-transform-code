import MagicString from 'magic-string'

const actors = {
  prepend (magicString, {value}) {
    magicString.prepend(value)
  },

  append (magicString, {value}) {
    magicString.append(value)
  },

  replace (magicString, {start, end, value}) {
    magicString.overwrite(start, end, value)
  },

  remove (magicString, {start, end}) {
    magicString.remove(start, end)
  }
}

export default ({transforms}) => {
  return {
    name: 'transform-code',

    transform (code, id) {
      if (transforms[id] == null) {
        return null
      }
      const transform = transforms[id](code)
      const actor = actors[transform.action]
      if (actor == null) {
        throw new Error('Invalid action: ' + transform.action)
      }
      const magicString = new MagicString(code)
      actor(magicString, transform)
      return {
        code: magicString.toString(),
        map: magicString.generateMap()
      }
    }
  }
}
