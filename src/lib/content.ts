import { supabase } from './supabase'

export type Content = Record<string, string>

export async function getContent(): Promise<Content> {
  const { data, error } = await supabase
    .from('content')
    .select('key, value')

  if (error) {
    console.error('Error fetching content:', error)
    return {}
  }

  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Content)
}

export async function updateContent(key: string, value: string): Promise<boolean> {
  const { error } = await supabase
    .from('content')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)

  if (error) {
    console.error('Error updating content:', error)
    return false
  }
  return true
}

export async function uploadLogo(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `logo.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file, { upsert: true })

  if (uploadError) {
    console.error('Error uploading logo:', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  return data.publicUrl
}
