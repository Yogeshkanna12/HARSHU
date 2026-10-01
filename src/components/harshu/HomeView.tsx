import React from 'react';
import { Language, IntentCategory } from '../../types';
import { UI_TRANSLATIONS, getT } from '../../utils/translations';
import {
  Mic,
  Keyboard,
  Volume2,
  Bus,
  Train,
  Navigation,
  Film,
  UtensilsCrossed,
  Smartphone,
  CreditCard,
  GraduationCap,
  Sparkles,
  MapPin,
  Landmark,
  Target,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { speakText } from '../../utils/speech';
import { ESSENTIAL_SERVICES, EssentialServiceItem } from '../../data/essentialServices';

interface HomeViewProps {
  currentLanguage: Language;
  onStartVoice: () => void;
  onStartText: () => void;
  onSelectCategory: (category: IntentCategory, promptText?: string) => void;
  onStartEssentialService?: (service: EssentialServiceItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLanguage,
  onStartVoice,
  onStartText,
  onSelectCategory,
  onStartEssentialService,
}) => {
  const greeting = getT(UI_TRANSLATIONS.welcomeGreeting, currentLanguage);
  const question = getT(UI_TRANSLATIONS.whatDoYouNeed, currentLanguage);

  const handleListenGreeting = () => {
    speakText(`${greeting} ${question}`, currentLanguage);
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'services':
        return Landmark;
      case 'schemes':
        return Target;
      case 'skills':
        return BookOpen;
      default:
        return Landmark;
    }
  };

  // Essential service card visual config per id
  const getServiceCardStyle = (id: string) => {
    switch (id) {
      case 'services':
        return {
          gradient: 'bg-gradient-to-br from-emerald-50 via-white to-harshu-50',
          border: 'border-emerald-200 hover:border-emerald-400',
          iconGlow: 'icon-glow-green',
          footerText: 'text-emerald-800',
          arrowColor: 'text-emerald-600',
          dotColor: 'bg-emerald-500',
        };
      case 'schemes':
        return {
          gradient: 'bg-gradient-to-br from-harshu-50 via-white to-saffron-50',
          border: 'border-harshu-200 hover:border-harshu-400',
          iconGlow: 'icon-glow-green',
          footerText: 'text-harshu-800',
          arrowColor: 'text-harshu-600',
          dotColor: 'bg-harshu-500',
        };
      case 'skills':
        return {
          gradient: 'bg-gradient-to-br from-teal-50 via-white to-emerald-50',
          border: 'border-teal-200 hover:border-teal-400',
          iconGlow: 'icon-glow-teal',
          footerText: 'text-teal-800',
          arrowColor: 'text-teal-600',
          dotColor: 'bg-teal-500',
        };
      default:
        return {
          gradient: 'bg-white',
          border: 'border-earth-200',
          iconGlow: '',
          footerText: 'text-earth-700',
          arrowColor: 'text-earth-500',
          dotColor: 'bg-earth-400',
        };
    }
  };

  // Inspiring open-ended question pills
  const samplePrompts = [
    {
      icon: '🏥',
      text: {
        ta: 'எனக்கு அருகில் உள்ள மருத்துவமனைகள் எங்கே?',
        hi: 'मेरे पास अस्पताल कहाँ है?',
        en: 'Find hospitals near me',
        mr: 'माझ्या जवळ रुग्णालय कुठे आहे?',
        te: 'నాకు సమీపంలో ఆసుపత్రి ఎక్కడ ఉంది?',
      },
      category: 'location' as IntentCategory,
    },
    {
      icon: '🎓',
      text: {
        ta: 'ஆவடி அருகில் உள்ள கல்லூரிகள் எவை?',
        hi: 'आवाडी के पास कौन से कॉलेज हैं?',
        en: 'Find colleges near Avadi',
        mr: 'आवाडी जवळ कोणती महाविद्यालये आहेत?',
        te: 'ఆవడి దగ్గర ఏ కాలేజీలు ఉన్నాయి?',
      },
      category: 'location' as IntentCategory,
    },
    {
      icon: '🚌',
      text: {
        ta: 'காஞ்சிபுரத்துக்கு பேருந்து எங்கே கிடைக்கும்?',
        hi: 'कांचीपुरम के लिए बस कहाँ से मिलेगी?',
        en: 'Where can I find a bus to Kanchipuram?',
        mr: 'कांचीपूरमला जाण्यासाठी बस कुठून मिळेल?',
        te: 'కాంచీపురం వెళ్లడానికి బస్సు ఎక్కడ దొరుకుతుంది?',
      },
      category: 'travel' as IntentCategory,
    },
    {
      icon: '🚶',
      text: {
        ta: 'சென்னை சென்ட்ரலில் இருந்து பார்க் ஸ்டேஷன் போவது எப்படி?',
        hi: 'चेन्नई सेंट्रल से चेन्नई पार्क स्टेशन पैदल कैसे जाएं?',
        en: 'How do I go from Chennai Central to Chennai Park station?',
        mr: 'चेन्नई सेंट्रलवरून चेन्नई पार्क स्टेशनला कसे जायचे?',
        te: 'చెన్నై సెంట్రల్ నుండి చెన్నై పార్క్ స్టేషన్‌కు ఎలా వెళ్ళాలి?',
      },
      category: 'navigation' as IntentCategory,
    },
    {
      icon: '🚆',
      text: {
        ta: 'ரயில் டிக்கெட் ஆன்லைனில் புக் செய்வது எப்படி?',
        hi: 'ट्रेन टिकट ऑनलाइन कैसे बुक करें?',
        en: 'How do I book a train ticket?',
        mr: 'रेल्वे तिकीट ऑनलाइन कसे बुक करायचे?',
        te: 'రైలు టికెట్ ఆన్‌లైన్‌లో ఎలా బుక్ చేయాలి?',
      },
      category: 'booking' as IntentCategory,
    },
    {
      icon: '🎬',
      text: {
        ta: 'சினிமா டிக்கெட் ஆன்லைனில் புக் செய்வது எப்படி?',
        hi: 'ऑनलाइन सिनेमा टिकट कैसे बुक करें?',
        en: 'How can I book a cinema ticket online?',
        mr: 'ऑनलाइन सिनेमाचे तिकीट कसे बुक करायचे?',
        te: 'ఆన్‌లైన్‌లో సినిమా టికెట్ ఎలా బుక్ చేయాలి?',
      },
      category: 'booking' as IntentCategory,
    },
    {
      icon: '🍛',
      text: {
        ta: 'சுவையான பிரியாணி செய்வது எப்படி?',
        hi: 'स्वादिष्ट दम बिरयानी कैसे बनाएं?',
        en: 'How to cook delicious biriyani?',
        mr: 'दम बिर्याणी कशी बनवायची?',
        te: 'రుచికరమైన బిర్యానీ ఎలా వండాలి?',
      },
      category: 'cooking' as IntentCategory,
    },
    {
      icon: '📱',
      text: {
        ta: 'வாட்ஸ்அப் கணக்கு தொடங்குவது எப்படி?',
        hi: 'व्हाट्सएप अकाउंट कैसे बनाएं?',
        en: 'How can I create a WhatsApp account?',
        mr: 'व्हॉट्सॲप अकाउंट कसे सुरू करायचे?',
        te: 'వాట్సాప్ ఖాతా ఎలా తెరవాలి?',
      },
      category: 'technology' as IntentCategory,
    },
    {
      icon: '⚡',
      text: {
        ta: 'கரண்ட் பில் ஆன்லைனில் கட்டுவது எப்படி?',
        hi: 'बिजली का बिल ऑनलाइन कैसे भरें?',
        en: 'How do I pay my electricity bill online?',
        mr: 'लाईट बिल ऑनलाइन कसे भरायचे?',
        te: 'కరెంట్ బిల్లు ఆన్‌లైన్‌లో ఎలా కట్టాలి?',
      },
      category: 'payment' as IntentCategory,
    },
    {
      icon: '🎓',
      text: {
        ta: 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை உள்ளதா?',
        hi: 'क्या छात्राओं के लिए सरकारी छात्रवृत्ति है?',
        en: 'Are there any scholarships for students?',
        mr: 'विद्यार्थ्यांसाठी सरकारी शिष्यवृत्ती आहे का?',
        te: 'విద్యార్థులకు ప్రభుత్వ స్కాలర్‌షిప్‌లు ఉన్నాయా?',
      },
      category: 'scholarship' as IntentCategory,
    },
  ];

  // Everyday domains
  const domainCards = [
    {
      category: 'travel' as IntentCategory,
      title: {
        ta: 'பயணம் & பேருந்து வழிகள்',
        hi: 'यात्रा व बस मार्ग',
        en: 'Travel & Bus Routes',
        mr: 'प्रवास व बस मार्ग',
        te: 'ప్రయాణం & బస్సు మార్గాలు',
      },
      subtitle: {
        ta: 'பேருந்து நிலையங்கள், எண்கள் & நேரம்',
        hi: 'बस स्टैंड, नंबर व सही समय',
        en: 'Bus stands, routes & timings',
        mr: 'बस स्थानके व वेळापत्रक',
        te: 'బస్ స్టాండ్లు & వేళలు',
      },
      prompt: 'காஞ்சிபுரத்துக்கு பேருந்து எங்கே கிடைக்கும்?',
      icon: Bus,
      badge: 'CMBT / SETC',
      colorClass: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-950 hover:border-emerald-400',
      iconBg: 'bg-emerald-600 text-white icon-glow-green',
    },
    {
      category: 'navigation' as IntentCategory,
      title: {
        ta: 'உள்ளூர் வழிகள் & மெட்ரோ/ரயில்',
        hi: 'स्थानीय रास्ते व रेलवे/मेट्रो',
        en: 'Walking Routes & Stations',
        mr: 'स्थानिक रस्ते व रेल्वे मार्ग',
        te: 'స్థానిక దారులు & రైలు స్టేషన్లు',
      },
      subtitle: {
        ta: 'ஒரு இடத்திலிருந்து மற்றொரு இடம் செல்ல நடைபாதை',
        hi: 'पैदल सबवे व आसान रास्ते',
        en: 'Subways, walking directions & maps',
        mr: 'पादचारी भुयारी मार्ग व नकाशे',
        te: 'సబ్వే & నడక మార్గాలు',
      },
      prompt: 'சென்னை சென்ட்ரலில் இருந்து பார்க் ஸ்டேஷன் போவது எப்படி?',
      icon: Navigation,
      badge: 'Maps & Walk',
      colorClass: 'bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200 text-teal-950 hover:border-teal-400',
      iconBg: 'bg-teal-600 text-white icon-glow-teal',
    },
    {
      category: 'booking' as IntentCategory,
      title: {
        ta: 'ரயில் டிக்கெட் முன்பதிவு',
        hi: 'ट्रेन टिकट बुकिंग (IRCTC)',
        en: 'Train Ticket Booking (IRCTC)',
        mr: 'रेल्वे तिकीट बुकिंग',
        te: 'రైలు టికెట్ బుకింగ్',
      },
      subtitle: {
        ta: 'வரிசையில் நிற்காமல் ரயில் இருக்கை புக் செய்ய எளிய முறை',
        hi: 'बिना लाइन लगे ट्रेन में सीट और स्लीपर/AC बुक करें',
        en: 'Book train seats & Sleeper/AC without long station queues',
        mr: 'रांगेत उभे न राहता रेल्वे तिकीट बुक करा',
        te: 'క్యూలో నిలబడకుండా రైలు టికెట్ బుక్ చేసుకోండి',
      },
      prompt: 'ரயில் டிக்கெட் ஆன்லைனில் புக் செய்வது எப்படி?',
      icon: Train,
      badge: 'IRCTC / Indian Railways',
      colorClass: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200 text-indigo-950 hover:border-indigo-400',
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      category: 'booking' as IntentCategory,
      title: {
        ta: 'சினிமா டிக்கெட் முன்பதிவு',
        hi: 'सिनेमा टिकट बुकिंग',
        en: 'Cinema & Movie Tickets',
        mr: 'सिनेमा तिकीट बुकिंग',
        te: 'సినిమా టికెట్ బుకింగ్',
      },
      subtitle: {
        ta: 'படம் தேர்வு செய்து இருக்கை புக் செய்யும் எளிய முறை',
        hi: 'फिल्म व सीट चुनने का सीधा तरीका',
        en: 'Pick movie, theatre, showtime and seat safely',
        mr: 'चित्रपट व सीट बुक करा',
        te: 'సీటు ఎంచుకుని బుక్ చేయండి',
      },
      prompt: 'சினிமா டிக்கெட் ஆன்லைனில் புக் செய்வது எப்படி?',
      icon: Film,
      badge: 'BookMyShow',
      colorClass: 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 text-amber-950 hover:border-amber-400',
      iconBg: 'bg-amber-600 text-white icon-glow-saffron',
    },
    {
      category: 'cooking' as IntentCategory,
      title: {
        ta: 'சமையல் குறிப்புகள் & செய்முறை',
        hi: 'स्वादिष्ट रसोई व रेसिपी',
        en: 'Cooking & Traditional Recipes',
        mr: 'स्वयंपाक व स्वादिष्ट रेसिपी',
        te: 'వంటకాలు & తయారీ విధానం',
      },
      subtitle: {
        ta: 'அளவுகள், மசாலா மற்றும் பக்குவமான செய்முறை',
        hi: 'सामग्री, दम देने की विधि व सही माप',
        en: 'Step-by-step cooking companion',
        mr: 'स्टेप-बाय-स्टेप स्वयंपाक मार्गदर्शन',
        te: 'రుచికరమైన వంటల గైడ్',
      },
      prompt: 'சுவையான பிரியாணி செய்வது எப்படி?',
      icon: UtensilsCrossed,
      badge: "Let's Cook 🍳",
      colorClass: 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 text-orange-950 hover:border-orange-400',
      iconBg: 'bg-orange-600 text-white',
    },
    {
      category: 'technology' as IntentCategory,
      title: {
        ta: 'செல்போன் & புதிய ஆப்கள்',
        hi: 'मोबाइल फोन व नई ऐप्स',
        en: 'Phone, WhatsApp & Everyday Tech',
        mr: 'मोबाईल, व्हॉट्सॲप व तंत्रज्ञान',
        te: 'ఫోన్, వాట్సాప్ & యాప్స్',
      },
      subtitle: {
        ta: 'வாட்ஸ்அப், கூகுள் மேப்ஸ் போன்றவற்றை பயமின்றி பழக',
        hi: 'व्हाट्सएप व जरूरी ऐप्स बिना झिझक सीखें',
        en: 'Install and use apps without fear',
        mr: 'ॲप्स सुरू करण्याचे सोपे मार्गदर्शन',
        te: 'యాప్స్ వాడటం నేర్చుకోండి',
      },
      prompt: 'வாட்ஸ்அப் கணக்கு தொடங்குவது எப்படி?',
      icon: Smartphone,
      badge: 'Play Store',
      colorClass: 'bg-gradient-to-br from-sky-50 to-sky-100/50 border-sky-200 text-sky-950 hover:border-sky-400',
      iconBg: 'bg-sky-600 text-white',
    },
    {
      category: 'payment' as IntentCategory,
      title: {
        ta: 'மின் கட்டணம் & ஆன்லைன் பணம்',
        hi: 'बिजली बिल व सुरक्षित भुगतान',
        en: 'Electricity Bill & Safe Payments',
        mr: 'लाईट बिल व सुरक्षित पेमेंट',
        te: 'కరెంట్ బిల్లు & చెల్లింపులు',
      },
      subtitle: {
        ta: 'கட்டண எண் மூலம் கூகுள் பே/போன்பேவில் செலுத்துவது',
        hi: 'कंज्यूमर नंबर द्वारा सुरक्षित भुगतान',
        en: 'Pay bills via UPI safely without losing money',
        mr: 'सुरक्षित ऑनलाइन बिल भरणे',
        te: 'యూపీఐ ద్వారా సురక్షిత చెల్లింపులు',
      },
      prompt: 'கரண்ட் பில் ஆன்லைனில் கட்டுவது எப்படி?',
      icon: CreditCard,
      badge: 'UPI / TANGEDCO',
      colorClass: 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200 text-rose-950 hover:border-rose-400',
      iconBg: 'bg-rose-600 text-white',
    },
    {
      category: 'scholarship' as IntentCategory,
      title: {
        ta: 'அரசு நலத்திட்டங்கள் & கல்வி உதவி',
        hi: 'सरकारी योजनाएं व छात्रवृत्तियां',
        en: 'Government Schemes & Scholarships',
        mr: 'सरकारी योजना व शिष्यवृत्ती',
        te: 'ప్రభుత్వ పథకాలు & స్కాలర్‌షిప్‌లు',
      },
      subtitle: {
        ta: 'புதுமைப் பெண், இலவச தையல் இயந்திரம், மகளிர் உதவி',
        hi: 'मुफ्त सिलाई मशीन, पुधुमै पेन, महिला सम्मान',
        en: 'Verified scholarships, welfare & skill training',
        mr: 'मोफत शिलाई मशीन व आर्थिक मदत',
        te: 'ఉచిత కుట్టు మిషన్ & సంక్షేమం',
      },
      prompt: 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை உள்ளதா?',
      icon: GraduationCap,
      badge: 'Verified .gov.in',
      colorClass: 'bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200 text-violet-950 hover:border-violet-400',
      iconBg: 'bg-violet-600 text-white',
    },
    {
      category: 'location' as IntentCategory,
      title: {
        ta: 'அருகிலுள்ள இடங்கள் & வரைபடம்',
        hi: 'आसपास के स्थान व लाइव मैप्स',
        en: 'Nearby Places & Live Maps',
        mr: 'जवळची ठिकाणे व थेट नकाशे',
        te: 'సమీప ప్రదేశాలు & లైవ్ మ్యాప్స్',
      },
      subtitle: {
        ta: 'மருத்துவமனை, மருந்தகம், ஏடிஎம், கல்லூரி, பேருந்து நிறுத்தம்',
        hi: 'अस्पताल, फार्मेसी, एटीएम, कॉलेज या बस स्टैंड खोजें',
        en: 'Hospitals, pharmacies, colleges, ATMs or stations with distance',
        mr: 'दवाखाने, औषधे, एटीएम किंवा कॉलेज थेट अंतरासह शोधा',
        te: 'ఆసుపత్రులు, మందుల షాపులు, ఏటీఎమ్‌లు మరియు బస్ స్టాండ్లు',
      },
      prompt: 'Find hospitals near me',
      icon: MapPin,
      badge: 'Real Distance & Navigation',
      colorClass: 'bg-gradient-to-br from-emerald-50 to-green-100/50 border-emerald-200 text-emerald-950 hover:border-emerald-400',
      iconBg: 'bg-emerald-600 text-white icon-glow-green',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* ======================================================== */}
      {/* WARM GREETING HERO                                        */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-harshu-900 via-harshu-800 to-harshu-700 px-6 py-8 sm:px-10 sm:py-10 shadow-green">
        {/* Decorative blobs inside hero */}
        <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full bg-saffron-400/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 rounded-full bg-harshu-400/10 blur-2xl" />
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white/5 blur-xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Greeting chip */}
          <div className="welcome-chip inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 text-harshu-100 bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-base">🌿</span>
            <span>{greeting}</span>
            <button
              type="button"
              onClick={handleListenGreeting}
              className="p-1 text-harshu-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Listen aloud"
              aria-label="Listen greeting aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main question */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {question}
          </h1>

          <p className="text-sm sm:text-base text-harshu-200/90 max-w-xl leading-relaxed mb-6">
            {currentLanguage === 'ta'
              ? 'பயணம், சினிமா டிக்கெட், சமையல் குறிப்பு, மின்சார கட்டணம், வாட்ஸ்அப் அல்லது அரசு திட்டங்கள் — எதையும் உங்கள் சொந்த மொழியில் கேளுங்கள்.'
              : currentLanguage === 'hi'
              ? 'यात्रा, सिनेमा टिकट, रसोई रेसिपी, बिजली बिल, व्हाट्सएप या सरकारी योजनाएं — कुछ भी अपनी भाषा में बेझिझक पूछें।'
              : 'Travel, movie tickets, cooking, utility bills, phone apps, or government benefits — ask anything naturally in your own language.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Hero Mic button */}
            <button
              type="button"
              onClick={onStartVoice}
              className="relative group flex items-center gap-3 px-8 py-4 bg-white text-harshu-900 rounded-2xl text-base font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 overflow-hidden"
              aria-label={getT(UI_TRANSLATIONS.startSpeaking, currentLanguage)}
            >
              {/* Shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-saffron-50 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 pointer-events-none" />
              {/* Pulse rings */}
              <span className="relative flex items-center justify-center w-9 h-9">
                <span className="absolute inset-0 rounded-full bg-harshu-200 animate-pulse-ring opacity-40" />
                <span className="absolute inset-0 rounded-full bg-harshu-200 animate-pulse-ring opacity-40 animation-delay-800" />
                <Mic className="w-5 h-5 text-harshu-800 relative z-10" />
              </span>
              <span className="relative z-10">{getT(UI_TRANSLATIONS.startSpeaking, currentLanguage)}</span>
            </button>

            {/* Type instead */}
            <button
              type="button"
              onClick={onStartText}
              className="flex items-center gap-2 px-5 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-sm font-semibold backdrop-blur-sm transition-all"
            >
              <Keyboard className="w-4 h-4 text-harshu-200" />
              <span>{getT(UI_TRANSLATIONS.typeInstead, currentLanguage)}</span>
            </button>
          </div>

          {/* Reassuring microcopy */}
          <p className="mt-4 text-xs text-harshu-300/80 font-medium">
            {currentLanguage === 'ta'
              ? 'தயங்காமல் பேசுங்கள். உங்கள் சொந்த தாய்மொழியை HARSHU புரிந்துகொள்ளும்.'
              : currentLanguage === 'hi'
              ? 'बिना झिझक बोलिए। HARSHU आपकी अपनी भाषा समझती है।'
              : 'Speak freely. HARSHU understands your mother tongue.'}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ESSENTIAL SERVICES HIGHLIGHT (3 Core Pillars)            */}
      {/* ======================================================== */}
      <div className="mb-9">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-extrabold text-harshu-950 tracking-tight flex items-center gap-2">
              <span>
                {currentLanguage === 'ta'
                  ? 'அத்தியாவசிய சேவைகள்'
                  : currentLanguage === 'hi'
                  ? 'आवश्यक सेवाएं'
                  : currentLanguage === 'te'
                  ? 'ముఖ్యమైన సేవలు'
                  : currentLanguage === 'mr'
                  ? 'महत्त्वाच्या सेवा'
                  : 'Essential Services'}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Top Capabilities
              </span>
            </h2>
          </div>
          <span className="text-[11px] text-earth-600">
            {currentLanguage === 'ta'
              ? 'தொடங்க ஏதேனும் ஒரு அட்டையை தட்டவும்'
              : currentLanguage === 'hi'
              ? 'शुरू करने के लिए किसी भी कार्ड को दबाएं'
              : 'Tap any card to start with HARSHU'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ESSENTIAL_SERVICES.map((item) => {
            const Icon = getServiceIcon(item.id);
            const style = getServiceCardStyle(item.id);
            const titleText = item.title[currentLanguage] || item.title.en;
            const descText = item.description[currentLanguage] || item.description.en;
            const badgeText = item.badge[currentLanguage] || item.badge.en;
            const questionText = item.question[currentLanguage] || item.question.en;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onStartEssentialService) {
                    onStartEssentialService(item);
                  } else {
                    onSelectCategory('scholarship', questionText);
                  }
                }}
                className={`essential-card card-premium w-full text-left p-5 sm:p-6 rounded-2xl border-2 flex flex-col justify-between ${style.gradient} ${style.border} shadow-card cursor-pointer`}
              >
                <div>
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{item.iconEmoji}</span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg} ${style.iconGlow} shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-earth-200 text-earth-700 shadow-sm whitespace-nowrap">
                      {badgeText}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-sm sm:text-base text-harshu-950 mb-1.5 leading-snug">
                    {titleText}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-earth-700 leading-relaxed mb-4">
                    {descText}
                  </p>
                </div>

                {/* Card footer */}
                <div className={`pt-3 border-t border-earth-200/60 flex items-center justify-between ${style.footerText}`}>
                  <span className="line-clamp-1 italic text-[11px] opacity-80 font-medium">
                    "{questionText}"
                  </span>
                  <span className={`ml-2 font-bold text-base ${style.arrowColor} group-hover:translate-x-1 transition-transform`}>
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* INSPIRING QUESTION PILLS                                  */}
      {/* ======================================================== */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Sparkles className="w-4 h-4 text-saffron-500" />
          <h2 className="text-xs sm:text-sm font-bold text-harshu-900 uppercase tracking-wide">
            {currentLanguage === 'ta'
              ? 'எதையும் கேளுங்கள் (உதாரணங்கள்):'
              : currentLanguage === 'hi'
              ? 'कुछ भी पूछिए (उदाहरण):'
              : 'Try asking anything (tap to ask):'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => {
            const promptText = getT(p.text, currentLanguage);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectCategory(p.category, promptText)}
                className="sample-pill inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white hover:bg-harshu-50 text-earth-900 text-xs sm:text-sm font-medium border border-earth-200 shadow-sm hover:border-harshu-300 text-left"
              >
                <span className="text-base leading-none">{p.icon}</span>
                <span>{promptText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* EVERYDAY DOMAINS GRID                                     */}
      {/* ======================================================== */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-harshu-400 to-harshu-700" />
          <h2 className="text-sm sm:text-base font-bold text-harshu-900">
            {currentLanguage === 'ta'
              ? 'அல்லது உங்களுக்கு தேவையான துறையை தேர்ந்தெடுக்கலாம்:'
              : currentLanguage === 'hi'
              ? 'या अपनी जरूरत के अनुसार विषय चुनें:'
              : 'Or explore by everyday need:'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {domainCards.map((item, idx) => {
            const Icon = item.icon;
            const titleText = getT(item.title, currentLanguage);
            const subText = getT(item.subtitle, currentLanguage);
            return (
              <button
                key={`${item.category}-${idx}`}
                type="button"
                onClick={() => onSelectCategory(item.category, item.prompt)}
                className={`domain-card card-premium w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${item.colorClass} shadow-card`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${item.iconBg} mt-0.5`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-sm sm:text-base leading-snug">
                      {titleText}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current opacity-70 whitespace-nowrap">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                    {subText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* PHILOSOPHY FOOTER BANNER                                  */}
      {/* ======================================================== */}
      <div className="mt-8 relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-harshu-50 via-white to-saffron-50 border border-harshu-200/60 text-center shadow-sm">
        <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 rounded-full bg-saffron-100/50 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-16 h-16 rounded-full bg-harshu-100/50 blur-xl" />
        <p className="text-xs sm:text-sm font-semibold text-harshu-950 relative z-10">
          {currentLanguage === 'ta'
            ? '💡 "தொழில்நுட்பம் உங்களை அறிய வேண்டும்; நீங்கள் தொழில்நுட்பத்தை அறிய வேண்டியதில்லை."'
            : currentLanguage === 'hi'
            ? '💡 "तकनीक को आपको समझना चाहिए — आपको तकनीक सीखने की मजबूरी नहीं होनी चाहिए।"'
            : '💡 "Technology should adapt to you — you do not need to adapt to technology."'}
        </p>
        <p className="text-[11px] sm:text-xs text-earth-700 mt-1.5 relative z-10">
          {currentLanguage === 'ta'
            ? 'சரியான அரசு இணையதளம், பஸ் வழி, சினிமா புக் செய்வது அல்லது சமையல் — HARSHU பொறுமையாக வழிகாட்டும்.'
            : currentLanguage === 'hi'
            ? 'बस, ट्रेन, फिल्म टिकट, रसोई या सरकारी योजनाएं — HARSHU धैर्य से कदम दर कदम साथ देगा।'
            : 'Bus routes, movie tickets, cooking, or government schemes — HARSHU guides you step by step.'}
        </p>
        {/* Trust badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 relative z-10">
          {[
            { icon: ShieldCheck, label: '100% Safe', color: 'text-harshu-700' },
            { icon: Sparkles, label: '13 Languages', color: 'text-saffron-600' },
          ].map((b) => (
            <div key={b.label} className="inline-flex items-center gap-1 text-[10px] font-semibold text-earth-700">
              <b.icon className={`w-3 h-3 ${b.color}`} />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
