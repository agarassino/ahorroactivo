import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { getContent, Content } from './lib/content'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState<Content>({})
  const [contentLoading, setContentLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    const data = await getContent()
    setContent(data)
    setContentLoading(false)
  }

  const c = (key: string, fallback: string) => content[key] || fallback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    const { error: supabaseError } = await supabase
      .from('waitlist')
      .insert([{ email }])

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      if (supabaseError.code === '23505') {
        setError('Este email ya está en la lista de espera')
      } else if (supabaseError.code === '42P01') {
        setError('Error: La tabla no existe. Creá la tabla en Supabase.')
      } else {
        setError(`Error: ${supabaseError.message}`)
      }
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-primary-dark">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white h-20 flex items-center justify-between px-8 lg:px-30 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          {content.logo_url ? (
            <img src={content.logo_url} alt="Ahorro Activo" className="h-10 object-contain" />
          ) : (
            <>
              <div className="w-10 h-10 bg-primary-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-primary-dark font-bold text-lg">AHORRO ACTIVO</span>
            </>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#beneficios" className="text-primary-dark font-medium hover:text-primary transition-colors">Beneficios</a>
          <a href="#como-funciona" className="text-primary-dark font-medium hover:text-primary transition-colors">Cómo funciona</a>
          <a href="#faq" className="text-primary-dark font-medium hover:text-primary transition-colors">Preguntas frecuentes</a>
        </nav>

        <a href="#waitlist" className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
          Unirme a la lista
        </a>
      </header>

      {/* Hero Section */}
      <section className="bg-background py-20 px-8 lg:px-30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex flex-col gap-8 max-w-xl">
            <span className="inline-block bg-secondary/20 text-primary-dark font-medium text-sm px-4 py-2 rounded-full w-fit">
              {c('hero_badge', 'Ahorro automatizado en el Merval')}
            </span>

            <h1 className="text-primary-dark text-4xl lg:text-5xl font-bold leading-tight">
              {c('hero_title', 'Tu futuro financiero, en piloto automático')}
            </h1>

            <p className="text-primary-dark/70 text-xl">
              {c('hero_subtitle', 'Invertí automáticamente en el Merval cada mes. Simple, seguro y sin complicaciones.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#waitlist" className="bg-primary text-white font-semibold px-8 py-4 rounded-lg hover:bg-primary-dark transition-colors text-center">
                {c('hero_cta_primary', 'Sumarme a la lista de espera')}
              </a>
              <a href="#como-funciona" className="bg-white text-primary-dark font-semibold px-8 py-4 rounded-lg border-2 border-primary-dark/20 hover:border-primary transition-colors text-center">
                {c('hero_cta_secondary', 'Ver cómo funciona')}
              </a>
            </div>

            <p className="text-primary-dark/60 text-sm font-medium">
              {c('hero_trust', 'Regulado por CNV • +5,000 usuarios en lista de espera • 100% seguro')}
            </p>
          </div>

          <div className="bg-white p-5 rounded-[40px] shadow-2xl">
            <div className="bg-primary-dark rounded-[32px] w-80 h-[500px] flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <span className="text-white font-bold text-xl mb-2">AHORRO ACTIVO</span>
              <span className="text-white/60 text-sm">Próximamente</span>
              <div className="mt-8 w-full space-y-3">
                <div className="bg-white/10 rounded-lg h-12 w-full"></div>
                <div className="bg-white/10 rounded-lg h-12 w-full"></div>
                <div className="bg-primary rounded-lg h-12 w-full flex items-center justify-center">
                  <span className="text-white font-semibold">Comenzar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="bg-white py-24 px-8 lg:px-30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-primary-dark text-4xl font-bold mb-4">
              {c('benefits_title', '¿Por qué elegir Ahorro Activo?')}
            </h2>
            <p className="text-primary-dark/70 text-lg">
              {c('benefits_subtitle', 'La forma más simple de construir tu futuro financiero')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-primary-dark text-2xl font-bold mb-3">{c('benefit_1_title', 'Automático')}</h3>
              <p className="text-primary-dark/70">
                {c('benefit_1_desc', 'Configurá una vez y olvidate. Tu inversión se ejecuta automáticamente cada mes.')}
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-dark rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-primary-dark text-2xl font-bold mb-3">{c('benefit_2_title', 'Sin complicaciones')}</h3>
              <p className="text-primary-dark/70">
                {c('benefit_2_desc', 'Te guiamos paso a paso. No necesitás ser experto para empezar a invertir.')}
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-primary-dark text-2xl font-bold mb-3">{c('benefit_3_title', 'Seguro y regulado')}</h3>
              <p className="text-primary-dark/70">
                {c('benefit_3_desc', 'Operamos bajo la regulación de la CNV. Tu dinero está protegido.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="bg-primary-dark py-24 px-8 lg:px-30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl font-bold mb-4">
              {c('how_title', '¿Cómo funciona?')}
            </h2>
            <p className="text-white/80 text-lg">
              {c('how_subtitle', 'Comenzá a invertir en solo 3 pasos')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-3">{c('step_1_title', 'Creá tu cuenta')}</h3>
              <p className="text-white/80">
                {c('step_1_desc', 'Registrate gratis en minutos. Solo necesitás tu DNI y un email.')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-3">{c('step_2_title', 'Configurá tu plan')}</h3>
              <p className="text-white/80">
                {c('step_2_desc', 'Elegí cuánto querés invertir y en qué activos del Merval.')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-3">{c('step_3_title', 'Mirá cómo crece')}</h3>
              <p className="text-white/80">
                {c('step_3_desc', 'Seguí tu progreso en tiempo real desde la app.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section id="waitlist" className="bg-primary py-24 px-8 lg:px-30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white text-4xl font-bold mb-4">
            {c('waitlist_title', 'Sumate a la lista de espera')}
          </h2>
          <p className="text-white/90 text-lg mb-8">
            {c('waitlist_subtitle', 'Sé de los primeros en acceder a Ahorro Activo. Dejá tu email y te avisamos cuando estemos listos.')}
          </p>

          {!submitted ? (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  required
                  className="flex-1 px-6 py-4 rounded-lg text-primary-dark font-medium border-2 border-white bg-transparent placeholder:text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg hover:bg-footer transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Unirme'}
                </button>
              </form>
              {error && (
                <p className="text-white bg-red-500/30 rounded-lg px-4 py-2 mt-4">{error}</p>
              )}
            </div>
          ) : (
            <div className="bg-white/20 rounded-2xl p-8">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">¡Gracias por sumarte!</h3>
              <p className="text-white/90">
                Te avisaremos a <strong>{email}</strong> cuando Ahorro Activo esté disponible.
              </p>
            </div>
          )}

          <p className="text-white/80 text-sm mt-6">
            {c('waitlist_note', 'Sin costos ocultos • Cancelá cuando quieras • No compartimos tu email')}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-24 px-8 lg:px-30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-primary-dark text-4xl font-bold text-center mb-12">
            {c('faq_title', 'Preguntas frecuentes')}
          </h2>

          <div className="space-y-6">
            <details className="bg-background rounded-2xl p-6 group">
              <summary className="text-primary-dark font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                ¿Qué es Ahorro Activo?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-primary-dark/70 mt-4">
                Ahorro Activo es una plataforma que te permite invertir de forma automática y recurrente en activos del Merval. Configurás tu plan una vez y nosotros nos encargamos del resto.
              </p>
            </details>

            <details className="bg-background rounded-2xl p-6 group">
              <summary className="text-primary-dark font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                ¿Cuánto dinero necesito para empezar?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-primary-dark/70 mt-4">
                Podés empezar con tan solo $10.000 ARS. No hay monto mínimo de inversión mensual una vez que tenés tu cuenta activa.
              </p>
            </details>

            <details className="bg-background rounded-2xl p-6 group">
              <summary className="text-primary-dark font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                ¿Es seguro invertir con Ahorro Activo?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-primary-dark/70 mt-4">
                Sí, operamos bajo la regulación de la Comisión Nacional de Valores (CNV). Tus inversiones están en tu nombre y podés retirar tu dinero cuando quieras.
              </p>
            </details>

            <details className="bg-background rounded-2xl p-6 group">
              <summary className="text-primary-dark font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                ¿Cuándo estará disponible la app?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-primary-dark/70 mt-4">
                Estamos trabajando para lanzar muy pronto. Sumate a la lista de espera y serás de los primeros en acceder cuando estemos listos.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-footer py-16 px-8 lg:px-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
              <span className="text-white font-bold text-xl block mb-4">AHORRO ACTIVO</span>
              <p className="text-white/70 text-sm leading-relaxed">
                {c('footer_tagline', 'La forma más simple de invertir en el Merval. Automatizá tu ahorro y construí tu futuro financiero.')}
              </p>
            </div>

            <div className="flex gap-16">
              <div>
                <h4 className="text-white font-semibold mb-4">Producto</h4>
                <ul className="space-y-2">
                  <li><a href="#beneficios" className="text-white/70 hover:text-white transition-colors text-sm">Beneficios</a></li>
                  <li><a href="#como-funciona" className="text-white/70 hover:text-white transition-colors text-sm">Cómo funciona</a></li>
                  <li><a href="#faq" className="text-white/70 hover:text-white transition-colors text-sm">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Términos</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Privacidad</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Contacto</h4>
                <ul className="space-y-2">
                  <li><a href="mailto:hola@ahorroactivo.com" className="text-white/70 hover:text-white transition-colors text-sm">hola@ahorroactivo.com</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <p className="text-white/60 text-sm">
              © 2026 Ahorro Activo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
