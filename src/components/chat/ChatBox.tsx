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
    <section className="flex h-[420px] flex-col rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-slate-300">Chat</h2>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.id} className="rounded-xl bg-white/5 p-3">
            <p className="text-xs font-bold text-amber-200">{message.playerName}</p>
            <p className="text-sm text-slate-100">{message.text}</p>
          </div>
        ))}
        {messages.length === 0 ? <p className="text-sm text-slate-500">O silencio tambem acusa.</p> : null}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <Input disabled={disabled} value={text} placeholder={disabled ? 'Chat bloqueado agora' : 'Mensagem'} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} />
        <Button disabled={disabled || !text.trim()} onClick={send}>Enviar</Button>
      </div>
    </section>
  )
}
