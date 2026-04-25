import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaCircleCheck,
  FaStar,
  FaMicrochip,
  FaWaveSquare,
} from "react-icons/fa6";

/* =========================
   Data
========================= */

const starterMessages = [
  {
    sender: "bot",
    text: "Hello 👋 I’m your Software Project Assistant. Ask me anything about planning, scope, risks, WBS or scheduling.",
  },
];

const smartReplies = [
  {
    keywords: ["scope"],
    text: "Project scope defines deliverables, boundaries, assumptions, constraints, and measurable outcomes.",
  },
  {
    keywords: ["risk"],
    text: "Risk management includes identification, probability, impact, owner assignment, mitigation, and monitoring.",
  },
  {
    keywords: ["wbs"],
    text: "WBS divides the project into phases, tasks, and subtasks for better planning and control.",
  },
  {
    keywords: ["gantt", "timeline"],
    text: "A Gantt chart shows task durations, sequencing, overlaps, milestones, and deadlines.",
  },
  {
    keywords: ["test"],
    text: "Testing should include unit testing, integration testing, UI validation, bug fixing, and acceptance tests.",
  },
];

/* =========================
   Helpers
========================= */

function getReply(message) {
  const text = message.toLowerCase();

  for (const item of smartReplies) {
    if (item.keywords.some((word) => text.includes(word))) {
      return item.text;
    }
  }

  return "In project management, focus on planning, communication, quality, risk control, and clear delivery goals.";
}

/* =========================
   Components
========================= */

function HeaderAvatar({ typing }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-400 to-violet-500 text-slate-950 shadow-xl"
    >
      <FaRobot className="text-xl" />

      {typing && (
        <>
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400" />
        </>
      )}
    </motion.div>
  );
}

function Feature({ icon, text }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3"
    >
      <div className="text-cyan-500">{icon}</div>
      <span className="text-sm text-slate-700">{text}</span>
    </motion.div>
  );
}

function ChatBackgroundBot({ typing }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [0, 2, -2, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="relative opacity-[0.05]"
      >
        <div className="flex h-80 w-80 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 blur-[1px]">
          <FaRobot className="text-[150px] text-white" />
        </div>

        <div className="absolute inset-0 rounded-full border border-white/40" />

        {typing && (
          <span className="absolute right-8 top-10 h-4 w-4 rounded-full bg-emerald-400 animate-ping" />
        )}
      </motion.div>
    </div>
  );
}

function MessageBubble({ item }) {
  const isBot = item.sender === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && (
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
          <FaRobot />
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-md ${
          isBot
            ? "border border-slate-200 bg-white/85 text-slate-700 backdrop-blur-md"
            : "bg-gradient-to-r from-cyan-400 to-violet-500 font-medium text-slate-950"
        }`}
      >
        {item.text}
      </div>

      {!isBot && (
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-700 text-white">
          <FaUser />
        </div>
      )}
    </motion.div>
  );
}

/* =========================
   Main
========================= */

export default function ChatBox() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: getReply(input),
      };

      setMessages((prev) => [...prev, botMessage]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Left Panel */}
      <div className="rounded-[2rem] border border-slate-200 bg-white/60 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <HeaderAvatar typing={typing} />

          <div>
            <h3 className="text-xl font-bold text-slate-800">
              PM Assistant
            </h3>
            <p className="text-sm text-emerald-500">
              Online & Smart
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Feature icon={<FaStar />} text="Scope Guidance" />
          <Feature icon={<FaCircleCheck />} text="Risk Advice" />
          <Feature icon={<FaMicrochip />} text="WBS Support" />
          <Feature icon={<FaWaveSquare />} text="Gantt Help" />
          <Feature icon={<FaCircleCheck />} text="Testing Suggestions" />
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-4">
          <p className="text-sm leading-7 text-slate-600">
            Ask project management questions and get instant AI answers with a premium experience.
          </p>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/60 p-4 shadow-2xl backdrop-blur-xl">
        <ChatBackgroundBot typing={typing} />

        {/* Messages */}
        <div className="relative z-10 h-[560px] space-y-4 overflow-y-auto pr-2">
          <AnimatePresence>
            {messages.map((item, index) => (
              <MessageBubble key={index} item={item} />
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                <FaRobot />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 backdrop-blur-md">
                Typing...
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="relative z-10 mt-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Ask anything about project management..."
            className="flex-1 rounded-3xl border border-slate-200 bg-white/80 px-5 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-400"
          />

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            onClick={sendMessage}
            className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-xl"
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      </div>
    </div>
  );
}