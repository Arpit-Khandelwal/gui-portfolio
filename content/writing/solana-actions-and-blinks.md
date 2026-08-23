---
title: "Solana Actions and Blinks: betting, gated NFTs, and quizzes"
description: "Three Blinks built on Solana Actions — what the spec makes easy, and where you end up writing more than you expected."
date: 2026-08-21
draft: true
tags: [Solana, Blinks, Solana Actions]
---

Solana Actions turn a URL into a transaction a wallet can execute, and Blinks make that URL renderable anywhere that unfurls links. I built three: a betting flow, gated NFT minting, and a quiz.

## What an Action actually is

TODO: the shape of the GET metadata response and the POST that returns a serialised transaction. Keep it concrete — paste the real payloads.

## The betting Blink

TODO: how stakes are escrowed and resolved. Who settles, and what stops the resolver from cheating.

## Gated NFT minting

TODO: what the gate checks (cohort membership? a prior token?) and where that check runs — client, Action server, or on-chain.

## The quiz

TODO: how answers are validated without leaking the answer key to the client.

## Where the spec ran out

TODO: what you had to build yourself — CORS and the `actions.json` dance, transaction simulation, error surfacing into wallet UI, chained actions.

---

**Live:** [actions.arpitkhandelwal.com/api/actions](https://actions.arpitkhandelwal.com/api/actions)
