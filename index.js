let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let width = canvas.width
let height = canvas.height
let rows = 21
let cols = 21
let w = width / cols
let h = height / rows
let path = new Array()
let naibhours = new Array()
let interval

let grid = new Array(cols)
for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows)
}

for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        grid[i][j] = new cell(i, j)
    }
}
for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
        grid[i][j].addneighbors(grid)
    }
}

function hScore(a, b) {
    return Math.sqrt(Math.pow((a.i - b.i), 2) + Math.pow((a.j - b.j), 2))
}

function remove(arr, e) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == e) {
            arr.splice(i, 1)
        }
    }
}


let start = grid[0][0]
let end = grid[cols - 1][rows - 1]
start.blocked = false
end.blocked = false

let openSet = new Array()
let closeSet = new Array()
openSet.push(start)



function draw_grid(t) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(ctx, w, h)
        }
    }
    if (!t) {
        start.show(ctx, w, h, 'purple')
        end.show(ctx, w, h, 'grey')
    }
    if (t) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].show(ctx, w, h)
            }
        }
        for (let i = 0; i < openSet.length; i++) {
            openSet[i].show(ctx, w, h, 'green')
        }
        for (let i = 0; i < closeSet.length; i++) {
            closeSet[i].show(ctx, w, h, 'red')
        }
        for (let i = 0; i < path.length; i++) {
            path[i].show(ctx, w, h, 'blue')
        }
        start.show(ctx, w, h, 'rgb(65,10,209)')
        end.show(ctx, w, h, 'rgb(100,100,211)')
    }
}
draw_grid()


function draw() {
    if (openSet.length > 0) {
        let winnerIndex = 0
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winnerIndex].f) {
                winnerIndex = i
            }
        }
        let current = openSet[winnerIndex]

        if (current === end) {
            console.log('Done')
            let temp = end
            path.push(end)
            while (temp.previous) {
                path.push(temp.previous)
                temp = temp.previous
            }
            clearInterval(interval)
        }
        remove(openSet, current)
        closeSet.push(current)

        let neighbors = current.neighbors
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i]
            if (!closeSet.includes(neighbor) & !neighbor.blocked) {
                let g = current.g + 1
                if (openSet.includes(neighbor)) {
                    if (g < neighbor.g) {
                        neighbor.g = g
                    }
                } else {
                    neighbor.g = g
                    neighbor.h = hScore(neighbor, end)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.previous = current
                    openSet.push(neighbor)
                }
            }
        }

    } else {
        // no solution
    }
    draw_grid(true)
}

document.querySelector('.start').onclick = () => {
    path = new Array()
    start.blocked = false
    end.blocked = false
    start.previous = false
    end.previous = false
    openSet = new Array()
    closeSet = new Array()
    openSet.push(start)
    interval = setInterval(() => draw(), 21)
}

let draggable = false
let dragStart = false
let dragEnd = false
canvas.onclick = e => block_or_unblock(e)

function block_or_unblock(e) {
    let selected = whichcell(e)
    if (selected.blocked) {
        selected.blocked = false
    } else {
        selected.blocked = true
    }
    draw_grid()
}

function whichcell(e) {
    let x = e.offsetX
    let y = e.offsetY
    let selected
    let selectI
    let selectJ
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let xi = i * w
            let yi = j * h
            let wi = xi + w
            let hi = yi + h
            if (x > xi & x < wi & y > yi & y < hi) {
                selectI = i
                selectJ = j
            }
        }
    }
    selected = grid[selectI][selectJ]
    return selected
}

canvas.onmousedown = () => draggable = true
canvas.onmouseup = e => {
    if (draggable & dragStart) {
        let selected = whichcell(e)
        start = selected
    }
    if (draggable & dragEnd) {
        let selected = whichcell(e)
        end = selected
    }
    dragStart = false
    dragEnd = false
    draggable = false
    draw_grid(true)
}
canvas.onmouseout = () => draggable = false
canvas.onmousemove = e => {
    let x = e.offsetX
    let y = e.offsetY
    let selected = whichcell(e)
    if (draggable & selected == start) {
        dragStart = true
        dragEnd = false
    }
    if (draggable & selected == end) {
        dragEnd = true
        dragStart = false
    }
}
