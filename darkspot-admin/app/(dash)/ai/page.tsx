"use client";
import { PageHead } from "@/components/ui";
import Copilot from "@/components/Copilot";
export default function AIPage() { return <div><PageHead title="AI Copilot" sub="Ask questions about users, findings, agents and sources. Shortcut: Ctrl J." /><div className="card p-5"><Copilot full /></div></div>; }
