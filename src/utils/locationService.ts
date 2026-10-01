import { Language, NearbyPlace, LocationData } from '../types/index';

// 1. In-memory / session storage for user coordinates
let cachedCoords: { latitude: number; longitude: number } | null = null;

export function getCachedUserCoords(): { latitude: number; longitude: number } | null {
  if (cachedCoords) return cachedCoords;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('harshu_user_coords');
      if (stored) {
        cachedCoords = JSON.parse(stored);
        return cachedCoords;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export function saveUserCoords(coords: { latitude: number; longitude: number }): void {
  cachedCoords = coords;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('harshu_user_coords', JSON.stringify(coords));
    } catch {
      // ignore
    }
  }
}

// 2. Browser Geolocation Request
export function requestBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        saveUserCoords(coords);
        resolve(coords);
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  });
}

// 3. Haversine Distance Formula (km)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10; // Round to 1 decimal place, e.g. 1.2
}

// 4. Location Intent Detection & Entity Extraction
export interface LocationIntentDetection {
  isLocationQuery: boolean;
  category: string;
  categoryLabel: string;
  localizedCategory: Record<string, string>;
  targetArea?: string;
  isNearMe: boolean;
  isFollowUp?: 'closest' | 'directions' | 'nearby_other';
  nearbyOtherCategory?: string;
}

export function detectLocationIntent(rawInput: string): LocationIntentDetection {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  // A. Multi-turn Follow-up Detection
  const isClosestQuery =
    /which.*(closest|nearest)|closest.*(one|place)|nearest.*(one|place)|மிக.*அருகில்|எது.*பக்கத்துல|எது.*அருகே|सबसे.*(पास|नजदीक)|ఏది.*దగ్గర|ಯಾವುದು.*ಹತ್ತಿರ|ഏതാണ്.*അടുത്ത്/.test(
      lower
    );
  if (isClosestQuery) {
    return {
      isLocationQuery: true,
      category: '',
      categoryLabel: '',
      localizedCategory: {},
      isNearMe: true,
      isFollowUp: 'closest',
    };
  }

  const isDirectionsQuery =
    /how.*(go|reach|get).*there|how.*(walk|drive)|directions|show.*way|route|எப்படி.*போக|வழி.*காட்டு|வழி.*என்ன|वहां.*कैसे.*(जाएं|पहुंचें)|रास्ता.*(दिखाओ|बताओ)|ఎలా.*వెళ్ళాలి|ಹೇಗೆ.*ಹೋಗುವುದು/.test(
      lower
    );
  if (isDirectionsQuery) {
    return {
      isLocationQuery: true,
      category: '',
      categoryLabel: '',
      localizedCategory: {},
      isNearMe: true,
      isFollowUp: 'directions',
    };
  }

  const isNearbyOtherQuery =
    /(?:near|around).*(?:that|the).*(?:place|college|hospital|station|shop|hotel|school|clinic)|அந்த.*(?:பக்கத்துல|அருகில்)|उसके.*पास/.test(
      lower
    );
  if (isNearbyOtherQuery) {
    // Extract what kind of place they want near that previous place
    let otherCat = 'pharmacy';
    if (/pharmacy|medical|chemist|மருந்தகம்|दवा/.test(lower)) otherCat = 'pharmacy';
    else if (/restaurant|hotel|food|சாப்பாடு|होटल/.test(lower)) otherCat = 'restaurants';
    else if (/atm|bank|ஏடிஎம்|बैंक/.test(lower)) otherCat = 'ATM';
    else if (/bus stop|பேருந்து நிறுத்தம்|बस स्टॉप/.test(lower)) otherCat = 'bus stop';
    else if (/tea|coffee|பேக்கரி|चाय/.test(lower)) otherCat = 'tea stall / bakery';

    return {
      isLocationQuery: true,
      category: otherCat,
      categoryLabel: otherCat.charAt(0).toUpperCase() + otherCat.slice(1),
      localizedCategory: { en: otherCat, ta: otherCat, hi: otherCat },
      isNearMe: false,
      isFollowUp: 'nearby_other',
      nearbyOtherCategory: otherCat,
    };
  }

  // B. Check for Location / "Near Me" Indicators
  const hasNearMeIndicator =
    /near me|nearby|nearest|around me|close to me|closer to me|பக்கத்துல|அருகில்|அருகிலுள்ள|பக்கத்தில்|எங்கே இருக்கு|எங்க இருக்கு|கிடைக்குமா|எங்கு உள்ளது|पास में|मेरे पास|नजदीक|नजदीकी|आसपास|कहाँ है|किधर है|daggara|aduthu|kache|hathira|jawal/.test(
      lower
    );

  const nonPlaceWords =
    /^(me|here|us|that|closest|nearest|place|places|area|town|city|college|hospital|station|skills|skill|free|course|training|ticket|tickets|train|movie|cinema|theatre|biriyani|whatsapp|bill|certificate|certificates|scholarship|scholarships|job|jobs|work|learning|learn|gov|government|online|website|portal|service|services|scheme|schemes|guide|help|how|what|when|where|which|why|can|could|would|should|do|does|did|எனக்கு|என்|எங்களுக்கு|நான்|நமக்கு|எங்க|அங்கு|அந்த|இங்கே|मेरे|मुझे|हमे|हमारा|यहाँ|वहाँ|మనకు|నాకు|ನನಗೆ|ಎನಗೆ|എനിക്ക്)$/i;

  const areaMatch =
    lower.match(/\b(?:near|in|around|at)\s+([a-zA-Z]+)(?:\s+area|\s+city|\s+town)?/i) ||
    lower.match(/([a-zA-Z\u0B80-\u0BFF\u0900-\u097F]+)\s*(?:அருகில்|பக்கத்துல|பக்கத்தில்|இல்|के पास|में)/i);

  let targetArea: string | undefined;
  if (areaMatch && !nonPlaceWords.test(areaMatch[1].trim())) {
    targetArea = areaMatch[1].trim();
  }

  const hasFindPlacesVerb =
    /find|search|nearest|locate|where is|where can i find|show me|எங்கே|தேடு|கண்டுபிடி|காட்டு|ढूंढो|कहाँ है|किधर है|ఎక్కడ|ಎಲ್ಲಿ/.test(
      lower
    );

  // If none of these match, not a location query
  if (!hasNearMeIndicator && !targetArea && !hasFindPlacesVerb) {
    return {
      isLocationQuery: false,
      category: '',
      categoryLabel: '',
      localizedCategory: {},
      isNearMe: false,
    };
  }

  // D. Extract & Normalize Category (Supports any place dynamically!)
  let category = 'places';
  let categoryLabel = 'Places';
  let localizedCategory: Record<string, string> = {
    en: 'Places',
    ta: 'இடங்கள்',
    hi: 'स्थान',
    te: 'ప్రదేశాలు',
    kn: 'ಸ್ಥಳಗಳು',
    mr: 'ठिकाणे',
  };

  // 1. Hospitals / Health
  if (
    /hospital|clinic|doctor|dispensary|மருத்துவமனை|மருத்துவ|ஆஸ்பத்திரி|டாக்டர்|அரசு மருத்துவமனை|அரசு|अस्पताल|दवाखाना|ஹாஸ்பிட்டல்|ஆசுபத்திரி|ఆసుపత్రి|ಆಸ್ಪತ್ರೆ|ಆಶുപത്രി/.test(
      lower
    )
  ) {
    const isGov = /government|அரசு|सरकारी|ప్రభుత్వ/.test(lower);
    category = isGov ? 'government hospital' : 'hospital';
    categoryLabel = isGov ? 'Government Hospitals' : 'Hospitals';
    localizedCategory = {
      en: isGov ? 'Government Hospitals' : 'Hospitals',
      ta: isGov ? 'அரசு மருத்துவமனைகள்' : 'மருத்துவமனைகள்',
      hi: isGov ? 'सरकारी अस्पताल' : 'अस्पताल',
      te: isGov ? 'ప్రభుత్వ ஆసుపత్రులు' : 'ఆసుపత్రులు',
      kn: isGov ? 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು' : 'ಆಸ್ಪತ್ರೆಗಳು',
      mr: isGov ? 'सरकारी रुग्णालय' : 'रुग्णालय',
    };
  }
  // 2. Colleges / Education
  else if (
    /college|university|campus|polytechnic|கல்லூரி|பல்கலைக்கழகம்|படிப்பு|कॉलेज|महाविद्यालय|కళాశాల|ಕಾಲೇಜು|കോളേജ്/.test(
      lower
    )
  ) {
    const isEng = /engineering|பொறியியல்|इंजीनियरिंग|ఇంజనీరింగ్/.test(lower);
    category = isEng ? 'engineering college' : 'college';
    categoryLabel = isEng ? 'Engineering Colleges' : 'Colleges';
    localizedCategory = {
      en: isEng ? 'Engineering Colleges' : 'Colleges',
      ta: isEng ? 'பொறியியல் கல்லூரிகள்' : 'கல்லூரிகள்',
      hi: isEng ? 'इंजीनियरिंग कॉलेज' : 'कॉलेज',
      te: isEng ? 'ఇంజనీరింగ్ కళాశాలలు' : 'కళాశాలలు',
      kn: isEng ? 'ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜುಗಳು' : 'ಕಾಲೇಜುಗಳು',
      mr: isEng ? 'अभियांत्रिकी महाविद्यालय' : 'महाविद्यालय',
    };
  }
  // 3. Pharmacy / Chemist
  else if (
    /pharmacy|chemist|medical store|medical shop|medicine|மருந்தகம்|மருந்து கடை|மெடிக்கல்|மருந்துக்கடை|दवा की दुकान|फार्मेसी|मल्टीस्पेशियलिटी|మందుల షాపు|ಔಷಧಾಲಯ|മെഡിക്കൽ/.test(
      lower
    )
  ) {
    category = 'pharmacy';
    categoryLabel = 'Pharmacies';
    localizedCategory = {
      en: 'Pharmacies',
      ta: 'மருந்தகங்கள்',
      hi: 'फार्मेसी / मेडिकल स्टोर',
      te: 'మందుల దుకాణాలు',
      kn: 'ಔಷಧ ಅಂಗಡಿಗಳು',
      mr: 'औषधांची दुकाने',
    };
  }
  // 4. ATMs & Banks
  else if (/atm|bank|cash machine|cash|ஏடிஎம்|வங்கி|एटीएम|बैंक|ఏటీఎం|ಬ್ಯಾಂಕ್/.test(lower)) {
    category = /atm|ஏடிஎம்|एटीएम|ఏటీఎం/.test(lower) ? 'atm' : 'bank';
    categoryLabel = category === 'atm' ? 'ATMs' : 'Banks';
    localizedCategory = {
      en: category === 'atm' ? 'ATMs' : 'Banks',
      ta: category === 'atm' ? 'ஏடிஎம் மையங்கள்' : 'வங்கிகள்',
      hi: category === 'atm' ? 'एटीएम (ATM)' : 'बैंक',
      te: category === 'atm' ? 'ఏటీఎంలు' : 'బ్యాంకులు',
      kn: category === 'atm' ? 'ಎಟಿಎಂಗಳು' : 'ಬ್ಯಾಂಕುಗಳು',
      mr: category === 'atm' ? 'एटीएम' : 'बँका',
    };
  }
  // 5. Bus Stops / Depots
  else if (
    /bus stop|bus stand|bus depot|பேருந்து நிறுத்தம்|பஸ் ஸ்டாண்ட்|பேருந்து நிலையம்|बस स्टॉप|बस स्टैंड|బస్ స్టాప్|ಬಸ್ ನಿಲ್ದಾಣ/.test(
      lower
    )
  ) {
    category = 'bus stop';
    categoryLabel = 'Bus Stops';
    localizedCategory = {
      en: 'Bus Stops',
      ta: 'பேருந்து நிறுத்தங்கள்',
      hi: 'बस स्टॉप / स्टैंड',
      te: 'బస్ స్టాప్‌లు',
      kn: 'ಬಸ್ ನಿಲ್ದಾಣಗಳು',
      mr: 'बस थांबे',
    };
  }
  // 6. Railway Stations
  else if (
    /railway station|train station|ரயில் நிலையம்|ரயில்வே ஸ்டேஷன்|रेलवे स्टेशन|రైల్వే స్టేషన్|ರೈಲು ನಿಲ್ದಾಣ/.test(
      lower
    )
  ) {
    category = 'railway station';
    categoryLabel = 'Railway Stations';
    localizedCategory = {
      en: 'Railway Stations',
      ta: 'ரயில் நிலையங்கள்',
      hi: 'रेलवे स्टेशन',
      te: 'రైల్వే స్టేషన్లు',
      kn: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣಗಳು',
      mr: 'रेल्वे स्थानके',
    };
  }
  // 7. Bakery / Cakes
  else if (/bakery|bakes|cake shop|cake|ரொட்டி கடை|பேக்கரி|बेकरी|బేకరీ/.test(lower)) {
    category = 'bakery';
    categoryLabel = 'Bakeries';
    localizedCategory = {
      en: 'Bakeries',
      ta: 'பேக்கரிகள்',
      hi: 'बेकरी',
      te: 'బేకరీలు',
      kn: 'ಬೇಕರಿಗಳು',
      mr: 'बेकरी',
    };
  }
  // 8. Restaurants / Food / Dining
  else if (
    /restaurant|hotel|food|eating|dining|mess|உணவகம்|ஹோட்டல்|சாப்பாடு|உணவு|होटल|रेस्टोरेंट|भोजनालय|ढाबा|రెస్టారెంట్|ಹೋಟೆಲ್/.test(
      lower
    )
  ) {
    category = 'restaurant';
    categoryLabel = 'Restaurants';
    localizedCategory = {
      en: 'Restaurants',
      ta: 'உணவகங்கள்',
      hi: 'रेस्टोरेंट / भोजनालय',
      te: 'రెస్టారెంట్లు',
      kn: 'ಉಪಹಾರ ಗೃಹಗಳು',
      mr: 'उपहारगृहे',
    };
  }
  // 9. Police Station
  else if (
    /police station|police outpost|police|cop|காவல் நிலையம்|போலீஸ்|காவல்துறை|पुलिस स्टेशन|थाना|పోలీస్ స్టేషన్|ಪೊಲೀಸ್ ಠಾಣೆ/.test(
      lower
    )
  ) {
    category = 'police station';
    categoryLabel = 'Police Stations';
    localizedCategory = {
      en: 'Police Stations',
      ta: 'காவல் நிலையங்கள்',
      hi: 'पुलिस स्टेशन / थाना',
      te: 'పోలీస్ స్టేషన్లు',
      kn: 'ಪೊಲೀಸ್ ಠಾಣೆಗಳು',
      mr: 'पोलीस ठाणी',
    };
  }
  // 10. Dynamic Open-Ended Place Categories (e.g. bakery, temple, park, petrol bunk, post office, library)
  else {
    const dynMatch =
      lower.match(/(?:find|search|nearest|locate|where is)\s+([a-zA-Z\s]+?)\s+(?:near|nearby|in|around)/) ||
      lower.match(/nearest\s+([a-zA-Z\s]+)/) ||
      lower.match(/([a-zA-Z\u0B80-\u0BFF\u0900-\u097F]+)\s+(?:near me|nearby|பக்கத்துல|அருகில்|இல்)/);

    if (dynMatch && dynMatch[1]) {
      const extracted = dynMatch[1].replace(/^(a|an|the)\s+/i, '').trim();
      if (!nonPlaceWords.test(extracted)) {
        category = extracted.toLowerCase();
        categoryLabel = extracted.charAt(0).toUpperCase() + extracted.slice(1);
        localizedCategory = {
          en: categoryLabel,
          ta: categoryLabel,
          hi: categoryLabel,
        };
      }
    }
  }

  // If still generic 'places' with no targetArea and no hasNearMeIndicator, it is NOT a location query
  if (category === 'places' && !targetArea && !hasNearMeIndicator) {
    return {
      isLocationQuery: false,
      category: '',
      categoryLabel: '',
      localizedCategory: {},
      isNearMe: false,
    };
  }

  const isNearMe =
    !targetArea ||
    /near me|nearby|around me|close to me|பக்கத்துல|அருகில்|என் அருகில்|मेरे पास|नजदीक/.test(lower);

  return {
    isLocationQuery: true,
    category,
    categoryLabel,
    localizedCategory,
    targetArea,
    isNearMe,
  };
}

// 5. Real Places Search via OpenStreetMap Nominatim
export async function searchRealPlaces(params: {
  category: string;
  targetArea?: string;
  userCoords?: { latitude: number; longitude: number };
  limit?: number;
}): Promise<NearbyPlace[]> {
  const { category, targetArea, userCoords, limit = 5 } = params;

  let query = '';
  if (targetArea && targetArea.trim().length > 0) {
    query = `${category} in ${targetArea.trim()}`;
  } else if (userCoords) {
    query = `${category}`;
  } else {
    query = category;
  }

  // Construct Nominatim search URL
  let url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&limit=${limit * 2}&q=${encodeURIComponent(query)}`;

  // If userCoords provided and no explicit targetArea, bound or bias by viewbox around user (approx 8km radius)
  if (userCoords && (!targetArea || targetArea === 'me')) {
    const d = 0.08; // ~8km
    const minLon = userCoords.longitude - d;
    const maxLon = userCoords.longitude + d;
    const minLat = userCoords.latitude - d;
    const maxLat = userCoords.latitude + d;
    url += `&viewbox=${minLon},${maxLat},${maxLon},${minLat}&bounded=0`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'HARSHU-Digital-Companion/1.0 (Digital Assistance for Women)',
      },
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      // Fallback: If 0 results and targetArea was given, try simpler query e.g. "category targetArea"
      if (targetArea) {
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&limit=${limit}&q=${encodeURIComponent(`${category} ${targetArea}`)}`;
        const fbRes = await fetch(fallbackUrl, {
          headers: { 'User-Agent': 'HARSHU-Digital-Companion/1.0' },
        });
        const fbData = await fbRes.json();
        if (Array.isArray(fbData) && fbData.length > 0) {
          return mapOsmToNearbyPlaces(fbData, category, userCoords, limit);
        }
      }
      return [];
    }

    return mapOsmToNearbyPlaces(data, category, userCoords, limit);
  } catch (err) {
    console.warn('Location search error:', err);
    return [];
  }
}

function mapOsmToNearbyPlaces(
  osmItems: any[],
  category: string,
  userCoords?: { latitude: number; longitude: number },
  limit = 5
): NearbyPlace[] {
  const places: NearbyPlace[] = [];

  for (const item of osmItems) {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (isNaN(lat) || isNaN(lon)) continue;

    // Clean real place name
    const rawName = item.name || item.display_name.split(',')[0].trim();
    // Clean formatted address
    const fullAddress = item.display_name || '';

    let distanceKm: number | undefined;
    if (userCoords) {
      distanceKm = calculateDistanceKm(userCoords.latitude, userCoords.longitude, lat, lon);
    }

    const tags = item.extratags || {};
    const phone = tags.phone || tags['contact:phone'] || undefined;
    const website = tags.website || tags['contact:website'] || undefined;
    const openingHours = tags.opening_hours || undefined;

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${rawName} ${fullAddress}`)}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rawName} ${fullAddress}`)}`;

    places.push({
      id: `place-${item.osm_id || Math.random().toString(36).substring(7)}`,
      name: rawName,
      category,
      address: fullAddress,
      distanceKm,
      latitude: lat,
      longitude: lon,
      openNow: openingHours ? openingHours.includes('24/7') : null,
      phone,
      website,
      directionsUrl,
      mapUrl,
    });
  }

  // Sort by distance if userCoords available
  if (userCoords) {
    places.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  return places.slice(0, limit);
}

// 6. Generate Direct Answer Text
export function generateLocationDirectAnswer(
  categoryName: string,
  places: NearbyPlace[],
  targetArea?: string,
  lang: Language = 'en',
  isNearMe = true
): string {
  const count = places.length;
  const closest = places[0];

  if (count === 0) {
    const locText = targetArea ? `"${targetArea}"` : '';
    switch (lang) {
      case 'ta':
        return `மன்னிக்கவும், ${locText} பகுதியில் தகுதியான ${categoryName} எதுவும் தற்போது கிடைக்கவில்லை. அருகிலுள்ள வேறு பகுதியையோ அல்லது 10 கி.மீ சுற்றளவிலோ தேடவா?`;
      case 'hi':
        return `क्षमा करें, ${locText} के पास कोई उपयुक्त ${categoryName} नहीं मिल सका। क्या आप किसी अन्य क्षेत्र में खोजना चाहती हैं?`;
      default:
        return `I couldn't find a suitable ${categoryName} ${locText ? `in ${locText}` : 'nearby'}. Would you like to search a wider area or choose another location?`;
    }
  }

  const distText = closest?.distanceKm ? ` (${closest.distanceKm} km)` : '';

  switch (lang) {
    case 'ta':
      return isNearMe
        ? `உங்களுக்கு அருகில் ${count} ${categoryName} கிடைத்துள்ளன! மிக அருகில் இருப்பது "${closest.name}"${distText}. கீழே உள்ள வழிகாட்டல் மூலம் எளிதாக செல்லலாம்.`
        : `"${targetArea}" பகுதியில் ${count} ${categoryName} கிடைத்துள்ளன. மிக அருகில் இருப்பது "${closest.name}". வரைபடம் மற்றும் விவரங்கள் கீழே உள்ளன.`;
    case 'hi':
      return isNearMe
        ? `आपके पास ${count} ${categoryName} मिले हैं! सबसे नजदीक "${closest.name}"${distText} है। नीचे दिए गए बटन से आप सीधा रास्ता और विवरण देख सकती हैं।`
        : `"${targetArea}" में ${count} ${categoryName} उपलब्ध हैं। सबसे मुख्य "${closest.name}" है।`;
    case 'te':
      return `మీకు సమీపంలో ${count} ${categoryName} కనుగొనబడ్డాయి. అత్యంత సమీపంలో "${closest.name}" ఉంది.`;
    case 'kn':
      return `ನಿಮ್ಮ ಹತ್ತಿರ ${count} ${categoryName} ಕಂಡುಬಂದಿವೆ. ಅತ್ಯಂತ ಸಮೀಪದಲ್ಲಿರುವುದು "${closest.name}".`;
    case 'mr':
      return `तुमच्या जवळ ${count} ${categoryName} उपलब्ध आहेत. सर्वात जवळचे "${closest.name}" आहे.`;
    default:
      return isNearMe
        ? `I found ${count} ${categoryName} near you! The closest is "${closest.name}"${distText}. You can tap Directions for live Google Maps navigation.`
        : `I found ${count} ${categoryName} in ${targetArea}. The primary one is "${closest.name}". Details and directions are listed below.`;
  }
}

// 7. Conversational Location Processor
import { Resource, IntentResult, ChatMessage } from '../types/index';
import { SUPPORTED_LANGUAGES } from './speech';

let activeLocationContext: LocationData | null = null;

export function getActiveLocationContext(): LocationData | null {
  return activeLocationContext;
}

export function setActiveLocationContext(ctx: LocationData | null): void {
  activeLocationContext = ctx;
}

export async function processLocationQuery(
  rawInput: string,
  preferredLanguage: Language,
  conversationHistory: ChatMessage[] = []
): Promise<IntentResult | null> {
  const trimmed = rawInput.trim();
  const locIntent = detectLocationIntent(trimmed);
  if (!locIntent.isLocationQuery) return null;

  const detectedLang = preferredLanguage;
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === detectedLang);
  const langName = langMeta ? `${langMeta.nativeLabel} (${langMeta.label})` : detectedLang;

  // 1. Follow-up: "Which one is closest?"
  if (locIntent.isFollowUp === 'closest') {
    if (!activeLocationContext || activeLocationContext.places.length === 0) {
      const msg =
        detectedLang === 'ta'
          ? 'எந்த இடத்தை தேட விரும்புகிறீர்கள் என்பதை கூறுங்கள் (எ.கா: "அருகில் உள்ள மருத்துவமனைகள்").'
          : detectedLang === 'hi'
          ? 'कृपया पहले बताएं कि आप कौन सा स्थान खोजना चाहती हैं (जैसे "पास के अस्पताल")।'
          : 'Please tell me what place you are looking for first (e.g. "Find hospitals near me").';

      return {
        category: 'location',
        taskType: 'location',
        rawInput: trimmed,
        recognizedText: trimmed,
        detectedLanguage: detectedLang,
        detectedLanguageName: langName,
        interpretedMeaning: 'Asking which place is closest',
        directAnswer: msg,
        summaryByLanguage: { [detectedLang]: msg, en: msg },
        schemeId: 'location-no-context',
        mode: 'direct_answer',
      };
    }

    const closest = activeLocationContext.places[0];
    activeLocationContext.selectedPlace = closest;
    activeLocationContext.isFollowUp = 'closest';

    const distInfo = closest.distanceKm ? ` (${closest.distanceKm} km)` : '';
    const answer =
      detectedLang === 'ta'
        ? `"${closest.name}" உங்களுக்கு மிகவும் அருகில் உள்ளது${distInfo}! முகவரி: ${closest.address}. கீழே உள்ள பொத்தானை தட்டி வரைபடத்தில் வழியை பார்க்கலாம்.`
        : detectedLang === 'hi'
        ? `"${closest.name}" आपके सबसे पास है${distInfo}! पता: ${closest.address}। नीचे दिए गए बटन से आप सीधा रास्ता देख सकती हैं।`
        : `"${closest.name}" is the closest to you${distInfo}! Address: ${closest.address}. You can tap Directions below to view the route on Google Maps.`;

    const meaning =
      detectedLang === 'ta'
        ? `மிக அருகில் உள்ள இடம் எது என கேட்கிறீர்கள் (${closest.name})`
        : `Asking which place is closest (${closest.name})`;

    const resource = buildLocationResource(activeLocationContext, answer, meaning, detectedLang);

    return {
      category: 'location',
      taskType: 'location',
      rawInput: trimmed,
      recognizedText: trimmed,
      detectedLanguage: detectedLang,
      detectedLanguageName: langName,
      interpretedMeaning: meaning,
      directAnswer: answer,
      summaryByLanguage: { [detectedLang]: meaning, en: meaning },
      schemeId: resource.id,
      discoveredResource: resource,
      mode: 'direct_answer',
      locationData: activeLocationContext,
      primaryActionLabel: {
        en: 'Open Live Directions ↗',
        ta: 'நேரடி வழியை பார்க்க ↗',
        hi: 'दिशा-निर्देश देखें ↗',
      },
      followupSuggestions: {
        en: ['How do I go there?', `Find a pharmacy near ${closest.name}`],
        ta: ['அங்க எப்படி போகணும்?', 'பக்கத்தில் உள்ள மருந்தகம்'],
        hi: ['वहां कैसे जाएं?', 'पास में फार्मेसी'],
      },
    };
  }

  // 2. Follow-up: "How do I go there?"
  if (locIntent.isFollowUp === 'directions') {
    const target = activeLocationContext?.selectedPlace || activeLocationContext?.places[0];
    if (!target) {
      const msg =
        detectedLang === 'ta'
          ? 'எந்த இடத்திற்கு செல்ல வழி வேண்டும் என்பதை குறிப்பிடுங்கள்.'
          : 'Please specify which place you would like directions to.';

      return {
        category: 'location',
        taskType: 'location',
        rawInput: trimmed,
        recognizedText: trimmed,
        detectedLanguage: detectedLang,
        detectedLanguageName: langName,
        interpretedMeaning: 'Asking for directions to a place',
        directAnswer: msg,
        summaryByLanguage: { [detectedLang]: msg, en: msg },
        schemeId: 'location-no-target',
        mode: 'direct_answer',
      };
    }

    if (activeLocationContext) {
      activeLocationContext.isFollowUp = 'directions';
    }

    const answer =
      detectedLang === 'ta'
        ? `"${target.name}" செல்ல கூகுள் மேப்ஸ் நேரடி வழி தயாராக உள்ளது. கீழே உள்ள 'வரைபடத்தில் வழிகாட்டுக (Directions)' பொத்தானை தட்டினால் நடைபாதை அல்லது வாகன வழி உடனடியாக திறக்கும். முகவரி: ${target.address}.`
        : detectedLang === 'hi'
        ? `"${target.name}" जाने के लिए लाइव रास्ता तैयार है। नीचे 'दिशा-निर्देश (Directions)' बटन दबाकर आप तुरंत नेविगेशन शुरू कर सकती हैं। पता: ${target.address}।`
        : `Live Google Maps navigation is ready for "${target.name}". Tap 'Open Live Directions' below to start turn-by-turn walking or driving navigation. Address: ${target.address}.`;

    const meaning =
      detectedLang === 'ta'
        ? `"${target.name}" செல்வதற்கான வழி கேட்கிறீர்கள்`
        : `Asking for directions to "${target.name}"`;

    const resource = buildLocationResource(
      activeLocationContext || {
        queryCategory: target.category,
        places: [target],
        status: 'ready',
        selectedPlace: target,
      },
      answer,
      meaning,
      detectedLang
    );

    return {
      category: 'location',
      taskType: 'location',
      rawInput: trimmed,
      recognizedText: trimmed,
      detectedLanguage: detectedLang,
      detectedLanguageName: langName,
      interpretedMeaning: meaning,
      directAnswer: answer,
      summaryByLanguage: { [detectedLang]: meaning, en: meaning },
      schemeId: resource.id,
      discoveredResource: resource,
      mode: 'direct_answer',
      locationData: activeLocationContext || undefined,
      primaryActionLabel: {
        en: 'Open Live Navigation ↗',
        ta: 'நேரடி வழியை பார்க்க ↗',
        hi: 'नेविगेशन शुरू करें ↗',
      },
    };
  }

  // 3. Follow-up: "Find a pharmacy near that college"
  if (locIntent.isFollowUp === 'nearby_other') {
    const prevPlace = activeLocationContext?.selectedPlace || activeLocationContext?.places[0];
    const newCategory = locIntent.category || 'pharmacy';
    const newCatLabel = locIntent.categoryLabel || 'Pharmacy';

    let searchArea = activeLocationContext?.targetArea;
    if (prevPlace?.address) {
      const parts = prevPlace.address.split(',');
      if (parts.length >= 3) {
        searchArea = parts[parts.length - 4]?.trim() || parts[1]?.trim() || searchArea;
      }
    }

    const places = await searchRealPlaces({
      category: newCategory,
      targetArea: searchArea,
      userCoords:
        prevPlace?.latitude && prevPlace?.longitude
          ? { latitude: prevPlace.latitude, longitude: prevPlace.longitude }
          : getCachedUserCoords() || undefined,
      limit: 5,
    });

    const newLocData: LocationData = {
      queryCategory: newCategory,
      rawCategory: newCatLabel,
      targetArea: searchArea,
      userCoords: getCachedUserCoords() || undefined,
      places,
      status: places.length > 0 ? 'ready' : 'no_results',
      selectedPlace: places[0],
      isFollowUp: 'nearby_other',
    };
    activeLocationContext = newLocData;

    const answer = generateLocationDirectAnswer(
      newCatLabel,
      places,
      prevPlace ? `${prevPlace.name}` : searchArea,
      detectedLang,
      false
    );

    const meaning =
      detectedLang === 'ta'
        ? `${prevPlace?.name || 'அந்த இடம்'} அருகில் ${newCatLabel} அறிய விரும்புகிறீர்கள்`
        : `Looking for ${newCatLabel} near ${prevPlace?.name || 'that place'}`;

    const resource = buildLocationResource(newLocData, answer, meaning, detectedLang);

    return {
      category: 'location',
      taskType: 'location',
      rawInput: trimmed,
      recognizedText: trimmed,
      detectedLanguage: detectedLang,
      detectedLanguageName: langName,
      interpretedMeaning: meaning,
      directAnswer: answer,
      summaryByLanguage: { [detectedLang]: meaning, en: meaning },
      schemeId: resource.id,
      discoveredResource: resource,
      mode: 'direct_answer',
      locationData: newLocData,
      primaryActionLabel: {
        en: 'Open in Google Maps ↗',
        ta: 'கூகுள் மேப்ஸில் பார்க்க ↗',
        hi: 'गूगल मैप्स में देखें ↗',
      },
    };
  }

  // 4. Primary Request (e.g. "Find colleges near Avadi", "Find hospitals near me", "Nearest pharmacy?")
  const targetArea = locIntent.targetArea;
  const isNearMe = locIntent.isNearMe;
  const userCoords = getCachedUserCoords();

  // If "near me" but no userCoords yet and no targetArea specified:
  if (isNearMe && !targetArea && !userCoords) {
    const permLocData: LocationData = {
      queryCategory: locIntent.category,
      rawCategory: locIntent.categoryLabel,
      places: [],
      status: 'needs_location_permission',
    };
    activeLocationContext = permLocData;

    const permMsg =
      detectedLang === 'ta'
        ? `உங்களுக்கு அருகிலுள்ள ${locIntent.localizedCategory.ta || locIntent.categoryLabel} கண்டறிய உங்கள் இருப்பிட அனுமதி தேவைப்படுகிறது. நீங்கள் அனுமதி வழங்கலாம் அல்லது உங்கள் ஊரின் பெயரை கூறலாம் (எ.கா: "ஆவடி அருகில்").`
        : detectedLang === 'hi'
        ? `आपके नजदीकी ${locIntent.localizedCategory.hi || locIntent.categoryLabel} खोजने के लिए मुझे आपकी लोकेशन चाहिए। आप लोकेशन की अनुमति दे सकती हैं या अपने क्षेत्र का नाम बता सकती हैं।`
        : `I need your location to find ${locIntent.categoryLabel} near you. You can allow location access or tell me your area (e.g., 'Find ${locIntent.category} in Avadi').`;

    const meaning =
      detectedLang === 'ta'
        ? `உங்களுக்கு அருகில் உள்ள ${locIntent.localizedCategory.ta || locIntent.categoryLabel} தேடுகிறீர்கள்`
        : `Looking for ${locIntent.categoryLabel} near you`;

    const resource = buildLocationResource(permLocData, permMsg, meaning, detectedLang);

    return {
      category: 'location',
      taskType: 'location',
      rawInput: trimmed,
      recognizedText: trimmed,
      detectedLanguage: detectedLang,
      detectedLanguageName: langName,
      interpretedMeaning: meaning,
      directAnswer: permMsg,
      summaryByLanguage: { [detectedLang]: meaning, en: meaning },
      schemeId: resource.id,
      discoveredResource: resource,
      mode: 'direct_answer',
      locationData: permLocData,
      primaryActionLabel: {
        en: 'Allow Location Access 📍',
        ta: 'இருப்பிட அனுமதி வழங்க 📍',
        hi: 'लोकेशन की अनुमति दें 📍',
      },
    };
  }

  // Execute real places search
  const places = await searchRealPlaces({
    category: locIntent.category,
    targetArea,
    userCoords: userCoords || undefined,
    limit: 5,
  });

  const locData: LocationData = {
    queryCategory: locIntent.category,
    rawCategory: locIntent.categoryLabel,
    targetArea,
    userCoords: userCoords || undefined,
    places,
    status: places.length > 0 ? 'ready' : 'no_results',
    selectedPlace: places[0],
  };
  activeLocationContext = locData;

  const directAnswer = generateLocationDirectAnswer(
    locIntent.localizedCategory[detectedLang] || locIntent.categoryLabel,
    places,
    targetArea,
    detectedLang,
    isNearMe
  );

  const meaning =
    detectedLang === 'ta'
      ? `${targetArea ? `${targetArea} பகுதியில்` : 'அருகில் உள்ள'} ${locIntent.localizedCategory.ta || locIntent.categoryLabel} அறிய விரும்புகிறீர்கள்`
      : `Looking for ${locIntent.categoryLabel} ${targetArea ? `in ${targetArea}` : 'near you'}`;

  const resource = buildLocationResource(locData, directAnswer, meaning, detectedLang);

  return {
    category: 'location',
    taskType: 'location',
    rawInput: trimmed,
    recognizedText: trimmed,
    detectedLanguage: detectedLang,
    detectedLanguageName: langName,
    interpretedMeaning: meaning,
    directAnswer,
    summaryByLanguage: { [detectedLang]: meaning, en: meaning },
    schemeId: resource.id,
    discoveredResource: resource,
    mode: 'direct_answer',
    locationData: locData,
    primaryActionLabel: {
      en: 'Open in Google Maps ↗',
      ta: 'கூகுள் மேப்ஸில் பார்க்க ↗',
      hi: 'गूगल मैप्स में देखें ↗',
    },
    followupSuggestions: {
      en: ['Which one is closest?', 'How do I go there?', 'Find a pharmacy nearby'],
      ta: ['எது ரொம்ப பக்கத்துல இருக்கு?', 'அங்க எப்படி போகணும்?', 'அருகில் உள்ள மருந்தகம்'],
      hi: ['सबसे पास कौन सा है?', 'वहां कैसे जाएं?', 'पास में फार्मेसी'],
    },
  };
}

function buildLocationResource(
  locData: LocationData,
  answer: string,
  meaning: string,
  lang: Language
): Resource {
  const cat = locData.rawCategory || locData.queryCategory || 'Places';
  const targetArea = locData.targetArea;
  const closest = locData.places[0];

  return {
    id: `location-${locData.queryCategory || 'places'}-${Date.now()}`,
    title: {
      en: `${cat} ${targetArea ? `in ${targetArea}` : 'Near You'}`,
      ta: `${cat} ${targetArea ? `(${targetArea})` : '(அருகில்)'}`,
      hi: `${cat} ${targetArea ? `(${targetArea})` : '(आसपास)'}`,
    },
    department: {
      en: 'Real Maps & Navigation Guide',
      ta: 'நேரடி வரைபடம் & வழிகாட்டி',
      hi: 'वास्तविक स्थान व दिशा-निर्देश',
    },
    whatItHelps: {
      en: answer,
      ta: answer,
      hi: answer,
    },
    whoItIsFor: {
      en: 'Anyone needing verified nearby places and directions',
      ta: 'அருகிலுள்ள இடங்கள் மற்றும் வழிகளை அறிய விரும்பும் அனைவரும்',
      hi: 'सभी नागरिक',
    },
    eligibility: { en: [], ta: [], hi: [] },
    documents: { en: [], ta: [], hi: [] },
    officialSource: 'OpenStreetMap & Google Maps',
    officialSourceName: 'Verified Open Maps & Navigation',
    officialUrl: closest?.directionsUrl || 'https://maps.google.com',
    sourceType: 'official',
    verified: true,
    category: 'location',
    taskType: 'location',
    mode: 'direct_answer',
    locationData: locData,
    primaryActionLabel: {
      en: 'Open in Google Maps ↗',
      ta: 'கூகுள் மேப்ஸில் பார்க்க ↗',
      hi: 'गूगल मैप्स में देखें ↗',
    },
    primaryActionType: 'open_map',
    steps: {
      en: [
        {
          stepNumber: 1,
          totalSteps: 2,
          title: 'Review Verified Options',
          instruction: 'Check the real places listed below with exact distance and address.',
          simplifiedInstruction: 'Pick the location closest to you.',
          example: closest?.name || 'Closest place',
          actionType: 'select',
          badge: 'Step 1 of 2',
        },
        {
          stepNumber: 2,
          totalSteps: 2,
          title: 'Open Navigation',
          instruction:
            'Tap the Directions button on any place card to launch Google Maps turn-by-turn navigation.',
          simplifiedInstruction: 'Follow the live route on your phone.',
          example: 'Walking or driving route',
          actionType: 'external_handoff',
          badge: 'Step 2 of 2',
        },
      ],
      ta: [
        {
          stepNumber: 1,
          totalSteps: 2,
          title: 'இடத்தை தேர்வு செய்க',
          instruction: 'கீழே கொடுக்கப்பட்டுள்ள இடங்களின் தூரம் மற்றும் முகவரியை பார்க்கவும்.',
          simplifiedInstruction: 'உங்களுக்கு வசதியான இடத்தை தேர்வு செய்யவும்.',
          example: closest?.name || 'மிக அருகிலுள்ள இடம்',
          actionType: 'select',
          badge: 'படி 1 / 2',
        },
        {
          stepNumber: 2,
          totalSteps: 2,
          title: 'வழிகாட்டுதலை தொடங்குங்கள்',
          instruction:
            'வரைபடத்தில் பார்க்க (Directions) பொத்தானை தட்டினால் கூகுள் மேப்ஸ் நேரடி வழியை காட்டும்.',
          simplifiedInstruction: 'போனில் வழியை பார்த்து எளிதாக செல்லலாம்.',
          example: 'நடப்பது அல்லது வண்டி வழி',
          actionType: 'external_handoff',
          badge: 'படி 2 / 2',
        },
      ],
    },
  };
}
