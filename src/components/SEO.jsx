import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLang } from '../context/LanguageContext'

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image = '/hero.jpg',
  type = 'website',
  canonicalPath
}) {
  const { lang } = useLang()
  
  const siteUrl = 'https://surmedania.no' // Update with your actual domain
  const fullUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  
  const siteName = 'Surmedania Dance School'
  const defaultTitle = 'Surmedania - Bhangra Dance School in Rælingen'
  const defaultDescription = 'Learn authentic Bhangra and Punjabi folk dance at Surmedania Dance School in Rælingen. Classes for all ages and skill levels. Join Norway\'s premier dance community celebrating Punjabi culture.'
  
  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonicalPath && <link rel="canonical" href={fullUrl} />}
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={lang === 'no' ? 'nb_NO' : lang === 'pa' ? 'pa_IN' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Surmedania Dance School" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="NO-30" />
      <meta name="geo.placename" content="Rælingen" />
      <meta name="geo.position" content="59.9321;11.0879" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'DanceGroup',
          name: 'Surmedania Dance School',
          description: defaultDescription,
          url: siteUrl,
          logo: `${siteUrl}/logo.svg`,
          image: fullImageUrl,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Øvre Rælingsveg 203',
            addressLocality: 'Fjerdingby',
            postalCode: '2008',
            addressRegion: 'Akershus',
            addressCountry: 'NO'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 59.9321,
            longitude: 11.0879
          },
          telephone: '+4746960880',
          email: 'surmedania@gmail.com',
          sameAs: [
            'https://www.instagram.com/surmedania',
            'https://www.facebook.com/profile.php?id=61565917691358'
          ],
          priceRange: '$$',
          areaServed: {
            '@type': 'City',
            name: 'Rælingen'
          }
        })}
      </script>
    </Helmet>
  )
}
