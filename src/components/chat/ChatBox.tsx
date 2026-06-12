'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ChatMessage } from '@/features/game/types'
import { getSocket } from '@/lib/socket'

export function ChatBox({ messages, disabled }: { messages: ChatMessage[]; disabled?: boolean }) {
  const [text, setText] = useState('')

  const send = () => {
    if (!text.trim()) return
    getSocket().emit('chat:message', { text })
    setText('')
  }

  return (
    <section className="flex h-[420px] flex-col bg-[#dacbb6]/95 p-4 text-[#171717] shadow-[8px_9px_0_rgba(23,23,23,0.45)] [clip-path:polygon(2%_0,98%_2%,100%_100%,0_97%)]">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#5e7381]">Chat</h2>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.id} className="rounded-[1rem_1.25rem_0.9rem_1.1rem] bg-[#eac8a6]/70 p-3 shadow-[3px_4px_0_rgba(23,23,23,0.18)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5e7381]">{message.playerName}</p>
            <p className="text-sm font-bold text-[#171717]">{message.text}</p>
          </div>
        ))}
        {messages.length === 0 ? <p className="text-sm font-bold text-[#171717]/55">O silencio tambem acusa.</p> : null}
      </div>
      <div className="mt-3 flex gap-2">
        <Input disabled={disabled} value={text} placeholder={disabled ? 'Chat bloqueado agora' : 'Mensagem'} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} />
        <Button disabled={disabled || !text.trim()} onClick={send}>Enviar</Button>
      </div>
    </section>
  )
}
