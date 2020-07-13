const PATH = 'path'

const get = (obj, path = []) => {
  return path.reduce((acc, prop) => {
    if (!acc) {
      return undefined
    }

    if(!acc[prop]) {
      return undefined
    }

    return acc[prop]
  }, obj)
}

const map = [
  [null, PATH, PATH, PATH, PATH],
  [null, PATH, null, null, PATH],
  [PATH, PATH, null, PATH, PATH],
  [PATH, PATH, PATH, PATH, PATH],
]

const playerLocation = [0, 4]
const goalLocation = [2, 3]

const directions = ['north', 'south', 'west', 'east']

const getCell = (map, i, j, direction) => {
  switch (direction) {
    case 'north':
      return { value: get(map, [i - 1, j]), coordinates: { i: i - 1, j } }
    case 'south':
      return { value: get(map, [i + 1, j]), coordinates: { i: i + 1, j } }
    case 'west':
      return { value: get(map, [i, j - 1]), coordinates: { i, j: j - 1 } }
    case 'east':
      return { value: get(map, [i, j + 1]), coordinates: { i, j: j + 1 } }
  }
}

const canGo = (map, i, j, direction, step) => {
  const { value } = getCell(map, i, j, direction)
  return !!value && (!Number.isInteger(value) || step < value)
}

const isPlayerLocation = (i, j, playerLocation) => i === playerLocation[0] && j === playerLocation[1]

const markStepsAround = (mapSubject, i, j) => {
  let step = 0
  let isPlayerFound = false
  let bestScore
  const snapshots = {}

  const recursion = (mapSubject, i, j, step) => {
    const map = [...mapSubject]
    map[i][j] = step

    if (isPlayerLocation(i, j, playerLocation)) {
      bestScore = !bestScore || step < bestScore ? step : bestScore
      snapshots[step] = map
      isPlayerFound = true
      return
    }

    directions.forEach((direction) => {
      if (!canGo(map, i, j, direction, step)) {
        return
      }

      const { coordinates } = getCell(map, i, j, direction)

      recursion(map, coordinates.i, coordinates.j, step + 1)
    })
  }

  recursion(mapSubject, i, j, step)

  console.log(bestScore, 'the bestScore')

  return snapshots[bestScore] || null
}

console.log(markStepsAround(map, ...goalLocation) || 'no route found')
