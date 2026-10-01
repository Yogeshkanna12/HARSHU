import React from 'react';
import { Language, IntentCategory } from '../../types';
import { UI_TRANSLATIONS, getT } from '../../utils/translations';
import {
  Mic,
  Keyboard,
  Volume2,
  Bus,
  Navigation,
  Film,
  UtensilsCrossed,
  Smartphone,
  CreditCard,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface HomeViewProps {
  currentLanguage: Language;
  onStartVoice: () => void;
  onStartText: () => void;
  onSelectCategory: (category: IntentCategory, promptText?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLanguage,
  onStartVoice,
  onStartText,
  onSelectCategory,
}) => {
  const greeting = getT(UI_TRANSLATIONS.welcomeGreeting, currentLanguage);
  const question = getT(UI_TRANSLATIONS.whatDoYouNeed, currentLanguage);

  const handleListenGreeting = () => {
    speakText(`${greeting} ${question}`, currentLanguage);
  };

  // Inspiring open-ended question pills
  const samplePrompts = [
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
      colorClass: 'bg-emerald-50/90 border-emerald-200 text-emerald-950 hover:bg-emerald-100/80',
      iconBg: 'bg-emerald-600 text-white',
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
      colorClass: 'bg-teal-50/90 border-teal-200 text-teal-950 hover:bg-teal-100/80',
      iconBg: 'bg-teal-600 text-white',
    },
    {
      category: 'booking' as IntentCategory,
      title: {
        ta: 'சினிமா & பயண டிக்கெட் முன்பதிவு',
        hi: 'सिनेमा व टिकट बुकिंग',
        en: 'Cinema & Ticket Booking',
        mr: 'सिनेमा तिकीट बुकिंग',
        te: 'సినిమా టికెట్ బుకింగ్',
      },
      subtitle: {
        ta: 'படம் தேர்வு செய்து இருக்கை புக் செய்யும் எளிய முறை',
        hi: 'फिल्म व सीट चुनने का सीधा तरीका',
        en: 'Pick movie, showtime, and seat safely',
        mr: 'चित्रपट व सीट बुक करा',
        te: 'సీటు ఎంచుకుని బుక్ చేయండి',
      },
      prompt: 'சினிமா டிக்கெட் ஆன்லைனில் புக் செய்வது எப்படி?',
      icon: Film,
      badge: 'BookMyShow / Apps',
      colorClass: 'bg-amber-50/90 border-amber-200 text-amber-950 hover:bg-amber-100/80',
      iconBg: 'bg-amber-600 text-white',
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
      colorClass: 'bg-orange-50/90 border-orange-200 text-orange-950 hover:bg-orange-100/80',
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
      colorClass: 'bg-sky-50/90 border-sky-200 text-sky-950 hover:bg-sky-100/80',
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
      colorClass: 'bg-rose-50/90 border-rose-200 text-rose-950 hover:bg-rose-100/80',
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
      colorClass: 'bg-indigo-50/90 border-indigo-200 text-indigo-950 hover:bg-indigo-100/80',
      iconBg: 'bg-indigo-600 text-white',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* Warm Greeting Card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-harshu-100/90 text-harshu-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 border border-harshu-200 shadow-xs">
          <span>{greeting}</span>
          <button
            type="button"
            onClick={handleListenGreeting}
            className="p-1 text-harshu-700 hover:text-harshu-900 hover:bg-harshu-200 rounded-full transition-colors"
            title="Listen aloud"
            aria-label="Listen greeting aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-harshu-950 tracking-tight leading-tight">
          {question}
        </h1>

        <p className="text-sm sm:text-base text-earth-700 max-w-xl mx-auto mt-2 leading-relaxed">
          {currentLanguage === 'ta'
            ? 'பயணம், சினிமா டிக்கெட், சமையல் குறிப்பு, மின்சார கட்டணம், வாட்ஸ்அப் அல்லது அரசு திட்டங்கள் — எதையும் உங்கள் சொந்த மொழியில் கேளுங்கள்.'
            : currentLanguage === 'hi'
            ? 'यात्रा, सिनेमा टिकट, रसोई रेसिपी, बिजली बिल, व्हाट्सएप या सरकारी योजनाएं — कुछ भी अपनी भाषा में बेझिझक पूछें।'
            : 'Travel, movie tickets, cooking, utility bills, phone apps, or government benefits — ask anything naturally in your own language.'}
        </p>
      </div>

      {/* Hero Microphone Button */}
      <div className="flex flex-col items-center justify-center my-6 sm:my-8">
        <button
          type="button"
          onClick={onStartVoice}
          className="group relative flex flex-col items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-harshu-700 to-harshu-900 text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all transform hover:-translate-y-1 focus:ring-4 focus:ring-harshu-300"
          aria-label={getT(UI_TRANSLATIONS.startSpeaking, currentLanguage)}
        >
          {/* Animated ripple circle */}
          <div className="absolute inset-0 rounded-full bg-harshu-500 opacity-20 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
          <Mic className="w-10 h-10 sm:w-14 sm:h-14 text-harshu-200 group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-bold text-harshu-100 mt-1">
            {getT(UI_TRANSLATIONS.startSpeaking, currentLanguage)}
          </span>
        </button>

        {/* Reassuring Microcopy */}
        <p className="text-xs sm:text-sm text-harshu-900 font-semibold mt-3 text-center flex items-center gap-1.5 bg-harshu-50/80 px-3.5 py-1.5 rounded-full border border-harshu-200/70">
          <span>🌿</span>
          <span>
            {currentLanguage === 'ta'
              ? 'தயங்காமல் பேசுங்கள். உங்கள் சொந்த தாய்மொழியை HARSHU புரிந்துகொள்ளும்.'
              : currentLanguage === 'hi'
              ? 'बिना झिझक बोलिए। HARSHU आपकी अपनी भाषा समझती है।'
              : 'Speak freely. HARSHU understands your mother tongue.'}
          </span>
        </p>

        {/* Secondary: Type Instead */}
        <button
          type="button"
          onClick={onStartText}
          className="mt-3 text-xs sm:text-sm font-semibold text-earth-800 hover:text-harshu-900 flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-earth-100 transition-colors"
        >
          <Keyboard className="w-4 h-4 text-earth-600" />
          <span>{getT(UI_TRANSLATIONS.typeInstead, currentLanguage)}</span>
        </button>
      </div>

      {/* Inspiring Question Pills (Real Questions Users Ask) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Sparkles className="w-4 h-4 text-harshu-700" />
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
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-harshu-100/80 text-earth-900 text-xs sm:text-sm font-medium border border-earth-200/80 shadow-xs hover:border-harshu-400 hover:shadow-sm transition-all text-left"
              >
                <span className="text-base">{p.icon}</span>
                <span>{promptText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Everyday Domains Grid */}
      <div className="mt-8">
        <h2 className="text-sm sm:text-base font-bold text-harshu-900 mb-3 px-1">
          {currentLanguage === 'ta'
            ? 'அல்லது உங்களுக்கு தேவையான துறையை தேர்ந்தெடுக்கலாம்:'
            : currentLanguage === 'hi'
            ? 'या अपनी जरूरत के अनुसार विषय चुनें:'
            : 'Or explore by everyday need:'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {domainCards.map((item) => {
            const Icon = item.icon;
            const titleText = getT(item.title, currentLanguage);
            const subText = getT(item.subtitle, currentLanguage);
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onSelectCategory(item.category, item.prompt)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 ${item.colorClass} shadow-xs hover:shadow-md transform hover:-translate-y-0.5 active:scale-[0.99]`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${item.iconBg} mt-0.5`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-sm sm:text-base leading-snug">
                      {titleText}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current opacity-70">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs opacity-85 line-clamp-2 leading-relaxed">
                    {subText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reassuring Philosophy Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-harshu-50 to-earth-50 border border-harshu-200/80 text-center">
        <p className="text-xs sm:text-sm font-semibold text-harshu-950">
          {currentLanguage === 'ta'
            ? '💡 "தொழில்நுட்பம் உங்களை அறிய வேண்டும்; நீங்கள் தொழில்நுட்பத்தை அறிய வேண்டியதில்லை."'
            : currentLanguage === 'hi'
            ? '💡 "तकनीक को आपको समझना चाहिए — आपको तकनीक सीखने की मजबूरी नहीं होनी चाहिए।"'
            : '💡 "Technology should adapt to you — you do not need to adapt to technology."'}
        </p>
        <p className="text-[11px] sm:text-xs text-earth-700 mt-1">
          {currentLanguage === 'ta'
            ? 'சரியான அரசு இணையதளம், பஸ் வழி, சினிமா புக் செய்வது அல்லது சமையல் — HARSHU பொறுமையாக வழிகாட்டும்.'
            : currentLanguage === 'hi'
            ? 'बस, ट्रेन, फिल्म टिकट, रसोई या सरकारी योजनाएं — HARSHU धैर्य से कदम दर कदम साथ देगा।'
            : 'Bus routes, movie tickets, cooking, or government schemes — HARSHU guides you step by step.'}
        </p>
      </div>
    </div>
  );
};
