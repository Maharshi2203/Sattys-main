"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Trash2, Mail, Calendar } from 'lucide-react'
import type { ContactMessage } from '@/lib/types'

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (message: ContactMessage) => {
    setSelectedMessage(message)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedMessage) return
    try {
      await fetch(`/api/contacts/${selectedMessage.id}`, { method: 'DELETE' })
      setMessages(messages.filter(m => m.id !== selectedMessage.id))
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const markAsRead = async (message: ContactMessage) => {
    if (message.is_read) return
    try {
      const res = await fetch(`/api/contacts/${message.id}`, { method: 'PUT' })
      const data = await res.json()
      setMessages(messages.map(m => m.id === message.id ? data : m))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Messages</h1>
        <p className="text-muted-foreground">Customer inquiries and feedback</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d4f3c]" />
        </div>
      ) : messages.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card 
              key={message.id} 
              className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${!message.is_read ? 'bg-[#0d4f3c]/5' : ''}`}
              onClick={() => markAsRead(message)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{message.name}</h3>
                      {!message.is_read && (
                        <Badge className="bg-[#0d4f3c]">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${message.email}`} className="hover:text-[#0d4f3c]" onClick={(e) => e.stopPropagation()}>
                        {message.email}
                      </a>
                    </div>
                    <p className="text-[#1a1a1a] whitespace-pre-wrap">{message.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                      <Calendar className="w-3 h-3" />
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(message); }}
                    className="text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from {selectedMessage?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
