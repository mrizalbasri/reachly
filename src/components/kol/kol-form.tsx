import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input, Select } from '../ui/input'
import { createKol, type CreateKolInput } from '../../server/kol'
import { useToast } from '../ui/toast'

interface KolFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function KolForm({ onSuccess, onCancel }: KolFormProps) {
  const toast = useToast()
  const [formData, setFormData] = useState<CreateKolInput>({
    name: '',
    platform: 'Instagram',
    username: '',
    niche: 'Lifestyle',
    followers: 0,
    engagementRate: '0',
    ratePerPost: '0',
    contact: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'followers' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Nama KOL wajib diisi')
      toast.warning('Validasi Form', 'Nama KOL wajib diisi.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await createKol({ data: formData })
      toast.success('KOL Ditambahkan', `${formData.name} berhasil ditambahkan ke direktori.`)
      onSuccess()
    } catch (err: any) {
      const msg = err.message || 'Gagal menambahkan KOL'
      setError(msg)
      toast.error('Gagal Menyimpan', msg)
    } finally {
      setLoading(false)
    }
  }


  const platformOptions = [
    { label: 'Instagram', value: 'Instagram' },
    { label: 'TikTok', value: 'TikTok' },
    { label: 'YouTube', value: 'YouTube' },
    { label: 'Twitter / X', value: 'Twitter' },
  ]

  const nicheOptions = [
    { label: 'Beauty & Skincare', value: 'Beauty' },
    { label: 'Fashion & Style', value: 'Fashion' },
    { label: 'Food & Culinary', value: 'Culinary' },
    { label: 'Tech & Gadgets', value: 'Tech' },
    { label: 'Gaming', value: 'Gaming' },
    { label: 'Fitness & Health', value: 'Fitness' },
    { label: 'Travel & Lifestyle', value: 'Lifestyle' },
    { label: 'Parenting & Family', value: 'Parenting' },
    { label: 'Finance & Business', value: 'Finance' },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Nama Lengkap *"
          name="name"
          placeholder="cth: Jerome Polin"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Username Social Media"
          name="username"
          placeholder="cth: @jeromepolin"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select
          label="Platform Utama"
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          options={platformOptions}
        />
        <Select
          label="Niche / Kategori"
          name="niche"
          value={formData.niche}
          onChange={handleChange}
          options={nicheOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label="Jumlah Followers"
          name="followers"
          type="number"
          placeholder="100000"
          value={formData.followers || ''}
          onChange={handleChange}
        />
        <Input
          label="Engagement Rate (%)"
          name="engagementRate"
          placeholder="3.5"
          value={formData.engagementRate}
          onChange={handleChange}
        />
        <Input
          label="Rate Card per Post (IDR)"
          name="ratePerPost"
          placeholder="5000000"
          value={formData.ratePerPost}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Kontak / Email / WA Manager"
        name="contact"
        placeholder="cth: manager@email.com / +628123456789"
        value={formData.contact}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-[#1C1C1E]">Catatan Tambahan</label>
        <textarea
          name="notes"
          rows={2}
          placeholder="Catatan khusus mengenai gaya konten, syarat khusus, dll..."
          className="px-3 py-2 text-xs bg-white border border-[#EEEEF0] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] placeholder:text-[#8E8E93]"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEEEF0] mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Data KOL'}
        </Button>
      </div>
    </form>
  )
}
