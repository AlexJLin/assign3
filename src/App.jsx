import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react';

const { Badge, Button, Card } = ReactBootstrap

function Square({ value, onSquareClick, isSelected }) {
  const className = isSelected ? "square selected" : "square";
  return <button className={className} onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  const [selected, setSelected] = useState(null);
  function handleClick(i) {
    if (calculateWinner(squares)) return;
    const currentPlayer = xIsNext ? "X" : "O";
    const pieceCount = squares.filter(s => s === currentPlayer).length;
    if (pieceCount < 3) {
      if (squares[i]) return;
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
      return;
    }
    if (selected === null) {
      if (squares[i] !== currentPlayer) return;
      setSelected(i);
      return;
    }
    const from = selected;
    const to = i;
    const targetEmpty = squares[to] === null;
    const adjacent = isAdjacent(from, to);
    if (!targetEmpty || !adjacent || from === to) {
      setSelected(null);
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[from] = null;
    nextSquares[to] = currentPlayer;
    if (squares[4] === currentPlayer) {
      const moveWins = calculateWinner(nextSquares) === currentPlayer;
      const vacatesCenter = from === 4;
      if (!moveWins && !vacatesCenter) {
        setSelected(null);
        return;
      }
    }
    setSelected(null);
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) status = "Winner: "  + winner;
  else status = "Next player: " + (xIsNext ? "X" : "O");
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isSelected={selected === 0} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isSelected={selected === 1} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isSelected={selected === 2} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isSelected={selected === 3} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isSelected={selected === 4} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isSelected={selected === 5} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isSelected={selected === 6} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isSelected={selected === 7} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isSelected={selected === 8} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function isAdjacent(fromIndex, toIndex) {
  const fromRow = Math.floor(fromIndex / 3);
  const fromCol = fromIndex % 3;
  const toRow = Math.floor(toIndex / 3);
  const toCol = toIndex % 3;
  const rowDistance = Math.abs(fromRow - toRow);
  const colDistance = Math.abs(fromCol - toCol);
  return (rowDistance <= 1 && colDistance <= 1) && !(rowDistance === 0 && colDistance === 0);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}