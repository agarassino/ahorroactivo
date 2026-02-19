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
    .upsert({ key, value, updated_at: new Date().toISOString() })

  if (error) {
    console.error('Error updating content:', error)
    return false
  }
  return true
}

export type UploadResult = {
  url: string | null
  error: string | null
}

export async function uploadImage(file: File, prefix: string = 'image'): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${prefix}-${Date.now()}.${fileExt}`

  // First, try to upload to the bucket
  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file, { upsert: true })

  if (uploadError) {
    console.error('Error uploading image:', uploadError)

    // Provide user-friendly error messages
    if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
      return {
        url: null,
        error: 'El bucket de storage "images" no existe. Crealo en Supabase Dashboard → Storage.'
      }
    }
    if (uploadError.message.includes('policy') || uploadError.message.includes('permission') || uploadError.message.includes('RLS')) {
      return {
        url: null,
        error: 'No hay permisos para subir archivos. Configurá las políticas RLS del bucket en Supabase.'
      }
    }
    if (uploadError.message.includes('size')) {
      return {
        url: null,
        error: 'El archivo es demasiado grande. Intentá con una imagen más pequeña.'
      }
    }

    return {
      url: null,
      error: `Error al subir: ${uploadError.message}`
    }
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  return {
    url: data.publicUrl,
    error: null
  }
}

export async function uploadLogo(file: File): Promise<UploadResult> {
  return uploadImage(file, 'logo')
}
