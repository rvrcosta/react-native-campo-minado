
const createBoard = (row, columns) => {
    return Array(row).fill(0).map((_,row)=>{
        return Array(columns).fill(0).map((_,column)=>{
            return {
                row,
                column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0
            }
        })
    })
}

const spreadMines = (board, minesAmount) => {
    const rows = board.length
    const columns = board[0].length

    let minesPlanted = 0

    while (minesPlanted < minesAmount){
        const rowSel = parseInt(Math.random() * rows, 10)
        const colSel = parseInt(Math.random() * columns, 10)

        if (!board[rowSel][colSel].mined){
            board[rowSel][colSel].mined = true
            minesPlanted++
        }
    }
}

const createMinedBoard = (rows, columns, minesAmount) => {
    const board = createBoard(rows,columns);
    spreadMines(board,minesAmount)
    return board
}

const cloneBoard = board => {
    return board.map( rows => {
        return rows.map(field => {
            return {...field}
        })
    })
}

const getNeighbors = (board, row, column) => {
    const neighbors = []
    const rows = [row - 1, row, row + 1]
    const columns = [column - 1, column, column + 1]

    rows.forEach(r=>{
        columns.forEach(c=>{
            const diferent = r !== row || c !== column
            const validRow = r >= 0 && r < board.length
            const validColumn = c >= 0  && c < board[0].length
            if(diferent && validRow && validColumn){
                neighbors.push(board[r][c])
            }
        })
    })

    return neighbors
}

const safeNeighborhood = (board, row, column) => {

    // função criada para verificação se é seguro o campo. Result é o valor inicial e neighbor é o valor passado
    // como segundo paramentro na função, ele verifica se o result é true e se o campo atual não é minado
    const safes = (result, neighbor) => result && !neighbor.mined

    // Retorna se os vizinhos são seguros ou não, utilizando o método getNeighbors (que retorna todos os vizinhos)
    // válidos e faz um reduce passando a função acima citada e o valor inicial do result como true.
    return getNeighbors(board, row, column).reduce(safes,true)
}

const openField = (board, row, column) =>{

    const field = board[row][column]

    if(!field.opened){
        field.opened = true
        if(field.mined){
            field.exploded = true
        } else if (safeNeighborhood(board, row, column)){
            getNeighbors(board, row, column)
            .forEach(n=> openField(board, n.row, n.column))
        } else {
            const neighbors = getNeighbors(board, row, column)
            field.nearMines = neighbors.filter(n => n.mined).length
        } 

    }
}

//Concatenta todos os arrays transformando em um único array
const fields = board => [].concat(...board)

// Chama a funcao fields e faz a verificação se há explosão no tabuleiro
const hadExplosion = board => fields(board)
                                .filter(field=> field.exploded).length > 0


const pendding = field => (field.mined && !field.flagged) || (!field.mined && field.opened)

// Verifica se há algum Field pendente
const wonGame = board => fields(board).filter(pendding).length === 0

// Percorre todas as fields e mostra todas as minas
const showMines = board => fields(board).filter(field => field.mined).forEach(field => field.opened = true)

const invertFlag = (board, row, column) =>{
    const field = board[row][column]
    field.flagged = !field.flagged
}

const flagsUsed = board => fields(board).filter(field => field.flagged).length

export { 
    createMinedBoard,
    cloneBoard,
    openField,
    hadExplosion,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed
 }