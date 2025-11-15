import React from 'react'
import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();
  return (
   <div className="tabs tabs-boxed bg-transparent p-2 m-2">
    <button type='button' onClick={ (e) => {setActiveTab(e.target.textContent)}} className={`tab ${
          activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}>
      chats
    </button>
    <button type='button' onClick={ (e) => {setActiveTab(e.target.textContent)}} className={`tab ${
          activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}>
      contacts
    </button>
    </div>
  )
}

export default ActiveTabSwitch