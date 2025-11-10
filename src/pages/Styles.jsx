import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Styles() {
  const { lang, t } = useLang()
  const [expandedStyle, setExpandedStyle] = useState(null)

  const styles = [
    {
      id: 'bhangra',
      name: 'Bhangra',
      emoji: '🥁',
      description: {
        en: 'High-energy Punjabi folk dance from harvest celebrations. Known for powerful shoulder movements and dhol drumming.',
        no: 'Høyenergi punjabisk folkedans fra høstfeiring. Kjent for kraftfulle skulderbevegelser og dhol-trommer.',
        pa: 'ਵਾਢੀ ਦੇ ਜਸ਼ਨ ਤੋਂ ਉੱਚ-ਊਰਜਾ ਵਾਲਾ ਪੰਜਾਬੀ ਲੋਕ ਨਾਚ। ਸ਼ਕਤੀਸ਼ਾਲੀ ਮੋਢੇ ਦੀਆਂ ਹਰਕਤਾਂ ਅਤੇ ਢੋਲ ਵਜਾਉਣ ਲਈ ਜਾਣਿਆ ਜਾਂਦਾ ਹੈ।'
      },
      characteristics: {
        en: ['Energetic movements', 'Dhol drum rhythms', 'Traditional costumes', 'Group celebrations'],
        no: ['Energiske bevegelser', 'Dhol trommerytmer', 'Tradisjonelle kostymer', 'Gruppefeiring'],
        pa: ['ਊਰਜਾਵਾਨ ਹਰਕਤਾਂ', 'ਢੋਲ ਦੀਆਂ ਤਾਲਾਂ', 'ਰਵਾਇਤੀ ਪਹਿਰਾਵੇ', 'ਸਮੂਹਿਕ ਜਸ਼ਨ']
      },
      detailedInfo: {
        en: {
          origin: 'Bhangra originated in Punjab during the harvest festival of Vaisakhi. It has evolved from a folk dance into a global phenomenon, blending traditional movements with modern music.',
          moves: ['Phumm Phumm - Shoulder bounce', 'Chaal - Walking step with attitude', 'Jhummar - Circular wrist movements', 'Luddi - Celebratory circles'],
          music: 'Traditionally accompanied by the dhol (double-headed drum), tumbi (single-string instrument), and algoza (double flute). Modern Bhangra often fuses with hip-hop and electronic music.',
          attire: 'Men wear colorful kurtas, lungis, turbans with phumans. Women wear salwar kameez or lehengas with dupattas, often in bright colors with mirror work.'
        },
        no: {
          origin: 'Bhangra oppsto i Punjab under høstfestivalen Vaisakhi. Den har utviklet seg fra en folkedans til et globalt fenomen, som blander tradisjonelle bevegelser med moderne musikk.',
          moves: ['Phumm Phumm - Skulderhopp', 'Chaal - Gåtrinn med holdning', 'Jhummar - Sirkulære håndleddsbevegelser', 'Luddi - Festlige sirkler'],
          music: 'Tradisjonelt akkompagnert av dhol (dobbelthodet tromme), tumbi (ett-strengs instrument) og algoza (dobbel fløyte). Moderne Bhangra fusjonerer ofte med hip-hop og elektronisk musikk.',
          attire: 'Menn bærer fargerike kurtaer, lungier, turbaner med phumaner. Kvinner bærer salwar kameez eller lehengas med dupattas, ofte i lyse farger med speilarbeid.'
        },
        pa: {
          origin: 'ਭੰਗੜਾ ਦੀ ਸ਼ੁਰੂਆਤ ਵੈਸਾਖੀ ਦੇ ਵਾਢੀ ਤਿਉਹਾਰ ਦੌਰਾਨ ਪੰਜਾਬ ਵਿੱਚ ਹੋਈ। ਇਹ ਇੱਕ ਲੋਕ ਨਾਚ ਤੋਂ ਇੱਕ ਵਿਸ਼ਵਵਿਆਪੀ ਵਰਤਾਰੇ ਵਿੱਚ ਵਿਕਸਤ ਹੋਇਆ ਹੈ, ਜੋ ਰਵਾਇਤੀ ਹਰਕਤਾਂ ਨੂੰ ਆਧੁਨਿਕ ਸੰਗੀਤ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।',
          moves: ['ਫੁੰਮ ਫੁੰਮ - ਮੋਢੇ ਦੀ ਉਛਾਲ', 'ਚਾਲ - ਰਵੱਈਏ ਨਾਲ ਤੁਰਨ ਦਾ ਕਦਮ', 'ਝੁੰਮਰ - ਗੋਲ ਗੱਟੇ ਦੀਆਂ ਹਰਕਤਾਂ', 'ਲੁੱਡੀ - ਜਸ਼ਨ ਭਰੇ ਚੱਕਰ'],
          music: 'ਰਵਾਇਤੀ ਤੌਰ ਤੇ ਢੋਲ (ਦੋ-ਮੁੱਖ ਡਰੱਮ), ਤੂੰਬੀ (ਇੱਕ-ਤਾਰ ਵਾਲਾ ਸਾਜ਼) ਅਤੇ ਅਲਗੋਜ਼ਾ (ਦੋਹਰੀ ਬੰਸਰੀ) ਨਾਲ। ਆਧੁਨਿਕ ਭੰਗੜਾ ਅਕਸਰ ਹਿੱਪ-ਹੌਪ ਅਤੇ ਇਲੈਕਟ੍ਰਾਨਿਕ ਸੰਗੀਤ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ।',
          attire: 'ਮਰਦ ਰੰਗੀਨ ਕੁਰਤੇ, ਲੁੰਗੀਆਂ, ਫੁੰਮਾਂ ਵਾਲੇ ਪੱਗਾਂ ਪਹਿਨਦੇ ਹਨ। ਔਰਤਾਂ ਸਲਵਾਰ ਕਮੀਜ਼ ਜਾਂ ਦੁਪੱਟਿਆਂ ਨਾਲ ਲਹਿੰਗੇ ਪਹਿਨਦੀਆਂ ਹਨ, ਅਕਸਰ ਸ਼ੀਸ਼ੇ ਦੇ ਕੰਮ ਵਾਲੇ ਚਮਕਦਾਰ ਰੰਗਾਂ ਵਿੱਚ।'
        }
      },
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'giddha',
      name: 'Giddha',
      emoji: '💃',
      description: {
        en: 'Traditional Punjabi women\'s dance performed in circles. Features graceful movements, clapping, and folk songs (boliyan).',
        no: 'Tradisjonell punjabisk kvinnedans utført i sirkler. Med grasiøse bevegelser, klapping og folkevisesanger (boliyan).',
        pa: 'ਰਵਾਇਤੀ ਪੰਜਾਬੀ ਔਰਤਾਂ ਦਾ ਨਾਚ ਜੋ ਚੱਕਰਾਂ ਵਿੱਚ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਸੁੰਦਰ ਹਰਕਤਾਂ, ਤਾੜੀਆਂ ਅਤੇ ਲੋਕ ਗੀਤਾਂ (ਬੋਲੀਆਂ) ਨਾਲ।'
      },
      characteristics: {
        en: ['Circular formations', 'Clapping rhythms', 'Folk songs', 'Colorful attire'],
        no: ['Sirkulære formasjoner', 'Klappende rytmer', 'Folkevisesanger', 'Fargerike antrekk'],
        pa: ['ਗੋਲ ਬਣਤਰ', 'ਤਾੜੀਆਂ ਦੀਆਂ ਤਾਲਾਂ', 'ਲੋਕ ਗੀਤ', 'ਰੰਗੀਨ ਪਹਿਰਾਵੇ']
      },
      detailedInfo: {
        en: {
          origin: 'Giddha is the female counterpart to Bhangra, celebrating women\'s joy, stories, and experiences. Performed in circles, dancers take turns leading songs called boliyan.',
          moves: ['Circle formations', 'Coordinated clapping patterns', 'Graceful hand gestures', 'Spinning movements', 'Storytelling through dance'],
          music: 'Accompanied by boliyan (folk songs) that tell stories of daily life, relationships, and celebrations. The rhythm is created by clapping and singing.',
          attire: 'Women wear colorful salwar suits, lehengas, or ghagras with heavy jewelry including tikkas, necklaces, and bangles. Bright colors and embroidery are essential.'
        },
        no: {
          origin: 'Giddha er den kvinnelige motparten til Bhangra, og feirer kvinners glede, historier og opplevelser. Utført i sirkler, tar dansere tur til å lede sanger kalt boliyan.',
          moves: ['Sirkelformasjoner', 'Koordinerte klappmønstre', 'Grasiøse håndbevegelser', 'Spinnende bevegelser', 'Historiefortelling gjennom dans'],
          music: 'Akkompagnert av boliyan (folkevisesanger) som forteller historier om dagliglivet, forhold og feiringer. Rytmen skapes ved klapping og sang.',
          attire: 'Kvinner bærer fargerike salwar-dresser, lehengas eller ghagras med tungt smykker inkludert tikkaer, halskjeder og armbånd. Lyse farger og broderi er essensielt.'
        },
        pa: {
          origin: 'ਗਿੱਧਾ ਭੰਗੜੇ ਦਾ ਔਰਤਾਂ ਵਾਲਾ ਰੂਪ ਹੈ, ਜੋ ਔਰਤਾਂ ਦੀ ਖੁਸ਼ੀ, ਕਹਾਣੀਆਂ ਅਤੇ ਤਜਰਬਿਆਂ ਦਾ ਜਸ਼ਨ ਮਨਾਉਂਦਾ ਹੈ। ਚੱਕਰਾਂ ਵਿੱਚ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਨੱਚਣ ਵਾਲੀਆਂ ਵਾਰੀ-ਵਾਰੀ ਬੋਲੀਆਂ ਗਾਉਂਦੀਆਂ ਹਨ।',
          moves: ['ਗੋਲ ਬਣਤਰ', 'ਤਾਲਮੇਲ ਵਾਲੇ ਤਾੜੀਆਂ ਦੇ ਪੈਟਰਨ', 'ਸੁੰਦਰ ਹੱਥਾਂ ਦੇ ਇਸ਼ਾਰੇ', 'ਘੁੰਮਣ ਵਾਲੀਆਂ ਹਰਕਤਾਂ', 'ਨਾਚ ਰਾਹੀਂ ਕਹਾਣੀ-ਕਥਨ'],
          music: 'ਬੋਲੀਆਂ (ਲੋਕ ਗੀਤ) ਨਾਲ ਜੋ ਰੋਜ਼ਾਨਾ ਜੀਵਨ, ਰਿਸ਼ਤਿਆਂ ਅਤੇ ਜਸ਼ਨਾਂ ਦੀਆਂ ਕਹਾਣੀਆਂ ਦੱਸਦੇ ਹਨ। ਤਾਲ ਤਾੜੀਆਂ ਅਤੇ ਗਾਉਣ ਨਾਲ ਬਣਦੀ ਹੈ।',
          attire: 'ਔਰਤਾਂ ਰੰਗੀਨ ਸਲਵਾਰ ਸੂਟ, ਲਹਿੰਗੇ ਜਾਂ ਘੱਗਰੇ ਭਾਰੀ ਗਹਿਣਿਆਂ ਨਾਲ ਪਹਿਨਦੀਆਂ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਟਿੱਕੇ, ਹਾਰ ਅਤੇ ਚੂੜੀਆਂ ਸ਼ਾਮਲ ਹਨ। ਚਮਕਦਾਰ ਰੰਗ ਅਤੇ ਕਸ਼ੀਦਾਕਾਰੀ ਜ਼ਰੂਰੀ ਹੈ।'
        }
      },
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'bollywood',
      name: 'Bollywood',
      emoji: '🎬',
      description: {
        en: 'Modern fusion dance from Indian cinema. Combines classical, folk, and contemporary styles with expressive storytelling.',
        no: 'Moderne fusjonsdans fra indisk film. Kombinerer klassisk, folke og moderne stiler med ekspressiv historiefortelling.',
        pa: 'ਭਾਰਤੀ ਸਿਨੇਮਾ ਤੋਂ ਆਧੁਨਿਕ ਫਿਊਜ਼ਨ ਡਾਂਸ। ਕਲਾਸੀਕਲ, ਲੋਕ ਅਤੇ ਸਮਕਾਲੀ ਸ਼ੈਲੀਆਂ ਨੂੰ ਭਾਵਪੂਰਣ ਕਹਾਣੀ-ਕਥਨ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।'
      },
      characteristics: {
        en: ['Expressive emotions', 'Cinematic flair', 'Fusion choreography', 'Popular music'],
        no: ['Ekspressive følelser', 'Filmisk flair', 'Fusjonskoreografi', 'Populærmusikk'],
        pa: ['ਭਾਵਪੂਰਣ ਭਾਵਨਾਵਾਂ', 'ਸਿਨੇਮਾਈ ਅੰਦਾਜ਼', 'ਫਿਊਜ਼ਨ ਕੋਰੀਓਗ੍ਰਾਫੀ', 'ਪ੍ਰਸਿੱਧ ਸੰਗੀਤ']
      },
      detailedInfo: {
        en: {
          origin: 'Bollywood dance emerged from Indian cinema in the 1930s, evolving into a unique style that blends classical Indian dance forms (Kathak, Bharatanatyam) with Western styles, folk dances, and modern choreography.',
          moves: ['Expressive mudras (hand gestures)', 'Classical footwork', 'Hip-hop elements', 'Contemporary moves', 'Theatrical expressions'],
          music: 'Features popular Bollywood film songs ranging from romantic ballads to high-energy dance numbers. Music often blends traditional Indian instruments with modern production.',
          attire: 'Varies widely from traditional lehengas and kurtas to modern fusion wear. Costumes are often colorful, glamorous, and film-inspired, featuring sequins, flowing fabrics, and dramatic styling.'
        },
        no: {
          origin: 'Bollywood-dans dukket opp fra indisk film på 1930-tallet, og utviklet seg til en unik stil som blander klassiske indiske danseformer (Kathak, Bharatanatyam) med vestlige stiler, folkedanser og moderne koreografi.',
          moves: ['Ekspressive mudraer (håndbevegelser)', 'Klassisk fotarbeid', 'Hip-hop-elementer', 'Moderne bevegelser', 'Teatralske uttrykk'],
          music: 'Inneholder populære Bollywood-filmsanger som spenner fra romantiske ballader til høyenergi dansenumre. Musikken blander ofte tradisjonelle indiske instrumenter med moderne produksjon.',
          attire: 'Varierer mye fra tradisjonelle lehengas og kurtaer til moderne fusjonantrekk. Kostymer er ofte fargerike, glamorøse og filminspirerte, med paljetter, flytende stoffer og dramatisk styling.'
        },
        pa: {
          origin: 'ਬਾਲੀਵੁੱਡ ਡਾਂਸ 1930 ਦੇ ਦਹਾਕੇ ਵਿੱਚ ਭਾਰਤੀ ਸਿਨੇਮਾ ਤੋਂ ਉਭਰਿਆ, ਇੱਕ ਵਿਲੱਖਣ ਸ਼ੈਲੀ ਵਿੱਚ ਵਿਕਸਤ ਹੋਇਆ ਜੋ ਕਲਾਸੀਕਲ ਭਾਰਤੀ ਨਾਚ ਰੂਪਾਂ (ਕਥਕ, ਭਰਤਨਾਟਿਅਮ) ਨੂੰ ਪੱਛਮੀ ਸ਼ੈਲੀਆਂ, ਲੋਕ ਨਾਚਾਂ ਅਤੇ ਆਧੁਨਿਕ ਕੋਰੀਓਗ੍ਰਾਫੀ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।',
          moves: ['ਭਾਵਪੂਰਣ ਮੁਦਰਾਵਾਂ (ਹੱਥਾਂ ਦੇ ਇਸ਼ਾਰੇ)', 'ਕਲਾਸੀਕਲ ਪੈਰਾਂ ਦਾ ਕੰਮ', 'ਹਿੱਪ-ਹੌਪ ਤੱਤ', 'ਆਧੁਨਿਕ ਹਰਕਤਾਂ', 'ਨਾਟਕੀ ਪ੍ਰਗਟਾਵੇ'],
          music: 'ਪ੍ਰਸਿੱਧ ਬਾਲੀਵੁੱਡ ਫਿਲਮੀ ਗੀਤਾਂ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਜੋ ਰੋਮਾਂਟਿਕ ਬੈਲਡਾਂ ਤੋਂ ਲੈ ਕੇ ਉੱਚ-ਊਰਜਾ ਡਾਂਸ ਨੰਬਰਾਂ ਤੱਕ ਹੁੰਦੇ ਹਨ। ਸੰਗੀਤ ਅਕਸਰ ਰਵਾਇਤੀ ਭਾਰਤੀ ਸਾਜ਼ਾਂ ਨੂੰ ਆਧੁਨਿਕ ਉਤਪਾਦਨ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।',
          attire: 'ਰਵਾਇਤੀ ਲਹਿੰਗਿਆਂ ਅਤੇ ਕੁਰਤਿਆਂ ਤੋਂ ਲੈ ਕੇ ਆਧੁਨਿਕ ਫਿਊਜ਼ਨ ਪਹਿਰਾਵੇ ਤੱਕ ਵੱਖਰਾ ਹੁੰਦਾ ਹੈ। ਪਹਿਰਾਵੇ ਅਕਸਰ ਰੰਗੀਨ, ਗਲੈਮਰਸ ਅਤੇ ਫਿਲਮੀ-ਪ੍ਰੇਰਿਤ ਹੁੰਦੇ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਸੀਕੁਇਨ, ਵਹਿੰਦੇ ਕੱਪੜੇ ਅਤੇ ਨਾਟਕੀ ਸਟਾਈਲਿੰਗ ਸ਼ਾਮਲ ਹੈ।'
        }
      },
      color: 'from-purple-500 to-indigo-500'
    }
  ]

  const toggleExpand = (styleId) => {
    setExpandedStyle(expandedStyle === styleId ? null : styleId)
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-3 bg-gradient-to-br from-black to-black/70 bg-clip-text text-transparent">
          {t('styles.title')}
        </h1>
        <p className="text-xs sm:text-sm text-black/70 max-w-2xl mx-auto">{t('styles.subtitle')}</p>
      </motion.div>

      {/* Dance Styles Grid */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {styles.map((style, idx) => (
          <motion.div
            key={style.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="lux-card p-6 sm:p-8 hover:shadow-xl transition-all"
          >
            {/* Style Icon & Name */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${style.color} text-white text-4xl mb-4 shadow-lg`}>
                {style.emoji}
              </div>
                      <h2 className="text-3xl font-heading font-bold mb-8 text-center">{t(`styles.names.${style.id}`, style.name)}</h2>
            </div>

            {/* Description */}
            <p className="text-sm text-black/70 mb-6 leading-relaxed">
              {style.description[lang]}
            </p>

            {/* Characteristics */}
            <div className="space-y-2 mb-6">
              <h3 className="font-semibold text-sm text-black/90 mb-3">{t('styles.characteristics')}</h3>
              {style.characteristics[lang].map((char, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-black/70">
                  <span className="text-gold">✓</span>
                  <span>{char}</span>
                </div>
              ))}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedStyle === style.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 space-y-4 overflow-hidden"
                >
                  {/* Origin */}
                  <div className="p-4 rounded-lg bg-gold/5 border border-gold/10">
                    <h4 className="font-semibold text-sm text-black/90 mb-2">{t('styles.origin')}</h4>
                    <p className="text-xs text-black/70 leading-relaxed">
                      {style.detailedInfo[lang].origin}
                    </p>
                  </div>

                  {/* Key Moves */}
                  <div className="p-4 rounded-lg bg-gold/5 border border-gold/10">
                    <h4 className="font-semibold text-sm text-black/90 mb-2">{t('styles.keyMoves')}</h4>
                    <ul className="space-y-1">
                      {style.detailedInfo[lang].moves.map((move, i) => (
                        <li key={i} className="text-xs text-black/70">• {move}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Music */}
                  <div className="p-4 rounded-lg bg-gold/5 border border-gold/10">
                    <h4 className="font-semibold text-sm text-black/90 mb-2">{t('styles.music')}</h4>
                    <p className="text-xs text-black/70 leading-relaxed">
                      {style.detailedInfo[lang].music}
                    </p>
                  </div>

                  {/* Attire */}
                  <div className="p-4 rounded-lg bg-gold/5 border border-gold/10">
                    <h4 className="font-semibold text-sm text-black/90 mb-2">{t('styles.attire')}</h4>
                    <p className="text-xs text-black/70 leading-relaxed">
                      {style.detailedInfo[lang].attire}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <button
              onClick={() => toggleExpand(style.id)}
              className="block w-full text-center px-4 py-3 rounded-lg border-2 border-gold/30 text-gold font-medium hover:bg-gold/5 transition-all text-sm"
            >
              {expandedStyle === style.id ? t('styles.showLess') : t('styles.learnMore')}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-10 sm:mt-12"
      >
        <h2 className="font-heading text-xl sm:text-2xl mb-3">{t('styles.readyToDance')}</h2>
        <p className="text-xs sm:text-sm text-black/70 max-w-xl mx-auto mb-6">{t('styles.ctaSubtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/registration"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-br from-[#C9A74A] to-[#B8902F] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
                          {t('styles.registerNow')}
          </Link>
          <Link
            to="/classes"
            className="inline-block px-6 py-3 rounded-lg border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-white transition-all text-sm"
          >
            {t('styles.viewSchedule')}
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
