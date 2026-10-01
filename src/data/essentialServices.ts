import { Language } from '../types';

export interface EssentialServiceItem {
  id: 'services' | 'schemes' | 'skills';
  iconEmoji: string;
  title: Record<string, string>;
  description: Record<string, string>;
  question: Record<string, string>;
  badge: Record<string, string>;
  accentClass: string;
  iconBg: string;
  suggestions: {
    label: Record<string, string>;
    query: string;
  }[];
}

export const ESSENTIAL_SERVICES: EssentialServiceItem[] = [
  {
    id: 'services',
    iconEmoji: '🏛️',
    title: {
      en: 'Government Services',
      ta: 'அரசு சேவைகள்',
      hi: 'सरकारी सेवाएं',
      te: 'ప్రభుత్వ సేవలు',
      mr: 'शासकीय सेवा',
      kn: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು',
      bn: 'সরকারি সেবা',
      gu: 'સરકારી સેવાઓ',
    },
    description: {
      en: 'Find and access essential government services.',
      ta: 'அத்தியாவசிய அரசு சேவைகளை எளிதாக கண்டறிந்து பெறலாம்.',
      hi: 'आवश्यक सरकारी सेवाओं की खोज व सीधी पहुंच।',
      te: 'అవసరమైన ప్రభుత్వ సేవలను సులభంగా పొందండి.',
      mr: 'महत्त्वाच्या सरकारी सेवा शोधा आणि मिळवा.',
      kn: 'ಅಗತ್ಯ ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಪಡೆಯಿರಿ.',
      bn: 'প্রয়োজনীয় সরকারি সেবা খুঁজুন ও সহজে পান।',
      gu: 'જરૂરી સરકારી સેવાઓ સરળતાથી શોધો અને મેળવો.',
    },
    question: {
      en: 'What government service do you need?',
      ta: 'உங்களுக்கு என்ன அரசு சேவை தேவை?',
      hi: 'आपको कौन सी सरकारी सेवा चाहिए?',
      te: 'మీకు ఏ ప్రభుత్వ సేవ కావాలి?',
      mr: 'तुम्हाला कोणती सरकारी सेवा हवी आहे?',
      kn: 'ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಸೇವೆ ಬೇಕು?',
      bn: 'আপনার কোন সরকারি সেবা প্রয়োজন?',
      gu: 'તમને કઈ સરકારી સેવાની જરૂર છે?',
    },
    badge: {
      en: 'e-Sevai & Portals',
      ta: 'இ-சேவை & சான்றிதழ்கள்',
      hi: 'ई-सेवा व प्रमाण पत्र',
      te: 'ఈ-సేవ & సర్టిఫికెట్లు',
      mr: 'ई-सेवा केंद्र',
      kn: 'ಇ-ಸೇವೆ',
      bn: 'ই-সেবা',
      gu: 'ઈ-સેવા પોર્ટલ',
    },
    accentClass: 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 border-emerald-200/90 hover:border-emerald-400',
    iconBg: 'bg-emerald-700 text-white',
    suggestions: [
      {
        label: {
          en: 'Aadhaar Card Update / Download',
          ta: 'ஆதார் அட்டை புதுப்பித்தல் / பதிவிறக்கம்',
          hi: 'आधार कार्ड अपडेट / डाउनलोड',
        },
        query: 'How to update or download Aadhaar card online?',
      },
      {
        label: {
          en: 'New Smart Ration Card Application',
          ta: 'புதிய ஸ்மார்ட் ரேஷன் கார்டு விண்ணப்பம்',
          hi: 'नया राशन कार्ड कैसे बनवाएं',
        },
        query: 'How to apply for new smart ration card online?',
      },
      {
        label: {
          en: 'Income & Community Certificate',
          ta: 'வருமான & சாதி சான்றிதழ் பெற',
          hi: 'आय व जाति प्रमाण पत्र',
        },
        query: 'How to get income and community certificate from e-Sevai?',
      },
      {
        label: {
          en: 'Voter ID Registration & Card',
          ta: 'வாக்காளர் அடையாள அட்டை பதிவு',
          hi: 'वोटर कार्ड पहचान पत्र',
        },
        query: 'How to apply for voter ID card online?',
      },
    ],
  },
  {
    id: 'schemes',
    iconEmoji: '🎯',
    title: {
      en: 'Government Schemes',
      ta: 'அரசு நலத்திட்டங்கள்',
      hi: 'सरकारी योजनाएं',
      te: 'ప్రభుత్వ పథకాలు',
      mr: 'शासकीय योजना',
      kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      bn: 'সরকারি প্রকল্প',
      gu: 'સરકારી યોજનાઓ',
    },
    description: {
      en: 'Discover relevant government schemes and understand eligibility.',
      ta: 'உங்களுக்கான நலத்திட்டங்கள் & தகுதிகளை எளிய முறையில் அறியலாம்.',
      hi: 'महत्वपूर्ण सरकारी योजनाएं और उनकी पात्रता जानें।',
      te: 'సంక్షేమ పథకాలు మరియు వాటి అర్హతలను తెలుసుకోండి.',
      mr: 'सरकारी योजना व त्यांची पात्रता समजून घ्या.',
      kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಅರ್ಹತೆಗಳನ್ನು ತಿಳಿಯಿರಿ.',
      bn: 'উপযুক্ত সরকারি প্রকল্প এবং যোগ্যতার নিয়ম জানুন।',
      gu: 'ઉપયોગી સરકારી યોજનાઓ અને પાત્રતા જાણો.',
    },
    question: {
      en: 'Which scheme would you like to know about?',
      ta: 'எந்த அரசு நலத்திட்டம் பற்றி அறிய விரும்புகிறீர்கள்?',
      hi: 'आप किस सरकारी योजना के बारे में जानना चाहती हैं?',
      te: 'మీరు ఏ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు?',
      mr: 'तुम्हाला कोणत्या योजनेबद्दल माहिती हवी आहे?',
      kn: 'ನೀವು ಯಾವ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
      bn: 'আপনি কোন সরকারি প্রকল্প সম্পর্কে জানতে চান?',
      gu: 'તમે કઈ સરકારી યોજના વિશે જાણવા માંગો છો?',
    },
    badge: {
      en: 'Welfare & Benefits',
      ta: 'மகளிர் & குடும்ப நலன்',
      hi: 'महिला व बाल कल्याण',
      te: 'సంక్షేమ పథకాలు',
      mr: 'कल्याणकारी योजना',
      kn: 'ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',
      bn: 'কল্যাণমূলক সুবিধা',
      gu: 'મહિલા કલ્યાણ',
    },
    accentClass: 'bg-gradient-to-br from-harshu-50/90 via-white to-harshu-50/40 border-harshu-200/90 hover:border-harshu-400',
    iconBg: 'bg-harshu-800 text-white',
    suggestions: [
      {
        label: {
          en: 'Pudhumai Penn Higher Education (₹1,000)',
          ta: 'புதுமைப் பெண் உயர்கல்வி திட்டம் (₹1,000)',
          hi: 'पुधुमै पेन उच्च शिक्षा योजना',
        },
        query: 'How to apply for Pudhumai Penn scheme?',
      },
      {
        label: {
          en: 'Free Sewing Machine for Women',
          ta: 'மகளிர் இலவச தையல் இயந்திர திட்டம்',
          hi: 'मुफ्त सिलाई मशीन योजना',
        },
        query: 'What is the eligibility for free sewing machine scheme?',
      },
      {
        label: {
          en: 'Kalaignar Magalir Urimai Thogai (₹1,000)',
          ta: 'கலைஞர் மகளிர் உரிமைத் தொகை திட்டம்',
          hi: 'महिला सम्मान मासिक सहायता',
        },
        query: 'Kalaignar Magalir Urimai Thogai scheme details',
      },
      {
        label: {
          en: 'CM Comprehensive Health Insurance Card',
          ta: 'முதலமைச்சர் விரிவான மருத்துவக் காப்பீடு',
          hi: 'मुख्यमंत्री स्वास्थ्य बीमा योजना',
        },
        query: 'How to get Chief Minister Comprehensive Health Insurance card?',
      },
    ],
  },
  {
    id: 'skills',
    iconEmoji: '📚',
    title: {
      en: 'Skills & Learning',
      ta: 'திறன் பயிற்சி & கல்வி',
      hi: 'कौशल विकास व प्रशिक्षण',
      te: 'నైపుణ్య శిక్షణ & విద్య',
      mr: 'कौशल्य विकास व शिक्षण',
      kn: 'ಕೌಶಲ್ಯ ತರಬೇತಿ & ಕಲಿಕೆ',
      bn: 'দক্ষতা ও প্রশিক্ষণ',
      gu: 'કૌશલ્ય તાલીમ અને શિક્ષણ',
    },
    description: {
      en: 'Find useful skill-development, training, and learning resources.',
      ta: 'இலவச தொழிற்பயிற்சி, கணினி மற்றும் சுயதொழில் வாய்ப்புகள்.',
      hi: 'हुनर सीखने, सिलाई, कंप्यूटर व व्यावसायिक प्रशिक्षण के साधन।',
      te: 'ఉచిత కుట్టు పని, కంప్యూటర్ మరియు నైపుణ్య శిక్షణ.',
      mr: 'शिलाई, कॉम्प्युटर आणि व्यावसायिक कौशल्य संसाधने.',
      kn: 'ಉಚಿತ ಹೊಲಿಗೆ, ಕಂಪ್ಯೂಟರ್ ಮತ್ತು ಕೌಶಲ್ಯ ತರಬೇತಿ.',
      bn: 'বিনামূল্যে সেলাই, কম্পিউটার ও স্বনির্ভর প্রশিক্ষণ।',
      gu: 'મફત સીવણ, કમ્પ્યુટર અને વ્યવસાયિક તાલીમ.',
    },
    question: {
      en: 'What skill would you like to learn?',
      ta: 'நீங்கள் என்ன தொழில் அல்லது திறன் கற்றுக்கொள்ள விரும்புகிறீர்கள்?',
      hi: 'आप कौन सा हुनर या कौशल सीखना चाहती हैं?',
      te: 'మీరు ఏ నైపుణ్యం నేర్చుకోవాలనుకుంటున్నారు?',
      mr: 'तुम्हाला कोणते कौशल्य शिकायचे आहे?',
      kn: 'ನೀವು ಯಾವ ಕೌಶಲ್ಯವನ್ನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?',
      bn: 'আপনি কোন দক্ষতা শিখতে চান?',
      gu: 'તમે કયું કૌશલ્ય શીખવા માંગો છો?',
    },
    badge: {
      en: 'Free Training & Courses',
      ta: 'இலவச அரசு தொழிற்பயிற்சி',
      hi: 'निःशुल्क सरकारी प्रशिक्षण',
      te: 'ఉచిత శిక్షణ',
      mr: 'मोफत प्रशिक्षण',
      kn: 'ಉಚಿತ ತರಬೇತಿ',
      bn: 'বিনামূল্যে কোর্স',
      gu: 'મફત તાલીમ',
    },
    accentClass: 'bg-gradient-to-br from-teal-50/90 via-white to-teal-50/40 border-teal-200/90 hover:border-teal-400',
    iconBg: 'bg-teal-700 text-white',
    suggestions: [
      {
        label: {
          en: 'Free Tailoring & Garment Making Course',
          ta: 'இலவச தையல் & ஆடை தயாரிப்பு பயிற்சி',
          hi: 'मुफ्त सिलाई व कढ़ाई कोर्स',
        },
        query: 'Where can I learn free tailoring and get sewing certificate?',
      },
      {
        label: {
          en: 'Basic Computer & Smartphone Skills',
          ta: 'அடிப்படை கணினி & ஸ்மார்ட்போன் பயிற்சி',
          hi: 'बेसिक कंप्यूटर व मोबाइल फोन कोर्स',
        },
        query: 'Free computer literacy courses for women',
      },
      {
        label: {
          en: 'Handicrafts, Jewellery & Jute Bag Making',
          ta: 'கைவினைப் பொருட்கள், சணல் பை பயிற்சி',
          hi: 'हस्तशिल्प व गृह उद्योग प्रशिक्षण',
        },
        query: 'Self employment training in handicrafts and home business',
      },
      {
        label: {
          en: 'Government Certified Beautician Course',
          ta: 'அழகுக்கலை & ஆரோக்கிய தொழிற்பயிற்சி',
          hi: 'ब्यूटीशियन व वेलनेस प्रशिक्षण',
        },
        query: 'Government certified beautician training course',
      },
    ],
  },
];
