import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

// Bhangra Section Component
function BhangraSection({ lang, accent, bhangraSteps, cardVariants }) {
  const [activeMove, setActiveMove] = useState(null)
  const [galleryFilter, setGalleryFilter] = useState('all')
  
  const signatureMoves = [
    { 
      key: 'phumm', 
      name: 'Phumm Phumm', 
      icon: '💪',
      desc: lang==='no'?'Skulder studsing som viser kraft og energi':'Shoulder bounce that shows power and energy',
      detail: lang==='no'
        ? 'Phumm Phumm er en av de mest gjenkjennelige Bhangra-bevegelsene. Det handler om å studsende skuldrene i takt med dhol-rytmen, og skaper en kraftfull, pulserende energi som definerer Bhangra.'
        : 'Phumm Phumm is one of the most recognizable Bhangra moves. It\'s about bouncing the shoulders in sync with the dhol rhythm, creating a powerful, pulsating energy that defines Bhangra.'
    },
    { 
      key: 'chaal', 
      name: 'Chaal', 
      icon: '🚶',
      desc: lang==='no'?'Grunnleggende gå-trinn med holdning':'Basic walking step with attitude',
      detail: lang==='no'
        ? 'Chaal er grunnsteget i Bhangra – en selvsikker gange som setter tonen for dansen. Det handler om holdning, timing og å bevege seg med rytmen.'
        : 'Chaal is the foundation step of Bhangra – a confident walk that sets the tone for the dance. It\'s about attitude, timing, and moving with the rhythm.'
    },
    { 
      key: 'jhummar-step', 
      name: 'Jhummar Step', 
      icon: '🔄',
      desc: lang==='no'?'Sirkulær bevegelse med håndledd':'Circular movement with wrists',
      detail: lang==='no'
        ? 'Jhummar-steget innebærer flytende sirkulære bevegelser av armer og håndledd, inspirert av den gamle Jhummar-dansen som feirer samhold og glede.'
        : 'The Jhummar step involves fluid circular movements of arms and wrists, inspired by the ancient Jhummar dance celebrating unity and joy.'
    },
    { 
      key: 'luddi-step', 
      name: 'Luddi Step', 
      icon: '🌀',
      desc: lang==='no'?'Håndleddssirkler med rotasjoner':'Wrist circles with rotations',
      detail: lang==='no'
        ? 'Luddi er en feiring bevegelse med sirkulære håndleddsbevegelser og skuldrotasjoner, ofte utført i en sirkel for å symbolisere enhet og fest.'
        : 'Luddi is a celebratory move with circular wrist movements and shoulder rotations, often performed in a circle to symbolize unity and celebration.'
    },
    { 
      key: 'tipp', 
      name: 'Tipp', 
      icon: '⚡',
      desc: lang==='no'?'Kjapp fotbevegelse med presisjon':'Quick foot move with precision',
      detail: lang==='no'
        ? 'Tipp er en rask, presis fotbevegelse som legger til skarpe aksenter i koreografien. Det krever balanse, timing og kontroll.'
        : 'Tipp is a quick, precise foot movement that adds sharp accents to the choreography. It requires balance, timing, and control.'
    },
    { 
      key: 'dhamaal', 
      name: 'Dhamaal Jump', 
      icon: '🦘',
      desc: lang==='no'?'Kraftfullt hopp fylt med energi':'Powerful jump filled with energy',
      detail: lang==='no'
        ? 'Dhamaal-hoppet er eksplosivt og kraftfullt, og representerer den rå energien til Bhangra. Det utføres ofte på høydepunkter i musikken.'
        : 'The Dhamaal jump is explosive and powerful, representing the raw energy of Bhangra. It\'s often performed at musical climaxes.'
    },
    { 
      key: 'sialkoti', 
      name: 'Sialkoti Hop', 
      icon: '🎯',
      desc: lang==='no'?'Stil fra Sialkot-regionen':'Style from Sialkot region',
      detail: lang==='no'
        ? 'Sialkoti-hoppet er en regional stil fra Sialkot med unike fotmønstre og hoppsekvenser som skiller seg ut i Bhangra-koreografi.'
        : 'The Sialkoti hop is a regional style from Sialkot with unique foot patterns and hopping sequences that stand out in Bhangra choreography.'
    },
    { 
      key: 'jatti', 
      name: 'Jatti Pose', 
      icon: '💃',
      desc: lang==='no'?'Ikonisk prestasjon pose':'Iconic performance pose',
      detail: lang==='no'
        ? 'Jatti-posen er en frossen, kraftfull posisjon som viser selvtillit og holdning – perfekt for høydepunkter og foto-øyeblikk.'
        : 'The Jatti pose is a frozen, powerful position that shows confidence and attitude – perfect for climactic moments and photo opportunities.'
    }
  ]

  const instruments = [
    { name: 'Dhol', desc: lang==='no'?'Hovedtrommen – hjertet av Bhangra':'Main drum – the heart of Bhangra', icon: '🥁' },
    { name: 'Tumbi', desc: lang==='no'?'Ett-strengs instrument med livlig lyd':'One-string instrument with lively sound', icon: '🎸' },
    { name: 'Algoza', desc: lang==='no'?'Dobbel fløyte for melodisk base':'Double flute for melodic base', icon: '🎶' }
  ]

  const outfits = {
    men: [
      { item: 'Kurta', desc: lang==='no'?'Lang tradisjonell skjorte':'Long traditional shirt' },
      { item: 'Lungi', desc: lang==='no'?'Vikklet skjørt':'Wrapped skirt' },
      { item: 'Turban (Pag)', desc: lang==='no'?'Hodeplagg':'Headwear' },
      { item: 'Phuman', desc: lang==='no'?'Dekorativ dusk':'Decorative tassel' },
      { item: 'Chadar', desc: lang==='no'?'Skulder sjal':'Shoulder shawl' }
    ],
    women: [
      { item: 'Salwar Kameez', desc: lang==='no'?'Tradisjonell drakt':'Traditional outfit' },
      { item: 'Paranda', desc: lang==='no'?'Flette akssessorie':'Braid accessory' },
      { item: 'Phulkari Dupatta', desc: lang==='no'?'Brodert sjal':'Embroidered shawl' }
    ]
  }

  const funFacts = [
    {
      icon: '🌾',
      text: lang==='no'?'Bhangra ble tradisjonelt utført etter høstesesongen for å feire Vaisakhi.':'Bhangra was traditionally performed after harvest season to celebrate Vaisakhi.'
    },
    {
      icon: '🥁',
      text: lang==='no'?'Dhol-trommen er hjertet av Bhangra og kan høres opptil 10 kilometer unna.':'The dhol drum is the heart of Bhangra and can be heard up to 10 kilometers away.'
    },
    {
      icon: '💪',
      text: lang==='no'?'Hvert trinn i Bhangra feirer glede, kraft og rytme fra punjabisk kultur.':'Each step in Bhangra celebrates joy, power, and rhythm from Punjabi culture.'
    },
    {
      icon: '🌍',
      text: lang==='no'?'Bhangra har spredt seg globalt og påvirket hip-hop og popmusikk verden over.':'Bhangra has spread globally and influenced hip-hop and pop music worldwide.'
    },
    {
      icon: '🎭',
      text: lang==='no'?'Ordet "Bhangra" kommer fra "Bhang," som refererer til en festivaldans.':'The word "Bhangra" comes from "Bhang," referring to a festival dance.'
    },
    {
      icon: '✨',
      text: lang==='no'?'Moderne Bhangra blander tradisjonelle bevegelser med urban dans og Bollywood.':'Modern Bhangra blends traditional moves with urban dance and Bollywood.'
    }
  ]

  // Gallery items for filtering
  const galleryItems = [
    { type: 'traditional', emoji: '🌾', label: lang === 'no' ? 'Tradisjonell Bhangra' : 'Traditional Bhangra' },
    { type: 'modern', emoji: '🎤', label: lang === 'no' ? 'Moderne Forestilling' : 'Modern Performance' },
    { type: 'fusion', emoji: '🌟', label: lang === 'no' ? 'Fusjon Workshop' : 'Fusion Workshop' },
    { type: 'traditional', emoji: '🥁', label: lang === 'no' ? 'Dhol Performance' : 'Dhol Performance' },
    { type: 'modern', emoji: '💃', label: lang === 'no' ? 'Scenekoreografi' : 'Stage Choreography' },
    { type: 'fusion', emoji: '🎵', label: lang === 'no' ? 'Hip-Hop Fusjon' : 'Hip-Hop Fusion' }
  ]

  const filteredGallery = galleryFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === galleryFilter)

  return (
    <div id="bhangra" className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
          boxShadow: `0 10px 40px -10px ${accent.from}40`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-20 text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4"
          >
            {lang === 'no' ? 'Bhangra – Høstens Energi' : 'Bhangra – The Energy of Harvest'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 mb-6"
          >
            {lang === 'no' ? 'Hvor rytme, kraft og glede møtes.' : 'Where rhythm, power, and joy unite.'}
          </motion.p>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
            {lang === 'no'
              ? 'Bhangra er en livlig folkedans fra Punjab, født fra høstfeiringer og kraftfull dhol-rytme. Det er en eksplosjon av energi, glede og kulturell stolthet som har spredt seg over hele verden og blitt et symbol på feiring.'
              : 'Bhangra is a vibrant folk dance from Punjab, born from harvest celebrations and powerful dhol rhythms. It\'s an explosion of energy, joy, and cultural pride that has spread worldwide and become a symbol of celebration.'}
          </p>
        </div>
      </motion.div>

      {/* 2. Origins & Evolution */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="lux-card p-6 sm:p-8"
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-4 text-center">
          {lang === 'no' ? 'Opprinnelse & Utvikling' : 'Origins & Evolution'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-4">
              {lang === 'no'
                ? 'Bhangra oppsto som en folkelig høstdans i Punjab-regionen, tradisjonelt utført under Vaisakhi-festivalen. Bøndene feiret den vellykkede høsten med kraftfulle bevegelser og dhol-trommer.'
                : 'Bhangra originated as a folk harvest dance in the Punjab region, traditionally performed during the Vaisakhi festival. Farmers celebrated the successful harvest with powerful movements and dhol drums.'}
            </p>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed">
              {lang === 'no'
                ? 'I dag har Bhangra utviklet seg til en global fenomen – fra tradisjonelle gressrøtter til sceneproduksjoner, fusjon med hip-hop og Bollywood, og internasjonale konkurranser.'
                : 'Today, Bhangra has evolved into a global phenomenon – from traditional grassroots to stage performances, fusion with hip-hop and Bollywood, and international competitions.'}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full aspect-video bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-100 rounded-lg flex items-center justify-center text-6xl">
              🥁
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Variations Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-center mb-6">{lang==='no'?'Bhangra Varianter':'Bhangra Variations'}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {bhangraSteps.map((step, i) => (
            <motion.div
              key={step.key}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              className="lux-card p-5 sm:p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold" style={{background:`linear-gradient(135deg, ${accent.from}, ${accent.to})`}}>
                  {i+1}
                </div>
                <h4 className="font-heading text-lg text-black/90">{step.name}</h4>
              </div>
              <p className="text-sm text-black/70 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Signature Moves (Interactive) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-center mb-6">{lang==='no'?'Signaturtrinn':'Signature Moves'}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signatureMoves.map((move) => (
            <motion.div
              key={move.key}
              className="lux-card p-5 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setActiveMove(activeMove === move.key ? null : move.key)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{move.icon}</span>
                <h4 className="font-medium text-lg">{move.name}</h4>
              </div>
              <p className="text-sm text-black/70 mb-2">{move.desc}</p>
              <AnimatePresence>
                {activeMove === move.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-black/10 mt-3">
                      <p className="text-sm text-black/60 leading-relaxed">{move.detail}</p>
                      <div className="mt-3 p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded text-xs text-black/50 text-center">
                        {lang === 'no' ? '🎥 Video kommer snart' : '🎥 Video coming soon'}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 5. Music & Instruments */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-center mb-6">{lang==='no'?'Musikk & Instrumenter':'Music & Instruments'}</h3>
        <div className="max-w-3xl mx-auto space-y-6 mb-6">
          <p className="text-sm sm:text-base text-black/70 leading-relaxed text-center">
            {lang === 'no'
              ? 'Bhangra-musikk er drevet av kraftfulle rytmer og livlige melodier. Dhol-trommen setter tempoet, mens tumbi og algoza legger til melodisk dybde.'
              : 'Bhangra music is driven by powerful rhythms and lively melodies. The dhol drum sets the pace, while tumbi and algoza add melodic depth.'}
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {instruments.map((inst, i) => (
            <motion.div
              key={inst.name}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i*0.1 }}
              className="lux-card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{inst.icon}</div>
              <h4 className="font-heading text-lg mb-2">{inst.name}</h4>
              <p className="text-sm text-black/70">{inst.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-sm text-black/60">
            {lang==='no'?'🎵 Lydklipp kommer snart':'🎵 Audio clips coming soon'}
          </div>
        </div>
      </motion.div>

      {/* 6. Traditional Outfits */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-6">{lang==='no'?'Tradisjonelle Antrekk':'Traditional Outfits'}</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="lux-card p-5 sm:p-6">
            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
              <span>👨</span>
              <span>{lang==='no'?'Menn':'Men'}</span>
            </h4>
            <ul className="space-y-2 text-sm">
              {outfits.men.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{color:accent.from}}>•</span>
                  <div>
                    <strong>{o.item}</strong> — {o.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lux-card p-5 sm:p-6">
            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
              <span>👩</span>
              <span>{lang==='no'?'Kvinner':'Women'}</span>
            </h4>
            <ul className="space-y-2 text-sm">
              {outfits.women.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{color:accent.from}}>•</span>
                  <div>
                    <strong>{o.item}</strong> — {o.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* 7. Modern & Fusion */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="lux-card p-6 sm:p-8"
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-center mb-6">{lang==='no'?'Moderne & Global Bhangra-fusjon':'Modern & Global Bhangra Fusion'}</h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <div className="w-full aspect-video bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-100 rounded-lg flex flex-col items-center justify-center text-center p-6">
              <span className="text-6xl mb-4">🌍</span>
              <p className="text-sm text-black/60">{lang === 'no' ? 'Moderne Bhangra-forestilling' : 'Modern Bhangra Performance'}</p>
              <p className="text-xs text-black/50 mt-2">{lang === 'no' ? '🎥 Video kommer snart' : '🎥 Video coming soon'}</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-4">
              {lang==='no'
                ? 'Bhangra har utviklet seg fra en folkelig fest til sceneproduksjoner og fusjonsstiler som blander hip-hop, urban og Bollywood. Det er nå en global bevegelse med konkurranser og workshops over hele verden.'
                : 'Bhangra has evolved from folk celebration to stage performances and fusion styles blending hip-hop, urban, and Bollywood. It\'s now a global movement with competitions and workshops worldwide.'}
            </p>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-4">
              {lang==='no'
                ? 'Kjente grupper inkluderer Bhangra Empire, Joshiley, og kunstnere som Panjabi MC har brakt Bhangra til mainstream musikk.'
                : 'Famous groups include Bhangra Empire, Joshiley, and artists like Panjabi MC have brought Bhangra to mainstream music.'}
            </p>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed">
              {lang==='no'
                ? 'Surmedanias Bhangra-klasser fokuserer på både tradisjonelle teknikker og moderne fusjon, og bygger kondisjon, koordinasjon og selvtillit.'
                : 'Surmedania\'s Bhangra classes focus on both traditional techniques and modern fusion, building fitness, coordination, and confidence.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 8. Fun Facts */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-center mb-6">{lang==='no'?'Morsomme Fakta':'Fun Facts'}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funFacts.map((fact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="lux-card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl block mb-3">{fact.icon}</span>
              <p className="text-sm text-black/70">{fact.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 9. Gallery Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Galleri' : 'Gallery'}
        </h3>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['all', 'traditional', 'modern', 'fusion'].map((filter) => (
            <button
              key={filter}
              onClick={() => setGalleryFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                galleryFilter === filter
                  ? 'text-white shadow-lg'
                  : 'bg-white text-black/70 hover:bg-black/5'
              }`}
              style={galleryFilter === filter ? {
                background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`
              } : {}}
            >
              {filter === 'all' ? (lang === 'no' ? 'Alle' : 'All') :
               filter === 'traditional' ? (lang === 'no' ? 'Tradisjonell' : 'Traditional') :
               filter === 'modern' ? (lang === 'no' ? 'Moderne' : 'Modern') :
               (lang === 'no' ? 'Fusjon' : 'Fusion')}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredGallery.map((item, idx) => (
              <motion.div
                key={`${item.type}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="lux-card p-6 aspect-square flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-5xl mb-3">{item.emoji}</span>
                <p className="text-sm font-medium text-black/80">{item.label}</p>
                <p className="text-xs text-black/50 mt-2">{lang === 'no' ? 'Foto kommer snart' : 'Photo coming soon'}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 10. CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
          boxShadow: `0 20px 60px -10px ${accent.from}60`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 text-center text-white">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl mb-4"
          >
            {lang==='no'?'Bli med på Bhangra-energien!':'Join the Bhangra Energy!'}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {lang==='no' 
              ? 'Lær kraftfulle trinn, bygg kondisjon og oppdag gleden med Punjabs mest energiske dans. Surmedanias Bhangra-klasser er for alle nivåer.'
              : 'Learn powerful steps, build fitness, and discover the joy of Punjab\'s most energetic dance. Surmedania\'s Bhangra classes are for all levels.'}
          </motion.p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/registration">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                {lang==='no'?'Registrer deg nå':'Register Now'}
              </motion.button>
            </Link>
            <Link to="/classes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/20 backdrop-blur text-white font-medium rounded-full border-2 border-white/50 hover:bg-white/30 transition-all"
              >
                {lang==='no'?'Se klasseoversikt':'View Classes'}
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Giddha Section Component
function GiddhaSection({ lang, accent, cardVariants }) {
  const [activeMove, setActiveMove] = useState(null)
  const [galleryFilter, setGalleryFilter] = useState('all')

  const variations = [
    { key: 'traditional', name: lang==='no'?'Tradisjonell Giddha':'Traditional Giddha', desc: lang==='no'?'Klassisk stil med fokus på boliyan og sirkulære bevegelser.':'Classic style focused on boliyan and circular movements.' },
    { key: 'modern', name: lang==='no'?'Moderne Scene Giddha':'Modern Stage Giddha', desc: lang==='no'?'Scenisk versjon med koreografi og synkroniserte formasjoner.':'Stage version with choreography and synchronized formations.' },
    { key: 'malwai', name: 'Malwai Giddha', desc: lang==='no'?'Regional variant fra Malwa med unike gester.':'Regional variant from Malwa with unique gestures.' },
    { key: 'sammi', name: 'Sammi', desc: lang==='no'?'Grasiøs stil med myke armbevegelser.':'Graceful style with soft arm movements.' },
    { key: 'ludiya', name: 'Ludiya Giddha', desc: lang==='no'?'Festlig versjon med mer energi og tempo.':'Festive version with more energy and tempo.' }
  ]

  const signatureMoves = [
    { key: 'chikkar', name: 'Chikkar Paauna', desc: lang==='no'?'Klassisk rote håndleddsbevegelse':'Classic rotating wrist movement' },
    { key: 'phummar', name: 'Phummar', desc: lang==='no'?'Skulder- og hodebevegelse':'Shoulder and head movement' },
    { key: 'boliyan', name: 'Boliyan Step', desc: lang==='no'?'Fotarbeid synkronisert med boliyan':'Footwork synced with boliyan' },
    { key: 'thappi', name: 'Thappi', desc: lang==='no'?'Klappemønster med rytme':'Clapping pattern with rhythm' },
    { key: 'jhumka', name: 'Jhumka Step', desc: lang==='no'?'Grasiøs hodeveggbevegelse':'Graceful head sway' },
    { key: 'lassi', name: 'Lassi Step', desc: lang==='no'?'Sirkulær dreibevegelse':'Circular swirl movement' }
  ]

  const outfitItems = [
    { item: 'Phulkari Dupatta', desc: lang==='no'?'Fargerik brodert sjal – symbol på punjabisk kultur':'Colorful embroidered shawl – symbol of Punjabi culture' },
    { item: 'Paranda', desc: lang==='no'?'Fletteaksessorie for tradisjonell eleganse':'Braid accessory for traditional elegance' },
    { item: 'Jhumke (øredobber)', desc: lang==='no'?'Store tradisjonelle øredobber':'Large traditional earrings' },
    { item: 'Salwar Kameez', desc: lang==='no'?'Tradisjonell drakt – base antrekk':'Traditional outfit – base attire' },
    { item: 'Chura (armbånd)', desc: lang==='no'?'Armbånd som lager rytmisk lyd':'Bangles that create rhythmic sound' }
  ]

  const funFacts = [
    lang==='no'?'Giddha oppsto i Punjab som en feiring av kvinners uttrykk og historie.':'Giddha originated in Punjab as a celebration of women\'s expression and storytelling.',
    lang==='no'?'Hvert trinn i Giddha bærer emosjon – fra glede til lengsel.':'Each step in Giddha carries emotion – from joy to longing.',
    lang==='no'?'Boliyan (folkelige vers) er hjertet av Giddha – ofte humoristiske eller hjertefulle.':'Boliyan (folk verses) are the heart of Giddha – often humorous or heartfelt.'
  ]

  const galleryItems = [
    { id: 1, type: 'traditional', thumb: '🎭' },
    { id: 2, type: 'modern', thumb: '🎬' },
    { id: 3, type: 'fusion', thumb: '✨' },
    { id: 4, type: 'traditional', thumb: '🎭' },
    { id: 5, type: 'modern', thumb: '🎬' },
    { id: 6, type: 'fusion', thumb: '✨' }
  ]

  const filteredGallery = galleryFilter === 'all' ? galleryItems : galleryItems.filter(i => i.type === galleryFilter)

  return (
    <div id="giddha" className="scroll-mt-28 space-y-12 sm:space-y-16">
      {/* 1. Hero */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3">{lang==='no'?'Giddha – Punjabs Eleganse':'Giddha – The Grace of Punjab'}</h2>
        <p className="text-base sm:text-lg text-black/70 mb-4">
          {lang==='no'?'Der rytme, uttrykk og kultur forenes.':'Where rhythm, expression, and culture unite.'}
        </p>
        <p className="text-sm text-black/60 leading-relaxed">
          {lang==='no'
            ? 'Giddha er den tradisjonelle folkedansen til punjabiske kvinner – en livlig feiring gjennom bevegelse og poesi.'
            : 'Giddha is the traditional folk dance of Punjabi women – a lively celebration through movement and poetry.'}
        </p>
      </div>

      {/* 2. Origin & Cultural Roots */}
      <div className="lux-card p-6 sm:p-8">
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">{lang==='no'?'Opprinnelse & Kulturelle Røtter':'Origin & Cultural Roots'}</h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed">
              {lang==='no'
                ? 'Giddha har sine røtter dypt i Punjab og er et uttrykk for kvinners feiring, glede og historiefortelling. Dansen utføres tradisjonelt i sirkler med boliyan (folkelige vers) som akkompagnerer bevegelsene – hver strofe bærer humor, livsvisdom eller følelser.'
                : 'Giddha has its roots deep in Punjab and is an expression of women\'s celebration, joy, and storytelling. The dance is traditionally performed in circles with boliyan (folk verses) accompanying the movements – each verse carries humor, life wisdom, or emotion.'}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full aspect-video bg-gradient-to-br from-pink-100 to-purple-50 rounded-lg flex items-center justify-center text-5xl">
              👭
            </div>
          </div>
        </div>
      </div>

      {/* 3. Giddha Variations */}
      <div>
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-6">{lang==='no'?'Giddha Varianter':'Giddha Variations'}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {variations.map((v, i) => (
            <motion.div
              key={v.key}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              className="lux-card p-5 sm:p-6"
            >
              <div className="w-full aspect-video bg-gradient-to-br rounded-lg mb-4 flex items-center justify-center text-4xl" style={{backgroundImage:`linear-gradient(135deg, ${accent.from}22, ${accent.to}11)`}}>
                💃
              </div>
              <h4 className="font-heading text-lg mb-2">{v.name}</h4>
              <p className="text-sm text-black/70">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Signature Moves */}
      <div>
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">{lang==='no'?'Signaturtrinn':'Signature Moves'}</h3>
        <p className="text-center text-sm text-black/60 mb-6">{lang==='no'?'Klikk for å lære mer':'Click to learn more'}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {signatureMoves.map((move) => (
            <motion.button
              key={move.key}
              onClick={() => setActiveMove(activeMove === move.key ? null : move.key)}
              className={[
                'lux-card p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5',
                activeMove === move.key ? 'ring-2 ring-offset-2' : ''
              ].join(' ')}
              style={activeMove === move.key ? { ringColor: accent.from } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{background:`linear-gradient(135deg, ${accent.from}22, ${accent.to}11)`}}>
                  ✨
                </div>
                <span className="font-medium text-sm">{move.name}</span>
              </div>
              <AnimatePresence>
                {activeMove === move.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-xs text-black/60 mt-2 border-t pt-2"
                  >
                    {move.desc}
                    <div className="mt-2 text-[10px] italic" style={{color:accent.from}}>
                      {lang==='no'?'[GIF kommer snart]':'[GIF coming soon]'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 5. Music & Boliyan */}
      <div className="lux-card p-6 sm:p-8 bg-gradient-to-br from-pink-50/50 to-purple-50/30">
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">{lang==='no'?'Musikk & Boliyan':'Music & Boliyan'}</h3>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-6 max-w-2xl mx-auto">
          {lang==='no'
            ? 'Boliyan er folkelige vers som akkompagnerer Giddha – ofte humoristiske, poetiske eller emosjonelle. De synges av danserne i call-and-response og gir rytmen liv.'
            : 'Boliyan are folk verses that accompany Giddha – often humorous, poetic, or emotional. They are sung by the dancers in call-and-response, bringing the rhythm to life.'}
        </p>
        <div className="max-w-xl mx-auto p-4 rounded-lg bg-white/70 border border-black/5">
          <div className="text-center mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{background:`linear-gradient(135deg, ${accent.from}33, ${accent.to}22)`, color:accent.from}}>
              {lang==='no'?'Eksempel Boli':'Sample Boli'}
            </span>
          </div>
          <p className="text-sm font-medium text-center mb-1">ਤੇਰੀ ਜੂੜੀ ਨੇ ਮਾਰੀ ਆ ਜੁਟਾਰੀ</p>
          <p className="text-xs text-center text-black/60 italic">
            {lang==='no'?'"Din flette har fanget mitt hjerte"':'"Your braid has captured my heart"'}
          </p>
          <div className="mt-4 text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-black/5 text-sm text-black/60">
              {lang==='no'?'🎵 Lydklipp kommer snart':'🎵 Audio clip coming soon'}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Traditional Outfits */}
      <div>
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-6">{lang==='no'?'Tradisjonelle Antrekk':'Traditional Outfits'}</h3>
        <div className="lux-card p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center text-6xl" style={{backgroundImage:`linear-gradient(135deg, ${accent.from}22, ${accent.to}11)`}}>
              👸
            </div>
          </div>
          <ul className="space-y-3 max-w-2xl mx-auto">
            {outfitItems.map((o, i) => (
              <motion.li
                key={i}
                initial={{ opacity:0, x:-20 }}
                whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50"
              >
                <span style={{color:accent.from}}>•</span>
                <div>
                  <strong className="text-sm">{o.item}</strong>
                  <p className="text-xs text-black/70 mt-0.5">{o.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Modern & Fusion */}
      <div className="lux-card p-6 sm:p-8 bg-gradient-to-br from-purple-50/50 to-pink-50/30">
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">{lang==='no'?'Moderne & Fusion Giddha':'Modern & Fusion Giddha'}</h3>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-2xl mx-auto mb-6">
          {lang==='no'
            ? 'Giddha har utviklet seg fra landsbygdsfeiringer til moderne sceneproduksjoner med koreografi, lys og fusjon med andre stilarter. I dag ser vi Giddha på internasjonale scener, som blander tradisjonelle bevegelser med moderne musikk og performance.'
            : 'Giddha has evolved from rural celebrations to modern stage productions with choreography, lighting, and fusion with other styles. Today we see Giddha on international stages, blending traditional movements with modern music and performance.'}
        </p>
        <div className="max-w-md mx-auto aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-5xl hover:scale-105 transition cursor-pointer">
          ▶️
        </div>
        <p className="text-center text-xs text-black/60 mt-3">{lang==='no'?'Video kommer snart':'Video coming soon'}</p>
      </div>

      {/* 8. Fun Facts */}
      <div className="max-w-2xl mx-auto">
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-6">{lang==='no'?'Morsomme Fakta':'Fun Facts'}</h3>
        <div className="space-y-3">
          {funFacts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, x:-20 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-pink-100"
            >
              <span className="text-xl">💫</span>
              <p className="text-sm text-black/80 leading-relaxed">{fact}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 9. Gallery Section */}
      <div>
        <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">{lang==='no'?'Galleri':'Gallery'}</h3>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { key: 'all', label: lang==='no'?'Alle':'All' },
            { key: 'traditional', label: lang==='no'?'Tradisjonell':'Traditional' },
            { key: 'modern', label: lang==='no'?'Moderne':'Modern' },
            { key: 'fusion', label: 'Fusion' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setGalleryFilter(filter.key)}
              className={[
                'px-4 py-2 rounded-full text-sm transition',
                galleryFilter === filter.key ? 'text-white shadow-md' : 'border border-pink-200 text-black/70 hover:bg-pink-50'
              ].join(' ')}
              style={galleryFilter === filter.key ? { background:`linear-gradient(135deg, ${accent.from}, ${accent.to})` } : {}}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredGallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity:0, scale:0.9 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay:i*0.05 }}
              className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center text-4xl hover:scale-105 transition cursor-pointer"
            >
              {item.thumb}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 10. CTA */}
      <div className="lux-card p-6 sm:p-8 text-center bg-gradient-to-b from-pink-50 to-transparent">
        <h3 className="font-heading text-xl sm:text-2xl mb-3">{lang==='no'?'Bli med på Giddha-opplevelsen!':'Join the Giddha Experience!'}</h3>
        <p className="text-sm sm:text-base text-black/70 mb-5">
          {lang==='no'?'Lær den tradisjonelle kunsten fra erfarne instruktører.':'Learn the traditional art from experienced instructors.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/registration" className="px-6 py-3 rounded-lg text-white shadow-md hover:shadow-lg transition" style={{background:`linear-gradient(135deg, ${accent.from}, ${accent.to})`}}>
            {lang==='no'?'Registrer deg nå':'Register Now'}
          </Link>
          <Link to="/classes" className="px-6 py-3 rounded-lg border border-pink-200 hover:bg-pink-50 transition">
            {lang==='no'?'Bli med i klassen vår':'Join Our Class'}
          </Link>
        </div>
      </div>
    </div>
  )
}

function BollywoodSection({ lang, accent, cardVariants }) {
  const [activeMove, setActiveMove] = useState(null)
  const [galleryFilter, setGalleryFilter] = useState('all')

  // Bollywood variations
  const variations = [
    {
      key: 'classical-fusion',
      title: lang === 'no' ? 'Klassisk Fusjon' : 'Classical Fusion',
      desc: lang === 'no' 
        ? 'Blander Kathak og Bharatanatyam med moderne filmkoreografi for en elegant stil.'
        : 'Blends Kathak and Bharatanatyam with modern film choreography for an elegant style.'
    },
    {
      key: 'folk-inspired',
      title: lang === 'no' ? 'Folkeinsipiert' : 'Folk-inspired Bollywood',
      desc: lang === 'no'
        ? 'Tar elementer fra Bhangra, Giddha og andre regionale danser inn i Bollywood-rammer.'
        : 'Takes elements from Bhangra, Giddha, and other regional dances into Bollywood frames.'
    },
    {
      key: 'contemporary',
      title: lang === 'no' ? 'Moderne Bollywood' : 'Contemporary Bollywood',
      desc: lang === 'no'
        ? 'Inkorporerer hip-hop, jazz og samtidskunst for en ren, urban følelse.'
        : 'Incorporates hip-hop, jazz, and contemporary for a clean, urban feel.'
    },
    {
      key: 'item-song',
      title: lang === 'no' ? 'Item Song-stil' : 'Item Song Style',
      desc: lang === 'no'
        ? 'Høy energi, sassy koreografi med dramatiske positurer og kommanderende tilstedeværelse.'
        : 'High energy, sassy choreography with dramatic poses and commanding stage presence.'
    },
    {
      key: 'cinematic',
      title: lang === 'no' ? 'Kinematisk / Teatralsk' : 'Cinematic / Theatrical',
      desc: lang === 'no'
        ? 'Storskala formasjoner, fortellende gester og filmisk uttrykk for sceneforestillinger.'
        : 'Large-scale formations, narrative gestures, and cinematic expression for stage performances.'
    }
  ]

  // Signature Bollywood moves
  const signatureMoves = [
    {
      key: 'thumka',
      name: 'Thumka',
      icon: '💃',
      desc: lang === 'no'
        ? 'Klassisk hoftesvingbevegelse som er leken og uttrykker selvtillit – en Bollywood-signatur.'
        : 'Classic hip swing movement that\'s playful and confident – a Bollywood signature.',
      detail: lang === 'no'
        ? 'Thumka er en av de mest kjente Bollywood-bevegelsene, ofte brukt i dansende festsanger. Det handler om timing, flyt og frigjøring av hofter med rytmen.'
        : 'Thumka is one of the most recognizable Bollywood moves, often used in celebratory dance numbers. It\'s all about timing, flow, and releasing the hips with the rhythm.'
    },
    {
      key: 'jhatka',
      name: 'Jhatka',
      icon: '⚡',
      desc: lang === 'no'
        ? 'En rask skulderrykk som legger til aksentuering og energi til enhver Bollywood-sekvens.'
        : 'A quick shoulder jerk that adds accent and energy to any Bollywood sequence.',
      detail: lang === 'no'
        ? 'Jhatka brukes til å skape dynamiske aksenter i koreografien. Det er et plutselig, skarpt trekk som synkroniserer med musikkens perkusjon eller høydepunkter.'
        : 'Jhatka is used to create dynamic accents in choreography. It\'s a sudden, sharp move that syncs with percussion or musical highlights.'
    },
    {
      key: 'nazakat',
      name: 'Nazakat',
      icon: '🌸',
      desc: lang === 'no'
        ? 'Yndige hånd- og øyebevegelser som formidler nyanser og følelser – essensen av uttrykksfull dans.'
        : 'Graceful hand and eye movements that convey nuance and emotion – the essence of expressive dance.',
      detail: lang === 'no'
        ? 'Nazakat betyr «eleganse» på urdu. Denne stilen handler om subtile øyeuttrykk, håndfluid bevegelse og innfanging av følelsesmessig dybde med nyanser.'
        : 'Nazakat means "elegance" in Urdu. This style is about subtle eye expressions, fluid hand movement, and capturing emotional depth with nuance.'
    },
    {
      key: 'balle-balle',
      name: 'Balle Balle Step',
      icon: '🙌',
      desc: lang === 'no'
        ? 'En feiring, høyenergi bevegelse som kombinerer armløft, hopp og glede.'
        : 'A celebratory, high-energy move that combines arm raises, jumps, and joy.',
      detail: lang === 'no'
        ? 'Balle Balle-steget kommer fra Bhangra, men Bollywood har gjort det til en globalt gjenkjennelig feiring. Armer i luften, et hopp og ren glede!'
        : 'The Balle Balle step comes from Bhangra, but Bollywood has made it a globally recognizable celebration. Arms in the air, a jump, and pure joy!'
    },
    {
      key: 'filmi-walk',
      name: 'Filmi Walk',
      icon: '🚶',
      desc: lang === 'no'
        ? 'En dramatisk, stilisert gange som gir karakter og fortelling til koreografien.'
        : 'A dramatic, stylized walk that brings character and storytelling into choreography.',
      detail: lang === 'no'
        ? 'Filmi Walk er en overdrevet, selvsikker gange som ofte sees i filmintro eller konfrontasjonsscener. Det handler om holdning, rytme og karakter.'
        : 'Filmi Walk is an exaggerated, confident walk often seen in movie intros or confrontation scenes. It\'s all about attitude, rhythm, and character.'
    },
    {
      key: 'spin-pose',
      name: 'Spin & Pose',
      icon: '🌀',
      desc: lang === 'no'
        ? 'En rask snurring etterfulgt av en fryst, kraftig positur – perfekt for høydepunkter.'
        : 'A quick spin followed by a frozen, powerful pose – perfect for climactic moments.',
      detail: lang === 'no'
        ? 'Denne bevegelsen er et hovedelement i Bollywood-koreografi, spesielt i slutten av fraser. Snurr, stopp brått, og hold posituren med tilstedeværelse og intensitet.'
        : 'This move is a staple of Bollywood choreography, especially at the end of phrases. Spin, stop sharply, and hold the pose with presence and intensity.'
    }
  ]

  // Costumes categories
  const costumeCategories = [
    {
      type: lang === 'no' ? 'Tradisjonelle Filmkostymer' : 'Traditional Film Costumes',
      items: [
        { name: lang === 'no' ? 'Saree' : 'Saree', desc: lang === 'no' ? 'Klassisk elegant drape' : 'Classic elegant drape' },
        { name: lang === 'no' ? 'Lehenga Choli' : 'Lehenga Choli', desc: lang === 'no' ? 'Brodert skjørt & topp' : 'Embroidered skirt & top' },
        { name: lang === 'no' ? 'Anarkali' : 'Anarkali', desc: lang === 'no' ? 'Flytende kjole-stil' : 'Flowing gown-style' },
        { name: lang === 'no' ? 'Kurta Pajama' : 'Kurta Pajama', desc: lang === 'no' ? 'Tradisjonelt menssett' : 'Traditional men\'s set' }
      ]
    },
    {
      type: lang === 'no' ? 'Moderne Fusjonslook' : 'Modern Fusion Looks',
      items: [
        { name: lang === 'no' ? 'Indo-Western Fusion' : 'Indo-Western Fusion', desc: lang === 'no' ? 'Moderne kutt med tradisjonelle motiver' : 'Modern cuts with traditional motifs' },
        { name: lang === 'no' ? 'Dansesneakers' : 'Dance Sneakers', desc: lang === 'no' ? 'Urban Bollywood-stil' : 'Urban Bollywood style' },
        { name: lang === 'no' ? 'Crop Tops & Dhoti' : 'Crop Tops & Dhoti', desc: lang === 'no' ? 'Samtidig møter klassisk' : 'Contemporary meets classic' },
        { name: lang === 'no' ? 'Gjennomsiktige overlays' : 'Sheer Overlays', desc: lang === 'no' ? 'Dramatisk sceneeffekt' : 'Dramatic stage effect' }
      ]
    }
  ]

  // Fun facts
  const funFacts = [
    {
      icon: '🎬',
      text: lang === 'no'
        ? 'Bollywood-filmer produserer over 1000 danselåter hvert år.'
        : 'Bollywood films produce over 1000 dance songs every year.'
    },
    {
      icon: '🌍',
      text: lang === 'no'
        ? 'Bollywood-dans utføres i over 80 land over hele verden.'
        : 'Bollywood dance is performed in over 80 countries worldwide.'
    },
    {
      icon: '💫',
      text: lang === 'no'
        ? 'Hver sang kan blande opptil 4 dansegenre – fra klassisk til hip-hop.'
        : 'Each song can blend up to 4 dance genres – from classical to hip-hop.'
    },
    {
      icon: '🤲',
      text: lang === 'no'
        ? 'Noen bevegelser er inspirert av klassiske mudraer (håndbevegelser) fra indisk dans.'
        : 'Some moves are inspired by classical mudras (hand gestures) from Indian dance.'
    },
    {
      icon: '🎭',
      text: lang === 'no'
        ? 'Bollywood-koreografer blander ofte fortellende gester med ren dans.'
        : 'Bollywood choreographers often mix narrative gestures with pure dance.'
    },
    {
      icon: '✨',
      text: lang === 'no'
        ? 'Den mest kjente Bollywood-danseren? Millioner har lært trinnene fra ikoniske filmer.'
        : 'The most famous Bollywood dancer? Millions have learned steps from iconic films.'
    }
  ]

  // Gallery items
  const galleryItems = [
    { type: 'classical', emoji: '💃', label: lang === 'no' ? 'Klassisk Fusjon' : 'Classical Fusion' },
    { type: 'modern', emoji: '🎬', label: lang === 'no' ? 'Moderne Forestilling' : 'Modern Performance' },
    { type: 'fusion', emoji: '🌟', label: lang === 'no' ? 'Global Fusjon' : 'Global Fusion' },
    { type: 'classical', emoji: '🎭', label: lang === 'no' ? 'Teatralsk Dans' : 'Theatrical Dance' },
    { type: 'modern', emoji: '🎵', label: lang === 'no' ? 'Filmi Koreografi' : 'Filmi Choreography' },
    { type: 'fusion', emoji: '💫', label: lang === 'no' ? 'Fusjon Workshop' : 'Fusion Workshop' }
  ]

  const filteredGallery = galleryFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === galleryFilter)

  return (
    <div id="bollywood" className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
          boxShadow: `0 10px 40px -10px ${accent.from}40`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-20 text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4"
          >
            {lang === 'no' ? 'Bollywood – Kinemaets Rytme' : 'Bollywood – The Rhythm of Cinema'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 mb-6"
          >
            {lang === 'no' ? 'Der dans, drama og følelser kommer til liv.' : 'Where dance, drama, and emotion come alive.'}
          </motion.p>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
            {lang === 'no'
              ? 'Bollywood-dans er en livlig fusjon av indisk klassisk, folkekunst og moderne stiler inspirert av filmkoreografi. Det er uttrykk, fortelling og ren glede – alt pakket inn i fargerik, energisk bevegelse som fanger hjertene over hele verden.'
              : 'Bollywood dance is a vibrant fusion of Indian classical, folk, and modern styles inspired by film choreography. It\'s expression, storytelling, and pure joy – all wrapped in colorful, energetic movement that captures hearts worldwide.'}
          </p>
        </div>
      </motion.div>

      {/* 2. Origins & Evolution */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="lux-card p-6 sm:p-8"
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-4 text-center">
          {lang === 'no' ? 'Opprinnelse & Utvikling' : 'Origins & Evolution'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-4">
              {lang === 'no'
                ? 'Bollywood-dans utviklet seg fra indisk filmkultur på 1950-tallet, og blander klassiske former som Kathak og Bharatanatyam med vestlige påvirkninger som hip-hop, jazz og samtidskunst.'
                : 'Bollywood dance evolved from Indian film culture in the 1950s, blending classical forms like Kathak and Bharatanatyam with Western influences like hip-hop, jazz, and contemporary.'}
            </p>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed">
              {lang === 'no'
                ? 'I dag er Bollywood-dans en global fenomen – en livlig, teatralsk stil som formidler følelser gjennom bevegelse, musikk og fortelling.'
                : 'Today, Bollywood dance is a global phenomenon – a vibrant, theatrical style that conveys emotion through movement, music, and storytelling.'}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full aspect-video bg-gradient-to-br from-violet-100 via-pink-50 to-red-100 rounded-lg flex items-center justify-center text-6xl">
              🎬
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Bollywood Dance Styles & Variations */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Dansearter & Variasjoner' : 'Dance Styles & Variations'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {variations.map((variation, idx) => (
            <motion.div
              key={variation.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="lux-card p-5 hover:shadow-lg transition-shadow"
            >
              <div className="w-full aspect-video bg-gradient-to-br from-violet-100 to-red-100 rounded-lg flex items-center justify-center text-4xl mb-4">
                🎭
              </div>
              <h4 className="font-medium text-lg mb-2">{variation.title}</h4>
              <p className="text-sm text-black/70">{variation.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Signature Bollywood Moves */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Signatur Bollywood-bevegelser' : 'Signature Bollywood Moves'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signatureMoves.map((move) => (
            <motion.div
              key={move.key}
              className="lux-card p-5 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setActiveMove(activeMove === move.key ? null : move.key)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{move.icon}</span>
                <h4 className="font-medium text-lg">{move.name}</h4>
              </div>
              <p className="text-sm text-black/70 mb-2">{move.desc}</p>
              <AnimatePresence>
                {activeMove === move.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-black/10 mt-3">
                      <p className="text-sm text-black/60 leading-relaxed">{move.detail}</p>
                      <div className="mt-3 p-3 bg-gradient-to-br from-violet-50 to-pink-50 rounded text-xs text-black/50 text-center">
                        {lang === 'no' ? '🎥 Video kommer snart' : '🎥 Video coming soon'}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 5. Music & Expression */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="lux-card p-6 sm:p-8"
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Musikk & Uttrykk' : 'Music & Expression'}
        </h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-sm sm:text-base text-black/70 leading-relaxed text-center">
            {lang === 'no'
              ? 'Bollywood-dans er dypt forbundet med følelser og tekster. Hver bevegelse forteller en historie, synkronisert med instrumenter som dhol, tabla, sitar og moderne beats.'
              : 'Bollywood dance is deeply connected to emotion and lyrics. Every movement tells a story, synchronized with instruments like dhol, tabla, sitar, and modern beats.'}
          </p>
          <div className="bg-gradient-to-br from-violet-50 to-pink-50 p-6 rounded-xl">
            <p className="font-medium text-center mb-2 text-black/80">
              {lang === 'no' ? '🎵 Eksempel Sangtekst' : '🎵 Sample Song Lyric'}
            </p>
            <p className="text-center italic text-black/70 mb-2">
              "Jai ho, jai ho..."
            </p>
            <p className="text-sm text-center text-black/60">
              {lang === 'no' 
                ? '(La seier være – et uttrykk for triumf og glede)'
                : '(Let victory be – an expression of triumph and joy)'}
            </p>
            <div className="mt-4 text-center text-xs text-black/50">
              {lang === 'no' ? '🎧 Lydklipp kommer snart' : '🎧 Audio clip coming soon'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. Costumes & Visual Aesthetics */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Kostymer & Visuell Estetikk' : 'Costumes & Visual Aesthetics'}
        </h3>
        <p className="text-center text-black/70 mb-8 max-w-2xl mx-auto">
          {lang === 'no'
            ? 'Bollywood-kostymer er fargerike, dramatiske og uttrykksfulle – fra tradisjonelle filmkostymer til moderne fusjonslook.'
            : 'Bollywood costumes are colorful, dramatic, and expressive – from traditional film costumes to modern fusion looks.'}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {costumeCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lux-card p-6"
            >
              <h4 className="font-medium text-lg mb-4 text-center">{category.type}</h4>
              <div className="space-y-3">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-violet-50 to-transparent rounded-lg">
                    <span className="text-xl">👗</span>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-black/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 7. Modern & Global Bollywood Fusion */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="lux-card p-6 sm:p-8"
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Moderne & Global Bollywood-fusjon' : 'Modern & Global Bollywood Fusion'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <div className="w-full aspect-video bg-gradient-to-br from-violet-100 via-pink-100 to-red-100 rounded-lg flex flex-col items-center justify-center text-center p-6">
              <span className="text-6xl mb-4">🌍</span>
              <p className="text-sm text-black/60">{lang === 'no' ? 'Moderne Bollywood-forestilling' : 'Modern Bollywood Performance'}</p>
              <p className="text-xs text-black/50 mt-2">{lang === 'no' ? '🎥 Video kommer snart' : '🎥 Video coming soon'}</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-4">
              {lang === 'no'
                ? 'Bollywood-dans har spredt seg over hele verden – sett i workshops, TV-show og globale forestillinger. Det er en feiring av kulturell fusjon og kreativ uttrykk.'
                : 'Bollywood dance has spread worldwide – seen in workshops, TV shows, and global performances. It\'s a celebration of cultural fusion and creative expression.'}
            </p>
            <p className="text-sm sm:text-base text-black/70 leading-relaxed">
              {lang === 'no'
                ? 'Surmedanias Bollywood-klasser fokuserer på filmkoreografi, freestyle-uttrykk og å bygge selvtillit gjennom dans.'
                : 'Surmedania\'s Bollywood classes focus on film choreography, freestyle expression, and building confidence through dance.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 8. Fun Facts */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Morsomme Fakta' : 'Fun Facts'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funFacts.map((fact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="lux-card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl block mb-3">{fact.icon}</span>
              <p className="text-sm text-black/70">{fact.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 9. Gallery Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
      >
        <h3 className="font-heading text-2xl sm:text-3xl mb-6 text-center">
          {lang === 'no' ? 'Galleri' : 'Gallery'}
        </h3>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['all', 'classical', 'modern', 'fusion'].map((filter) => (
            <button
              key={filter}
              onClick={() => setGalleryFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                galleryFilter === filter
                  ? 'text-white shadow-lg'
                  : 'bg-white text-black/70 hover:bg-black/5'
              }`}
              style={galleryFilter === filter ? {
                background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`
              } : {}}
            >
              {filter === 'all' ? (lang === 'no' ? 'Alle' : 'All') :
               filter === 'classical' ? (lang === 'no' ? 'Klassisk' : 'Classical') :
               filter === 'modern' ? (lang === 'no' ? 'Moderne' : 'Modern') :
               (lang === 'no' ? 'Fusjon' : 'Fusion')}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredGallery.map((item, idx) => (
              <motion.div
                key={`${item.type}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="lux-card p-6 aspect-square flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-5xl mb-3">{item.emoji}</span>
                <p className="text-sm font-medium text-black/80">{item.label}</p>
                <p className="text-xs text-black/50 mt-2">{lang === 'no' ? 'Foto kommer snart' : 'Photo coming soon'}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 10. CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
          boxShadow: `0 20px 60px -10px ${accent.from}60`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 text-center text-white">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl mb-4"
          >
            {lang === 'no' ? 'Bli med på Bollywood-beaten!' : 'Join the Bollywood Beat!'}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {lang === 'no' 
              ? 'Lær å uttrykke, opptre og skinne som en stjerne. Surmedanias Bollywood-klasser er for alle nivåer.'
              : 'Learn to express, perform, and shine like a star. Surmedania\'s Bollywood classes are for all levels.'}
          </motion.p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/registration">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                {lang === 'no' ? 'Registrer deg nå' : 'Register Now'}
              </motion.button>
            </Link>
            <Link to="/classes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/20 backdrop-blur text-white font-medium rounded-full border-2 border-white/50 hover:bg-white/30 transition-all"
              >
                {lang === 'no' ? 'Se klasseoversikt' : 'View Classes'}
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Styles(){
  const { t, lang } = useLang()
  const location = useLocation()

  const bhangraSteps = [
    {
      key: 'luddi',
      name: 'Luddi',
      desc: lang === 'no' 
        ? 'En feiring stil med sirkulære håndleddsbevegelser og skuldrotasjoner.'
        : 'A celebratory style performed with circular wrist movements and shoulder rotations.'
    },
    {
      key: 'jhummar',
      name: 'Jhummar',
      desc: lang === 'no' 
        ? 'Langsom, grasiøs og rytmisk bevegelse, ofte danset til mykere dhol-slag.'
        : 'Slow, graceful, rhythmic movement often danced to softer dhol beats.'
    },
    {
      key: 'dhumal',
      name: 'Dhumal',
      desc: lang === 'no' 
        ? 'Tung og dristig, med stor vekt på store armsvinger og hopp.'
        : 'Heavy and bold, emphasizing large arm swings and jumps.'
    },
    {
      key: 'malwai-giddha',
      name: 'Malwai Giddha',
      desc: lang === 'no' 
        ? 'Mannlig versjon av giddha med humoristiske uttrykk og tradisjonelle gester.'
        : 'Male version of giddha with humorous expressions and traditional gestures.'
    },
    {
      key: 'fumman',
      name: 'Fumman / Fumman Jatti',
      desc: lang === 'no' 
        ? 'Fokusert på klapping, skulderstudsing og kraftig energi.'
        : 'Focused on clapping, shoulder bounces, and strong energy.'
    },
    {
      key: 'sammi',
      name: 'Sammi',
      desc: lang === 'no' 
        ? 'Grasiøs feminin versjon, ofte sammenkoblet med Giddha.'
        : 'Graceful feminine version, often paired with Giddha.'
    },
    {
      key: 'phulkari',
      name: 'Phulkari / Mirza',
      desc: lang === 'no' 
        ? 'Inspirert av historiefortelling og tradisjonelle folkloretemaer.'
        : 'Inspired by storytelling and traditional folklore themes.'
    }
  ]

  const validKeys = ['bhangra','giddha','bollywood']
  const hashKey = useMemo(() => (location.hash || '').replace('#','').toLowerCase(), [location.hash])
  const initial = validKeys.includes(hashKey) ? hashKey : 'bhangra'
  const [selected, setSelected] = useState(initial)

  useEffect(() => {
    if (validKeys.includes(hashKey) && hashKey !== selected) {
      setSelected(hashKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashKey])

  function choose(key){
    if (!validKeys.includes(key)) return
    setSelected(key)
    const url = new URL(window.location.href)
    url.hash = `#${key}`
    window.history.replaceState(null, '', url.toString())
  }

  const accent = useMemo(() => {
    switch(selected){
      case 'giddha': return { from:'#D946EF', to:'#F472B6' } // fuchsia -> pink
      case 'bollywood': return { from:'#8B5CF6', to:'#EF4444' } // violet -> red
      default: return { from:'#C9A74A', to:'#B8902F' } // golds
    }
  }, [selected])

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } })
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
      {/* Soft glow background that changes with selection */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-10 sm:-top-16 h-56 sm:h-64 opacity-30 blur-2xl" style={{background:`radial-gradient(60% 60% at 50% 40%, ${accent.from}33 0%, ${accent.to}22 40%, transparent 70%)`}} />
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {lang === 'no' ? 'Dansestiler' : 'Dance Styles'}
        </h1>
        <p className="text-black/70 text-base sm:text-lg leading-relaxed">
          {lang === 'no'
            ? 'Oppdag rytmen, kraften og gleden i hver dans. Klikk for å utforske mer.'
            : 'Click a style to focus. Share the link — we’ll show only what you selected.'}
        </p>

        {/* Style selector (tabs) */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            {key:'bhangra', label:'Bhangra'},
            {key:'giddha', label:'Giddha'},
            {key:'bollywood', label:'Bollywood'}
          ].map(item => (
            <button
              key={item.key}
              onClick={() => choose(item.key)}
              aria-pressed={selected===item.key}
              className={[
                'px-4 py-2 rounded-full text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                selected===item.key ? 'text-white shadow-md' : 'border text-black/70 hover:bg-black/5',
                'border-transparent'
              ].join(' ')}
              style={selected===item.key ? { background:`linear-gradient(135deg, ${accent.from}, ${accent.to})` } : { borderColor:'rgba(201,167,74,0.3)' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Single-style view with animation */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {selected === 'bhangra' && (
          <BhangraSection lang={lang} accent={accent} bhangraSteps={bhangraSteps} cardVariants={cardVariants} />
        )}

        {selected === 'giddha' && (
          <GiddhaSection lang={lang} accent={accent} cardVariants={cardVariants} />
        )}

        {false && (
          <div id="giddha-old" className="scroll-mt-28">
            <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl mb-3">Giddha</h2>
              <p className="text-black/70">
                {lang === 'no'
                  ? 'Giddha er en livlig og grasiøs kvinnelig folkedans, kjent for boliyan (rim) og uttrykk.'
                  : 'Giddha is a lively, graceful folk dance performed by women, known for boliyan (rhymes) and expression.'}
              </p>
            </div>
            <div className="lux-card p-5 sm:p-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-medium text-black/90 mb-2">{lang==='no'?'Kjennetegn':'Characteristics'}</h3>
                  <ul className="space-y-1.5 text-sm text-black/70">
                    <li>• {lang==='no'?'Historiefortelling gjennom boliyan':'Storytelling through boliyan'}</li>
                    <li>• {lang==='no'?'Smygende håndledd og håndbevegelser':'Graceful wrists and handwork'}</li>
                    <li>• {lang==='no'?'Sirkulære formasjoner og call‑and‑response':'Circular formations and call‑and‑response'}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-black/90 mb-2">{lang==='no'?'Opplevelsen':'The Experience'}</h3>
                  <p className="text-sm text-black/70 leading-relaxed">
                    {lang==='no' 
                      ? 'Giddha handler om glede, fellesskap og uttrykk – en perfekt balanse til Bhangras rå energi.'
                      : 'Giddha is about joy, community, and expression – a perfect balance to Bhangra’s raw energy.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selected === 'bollywood' && (
          <BollywoodSection lang={lang} accent={accent} cardVariants={cardVariants} />
        )}
      </motion.div>
    </section>
  )
}
