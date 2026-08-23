---
title: "All 255,168 tic-tac-toe games, censused"
description: "Tic-tac-toe has exactly 255,168 distinct games. XOXO renders every one as a browsable tree with a minimax oracle attached."
date: 2026-08-23
draft: true
tags: [game theory, minimax, data visualisation]
---

Tic-tac-toe has exactly 255,168 distinct games if you count every legal move order and stop at the first win. XOXO enumerates all of them and renders the result as a branching, censused tree you can walk, with a minimax oracle telling you the true value of any position.

## Why 255,168 and not 9!

TODO: the counting argument. 9! = 362,880 is the naive number; explain what the difference is (games ending early on a win) and how you verified your enumeration hit the known figure.

## Enumeration

TODO: the approach — DFS over move orders? memoised on canonical board state? What was the runtime and where did it run: build time, or in the browser?

## Storing a quarter of a million games

TODO: the representation. Board as a base-3 integer? Path encoding? What the payload size ended up being and what you did to get it there.

## The minimax oracle

TODO: how position value is computed and whether it is precomputed or evaluated live. Whether symmetry reduction (the 8 board symmetries) was used, and why or why not.

## Rendering a tree that wide

TODO: the visualisation problem — you cannot draw 255,168 nodes at once. What the collapsing/virtualisation strategy was.

---

**Live:** [xoxo.arpitkhandelwal.com](https://xoxo.arpitkhandelwal.com)
