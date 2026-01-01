"use client"
import React, { useState, useEffect, useMemo } from 'react';
import
{
  Terminal, Shield, Zap, ExternalLink, Github, Linkedin, Twitter,
  Globe, Lock, Code, Mic, ChevronRight, Hash, Command, Server, Eye, Award,
  Landmark, MessageCircle, Brain, Database, Video, Gamepad, Image as ImageIcon,
  FileText, Music, Smartphone
} from 'lucide-react';

/**
 * =========================================================================================
 * DATA LAYER - SINGLE SOURCE OF TRUTH
 * =========================================================================================
 */

const RESUME_DATA = {
  name: "Arpit Khandelwal",
  initials: "AK",
  location: "Bengaluru, IN",
  locationLink: "https://maps.app.goo.gl/zhMJcYT74CoPqhkd8",
  about:
    "Full Stack Engineer specializing in AI and Web3 applications, focused on delivering robust and user-centric products.",
  summary:
    "Bridging the gap between Enterprise Security rigor and Agentic AI velocity. I build systems that are secure by design and autonomous by nature.",
  avatarUrl: "https://avatars.githubusercontent.com/u/68700864?v=4",
  personalWebsiteUrl: "https://arpitkhandelwal.com",
  contact: {
    email: "ak@arpitkhandelwal.com",
    tel: "+918224099125",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/arpit-khandelwal",
        icon: Github,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/arpit-khandelwal-0812aa1a3/",
        icon: Linkedin,
      },
      {
        name: "X",
        url: "https://x.com/ArpitKhandelwa3",
        icon: Twitter,
      },
    ],
  },
  work: [
    {
      company: "Freelance",
      link: "",
      badges: ["Remote"],
      title: "Software Developer",
      start: "2021",
      end: "Present",
      description:
        "Engineered automated solutions including FFmpeg video pipelines for creators, Reddit scraping/query bots, and custom AI-powered Discord/Twitter/Telegram bots leveraging knowledge integration and web scraping tools (Firecrawl/Playwright).",
    },
    {
      company: "Avici Money",
      link: "https://avici.money",
      badges: ["Remote"],
      title: "AI and Backend Engineer",
      start: "January, 2025",
      end: "July, 2025",
      description:
        "Developing an AI concierge service enabling users to seamlessly order food, book tickets, and manage various tasks through natural language interaction. Built the Swiggy MCP Server using Playwright.",
    },
    {
      company: "Hewlett Packard Enterprise",
      link: "",
      badges: ["Hybrid"],
      title: "Software Developer 1",
      start: "2023",
      end: "2024",
      description:
        "Developed and integrated microservices for DAST security tools (Webinspect, Burp Suite, OWASP ZAP, OpenVAS), enhancing application security testing capabilities.",
    },
  ],
  skills: [
    "JavaScript", "TypeScript", "Python", "React/Next.js", "Node.js",
    "Solana", "AI/LLMs", "Vector DB", "Prisma", "Postgres",
    "Zod", "ffmpeg", "Playwright", "Web Scraping", "API Integration",
    "Docker", "Cloudflare Workers", "Rust"
  ],
  projects: [
    {
      title: "Voting Dapp",
      techStack: ["Next.js", "TypeScript", "Solana", "Rust", "Tailwind CSS"],
      description: "Voting Dapp to vote for candidates on Solana blockchain",
      link: { label: "website", href: "https://ion.arpitkhandelwal.com" },
    },
    {
      title: "Ion Vault",
      techStack: ["Next.js", "TypeScript", "Solana", "Rust", "Tailwind CSS"],
      description: "Vault to Deposit/Withdraw native SOL using PDAs and Anchor.",
      link: { label: "website", href: "https://ion.arpitkhandelwal.com" },
    },
    {
      title: "Gossip DAO",
      techStack: ["Next.js", "TypeScript", "Solana", "Prisma", "Tailwind CSS"],
      description: "Privacy-focused anonymous gossip platform built during Zugrama residency. Achieved 50+ users & 200+ gossips within 24 hours.",
      link: { label: "website", href: "https://gossip-dao.vercel.app" },
    },
    {
      title: "Sage Aadit",
      techStack: ["Next.js", "TypeScript", "AI", "LLMs", "Vector DB", "Tailwind CSS"],
      description: "AI therapist providing personalized support through weekly check-ins and indexed journal entries (RAG).",
      link: { label: "website", href: "https://sage-aadit.arpitkhandelwal.com" },
    },
    {
      title: "100xNFT",
      techStack: ["Solana", "Next.js", "TypeScript", "NFT", "Tailwind CSS"],
      description: "Gated Solana NFT minting platform exclusively for members of Harkirat's 100x Devs cohort.",
      link: { label: "website", href: "https://nft.arpitkhandelwal.com" },
    },
    {
      title: "Helius Indexer",
      techStack: ["Solana", "Helius API", "Postgres", "Node.js", "TypeScript", "React/Next.js"],
      description: "Blockchain indexing platform simplifying Solana data integration into Postgres using Helius webhooks.",
      link: { label: "website", href: "https://helius-indexer.arpitkhandelwal.com" },
    },
    {
      title: "Atlas",
      techStack: ["LLMs", "Azure", "RAG", "Devops"],
      description: "AI-powered chatbot for the Solana ecosystem, providing users with relevant information and assistance.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=Atlas" },
    },
    {
      title: "Youtube Downloader",
      techStack: ["TypeScript", "React", "Node.js", "Next.js", "S3", "ffmpeg", "Chakra UI", "Tailwind CSS"],
      description: "Minimalist tool for downloading YouTube audio and video at custom qualities and resolutions.",
      link: { label: "website", href: "https://yt.arpitkhandelwal.com" },
    },
    {
      title: "Github Leaderboard",
      techStack: ["TypeScript", "React", "Node.js", "Next.js", "Prisma", "Zod", "Postgres", "Github API"],
      description: "Ranks GitHub users based on their open-source software contributions using the GitHub API.",
      link: { label: "website", href: "https://leaderboard.arpitkhandelwal.com" },
    },
    {
      title: "Video Trimmer",
      techStack: ["Flask", "Python", "ffmpeg"],
      description: "Frame-accurate tool to trim and merge multiple videos, handling varying resolutions and encodings.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=Video+Trimmer" },
    },
    {
      title: "Mint Free NFT",
      techStack: ["React", "Ethers.js", "Hardhat"],
      description: "Platform for minting free, randomly generated NFTs on the Ethereum testnet to onboard new users.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/myNFT" },
    },
    {
      title: "Blinks",
      techStack: ["React", "Solana", "Typescript", "Next.js"],
      description: "Collection of interactive Solana Actions (Blinks) including coin toss betting, gated NFTs, and quizzes.",
      link: { label: "website", href: "https://actions.arpitkhandelwal.com/api/actions" },
    },
    {
      title: "Blinkathon Leaderboard",
      techStack: ["Next.js", "Typescript", "Solana Actions", "Prisma"],
      description: "Displays views and upvotes for community-submitted Blinks (Solana Actions).",
      link: { label: "website", href: "https://blinkathon.vercel.app/" },
    },
    {
      title: "7 course mart",
      techStack: ["Next.js", "Typescript", "Tailwind CSS", "Framer Motion"],
      description: "Animated landing page developed for a gourmet food store.",
      link: { label: "website", href: "https://7cm.arpitkhandelwal.com" },
    },
    {
      title: "Daily Quote",
      techStack: ["Next.js", "Typescript", "Tailwind CSS"],
      description: "Web application displaying daily motivational quotes from Stoic philosophy.",
      link: { label: "website", href: "https://quotes.arpitkhandelwal.com/" },
    },
    {
      title: "WoW Helper",
      techStack: ["React", "Node.js"],
      description: "Utility to find valid words from given letters for the 'Words of Wonder' game.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=WoW+Helper" },
    },
    {
      title: "Typing Game",
      techStack: ["JavaScript", "HTML", "CSS"],
      description: "Simple web-based game designed to test and improve typing speed and accuracy.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/typing-game" },
    },
    {
      title: "Drum Kit",
      techStack: ["JavaScript", "HTML", "CSS"],
      description: "Interactive web application allowing users to play drum sounds using keyboard keys.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/Drum-Kit" },
    },
    {
      title: "Real Estate WhatsApp Chatbot",
      techStack: ["Node.js", "WhatsApp API", "MongoDB", "OpenAI API", "Cloudflare Workers", "Hono"],
      description: "AI-powered WhatsApp chatbot facilitating property buying, selling, and listing.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=Real+Estate+WhatsApp+Chatbot" },
    },
    {
      title: "Calendly Workaround",
      techStack: ["JavaScript", "Node.js", "Playwright"],
      description: "Automated script using Playwright to overcome limitations in Calendly scheduling.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/Calendly-workaround" },
    },
    {
      title: "AI Screenshot Renamer",
      techStack: ["Python", "OpenCV"],
      description: "Utility that automatically renames screenshot files based on their visual content using OpenCV.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=AI+Screenshot+Renamer" },
    },
    {
      title: "Low Power Mode Test",
      techStack: ["JavaScript", "React"],
      description: "Proof-of-concept demonstrating render optimization for devices in low power mode.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/Low-Power-Mode-Test" },
    },
    {
      title: "Image to Excel",
      techStack: ["Python", "Pandas"],
      description: "Tool to convert image data (e.g., tables) into structured Excel spreadsheets.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/ImageToExcel" },
    },
    {
      title: "Insta Follow Frenzy",
      techStack: ["Python", "Instagram API"],
      description: "Proof-of-concept script to recursively follow followers of an Instagram account for social graph analysis.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=Insta+Follow+Frenzy" },
    },
    {
      title: "Ask GPT Twitter",
      techStack: ["Node.js", "Twitter API", "OpenAI API"],
      description: "Twitter bot that answers questions about a tweet when mentioned in a reply, using GPT.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal?tab=repositories&q=Ask+GPT+Twitter" },
    },
    {
      title: "Twitter Thread Bot",
      techStack: ["Node.js", "Twitter API", "OpenAI API"],
      description: "Automated bot creating Twitter threads on various topics using GPT and the Twitter API.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/Twitter-Thread-Bot" },
    },
    {
      title: "Terminal Chat GPT",
      techStack: ["Python", "OpenAI API"],
      description: "Command-line interface application for interacting with OpenAI's GPT models directly from the terminal.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/TerminalChatGPT" },
    },
    {
      title: "Face Mask Detection",
      techStack: ["Python", "OpenCV"],
      description: "Application using OpenCV to detect face masks in images and real-time video streams.",
      link: { label: "github", href: "https://github.com/arpit-khandelwal/AI-Face-Mask-Detection" },
    },
  ],
};


/**
 * =========================================================================================
 * COMPONENT LAYER
 * =========================================================================================
 */

// --- Helpers to Map Data to UI ---

const getIconForProject = (title: string, techStack: string[]) =>
{
  const t = title.toLowerCase();
  const stack = techStack.join(' ').toLowerCase();

  if (t.includes('voting') || t.includes('vault') || t.includes('nft')) return Landmark;
  if (t.includes('gossip') || t.includes('chat') || t.includes('twitter') || t.includes('whatsapp')) return MessageCircle;
  if (t.includes('ai') || t.includes('sage') || t.includes('gpt') || stack.includes('llm')) return Brain;
  if (t.includes('indexer') || t.includes('leaderboard') || t.includes('excel')) return Database;
  if (t.includes('youtube') || t.includes('video') || t.includes('stream')) return Video;
  if (t.includes('game') || t.includes('wow') || t.includes('typing')) return Gamepad;
  if (t.includes('image') || t.includes('mask') || t.includes('screenshot')) return ImageIcon;
  if (t.includes('drum')) return Music;
  return Code;
};

// Data Transformation Adapter
const usePortfolioData = () =>
{
  return useMemo(() =>
  {
    // 1. Meta & Hero
    const meta = RESUME_DATA;

    // 2. Cores (Split Work History)
    const hpeWork = RESUME_DATA.work.find(w => w.company.includes("Hewlett Packard"));
    const aviciWork = RESUME_DATA.work.find(w => w.company.includes("Avici"));

    const cores = [
      {
        id: "security",
        title: "The Sentinel",
        icon: Shield,
        color: "blue",
        protocol: "Protocol: Security",
        description: hpeWork ? hpeWork.description : "Enterprise Security Specialist",
        skills: ["Auth Automation (Selenium)", "Pen-Testing Integrations", "WebInspect"]
      },
      {
        id: "velocity",
        title: "The Architect",
        icon: Zap,
        color: "emerald",
        protocol: "Protocol: Velocity",
        description: aviciWork ? aviciWork.description : "AI & Web3 Engineer",
        skills: ["Reverse Engineering APIs", "Decentralized Swarms", "MCP Servers"]
      }
    ];

    // 3. Selected Operations (Curated High Impact)
    // We manually pick the top projects to show in the "Magnum Opus" section
    const selectedTitles = ["Avici Money", "Gossip DAO", "Atlas", "Helius Indexer", "Ion Vault"];

    const selectedOperations = [];

    // Add Avici (from Work) as a Project
    if (aviciWork) {
      selectedOperations.push({
        id: "avici",
        title: "Swiggy MCP Server",
        role: "AI & Fullstack Engineer @ Avici",
        date: aviciWork.start + " - " + aviciWork.end,
        type: "Agentic Infrastructure",
        icon: Server,
        description: "Built a Model Context Protocol (MCP) server that allowed LLMs to interact with Swiggy's closed ecosystem. Engineered a session-mocking layer using Playwright to simulate human authentication.",
        tags: ["Python", "Playwright", "MCP"],
        link: aviciWork.link,
        stats: { label: "Impact", value: "Zero-API Integration" }
      });
    }

    // Add Gossip DAO
    const gossip = RESUME_DATA.projects.find(p => p.title === "Gossip DAO");
    if (gossip) {
      selectedOperations.push({
        id: "gossip",
        title: gossip.title,
        role: "Zugrama Residency",
        date: "2025",
        type: "Community",
        icon: MessageCircle,
        description: gossip.description,
        tags: gossip.techStack,
        link: gossip.link.href,
        stats: { label: "Users", value: "200+ in 24h" }
      });
    }

    // Add Atlas (Solchat)
    const atlas = RESUME_DATA.projects.find(p => p.title === "Atlas");
    if (atlas) {
      selectedOperations.push({
        id: "atlas",
        title: "Atlas (Solchat)",
        role: "Grant Winner ($2,500)",
        date: "LATE 2024",
        type: "Grant Winner",
        icon: Award,
        description: atlas.description,
        tags: atlas.techStack,
        link: atlas.link.href,
        stats: { label: "Award", value: "Foundation Grant" }
      });
    }

    // Add Helius
    const helius = RESUME_DATA.projects.find(p => p.title === "Helius Indexer");
    if (helius) {
      selectedOperations.push({
        id: "helius",
        title: helius.title,
        role: "Infrastructure Engineering",
        date: "2024",
        type: "Protocol Engineering",
        icon: Database,
        description: helius.description,
        tags: helius.techStack,
        link: helius.link.href
      });
    }

    // 4. The Vault (Everything else)
    const vault = RESUME_DATA.projects
      .filter(p => !selectedTitles.includes(p.title) && p.title !== "Gossip DAO" && p.title !== "Helius Indexer" && p.title !== "Atlas")
      .map(p => ({
        id: p.title,
        title: p.title,
        desc: p.description,
        stack: p.techStack.slice(0, 3), // First 3 tags only
        link: p.link.href,
        icon: getIconForProject(p.title, p.techStack)
      }));

    return { meta, cores, selectedOperations, vault };
  }, []);
};


// --- UI Components ---

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-12 md:mb-20">
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
      {title}<span className="text-emerald-500">.</span>
    </h2>
    <div className="h-1 w-20 bg-emerald-500 mb-4"></div>
    <p className="text-slate-400 max-w-xl text-lg leading-relaxed">{subtitle}</p>
  </div>
);

const TechTag = ({ label }: { label: string }) => (
  <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-mono rounded hover:border-emerald-500/50 transition-colors cursor-default">
    {label}
  </span>
);

const DualCoreSystem = ({ cores }: { cores: { id: string; icon: any; color: string; protocol: string; title: string; description: string; skills: string[] }[] }) => (
  <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
    {cores.map((core) => (
      <div key={core.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:bg-slate-900/60 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <core.icon className={`w-32 h-32 ${core.color === 'blue' ? 'text-blue-500' : 'text-emerald-500'}`} />
        </div>
        <div className="relative z-10">
          <div className={`flex items-center gap-3 mb-4 ${core.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'}`}>
            <core.icon className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">{core.protocol}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{core.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {core.description}
          </p>
          <ul className="space-y-2 text-sm text-slate-300 font-mono">
            {core.skills.map((skill, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${core.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

const MagnumOpus = ({ op }: { op: { date: string; title: string; role: string; stats?: { label: string; value: string }; icon: any; type: string; description: string; tags: string[]; link?: string } }) => (
  <div className="group relative bg-slate-950 border-b border-slate-800 py-12 md:py-16 hover:bg-slate-900/20 transition-colors">
    <div className="container mx-auto px-6 flex flex-col md:flex-row gap-8 md:gap-16">

      {/* Left: Meta */}
      <div className="md:w-1/4 flex flex-col justify-between shrink-0">
        <div>
          <span className="font-mono text-emerald-500 text-xs mb-2 block">{op.date}</span>
          <h3 className="text-3xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
            {op.title}
          </h3>
          <span className="inline-block mt-2 px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-400 text-xs">
            {op.role}
          </span>
        </div>
        {op.stats && (
          <div className="mt-6 p-4 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-emerald-500">
            <p className="text-xs text-slate-400 font-mono uppercase">{op.stats.label}</p>
            <p className="text-xl font-bold text-white">{op.stats.value}</p>
          </div>
        )}
      </div>

      {/* Right: Content */}
      <div className="md:w-3/4">
        <div className="flex items-center gap-3 mb-4">
          {/* Dynamic Icon */}
          <op.icon className={`w-4 h-4 ${op.type.includes('Grant') ? 'text-yellow-400' : op.type.includes('Speaker') ? 'text-purple-400' : 'text-slate-500'}`} />
          <span className="text-sm font-semibold text-slate-300">{op.type}</span>
        </div>
        <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-3xl">
          {op.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          {op.tags.map((tag, i) => <TechTag key={i} label={tag} />)}
        </div>

        {op.link && (
          <a href={op.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white font-semibold border-b border-emerald-500 pb-1 hover:text-emerald-400 transition-colors">
            View Source <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  </div>
);

const VaultItem = ({ item }: { item: { link: string; title: string; desc: string; stack: string[]; icon: any } }) => (
  <a
    href={item.link}
    target="_blank"
    className="block p-6 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer hover:-translate-y-1"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded group-hover:bg-slate-700 transition-colors text-emerald-400">
        <item.icon className="w-5 h-5" />
      </div>
      <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
    </div>
    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
    <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{item.desc}</p>
    <div className="flex flex-wrap gap-2">
      {item.stack.map((t, i) => (
        <span key={i} className="text-[10px] text-slate-500 font-mono">#{t}</span>
      ))}
    </div>
  </a>
);

// --- Main Page ---

export default function Portfolio()
{
  const [scrolled, setScrolled] = useState(false);
  const data = usePortfolioData();

  useEffect(() =>
  {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-white">

      {/* Sticky Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur border-b border-slate-800 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="font-mono font-bold text-xl tracking-tighter text-white">
            {data.meta.name.split(' ')[0].toUpperCase()}<span className="text-emerald-500">.</span>{data.meta.name.split(' ')[1].toUpperCase()}
          </div>
          <div className="flex gap-6">
            {data.meta.contact.social.map((social, idx) => (
              <a key={idx} href={social.url} target="_blank" className="hover:text-emerald-400 transition-colors"><social.icon className="w-5 h-5" /></a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-32 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM ONLINE
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Tatakaee</span><br />
            Protocol.
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed mb-12">
            {data.meta.summary}
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => { const element = document.getElementById('work'); if (element) element.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400 transition-colors flex items-center gap-2">
              <Eye className="w-5 h-5" /> View Selected Works
            </button>
            <a href={`mailto:${data.meta.contact.email}`} className="px-8 py-4 bg-slate-900 border border-slate-800 text-white font-medium rounded hover:border-slate-600 transition-colors">
              Establish Uplink
            </a>
          </div>
        </div>

        {/* Background Noise */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none -z-10 blur-3xl" />
      </header>

      {/* DNA Section */}
      <section className="py-20 border-y border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-sm font-mono text-slate-500 uppercase tracking-widest">System Architecture</h2>
          </div>
          <DualCoreSystem cores={data.cores} />
        </div>
      </section>

      {/* Selected Operations */}
      <section id="work" className="bg-slate-950">
        <div className="container mx-auto px-6 pt-24 pb-12">
          <SectionHeader
            title="Selected Operations"
            subtitle="A curation of high-impact architectures, public goods, and stealth prototypes."
          />
        </div>

        {data.selectedOperations.map((op) => (
          <MagnumOpus key={op.id} op={op} />
        ))}
      </section>

      {/* The Vault */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="The Vault"
            subtitle="Experiments, hackathon wins, and scripts from the lab."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.vault.map((item) => (
              <VaultItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Terminal */}
      <footer className="bg-black py-12 border-t border-slate-900">
        <div className="container mx-auto px-6 font-mono text-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-emerald-500 mb-2">$ echo "Let's Build"</p>
              <h3 className="text-2xl text-white font-bold mb-6">Ready to deploy?</h3>
              <div className="flex gap-4">
                <a href={`mailto:${data.meta.contact.email}`} className="text-slate-400 hover:text-white underline decoration-emerald-500 underline-offset-4">Email Protocol</a>
                {data.meta.contact.social.find(s => s.name === "X") && <a href={data.meta.contact.social.find(s => s.name === "X")!.url} className="text-slate-400 hover:text-white underline decoration-emerald-500 underline-offset-4">X Comms</a>}
              </div>
            </div>
            <div className="text-slate-600 md:text-right">
              <p>LOCATION: {data.meta.location.toUpperCase()}</p>
              <p>CURRENT STATUS: OPEN FOR CONTRACTS</p>
              <p className="mt-4">© {new Date().getFullYear()} {data.meta.name}</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
