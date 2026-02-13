'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, Pencil, Trash2, Search, Package, Upload, X, FileSpreadsheet, ImageIcon, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDropzone } from 'react-dropzone'

const emptyProduct = {
  product_code: '',
  name: '',
  brand_name: '',
  company_name: '',
  category_id: null as number | null,
  case_size: '',
  pack_size: '',
  shelf_life: '',
  base_price: 0,
  gst_percentage: 0,
  final_price: 0,
  description: '',
  image_url: '',
  images: [] as string[],
  stock_status: 'IN' as 'IN' | 'OUT',
  is_featured: false
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploadingImage(true)

    try {
      const newImages = [...(formData.images || [])]

      for (const file of acceptedFiles) {
        const data = new FormData()
        data.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data
        })

        if (!res.ok) throw new Error('Upload failed')
        const { url } = await res.json()
        newImages.push(url)
      }

      setFormData(prev => ({
        ...prev,
        images: newImages,
        image_url: newImages[0] || prev.image_url
      }))
      toast.success('Images uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload images')
    } finally {
      setUploadingImage(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true
  })

  const removeImage = (indexToRemove: number) => {
    const newImages = formData.images.filter((_, idx) => idx !== indexToRemove)
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image_url: newImages.length > 0 ? newImages[0] : ''
    }))
  }


  // SKU Auto-generation Logic
  useEffect(() => {
    if (!selectedProduct && formData.category_id) {
      const categoryProducts = products.filter(p => p.category_id === formData.category_id)

      // Get maximum sequence number from existing products in this category
      let maxSeq = 0
      categoryProducts.forEach(p => {
        if (p.product_code) {
          const codeStr = p.product_code.toString()
          const catIdStr = formData.category_id?.toString() || ''

          if (codeStr.startsWith(catIdStr)) {
            const seqStr = codeStr.substring(catIdStr.length)
            const seq = parseInt(seqStr)
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq
            }
          }
        }
      })

      const nextSeq = maxSeq + 1
      // Padding to 4 digits as per common SKU styles, e.g., 40001
      const paddedSequence = nextSeq.toString().padStart(4, '0')
      const generatedCode = `${formData.category_id}${paddedSequence}`

      if (formData.product_code !== generatedCode) {
        setFormData(prev => ({ ...prev, product_code: generatedCode }))
      }
    }
  }, [formData.category_id, selectedProduct, products, formData.product_code])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      // Support both array (legacy) and paginated response (new)
      setProducts(Array.isArray(data) ? data : (data.data || []))
    } catch (err) {
      console.error('Failed to fetch products:', err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setFormData(emptyProduct)
    setDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      product_code: product.product_code || '',
      name: product.name,
      brand_name: product.brand_name || '',
      company_name: product.company_name || '',
      category_id: product.category_id,
      case_size: product.case_size || '',
      pack_size: product.pack_size || '',
      shelf_life: product.shelf_life || '',
      base_price: Number(product.base_price),
      gst_percentage: Number(product.gst_percentage),
      final_price: Number(product.final_price),
      description: product.description || '',
      image_url: product.image_url || '',
      images: product.images || (product.image_url ? [product.image_url] : []),
      stock_status: product.stock_status,
      is_featured: product.is_featured
    })
    setDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return
    try {
      // Use Admin API for DELETE
      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setDeleteDialogOpen(false)
      toast.success('Product removed from catalog')
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Auto-calculate final price
    const base = Number(formData.base_price) || 0
    const gst = Number(formData.gst_percentage) || 0
    const final = base + (base * gst / 100)

    const payload = {
      ...formData,
      final_price: final,
      image_url: formData.images && formData.images.length > 0 ? formData.images[0] : formData.image_url,
      images: formData.images || []
    }

    try {
      // Use Admin API for POST/PUT
      const url = selectedProduct ? `/api/admin/products/${selectedProduct.id}` : '/api/admin/products'
      const method = selectedProduct ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error('Save failed')

      if (selectedProduct) {
        setProducts(products.map(p => p.id === selectedProduct.id ? data : p))
        toast.success('Product updated successfully')
      } else {
        setProducts([data, ...products])
        toast.success('New product added to catalog')
      }
      setDialogOpen(false)
    } catch (err) {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/products/import', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Import failed')

      toast.success(`Successfully imported ${result.success} products`)
      fetchProducts()
      setImportDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Import failed')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }



  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.product_code?.toLowerCase().includes(search.toLowerCase())
  )

  const calculatedFinalPrice = Number(formData.base_price) + (Number(formData.base_price) * Number(formData.gst_percentage) / 100)

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Catalog</h1>
          <p className="text-muted-foreground mt-2 text-lg">Curate and manage your premium product collection.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="h-14 px-8 rounded-2xl gap-3 border-border bg-white text-slate-600 hover:text-primary hover:bg-slate-50 font-bold transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Bulk Acquisition
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-br from-[#C8102B] via-[#A80D24] to-[#800A1B] hover:shadow-[0_20px_50px_-12px_rgba(200,16,43,0.4)] text-white font-bold h-14 px-10 rounded-2xl shadow-2xl shadow-primary/20 gap-3 transition-all hover:scale-[1.05] active:scale-[0.98]"
          >
            <Plus className="w-6 h-6" />
            New Masterpiece
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardHeader className="border-b border-slate-50 p-8 sm:px-10">
          <div className="relative max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name, brand, or product code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 h-16 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 font-medium text-lg placeholder:text-slate-400"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">No Products Found</h3>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Refine your search or add a new product to your catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Masterpiece</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Collection</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Financials</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50">Status</TableHead>
                    <TableHead className="py-6 px-8 text-xs uppercase tracking-widest font-bold opacity-50 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="group hover:bg-muted/20 transition-colors border-b border-border/50">
                        <TableCell className="py-6 px-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-muted border border-border overflow-hidden flex-shrink-0 relative group-hover:scale-110 transition-transform duration-500">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.brand_name || 'Generic'}</span>
                                <span className="w-1 h-1 bg-border rounded-full" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.product_code || 'No Code'}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          {product.category?.name ? (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-wider">
                              {product.category.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-30">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <p className="text-xl font-display font-bold text-foreground">₹ {Number(product.final_price).toLocaleString('en-IN')}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Base: ₹ {Number(product.base_price).toLocaleString('en-IN')}</p>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <div className="flex flex-col gap-2">
                            <Badge className={`${product.stock_status === 'IN' ? 'bg-emerald-500' : 'bg-destructive'} text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border-none`}>
                              {product.stock_status === 'IN' ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            {product.is_featured && (
                              <Badge className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border-none flex items-center gap-1 w-fit">
                                <Sparkles className="w-2.5 h-2.5" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(product)}
                              className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product)}
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
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          fullScreen
          className="bg-white overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-12 space-y-12">
              {/* Header */}
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm group"
                >
                  <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  Back to Catalog
                </button>

                <div className="space-y-2">
                  <DialogTitle className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tight">
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <p className="text-slate-500 text-lg md:text-xl font-medium tracking-tight">
                    Define specifications for your premium offering.
                  </p>
                </div>
              </div>

              {/* Visual Identity Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 py-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-primary">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900">Visual Representation</h3>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  {...getRootProps()}
                  className={cn(
                    "relative w-full min-h-[200px] bg-slate-50/50 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300",
                    isDragActive ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/40 hover:bg-slate-100/50",
                    uploadingImage && "opacity-50 pointer-events-none"
                  )}
                >
                  <input {...getInputProps()} />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-500 font-medium">Uploading images...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-lg font-bold text-slate-700">
                        {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">or click to browse (PNG, JPG, WebP)</p>
                    </div>
                  )}
                </div>

                {/* Or Paste URL */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or paste URL</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="image"
                    placeholder="Paste Image URL here and press Enter..."
                    className="h-14 bg-white border-slate-200 rounded-2xl pl-12 pr-24 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.currentTarget
                        const url = input.value.trim()
                        if (url) {
                          setFormData(prev => ({
                            ...prev,
                            images: [...(prev.images || []), url],
                            image_url: prev.images.length === 0 ? url : prev.image_url
                          }))
                          input.value = ''
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                    onClick={(e) => {
                      const input = document.getElementById('image') as HTMLInputElement
                      const url = input.value.trim()
                      if (url) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...(prev.images || []), url],
                          image_url: prev.images.length === 0 ? url : prev.image_url
                        }))
                        input.value = ''
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* Image Grid */}
                {formData.images && formData.images.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {formData.images.length} Image{formData.images.length > 1 ? 's' : ''} Added
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "relative aspect-square rounded-2xl border-2 overflow-hidden bg-white group",
                            idx === 0 ? "border-primary ring-2 ring-primary/20" : "border-slate-200"
                          )}
                        >
                          <img
                            src={img}
                            alt={`Product image ${idx + 1}`}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              const target = e.currentTarget
                              target.src = '/placeholder-product.jpg'
                            }}
                          />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product SKU</Label>
                  <Input
                    value={formData.product_code}
                    readOnly
                    className="h-14 bg-slate-100/50 border-none rounded-2xl px-6 text-slate-400 cursor-not-allowed font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Name</Label>
                  <Input
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Name</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-lg"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</Label>
                  <Select value={formData.category_id?.toString() || ''} onValueChange={(v) => setFormData({ ...formData, category_id: v ? parseInt(v) : null })}>
                    <SelectTrigger className="h-14 w-full bg-slate-50 border-slate-100 rounded-2xl px-6 font-bold">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()} className="h-12 rounded-lg font-medium">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Status</Label>
                  <Select value={formData.stock_status} onValueChange={(v: 'IN' | 'OUT') => setFormData({ ...formData, stock_status: v })}>
                    <SelectTrigger className="h-14 w-full bg-slate-50 border-slate-100 rounded-2xl px-6 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-white">
                      <SelectItem value="IN" className="h-12 rounded-lg font-bold text-emerald-600">In Stock</SelectItem>
                      <SelectItem value="OUT" className="h-12 rounded-lg font-bold text-destructive">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 bg-[#0a0a0a] rounded-[2rem] border border-white/10">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/40 uppercase tracking-widest">Base Price (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                    className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-4 focus:ring-primary/40 font-display font-bold text-xl text-white text-center"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/40 uppercase tracking-widest">GST (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.gst_percentage}
                    onChange={(e) => setFormData({ ...formData, gst_percentage: parseFloat(e.target.value) || 0 })}
                    className="h-14 bg-white/5 border-white/10 rounded-xl focus:ring-4 focus:ring-primary/40 font-display font-bold text-xl text-white text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-primary uppercase tracking-widest">Final Price</Label>
                  <div className="h-14 bg-primary rounded-xl flex items-center justify-center font-display font-bold text-xl md:text-2xl text-white shadow-lg">
                    ₹{calculatedFinalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case Size</Label>
                  <Input
                    value={formData.case_size}
                    onChange={(e) => setFormData({ ...formData, case_size: e.target.value })}
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pack Size</Label>
                  <Input
                    value={formData.pack_size}
                    onChange={(e) => setFormData({ ...formData, pack_size: e.target.value })}
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shelf Life</Label>
                  <Input
                    value={formData.shelf_life}
                    onChange={(e) => setFormData({ ...formData, shelf_life: e.target.value })}
                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 min-h-[120px] p-6 text-base font-medium"
                  placeholder="Describe your product..."
                />
              </div>

              {/* Featured Toggle */}
              <div className="p-6 md:p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                    className="scale-150 data-[state=checked]:bg-primary"
                  />
                  <div>
                    <Label className="text-sm font-bold text-slate-900">Featured Product</Label>
                    <p className="text-xs text-slate-500 mt-1">Show this product on the homepage</p>
                  </div>
                </div>
                <Badge className={formData.is_featured ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-500"}>
                  {formData.is_featured ? 'Featured' : 'Standard'}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="text-slate-600 font-bold hover:text-primary transition-colors px-6 py-3"
                >
                  Discard Changes
                </button>
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold h-16 px-12 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Package className="w-5 h-5" />
                  )}
                  <span>{selectedProduct ? 'Update Product' : 'Add to Catalog'}</span>
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10">
          <AlertDialogHeader>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="w-10 h-10 text-destructive" />
            </div>
            <AlertDialogTitle className="text-3xl font-display font-bold">Decommission Product?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg leading-relaxed pt-2">
              Are you sure you want to remove <span className="font-bold text-foreground">&quot;{selectedProduct?.name}&quot;</span> from your premium catalog? This operation is permanent and will affect store availability.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-4 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl h-14 px-8 font-bold border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90 rounded-2xl h-14 px-10 font-bold shadow-lg shadow-destructive/20">
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-3xl w-[95vw] sm:w-full max-h-[92vh] overflow-hidden rounded-[3rem] border-0 shadow-[0_40px_100px_-20px_rgba(200,16,43,0.2)] p-0 bg-white text-gray-900 flex flex-col"
        >
          {/* Custom Floating Close Button */}
          <div className="absolute top-8 right-8 z-[60]">
            <button
              onClick={() => setImportDialogOpen(false)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 hover:rotate-90 active:scale-95 transition-all duration-500 shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <DialogHeader className="relative overflow-hidden pt-16 pb-12 px-14 bg-gradient-to-br from-[#C8102B] via-[#A80D24] to-[#800A1B] text-white flex-shrink-0">
            {/* Premium Decorative Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-white rounded-full blur-[120px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <div className="relative z-10 flex items-center gap-8">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 3 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-[1.5rem] border border-white/40 flex items-center justify-center shadow-2xl"
              >
                <FileSpreadsheet className="w-10 h-10 text-white drop-shadow-lg" />
              </motion.div>
              <div className="space-y-1">
                <DialogTitle className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-tight">
                  Bulk Acquisition
                </DialogTitle>
                <p className="text-white/80 text-lg font-medium tracking-tight">Expand your catalog via CSV or Excel archives.</p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-10 py-12 space-y-10 scrollbar-none">
            <div
              className="group relative p-10 sm:p-14 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-500 cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Background Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 text-center space-y-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-primary/10 transition-all duration-700">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/5 rounded-[1.75rem] flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-primary transition-colors group-hover:text-white" />
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Manifest Ingestion</h4>
                  <p className="text-slate-500 text-base font-medium max-w-sm mx-auto leading-relaxed">
                    Drop your .xlsx, .xls, or .csv masterpiece file here or browse from your local vault.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImport}
                  className="hidden"
                />

                <Button
                  type="button"
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 px-12 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95"
                  disabled={importing}
                >
                  {importing ? (
                    <span className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Synchronizing...
                    </span>
                  ) : 'Select Source File'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Data Schema
                </h5>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Ensure your file includes vectors for <span className="text-primary font-bold">Name</span>, <span className="text-primary font-bold">Brand</span>, <span className="text-primary font-bold">Price</span>, and <span className="text-primary font-bold">Category</span>.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  System Sync
                </h5>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Visual artifacts will be automatically synchronized by the unique <span className="font-bold">Product SKU Code</span> for maximum precision.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center flex-shrink-0">
            <Button
              variant="ghost"
              onClick={() => setImportDialogOpen(false)}
              className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              Discard Operation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
