'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Pencil, Trash2, FolderTree, ChevronRight, LayoutGrid } from 'lucide-react'
import type { Category } from '@/lib/types'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', parent_id: 'null' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setFormData({ name: '', description: '', parent_id: 'null' })
    setError('')
    setDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData({ 
      name: category.name, 
      description: category.description || '', 
      parent_id: category.parent_id?.toString() || 'null' 
    })
    setError('')
    setDialogOpen(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setError('')
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCategory) return
    try {
      const res = await fetch(`/api/categories/${selectedCategory.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete category')
        return
      }
      setCategories(categories.filter(c => c.id !== selectedCategory.id))
      setDeleteDialogOpen(false)
      toast.success('Category deleted successfully')
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    const payload = {
      ...formData,
      parent_id: formData.parent_id === 'null' ? null : parseInt(formData.parent_id)
    }

    try {
      const url = selectedCategory ? `/api/categories/${selectedCategory.id}` : '/api/categories'
      const method = selectedCategory ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save category')
        return
      }
      if (selectedCategory) {
        setCategories(categories.map(c => c.id === selectedCategory.id ? data : c))
        toast.success('Category updated successfully')
      } else {
        setCategories([...categories, data])
        toast.success('Category created successfully')
      }
      setDialogOpen(false)
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setSaving(false)
    }
  }

  const getParentName = (parentId: number | null) => {
    if (!parentId) return null
    const parent = categories.find(c => c.id === parentId)
    return parent ? parent.name : null
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Hierarchy</h1>
          <p className="text-muted-foreground mt-2 text-lg">Define and organize your product architecture.</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-[1.02]">
          <Plus className="w-5 h-5" />
          New Category
        </Button>
      </div>

      <Card className="border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderTree className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">No Categories Found</h3>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Create your first category to start organizing your catalog.</p>
              <Button onClick={handleCreate} className="mt-8 bg-primary rounded-xl px-12 h-14 font-bold">Add Category</Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Category Name</TableHead>
                  <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Parent</TableHead>
                  <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50 hidden md:table-cell">Description</TableHead>
                  <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {categories.map((category) => (
                    <TableRow key={category.id} className="group hover:bg-muted/20 transition-colors border-b border-border/50">
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all">
                            <FolderTree className="w-6 h-6 text-primary group-hover:text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{category.name}</span>
                            {category.parent_id && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
                                <span>Child Category</span>
                                <ChevronRight className="w-3 h-3" />
                                <span>{getParentName(category.parent_id)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                        {category.parent_id ? (
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-primary opacity-50" />
                            <span className="font-bold text-foreground opacity-80">{getParentName(category.parent_id)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <LayoutGrid className="w-4 h-4" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Root Category</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-6 px-8 hidden md:table-cell text-muted-foreground leading-relaxed">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell className="py-6 px-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(category)}
                            className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(category)} 
                            className="h-10 w-10 rounded-xl hover:bg-destructive hover:text-white transition-all text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-display font-bold">
              {selectedCategory ? 'Refine Category' : 'Architect Category'}
            </DialogTitle>
            <p className="text-white/70 text-sm mt-1">Define the properties for your product grouping.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Display Name *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="h-12 bg-muted/50 border-border rounded-xl focus:ring-primary font-bold"
                placeholder="e.g. Electronics, Luxury Goods"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Parent Category</Label>
              <Select value={formData.parent_id} onValueChange={(value) => setFormData({ ...formData, parent_id: value })}>
                <SelectTrigger className="h-12 bg-muted/50 border-border rounded-xl font-medium">
                  <SelectValue placeholder="Root Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="null">None (Root Category)</SelectItem>
                  {categories
                    .filter(c => c.id !== selectedCategory?.id) // Prevent self-parenting
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold opacity-50">Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                className="bg-muted/50 border-border rounded-xl focus:ring-primary min-h-[100px]"
                placeholder="Describe the purpose of this collection..."
                rows={4} 
              />
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="flex-1 rounded-xl h-12 font-bold">Cancel</Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 rounded-xl h-12 font-bold shadow-lg shadow-primary/20" disabled={saving}>
                {saving ? 'Processing...' : 'Save Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl font-display font-bold">Remove Hierarchy?</AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-foreground">&quot;{selectedCategory?.name}&quot;</span>? This action cannot be undone. 
              Categories with existing products or sub-categories cannot be removed for data integrity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 font-bold border-border">Discard</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl h-12 font-bold px-8 shadow-lg shadow-destructive/20"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
