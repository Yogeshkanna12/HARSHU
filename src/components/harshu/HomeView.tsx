import React from 'react';
import { Language, IntentCategory } from '../../types';
import { UI_TRANSLATIONS, getT } from '../../utils/translations';
import { Mic, Keyboard, Volume2, Briefcase, GraduationCap, Building2, Coins, HelpCircle } from 'lucide-react';
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

  // 5 large, welcoming visual choices
  const choices = [
    {
      category: 'skills' as IntentCategory,
      title: {
        ta: 'எனக்கு தையல் அல்லது ஒரு திறன் கற்க வேண்டும்',
        hi: 'मुझे सिलाई या नया कौशल सीखना है',
        en: 'I want to learn tailoring or a practical skill',
        mr: 'मला शिवणकाम किंवा नवीन कौशल्य शिकायचे आहे',
        te: 'నేను కుట్టు పని లేదా కొత్త నైపుణ్యం నేర్చుకోవాలనుకుంటున్నాను',
      },
      subtitle: {
        ta: 'இலவச தையல் இயந்திரம் & பயிற்சி',
        hi: 'मुफ्त सिलाई मशीन और प्रशिक्षण',
        en: 'Free sewing machine & certification',
        mr: 'मोफत शिलाई मशीन व प्रशिक्षण',
        te: 'ఉచిత కుట్టు మిషన్ మరియు శిక్షణ',
      },
      icon: GraduationCap,
      colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70',
      iconBg: 'bg-emerald-600 text-white',
      defaultPrompt: 'எனக்கு தையல் கற்றுக்கணும், அரசு உதவி கிடைக்குமா?',
    },
    {
      category: 'scholarship' as IntentCategory,
      title: {
        ta: 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை தேவை',
        hi: 'छात्राओं के लिए कॉलेज छात्रवृत्ति व वित्तीय सहायता',
        en: 'Free government scholarships for students',
        mr: 'विद्यार्थ्यांसाठी मोफत सरकारी शिष्यवृत्ती योजना',
        te: 'విద్యార్థుల కోసం ప్రభుత్వ ఉచిత స్కాలర్‌షిప్ పథకం',
      },
      subtitle: {
        ta: 'கல்லூரி மாணவிகளுக்கு மாதம் ₹1,000',
        hi: 'कॉलेज छात्राओं को ₹1,000 मासिक सहायता',
        en: '₹1,000/month for college girls',
        mr: 'मुलींसाठी दरमहा आर्थिक शिष्यवृत्ती',
        te: 'కళాశాల విద్యార్థినులకు నెలకు ₹1,000',
      },
      icon: Coins,
      colorClass: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/70',
      iconBg: 'bg-amber-600 text-white',
      defaultPrompt: 'மாணவர்களுக்கான இலவசக் கல்வி உதவித்தொகை பற்றி நான் தெரிந்துகொள்ள விரும்புகிறேன். அரசாங்கத்தின் சார்பில் ஏதேனும் கல்வி உதவித்தொகை வழங்கப்படுகிறதா?',
    },
    {
      category: 'jobs' as IntentCategory,
      title: {
        ta: 'எனக்கு வேலை வேண்டும் / சுயதொழில் செய்ய வேண்டும்',
        hi: 'मुझे काम चाहिए / खुद का रोजगार करना है',
        en: 'I need a job or want to start self-employment',
        mr: 'मला काम हवे आहे / व्यवसाय सुरू करायचा आहे',
        te: 'నాకు పని కావాలి / స్వయం ఉపాధి ప్రారంభించాలి',
      },
      subtitle: {
        ta: 'சுயதொழில் கடன் & உள்ளூர் வேலைவாய்ப்பு',
        hi: 'स्वरोजगार ऋण और स्थानीय रोजगार',
        en: 'Self-employment loan & placement',
        mr: 'मुद्रा कर्ज व स्थानिक रोजगार',
        te: 'ముద్రా రుణం మరియు స్థానిక ఉపాధి',
      },
      icon: Briefcase,
      colorClass: 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100/70',
      iconBg: 'bg-teal-600 text-white',
      defaultPrompt: 'எனக்கு வேலை வேண்டும், வீட்டில் இருந்தே செய்யலாமா?',
    },
    {
      category: 'welfare' as IntentCategory,
      title: {
        ta: 'அரசு மகளிர் உரிமைத் தொகை பற்றி தெரிய வேண்டும்',
        hi: 'महिला सहायता राशि की जानकारी चाहिए',
        en: 'Information on the Monthly Women’s Welfare Grant',
        mr: 'महिला सन्मान निधी व मासिक अनुदान माहिती',
        te: 'మహిళా ఆర్థిక సహాయ పథకం వివరాలు',
      },
      subtitle: {
        ta: 'குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000',
        hi: 'महिला मुखियाओं को ₹1,000 मासिक सम्मान',
        en: '₹1,000/month for female family heads',
        mr: 'महिला कुटुंबप्रमुखांसाठी दरमहा मदत',
        te: 'కుటుంబ మహిళలకు నెలకు ₹1,000',
      },
      icon: Building2,
      colorClass: 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100/70',
      iconBg: 'bg-sky-700 text-white',
      defaultPrompt: 'மகளிர் உரிமைத் தொகை விண்ணப்பிப்பது எப்படி?',
    },
    {
      category: 'other' as IntentCategory,
      title: {
        ta: 'எனக்கு வேறு உதவி வேண்டும்',
        hi: 'मुझे अन्य सहायता चाहिए',
        en: 'I need something else',
        mr: 'मला इतर मदत हवी आहे',
        te: 'నాకు ఇతర సహాయం కావాలి',
      },
      subtitle: {
        ta: 'நீங்கள் என்ன விரும்புகிறீர்கள் என்று சொல்லுங்கள்',
        hi: 'बताइए आपको क्या सहायता चाहिए',
        en: 'Tell HARSHU in your own simple words',
        mr: 'आपल्या साध्या शब्दांत सांगा',
        te: 'మీ మాటల్లోనే చెప్పండి',
      },
      icon: HelpCircle,
      colorClass: 'bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100/70',
      iconBg: 'bg-stone-600 text-white',
      defaultPrompt: 'எனக்கு அரசு உதவி வேண்டும்.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      {/* Warm Greeting Card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-harshu-100/90 text-harshu-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 border border-harshu-200">
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

        <p className="text-sm sm:text-base text-earth-700 max-w-md mx-auto mt-2 leading-relaxed">
          {currentLanguage === 'ta'
            ? 'கீழே உள்ள மைக் பட்டனை அழுத்தி பேசலாம், அல்லது உங்களுக்கு தேவையானதை நேரடியாக தொடலாம்.'
            : currentLanguage === 'hi'
            ? 'नीचे दिए गए माइक बटन को दबाकर बोलें, या अपनी पसंद के विकल्प पर टैप करें।'
            : 'Press the microphone below to speak, or tap what you need.'}
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
        <p className="text-xs text-harshu-800 font-medium mt-3 text-center">
          🌿 தயங்காமல் பேசுங்கள். உங்கள் சொந்த தாய்மொழியை HARSHU புரிந்துகொள்ளும்.
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

      {/* Large Visual Choices (One-touch categories) */}
      <div className="mt-8">
        <h2 className="text-sm sm:text-base font-bold text-harshu-900 mb-3 px-1 flex items-center justify-between">
          <span>
            {currentLanguage === 'ta'
              ? 'அல்லது இவற்றில் ஒன்றை தொடுங்கள்:'
              : currentLanguage === 'hi'
              ? 'या इनमें से किसी एक को चुनें:'
              : 'Or choose directly from common needs:'}
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {choices.map((item) => {
            const Icon = item.icon;
            const titleText = getT(item.title, currentLanguage);
            const subText = getT(item.subtitle, currentLanguage);
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onSelectCategory(item.category, item.defaultPrompt)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4 ${item.colorClass} shadow-xs hover:shadow-md transform hover:-translate-y-0.5 active:scale-[0.99]`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${item.iconBg}`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg leading-snug">
                    {titleText}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-85 mt-0.5">
                    {subText}
                  </p>
                </div>
                <div className="text-lg opacity-60 font-bold px-1">➔</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
