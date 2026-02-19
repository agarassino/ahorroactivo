import { useState, useEffect } from 'react'
import { getContent, updateContent, uploadLogo, uploadImage } from './lib/content'
import type { Content } from './lib/content'

const ADMIN_PASSWORD = 'ahorroactivo2024'

const CONTENT_FIELDS = [
  { key: 'hero_badge', label: 'Hero - Badge', multiline: false },
  { key: 'hero_title', label: 'Hero - Título', multiline: false },
  { key: 'hero_subtitle', label: 'Hero - Subtítulo', multiline: true },
  { key: 'hero_cta_primary', label: 'Hero - Botón primario', multiline: false },
  { key: 'hero_cta_secondary', label: 'Hero - Botón secundario', multiline: false },
  { key: 'hero_trust', label: 'Hero - Texto confianza', multiline: false },
  { key: 'benefits_title', label: 'Beneficios - Título', multiline: false },
  { key: 'benefits_subtitle', label: 'Beneficios - Subtítulo', multiline: false },
  { key: 'benefit_1_title', label: 'Beneficio 1 - Título', multiline: false },
  { key: 'benefit_1_desc', label: 'Beneficio 1 - Descripción', multiline: true },
  { key: 'benefit_2_title', label: 'Beneficio 2 - Título', multiline: false },
  { key: 'benefit_2_desc', label: 'Beneficio 2 - Descripción', multiline: true },
  { key: 'benefit_3_title', label: 'Beneficio 3 - Título', multiline: false },
  { key: 'benefit_3_desc', label: 'Beneficio 3 - Descripción', multiline: true },
  { key: 'how_title', label: 'Cómo funciona - Título', multiline: false },
  { key: 'how_subtitle', label: 'Cómo funciona - Subtítulo', multiline: false },
  { key: 'step_1_title', label: 'Paso 1 - Título', multiline: false },
  { key: 'step_1_desc', label: 'Paso 1 - Descripción', multiline: true },
  { key: 'step_2_title', label: 'Paso 2 - Título', multiline: false },
  { key: 'step_2_desc', label: 'Paso 2 - Descripción', multiline: true },
  { key: 'step_3_title', label: 'Paso 3 - Título', multiline: false },
  { key: 'step_3_desc', label: 'Paso 3 - Descripción', multiline: true },
  { key: 'waitlist_title', label: 'Waitlist - Título', multiline: false },
  { key: 'waitlist_subtitle', label: 'Waitlist - Subtítulo', multiline: true },
  { key: 'waitlist_note', label: 'Waitlist - Nota', multiline: false },
  { key: 'faq_title', label: 'FAQ - Título', multiline: false },
  { key: 'faq_1_question', label: 'FAQ 1 - Pregunta', multiline: false },
  { key: 'faq_1_answer', label: 'FAQ 1 - Respuesta', multiline: true },
  { key: 'faq_2_question', label: 'FAQ 2 - Pregunta', multiline: false },
  { key: 'faq_2_answer', label: 'FAQ 2 - Respuesta', multiline: true },
  { key: 'faq_3_question', label: 'FAQ 3 - Pregunta', multiline: false },
  { key: 'faq_3_answer', label: 'FAQ 3 - Respuesta', multiline: true },
  { key: 'faq_4_question', label: 'FAQ 4 - Pregunta', multiline: false },
  { key: 'faq_4_answer', label: 'FAQ 4 - Respuesta', multiline: true },
  { key: 'footer_tagline', label: 'Footer - Tagline', multiline: true },
]

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [content, setContent] = useState<Content>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoMessage, setLogoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [iconFiles, setIconFiles] = useState<{ [key: string]: File | null }>({})
  const [uploadingIcon, setUploadingIcon] = useState<string | null>(null)
  const [iconMessage, setIconMessage] = useState<{ [key: string]: { type: 'success' | 'error'; text: string } }>({})

  useEffect(() => {
    if (authenticated) {
      loadContent()
    }
  }, [authenticated])

  const loadContent = async () => {
    setLoading(true)
    const data = await getContent()
    setContent(data)
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setPasswordError('')
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const handleSave = async (key: string, value: string) => {
    setSaving(key)
    const success = await updateContent(key, value)
    setSaving(null)
    if (success) {
      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    }
  }

  const handleLogoUpload = async () => {
    if (!logoFile) return
    setUploadingLogo(true)
    setLogoMessage(null)

    try {
      const result = await uploadLogo(logoFile)

      if (result.error) {
        setLogoMessage({ type: 'error', text: result.error })
        setUploadingLogo(false)
        return
      }

      if (result.url) {
        const success = await updateContent('logo_url', result.url)
        if (success) {
          setContent({ ...content, logo_url: result.url })
          setLogoFile(null)
          setLogoMessage({ type: 'success', text: '¡Logo subido correctamente!' })
          // Clear file input
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
          if (fileInput) fileInput.value = ''
        } else {
          setLogoMessage({ type: 'error', text: 'Error al guardar la URL del logo en la base de datos' })
        }
      }
    } catch (err) {
      setLogoMessage({ type: 'error', text: 'Error inesperado al subir el logo' })
      console.error('Logo upload error:', err)
    }

    setUploadingLogo(false)
  }

  const handleIconUpload = async (benefitNumber: number) => {
    const key = `benefit_${benefitNumber}_icon`
    const file = iconFiles[key]
    if (!file) return

    setUploadingIcon(key)
    setIconMessage((prev) => ({ ...prev, [key]: undefined as unknown as { type: 'success' | 'error'; text: string } }))

    try {
      const result = await uploadImage(file, `benefit-icon-${benefitNumber}`)

      if (result.error) {
        setIconMessage((prev) => ({ ...prev, [key]: { type: 'error', text: result.error! } }))
        setUploadingIcon(null)
        return
      }

      if (result.url) {
        const success = await updateContent(key, result.url)
        if (success) {
          setContent({ ...content, [key]: result.url })
          setIconFiles((prev) => ({ ...prev, [key]: null }))
          setIconMessage((prev) => ({ ...prev, [key]: { type: 'success', text: '¡Icono subido!' } }))
        } else {
          setIconMessage((prev) => ({ ...prev, [key]: { type: 'error', text: 'Error al guardar' } }))
        }
      }
    } catch (err) {
      setIconMessage((prev) => ({ ...prev, [key]: { type: 'error', text: 'Error inesperado' } }))
      console.error('Icon upload error:', err)
    }

    setUploadingIcon(null)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-primary-dark mb-6">Admin - Ahorro Activo</h1>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              placeholder="Ingresá la contraseña"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Ingresar
            </button>
          </form>
          <a href="/" className="block text-center text-primary mt-4 hover:underline">
            ← Volver al sitio
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary-dark">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary-dark">Admin - Ahorro Activo</h1>
          <a href="/" className="text-primary hover:underline">← Volver al sitio</a>
        </div>

        {/* Logo Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-primary-dark mb-4">Logo</h2>

          {content.logo_url && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Logo actual:</p>
              <img src={content.logo_url} alt="Logo" className="h-12 object-contain" />
            </div>
          )}

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Subir nuevo logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setLogoFile(e.target.files?.[0] || null)
                  setLogoMessage(null)
                }}
                className="w-full text-sm"
              />
            </div>
            <button
              onClick={handleLogoUpload}
              disabled={!logoFile || uploadingLogo}
              className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {uploadingLogo ? 'Subiendo...' : 'Subir'}
            </button>
          </div>

          {logoMessage && (
            <div className={`mt-4 p-3 rounded-lg ${logoMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {logoMessage.text}
            </div>
          )}
        </div>

        {/* Benefit Icons */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-primary-dark mb-4">Iconos de Beneficios</h2>
          <p className="text-sm text-gray-500 mb-4">Subí imágenes PNG o SVG para los iconos de la sección de beneficios.</p>

          <div className="space-y-6">
            {[1, 2, 3].map((num) => {
              const key = `benefit_${num}_icon`
              return (
                <div key={key} className="border-b border-gray-100 pb-4 last:border-0">
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Beneficio {num} - Icono
                  </label>

                  {content[key] && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Icono actual:</p>
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                        <img src={content[key]} alt={`Icono ${num}`} className="w-8 h-8 object-contain" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setIconFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] || null }))
                          setIconMessage((prev) => ({ ...prev, [key]: undefined as unknown as { type: 'success' | 'error'; text: string } }))
                        }}
                        className="w-full text-sm"
                      />
                    </div>
                    <button
                      onClick={() => handleIconUpload(num)}
                      disabled={!iconFiles[key] || uploadingIcon === key}
                      className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
                    >
                      {uploadingIcon === key ? 'Subiendo...' : 'Subir'}
                    </button>
                  </div>

                  {iconMessage[key] && (
                    <div className={`mt-2 p-2 rounded-lg text-sm ${iconMessage[key].type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {iconMessage[key].text}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Fields */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary-dark mb-4">Contenido</h2>

          <div className="space-y-6">
            {CONTENT_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  {field.label}
                </label>
                <div className="flex gap-2">
                  {field.multiline ? (
                    <textarea
                      value={content[field.key] || ''}
                      onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                      rows={3}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={content[field.key] || ''}
                      onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                  <button
                    onClick={() => handleSave(field.key, content[field.key] || '')}
                    disabled={saving === field.key}
                    className="bg-primary-dark text-white font-medium px-4 py-2 rounded-lg hover:bg-footer transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {saving === field.key ? 'Guardando...' : saved === field.key ? '✓ Guardado' : 'Guardar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Los cambios se reflejan inmediatamente en el sitio.
        </p>
      </div>
    </div>
  )
}
