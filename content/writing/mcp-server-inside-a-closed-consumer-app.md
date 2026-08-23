---
title: "Driving a closed consumer app with an MCP server"
description: "An AI concierge needed to order food inside an app with no public API. The tool layer ended up being a Playwright-backed MCP server."
date: 2026-08-24
draft: true
tags: [MCP, Playwright, AI agents, browser automation]
---

At Avici Money the concierge had to complete real tasks — ordering, booking — inside consumer apps that expose no API to anyone outside their own client. The surface was closed. The tool layer became a Playwright-backed MCP server operating a controlled browser session.

## The problem with "just call the API"

TODO: what you evaluated first (public API? private API reverse-engineering? partner access?) and why each was closed off.

## Why MCP rather than a bespoke tool endpoint

TODO: what MCP gave you that a plain HTTP tool endpoint would not — schema negotiation, the host doing tool selection, reuse across models?

## Session and auth handling

The hard part of automating a logged-in consumer surface is not clicking buttons, it is staying logged in.

TODO: how sessions were established, stored, and refreshed. What happened on expiry. Whether one browser context was shared or one per user.

## What broke

TODO: the specific failure modes. Selector drift on redeploys? Rate limiting? Bot detection? Race conditions between the model deciding and the page changing?

## What I would do differently

TODO: one or two concrete things.

---

**Shipped:** a tool layer for an AI concierge, browser-session automation, and a backend control surface around a third-party UI. Stack: MCP, Playwright, LLMs, Node.
