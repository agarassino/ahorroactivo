import { useState, useEffect } from 'react'
import { getContent, updateContent, uploadLogo, Content } from './lib/content'

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
    const url = await uploadLogo(logoFile)
    if (url) {
      await updateContent('logo_url', url)
      setContent({ ...content, logo_url: url })
      setLogoFile(null)
    }
    setUploadingLogo(false)
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
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
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
