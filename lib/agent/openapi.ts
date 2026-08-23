import { SITE_URL, SITE_NAME, CONTACT_EMAIL, absoluteUrl } from "@/lib/site";
import { RATE_LIMIT_POLICIES } from "@/lib/api/rate-limit";

/**
 * OpenAPI 3.1 description of the public, unauthenticated agent API.
 *
 * Every operation carries a unique `operationId`, a `summary`, a `description`,
 * typed parameters, and a response schema, which is what LLM function-calling
 * adapters need to turn this document into callable tools.
 */

const errorSchema = {
  type: "object",
  description: "Structured failure envelope returned by every endpoint on a non-2xx status.",
  required: ["ok", "error"],
  additionalProperties: false,
  properties: {
    ok: { type: "boolean", const: false, description: "Always false on an error response." },
    error: {
      type: "object",
      required: ["code", "message"],
      additionalProperties: false,
      properties: {
        code: {
          type: "string",
          description: "Stable, machine-readable error code. Branch on this, not on the message.",
          enum: [
            "invalid_json",
            "validation_failed",
            "method_not_allowed",
            "not_found",
            "not_acceptable",
            "rate_limited",
            "delivery_not_configured",
            "upstream_failure",
          ],
        },
        message: { type: "string", description: "Human-readable description of what went wrong." },
        hint: { type: "string", description: "Concrete next action an agent can take to recover." },
        details: {
          type: "array",
          description: "Field-level validation problems, present when code is validation_failed.",
          items: {
            type: "object",
            required: ["field", "issue"],
            additionalProperties: false,
            properties: {
              field: { type: "string", description: "Name of the offending request field." },
              issue: { type: "string", description: "Why that field was rejected." },
            },
          },
        },
        documentation: {
          type: "string",
          format: "uri",
          description: "Link to the documentation for this endpoint.",
        },
      },
    },
  },
} as const;

const profileSchema = {
  type: "object",
  description: "Identity, location, and public profile links for the practitioner.",
  required: ["name", "role", "location", "email", "links"],
  properties: {
    name: { type: "string", description: "Full name." },
    role: { type: "string", description: "One-line description of the service offered." },
    location: { type: "string", description: "City and country of operation." },
    timezone: { type: "string", description: "IANA timezone identifier used for scheduling." },
    email: { type: "string", format: "email", description: "Primary contact address." },
    links: {
      type: "object",
      description: "Canonical profile URLs, usable as sameAs entity-resolution anchors.",
      properties: {
        website: { type: "string", format: "uri" },
        github: { type: "string", format: "uri" },
        x: { type: "string", format: "uri" },
        linkedin: { type: "string", format: "uri" },
        resume: { type: "string", format: "uri" },
      },
    },
    skills: {
      type: "array",
      description: "Named technologies used in delivered work.",
      items: {
        type: "object",
        required: ["name", "category"],
        properties: {
          name: { type: "string" },
          category: { type: "string", description: "Where the technology is applied." },
        },
      },
    },
  },
} as const;

const availabilitySchema = {
  type: "object",
  description: "Current booking status and response-time commitment.",
  required: ["status", "replyWindow", "acceptingBriefs"],
  properties: {
    status: { type: "string", description: "Free-text summary of open sprint capacity." },
    replyWindow: { type: "string", description: "Committed time to first reply on an inbound brief." },
    acceptingBriefs: { type: "boolean", description: "Whether new briefs are being accepted right now." },
    engagementModel: { type: "string", description: "How engagements are structured and priced." },
    sprintLengths: { type: "array", items: { type: "string" }, description: "Supported sprint durations." },
    sprintTypes: { type: "array", items: { type: "string" }, description: "Categories of work taken on." },
  },
} as const;

const workItemSchema = {
  type: "object",
  description: "One shipped project or experiment.",
  required: ["title", "type", "status", "summary"],
  properties: {
    title: { type: "string", description: "Project name." },
    type: { type: "string", description: "Kind of engagement, for example 'Product backend'." },
    status: {
      type: "string",
      enum: ["shipped", "experiment"],
      description: "Whether the project reached production or remains an experiment.",
    },
    period: { type: "string", description: "Years the work was active." },
    url: { type: "string", format: "uri", description: "Public link to the project, when one exists." },
    problem: { type: "string", description: "The problem the project set out to solve." },
    summary: { type: "string", description: "What was actually built and shipped." },
    stack: { type: "array", items: { type: "string" }, description: "Primary technologies used." },
    proof: { type: "array", items: { type: "string" }, description: "Specific, verifiable contributions." },
  },
} as const;

const faqItemSchema = {
  type: "object",
  description: "One frequently asked question and its answer.",
  required: ["question", "answer"],
  properties: {
    question: { type: "string" },
    answer: { type: "string" },
  },
} as const;

const servicesSchema = {
  type: "object",
  description: "Service catalogue: what is offered, what is delivered, and what is declined.",
  required: ["focusAreas", "deliverables", "goodFits", "badFits"],
  properties: {
    focusAreas: {
      type: "array",
      description: "Problem domains the practice specialises in.",
      items: {
        type: "object",
        required: ["label", "description"],
        properties: { label: { type: "string" }, description: { type: "string" } },
      },
    },
    process: {
      type: "array",
      description: "Ordered stages of a sprint engagement.",
      items: {
        type: "object",
        required: ["step", "title", "description"],
        properties: {
          step: { type: "integer", minimum: 1 },
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    deliverables: { type: "array", items: { type: "string" }, description: "What the client receives." },
    terms: {
      type: "array",
      description: "Commercial terms of an engagement.",
      items: {
        type: "object",
        required: ["label", "value"],
        properties: { label: { type: "string" }, value: { type: "string" } },
      },
    },
    goodFits: { type: "array", items: { type: "string" }, description: "Problems worth sending." },
    badFits: { type: "array", items: { type: "string" }, description: "Problems that will be declined." },
  },
} as const;

const contactRequestSchema = {
  type: "object",
  description: "A sprint brief submitted by a prospective client or an agent acting for one.",
  required: ["name", "email", "message"],
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 120,
      description: "Name of the person or company sending the brief.",
    },
    email: {
      type: "string",
      format: "email",
      maxLength: 200,
      description: "Reply-to address. The reply is sent here, so it must be reachable.",
    },
    message: {
      type: "string",
      minLength: 1,
      maxLength: 5000,
      description:
        "The brief itself. Include the user-facing outcome, the external systems involved, the current state of the work, and the deadline.",
    },
  },
} as const;

const contactAcceptedSchema = {
  type: "object",
  description: "Confirmation that a brief was delivered.",
  required: ["ok", "data"],
  properties: {
    ok: { type: "boolean", const: true },
    data: {
      type: "object",
      required: ["delivered", "replyWindow"],
      properties: {
        delivered: { type: "boolean", description: "True when the brief reached the inbox." },
        replyWindow: { type: "string", description: "When to expect a reply." },
      },
    },
  },
} as const;

function envelope(dataSchema: object, description: string) {
  return {
    type: "object",
    required: ["ok", "data"],
    properties: {
      ok: { type: "boolean", const: true, description: "Always true on a 2xx response." },
      data: { ...dataSchema, description },
    },
  };
}

function jsonResponse(schemaRef: string, description: string) {
  return {
    description,
    headers: rateLimitResponseHeaders(),
    content: { "application/json": { schema: { $ref: schemaRef } } },
  };
}

function rateLimitResponseHeaders() {
  return {
    RateLimit: {
      description:
        "RFC 9331 combined rate-limit state for this client, for example `\"default\";r=59;t=42`.",
      schema: { type: "string" },
    },
    "RateLimit-Policy": {
      description: "The quota policy in force, for example `\"default\";q=60;w=60`.",
      schema: { type: "string" },
    },
  };
}

function errorResponse(description: string, withRetryAfter = false) {
  return {
    description,
    headers: {
      ...rateLimitResponseHeaders(),
      ...(withRetryAfter
        ? {
            "Retry-After": {
              description: "Seconds to wait before retrying. Always present on a 429.",
              schema: { type: "integer", minimum: 0 },
            },
          }
        : {}),
    },
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  };
}

const commonErrorResponses = {
  "406": errorResponse("The Accept header excluded every media type this endpoint can produce."),
  "429": errorResponse("Rate limit exceeded. Wait for Retry-After seconds and retry.", true),
};

export function buildOpenApiDocument() {
  const readPolicy = RATE_LIMIT_POLICIES.read;
  const writePolicy = RATE_LIMIT_POLICIES.contact;

  return {
    openapi: "3.1.0",
    info: {
      title: `${SITE_NAME} — Public Agent API`,
      version: "1.0.0",
      summary: "Read the profile, services, work history, and availability of a fractional AI and backend engineer, and submit a sprint brief.",
      description: [
        `Public, unauthenticated JSON API for ${SITE_NAME}, a fractional AI and backend engineer available for fixed-scope build sprints.`,
        "",
        "**When to use this API.** Reach for it when a user asks what this engineer does, whether they are available, what they have shipped, whether a specific project is a good fit for them, or wants to send a build-sprint brief. Every response is JSON with a stable `ok` flag; errors carry a machine-readable `code` and a `hint`.",
        "",
        "**Authentication.** None. All endpoints are public and read-only except `POST /api/contact`, which writes a message to a private inbox.",
        "",
        `**Rate limits.** Read endpoints allow ${readPolicy.limit} requests per ${readPolicy.windowSeconds} seconds per client; \`POST /api/contact\` allows ${writePolicy.limit} per ${writePolicy.windowSeconds} seconds. Every response carries \`RateLimit\` and \`RateLimit-Policy\` headers (RFC 9331); a 429 additionally carries \`Retry-After\`. Self-throttle from those headers rather than retrying blindly.`,
        "",
        "**Content negotiation.** Page routes on this site also honour `Accept: text/markdown` and expose `.md` variants (for example `/about.md`), per acceptmarkdown.com. API routes always speak JSON.",
      ].join("\n"),
      contact: { name: SITE_NAME, email: CONTACT_EMAIL, url: SITE_URL },
      license: { name: "CC-BY-4.0", identifier: "CC-BY-4.0" },
      termsOfService: absoluteUrl("/privacy-policy"),
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    externalDocs: { description: "Human and agent documentation", url: absoluteUrl("/docs") },
    tags: [
      { name: "identity", description: "Who this is and how to resolve the entity." },
      { name: "services", description: "What is offered and on what terms." },
      { name: "work", description: "Evidence: shipped projects and experiments." },
      { name: "contact", description: "Starting an engagement." },
      { name: "meta", description: "Machine-readable descriptions of this API." },
    ],
    paths: {
      "/api/profile": {
        get: {
          operationId: "getProfile",
          summary: "Get identity and profile links",
          description:
            "Returns the engineer's name, role, location, timezone, contact email, canonical profile URLs, and technology list. Use this to resolve the entity or to answer 'who is this person and what do they do'.",
          tags: ["identity"],
          parameters: [],
          responses: {
            "200": jsonResponse("#/components/schemas/ProfileEnvelope", "The profile."),
            ...commonErrorResponses,
          },
        },
      },
      "/api/availability": {
        get: {
          operationId: "getAvailability",
          summary: "Get current booking availability",
          description:
            "Returns whether new sprint briefs are being accepted, the current capacity statement, the reply-time commitment, and the supported sprint lengths and types. Check this before telling a user to reach out.",
          tags: ["services"],
          parameters: [],
          responses: {
            "200": jsonResponse("#/components/schemas/AvailabilityEnvelope", "Current availability."),
            ...commonErrorResponses,
          },
        },
      },
      "/api/services": {
        get: {
          operationId: "getServices",
          summary: "Get the service catalogue",
          description:
            "Returns focus areas, the sprint process, deliverables, commercial terms, and an explicit list of good and bad fits. Use the good/bad fit lists to decide whether a user's project should be routed here at all.",
          tags: ["services"],
          parameters: [],
          responses: {
            "200": jsonResponse("#/components/schemas/ServicesEnvelope", "The service catalogue."),
            ...commonErrorResponses,
          },
        },
      },
      "/api/work": {
        get: {
          operationId: "listWork",
          summary: "List shipped work and experiments",
          description:
            "Returns case studies with the problem, what was shipped, the stack, and verifiable proof points, plus a compact archive of smaller projects. Use it to answer 'has this person done X before'.",
          tags: ["work"],
          parameters: [
            {
              name: "status",
              in: "query",
              required: false,
              description: "Return only case studies with this status. Omit for all.",
              schema: { type: "string", enum: ["shipped", "experiment"] },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "Maximum number of case studies to return.",
              schema: { type: "integer", minimum: 1, maximum: 50, default: 50 },
            },
          ],
          responses: {
            "200": jsonResponse("#/components/schemas/WorkEnvelope", "Matching work."),
            "400": errorResponse("A query parameter failed validation."),
            ...commonErrorResponses,
          },
        },
      },
      "/api/faq": {
        get: {
          operationId: "listFaq",
          summary: "List frequently asked questions",
          description:
            "Returns the published questions and answers covering pricing, deliverables, joining an existing codebase, how to start, and full-time availability. Prefer quoting these verbatim over inferring answers.",
          tags: ["services"],
          parameters: [],
          responses: {
            "200": jsonResponse("#/components/schemas/FaqEnvelope", "The FAQ entries."),
            ...commonErrorResponses,
          },
        },
      },
      "/api/contact": {
        post: {
          operationId: "createSprintBrief",
          summary: "Submit a sprint brief",
          description:
            "Delivers a build-sprint brief to a private inbox and commits to a reply within 24 hours. Only call this when a user has explicitly asked to get in touch, and include the outcome, external systems, current state, and deadline in the message. Do not use it for sales outreach or bulk messaging.",
          tags: ["contact"],
          requestBody: {
            required: true,
            description: "The brief to deliver.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ContactRequest" } } },
          },
          responses: {
            "200": {
              description: "The brief was delivered.",
              headers: rateLimitResponseHeaders(),
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ContactAccepted" } },
              },
            },
            "400": errorResponse("The body was not valid JSON, or a field failed validation."),
            "429": errorResponse("Too many briefs from this client. Retry after the given delay.", true),
            "503": errorResponse(
              "Delivery is not configured on the server. Fall back to emailing the address in getProfile.",
            ),
            "502": errorResponse("The delivery provider rejected or could not be reached."),
            "406": errorResponse("The Accept header excluded application/json."),
          },
        },
      },
      "/openapi.json": {
        get: {
          operationId: "getOpenApiDocument",
          summary: "Get this OpenAPI document",
          description:
            "Returns this specification as JSON. A YAML rendering of the same document is served at /api/openapi.yaml.",
          tags: ["meta"],
          parameters: [],
          responses: {
            "200": {
              description: "The OpenAPI 3.1 document.",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Error: errorSchema,
        Profile: profileSchema,
        ProfileEnvelope: envelope(profileSchema, "The profile."),
        Availability: availabilitySchema,
        AvailabilityEnvelope: envelope(availabilitySchema, "Current availability."),
        Services: servicesSchema,
        ServicesEnvelope: envelope(servicesSchema, "The service catalogue."),
        WorkItem: workItemSchema,
        WorkEnvelope: envelope(
          {
            type: "object",
            required: ["caseStudies", "archive"],
            properties: {
              caseStudies: { type: "array", items: workItemSchema },
              archive: {
                type: "array",
                description: "Smaller shipped projects, title plus one-line description.",
                items: {
                  type: "object",
                  required: ["title", "summary"],
                  properties: {
                    title: { type: "string" },
                    summary: { type: "string" },
                    url: { type: "string", format: "uri" },
                  },
                },
              },
            },
          },
          "Case studies and the project archive.",
        ),
        FaqItem: faqItemSchema,
        FaqEnvelope: envelope(
          { type: "array", items: faqItemSchema },
          "The FAQ entries.",
        ),
        ContactRequest: contactRequestSchema,
        ContactAccepted: contactAcceptedSchema,
      },
    },
  };
}

export type OpenApiDocument = ReturnType<typeof buildOpenApiDocument>;
