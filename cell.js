class cell {
    constructor(i, j) {
        this.i = i
        this.j = j
        this.f = 0
        this.g = 0
        this.h = 0
        this.blocked = false
        this.neighbors = new Array()
        this.previous = false
        if(Math.random()<0.2){
            this.blocked = true
        }
    }
    show(ctx, w, h, c) {
        let color = 'white'
        if (c) {
            color = c
        } else {
            if (this.blocked) {
                color = 'black'
            } else {
                color = 'white'
            }
        }
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.strokeStyle = 'black'
        ctx.rect(this.i * w, this.j * h, w, h)
        ctx.fill()
        ctx.stroke()
    }
    addneighbors(grid) {
        if (this.i < cols - 1) {
            this.neighbors.push(grid[this.i + 1][this.j])
        }
        if (this.i > 0) {
            this.neighbors.push(grid[this.i - 1][this.j])
        }
        if (this.j < rows - 1) {
            this.neighbors.push(grid[this.i][this.j + 1])
        }
        if (this.j > 0) {
            this.neighbors.push(grid[this.i][this.j - 1])
        }
    }
}