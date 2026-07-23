const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('dist'));

// Fallback route untuk SPA React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Sudoku Solved Seed Grid
const SOLVED_SEEDS = [
    [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]
];

// Generates a randomized valid Sudoku and masks some cells
function generateSudoku(difficulty = 'medium') {
    let grid = JSON.parse(JSON.stringify(SOLVED_SEEDS[0]));

    // Shuffle helper (Fisher-Yates)
    const shuffleArray = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // 1. Swap digits randomly
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(digits);
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            grid[r][c] = digits[grid[r][c] - 1];
        }
    }

    // 2. Swap rows within blocks of 3
    for (let block = 0; block < 3; block++) {
        const rowIndices = [0, 1, 2].map(i => block * 3 + i);
        shuffleArray(rowIndices);
        const originalRows = rowIndices.map(idx => [...grid[idx]]);
        rowIndices.forEach((newIdx, i) => {
            grid[newIdx] = originalRows[i];
        });
    }

    // 3. Swap columns within blocks of 3
    for (let block = 0; block < 3; block++) {
        const colIndices = [0, 1, 2].map(i => block * 3 + i);
        shuffleArray(colIndices);
        const tempCols = colIndices.map(colIdx => {
            const col = [];
            for (let r = 0; r < 9; r++) {
                col.push(grid[r][colIdx]);
            }
            return col;
        });
        colIndices.forEach((newIdx, i) => {
            for (let r = 0; r < 9; r++) {
                grid[r][newIdx] = tempCols[i][r];
            }
        });
    }

    // 4. Swap block rows
    const blockRows = [0, 1, 2];
    shuffleArray(blockRows);
    const tempGrid = JSON.parse(JSON.stringify(grid));
    blockRows.forEach((newBlockIdx, oldBlockIdx) => {
        for (let r = 0; r < 3; r++) {
            grid[newBlockIdx * 3 + r] = tempGrid[oldBlockIdx * 3 + r];
        }
    });

    // 5. Swap block columns
    const blockCols = [0, 1, 2];
    shuffleArray(blockCols);
    const tempGridCols = JSON.parse(JSON.stringify(grid));
    blockCols.forEach((newBlockIdx, oldBlockIdx) => {
        for (let c = 0; c < 3; c++) {
            const targetCol = newBlockIdx * 3 + c;
            const sourceCol = oldBlockIdx * 3 + c;
            for (let r = 0; r < 9; r++) {
                grid[r][targetCol] = tempGridCols[r][sourceCol];
            }
        }
    });

    const solution = JSON.parse(JSON.stringify(grid));

    // Remove cells to create a playable puzzle
    const puzzle = JSON.parse(JSON.stringify(grid));
    const DIFFICULTY_CELLS = {
        test: 1,
        easy: 30,
        medium: 45,
        hard: 60
    };
    const cellsToRemove = DIFFICULTY_CELLS[difficulty] || 45;
    const positions = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            positions.push({ r, c });
        }
    }
    shuffleArray(positions);

    for (let i = 0; i < cellsToRemove; i++) {
        const { r, c } = positions[i];
        puzzle[r][c] = 0; // 0 represents empty cell
    }

    return { puzzle, solution };
}

// Memory State
const players = {}; // socket.id -> { name, room }
const rooms = {};   // roomName -> { status, puzzle, solution, players, totalEmptyCells, difficulty }

// Helper to construct room state payload for broadcast
function getRoomUpdatePayload(roomName) {
    const room = rooms[roomName];
    if (!room) return null;
    return {
        status: room.status,
        players: room.players,
        totalEmptyCells: room.totalEmptyCells,
        difficulty: room.difficulty || 'medium'
    };
}

io.on('connection', (socket) => {
    console.log(`[connect] ${socket.id}`);

    // --- JOIN ROOM ---
    socket.on('join-room', ({ room, name }) => {
        socket.join(room);
        players[socket.id] = { room, name };

        if (!rooms[room]) {
            rooms[room] = {
                status: 'waiting', // waiting, playing, gameover
                puzzle: null,
                solution: null,
                players: {},
                totalEmptyCells: 0,
                difficulty: 'medium'
            };
        }

        rooms[room].players[socket.id] = {
            name,
            progress: 0,
            mistakes: 0,
            board: null
        };

        const roomSize = Object.keys(rooms[room].players).length;
        console.log(`[join] ${name} (${socket.id}) masuk ke room "${room}" (total: ${roomSize})`);

        // Broadcast room update to everyone in the room
        io.to(room).emit('room-update', getRoomUpdatePayload(room));

        // System broadcast notification
        io.to(room).emit('player-joined', {
            name,
            socketId: socket.id,
            roomSize
        });
    });

    // --- CHANGE DIFFICULTY ---
    socket.on('change-difficulty', ({ difficulty }) => {
        const playerInfo = players[socket.id];
        if (!playerInfo) return;

        const room = playerInfo.room;
        const game = rooms[room];
        if (!game || game.status !== 'waiting') return;

        // Only the host (first player in the list) can change difficulty
        const playerEntries = Object.entries(game.players);
        const hostId = playerEntries[0]?.[0];
        if (socket.id !== hostId) return;

        if (['easy', 'medium', 'hard', 'test'].includes(difficulty)) {
            game.difficulty = difficulty;
            console.log(`[difficulty] Room "${room}" difficulty set to "${difficulty}"`);
            io.to(room).emit('room-update', getRoomUpdatePayload(room));
        }
    });

    // --- START GAME ---
    socket.on('start-game', () => {
        const playerInfo = players[socket.id];
        if (!playerInfo) return;

        const room = playerInfo.room;
        const game = rooms[room];
        if (!game || game.status === 'playing') return;

        const { puzzle, solution } = generateSudoku(game.difficulty || 'medium');
        game.puzzle = puzzle;
        game.solution = solution;
        game.status = 'playing';

        // Count empty cells
        let emptyCells = 0;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (puzzle[r][c] === 0) emptyCells++;
            }
        }
        game.totalEmptyCells = emptyCells;

        // Reset players stats and set up individual boards
        for (const id in game.players) {
            game.players[id].progress = 0;
            game.players[id].mistakes = 0;
            game.players[id].board = JSON.parse(JSON.stringify(puzzle));
        }

        console.log(`[start] Game dimulai di room "${room}" dengan ${emptyCells} empty cells`);

        io.to(room).emit('game-started', {
            puzzle,
            totalEmptyCells: emptyCells,
            players: game.players
        });
    });

    // --- SUBMIT CELL MOVE ---
    socket.on('submit-cell', ({ r, c, val }) => {
        const playerInfo = players[socket.id];
        if (!playerInfo) return;

        const room = playerInfo.room;
        const game = rooms[room];
        if (!game || game.status !== 'playing') return;

        const player = game.players[socket.id];
        if (!player) return;

        // Clean values to integers
        r = parseInt(r);
        c = parseInt(c);
        val = parseInt(val);

        const solutionVal = game.solution[r][c];

        // If cell is already filled correctly, do nothing
        if (player.board[r][c] === solutionVal) {
            return;
        }

        const isCorrect = (val === solutionVal);

        if (isCorrect) {
            player.board[r][c] = val;

            // Recalculate progress (number of correct filled blank cells)
            let correctFilled = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (game.puzzle[row][col] === 0 && player.board[row][col] === game.solution[row][col]) {
                        correctFilled++;
                    }
                }
            }
            player.progress = correctFilled;

            // Check Win Condition
            if (correctFilled === game.totalEmptyCells) {
                game.status = 'gameover';
                io.to(room).emit('game-over', {
                    winnerId: socket.id,
                    winnerName: player.name,
                    players: game.players
                });
                return;
            }
        } else {
            player.mistakes++;
        }

        // Send feedback back to the player who made the move
        socket.emit('move-result', { r, c, val, isCorrect, mistakes: player.mistakes, progress: player.progress });

        // Broadcast room update (progress bar updates, mistakes counter) to everyone
        io.to(room).emit('room-update', getRoomUpdatePayload(room));
    });

    // --- RESET GAME ---
    socket.on('reset-game', () => {
        const playerInfo = players[socket.id];
        if (!playerInfo) return;

        const room = playerInfo.room;
        const game = rooms[room];
        if (!game) return;

        game.status = 'waiting';
        game.puzzle = null;
        game.solution = null;
        game.totalEmptyCells = 0;

        for (const id in game.players) {
            game.players[id].progress = 0;
            game.players[id].mistakes = 0;
            game.players[id].board = null;
        }

        console.log(`[reset] Game di-reset di room "${room}" oleh ${playerInfo.name}`);

        io.to(room).emit('room-update', getRoomUpdatePayload(room));
    });

    // --- LEAVE ROOM SECURITY / CLEANUP ---
    socket.on('leave-room', () => {
        const playerInfo = players[socket.id];
        if (!playerInfo) return;

        const { room, name } = playerInfo;
        socket.leave(room);

        console.log(`[leave] ${name} (${socket.id}) keluar dari room "${room}"`);

        if (rooms[room]) {
            delete rooms[room].players[socket.id];

            if (Object.keys(rooms[room].players).length === 0) {
                delete rooms[room];
                console.log(`[cleanup] Room "${room}" telah dihapus karena kosong`);
            } else {
                io.to(room).emit('room-update', getRoomUpdatePayload(room));
                io.to(room).emit('player-left', { name });
            }
        }

        delete players[socket.id];
    });

    // --- DISCONNECT ---
    socket.on('disconnect', () => {
        const playerInfo = players[socket.id];
        console.log(`[disconnect] ${socket.id}`);

        if (playerInfo) {
            const { room, name } = playerInfo;
            if (rooms[room]) {
                delete rooms[room].players[socket.id];

                if (Object.keys(rooms[room].players).length === 0) {
                    delete rooms[room];
                    console.log(`[cleanup] Room "${room}" telah dihapus karena kosong`);
                } else {
                    io.to(room).emit('room-update', getRoomUpdatePayload(room));
                    io.to(room).emit('player-left', { name });
                }
            }
            delete players[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});