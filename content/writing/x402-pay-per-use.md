---
title: "Shipping pay-per-use services on x402"
description: "Per-message AI chat and a pay-once URL shortener, settled with micropayments over the x402 protocol. Notes from putting it live."
date: 2026-08-22
draft: true
tags: [x402, Solana, payments, agents]
---

x402 revives HTTP 402 Payment Required as an actual protocol: a server answers 402 with payment terms, the client pays, retries, and gets the resource. I put two real services behind it — per-message AI chat and a pay-once URL shortener.

## Why 402 instead of a subscription

TODO: the argument. Who is the payer — a human or an agent? What breaks about subscriptions when the caller is an agent?

## The flow, concretely

TODO: walk one request end to end. What the 402 response body contains, what the client signs, how settlement is verified before the resource is served.

## Settling on Solana

TODO: why Solana for this. Fee and latency numbers, since those are the entire argument for micropayments.

## Pricing something per message

TODO: how you set the price, and what happens on a failed or partial generation. Does the caller get refunded?

## What is still awkward

TODO: honest list. Wallet UX for humans? Replay protection? Anything you had to build because the spec did not cover it?

---

**Live:** [x402.arpitkhandelwal.com](https://x402.arpitkhandelwal.com). Stack: x402, Solana, Next.js.
