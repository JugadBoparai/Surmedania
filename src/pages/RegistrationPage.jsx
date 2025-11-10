import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const SPOND_LINK = 'https://spond.example/group' // Replace with real Spond group link
const VIPPS_PAYLINK = 'https://vipps.example/pay' // Replace with Vipps payment link or integration
const SHEETS_WEBHOOK = import.meta.env.VITE_WEBHOOK_URL || '/api/webhook' // Use serverless function

export default function RegistrationPage(){
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const [memberType, setMemberType] = useState('active')
  const [form, setForm] = useState({ name:'', email:'', phone:'', dob:'', style:'', experience:'', comments:'', relation:'', classSelection:'' })
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  // Check if URL has ?type=supported or ?class=Thursday/Sunday parameters
  useEffect(() => {
    const type = searchParams.get('type')
    const classDay = searchParams.get('class')
    
    if (type === 'supported') {
      setMemberType('supported')
    }
    
    if (classDay === 'Thursday' || classDay === 'Sunday') {
      setForm(prev => ({ ...prev, classSelection: classDay }))
    }
  }, [searchParams])

  function update(e){
    setForm(f => ({...f, [e.target.name]: e.target.value}))
  }

  async function submit(e){
    e.preventDefault()
    // Basic client-side validation
    if(!form.name || !form.email) return setStatus(t('registration.fillRequired'))
    setStatus(null)
    try{
      const res = await fetch(SHEETS_WEBHOOK, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ memberType, ...form }) })
      const data = await res.json().catch(()=>null)
      if(!res.ok) throw new Error(data?.error || 'Webhook failed')

      // Show success modal and offer redirect options
      setStatus('success')
      // Redirect to confirmation page (keeps user on site to choose next action)
      navigate('/registration/confirm', { state: { memberType, name: form.name, phone: form.phone } })
    }catch(err){
      console.error(err)
      setStatus(t('registration.saveError'))
    }
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="font-heading text-2xl sm:text-3xl mb-6 sm:mb-8">{t('registration.title')}</h2>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="lux-card p-5 sm:p-6 md:p-7">
          <div className="flex gap-2 sm:gap-3 mb-6">
            <button 
              onClick={()=>setMemberType('active')} 
              className={`flex-1 px-4 sm:px-5 py-3 rounded-lg font-medium tracking-wide transition-all ${memberType==='active' ? 'bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white shadow-md' : 'border-2 border-gold/30 text-black/70 hover:border-gold/60 hover:bg-gold/5'}`}
            >
              {t('registration.active')}
            </button>
            <button 
              onClick={()=>setMemberType('supported')} 
              className={`flex-1 px-4 sm:px-5 py-3 rounded-lg font-medium tracking-wide transition-all ${memberType==='supported' ? 'bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white shadow-md' : 'border-2 border-gold/30 text-black/70 hover:border-gold/60 hover:bg-gold/5'}`}
            >
              {t('registration.supported')}
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.name')}</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={update} 
                className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition" 
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.email')}</label>
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={update} 
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition" 
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.phone')}</label>
                <input 
                  name="phone" 
                  type="tel"
                  value={form.phone} 
                  onChange={update} 
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition" 
                />
              </div>
            </div>

            {memberType==='active' && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.dob')}</label>
                    <input 
                      name="dob" 
                      type="date"
                      value={form.dob} 
                      onChange={update}
                      placeholder="DD/MM/YYYY"
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition text-base font-medium [color-scheme:light]" 
                      style={{ minWidth: '150px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.style')}</label>
                    <select 
                      name="style" 
                      value={form.style} 
                      onChange={update} 
                      className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition bg-white"
                    >
                      <option value="">{t('registration.styleSelect')}</option>
                      <option value="Bhangra">{t('registration.styleBhangra')}</option>
                      <option value="Giddha">{t('registration.styleGiddha')}</option>
                      <option value="Bollywood">{t('registration.styleBollywood')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.experience')}</label>
                    <select 
                      name="experience" 
                      value={form.experience} 
                      onChange={update} 
                      className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition bg-white"
                    >
                      <option value="">{t('registration.experienceSelect')}</option>
                      <option value="Beginner">{t('registration.experienceBeginner')}</option>
                      <option value="Intermediate">{t('registration.experienceIntermediate')}</option>
                      <option value="Advanced">{t('registration.experienceAdvanced')}</option>
                      <option value="Professional">{t('registration.experienceProfessional')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.comments')}</label>
                  <textarea 
                    name="comments" 
                    value={form.comments} 
                    onChange={update} 
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition resize-none" 
                  />
                </div>
              </>
            )}

            {memberType==='supported' && (
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.relation')}</label>
                <input 
                  name="relation" 
                  value={form.relation} 
                  onChange={update} 
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition" 
                />
              </div>
            )}

            {memberType==='active' && (
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">{t('registration.classSelection') || 'Class selection'}</label>
                {/**
                 * We separate the canonical value (Thursday/Sunday) from the localized display text.
                 * This lets URL query ?class=Thursday preselect the right option even though the
                 * visible text might be a full schedule line or translated label.
                 */}
                <select
                  name="classSelection"
                  value={form.classSelection}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-black/10 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition bg-white"
                >
                  <option value="">{t('registration.classSelect') || 'Select class'}</option>
                  <option value="Thursday">{t('classes.thursday') || 'Thursday'}</option>
                  <option value="Sunday">{t('classes.sunday') || 'Sunday'}</option>
                </select>
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full sm:w-auto min-w-[200px] px-6 py-3 bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white rounded-lg font-medium text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
              >
                {t('registration.submit')}
              </button>
            </div>
          </form>

          {status && status !== 'success' && <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm sm:text-base text-red-700">{status}</div>}
          {status === 'success' && (
            <div className="mt-6 p-5 sm:p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="font-semibold text-lg mb-2">{t('confirm.title')}</div>
              <div className="text-sm sm:text-base mt-2 text-black/70 leading-relaxed">{t('confirm.message')}</div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a 
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white text-center rounded-lg font-medium shadow-md hover:shadow-lg transition-all" 
                  href={VIPPS_PAYLINK} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  {t('confirm.payVipps')}
                </a>
                <a 
                  className="flex-1 sm:flex-none px-6 py-3 border-2 border-gold text-gold text-center rounded-lg font-medium hover:bg-gold/5 transition-all" 
                  href={SPOND_LINK} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  {t('confirm.openSpond')}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="lux-card p-5 sm:p-6 md:p-7">
          <h3 className="font-heading text-lg sm:text-xl mb-4">{memberType==='active' ? (t('registration.active') + ' ' + (t('registration.title'))) : (t('registration.supported') + ' ' + (t('registration.title')))}</h3>
          
          {memberType === 'active' ? (
            <div>
              <h4 className="font-semibold text-gold mb-2">{t('registration.active')}</h4>
              <ul className="text-sm text-black/70 space-y-2 list-disc list-inside">
                <li>{t('registration.activeBenefitsParticipate')}</li>
                <li>{t('registration.activeBenefitsEvents')}</li>
                <li>{t('registration.activeBenefitsWorkshops')}</li>
                <li>{t('registration.activeBenefitsSpond')}</li>
                <li>{t('registration.activeBenefitsUpdates')}</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-black/10">
                <div className="text-sm"><strong>{t('registration.locationLabel')}</strong> Ravinen, Rælingen</div>
                <div className="mt-2 text-sm"><strong>{t('registration.classesLabel')}</strong> {t('registration.classDays')}</div>
                <div className="mt-3 text-sm text-black/70">{t('registration.redirectSpond')}</div>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-gold mb-2">{t('registration.supported')}</h4>
              <ul className="text-sm text-black/70 space-y-2 list-disc list-inside">
                <li>{t('registration.supportedBenefitsMission')}</li>
                <li>{t('registration.supportedBenefitsUpdates')}</li>
                <li>{t('registration.supportedBenefitsNewsEvents')}</li>
                <li>{t('registration.supportedBenefitsEarly')}</li>
                <li>{t('registration.supportedBenefitsCommunity')}</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-black/10">
                <div className="text-sm"><strong>{t('registration.locationLabel')}</strong> Ravinen, Rælingen</div>
                <div className="mt-3 text-sm text-black/70">{t('registration.supportHelp')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
