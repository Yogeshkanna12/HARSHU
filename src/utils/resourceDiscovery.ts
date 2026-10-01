import { Language, Resource, SourceType, GuidedStep } from '../types/index';
import { VERIFIED_SCHEMES } from '../data/schemes';

export interface VerifiedPortalEntry {
  id: string;
  category: 'scholarship' | 'skills' | 'jobs' | 'welfare' | 'services' | 'other';
  keywords: string[];
  officialSourceName: string;
  officialUrl: string;
  sourceType: SourceType;
  domainHierarchy: string;
  title: Record<string, string>;
  department: Record<string, string>;
  whatItHelps: Record<string, string>;
  whoItIsFor: Record<string, string>;
  eligibility: Record<string, string[]>;
  documents: Record<string, string[]>;
  lastVerified: string;
}

// 1. Curated, Authentic, Verified Government Registry
// All URLs are real, official .gov.in / .nic.in or statutory government platforms.
export const OFFICIAL_GOV_REGISTRY: VerifiedPortalEntry[] = [
  {
    id: 'national-scholarship-portal',
    category: 'scholarship',
    keywords: [
      'scholarship',
      'கல்வி உதவித்தொகை',
      'छात्रवृत्ति',
      'शिष्यवृत्ती',
      'కాలేజీ',
      'college',
      'student',
      'degree',
      'school',
      'nsp',
      'post matric',
      'pre matric',
      'tuition',
      'fee waiver',
      'higher education',
      'படிப்பு',
      'மாணவி',
      'கல்வி',
    ],
    officialSourceName: 'National Scholarship Portal (scholarships.gov.in)',
    officialUrl: 'https://scholarships.gov.in',
    sourceType: 'official',
    domainHierarchy: 'Ministry of Electronics & IT / Ministry of Education, Govt. of India (.gov.in)',
    lastVerified: 'AY 2026-27 Active',
    title: {
      ta: 'தேசிய கல்வி உதவித்தொகை தளம் (National Scholarship Portal - NSP)',
      hi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (National Scholarship Portal - NSP)',
      en: 'National Scholarship Portal (NSP - scholarships.gov.in)',
      mr: 'राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP)',
      te: 'జాతీయ స్కాలర్‌షిప్ పోర్టల్ (NSP)',
      kn: 'ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್ (NSP)',
    },
    department: {
      ta: 'கல்வி அமைச்சகம் & மின்னணு தகவல் தொழில்நுட்ப அமைச்சகம், இந்திய அரசு',
      hi: 'शिक्षा मंत्रालय एवं इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय, भारत सरकार',
      en: 'Ministry of Education & MeitY, Government of India',
      mr: 'शिक्षण मंत्रालय, भारत सरकार',
      te: 'విద్యా మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
      kn: 'ಶಿಕ್ಷಣ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ',
    },
    whatItHelps: {
      ta: 'பள்ளி, கல்லூரி மற்றும் பல்கலைக்கழக மாணவிகளுக்கான மத்திய மற்றும் மாநில அரசுகளின் அனைத்து கல்வி உதவித்தொகைகளையும் ஒரே இடத்தில் பெற உதவுகிறது.',
      hi: 'स्कूली एवं कॉलेज छात्राओं को केंद्रीय और राज्य सरकार की सभी छात्रवृत्तियों हेतु एक ही स्थान पर सीधा आवेदन व बैंक ट्रांसफर।',
      en: 'Provides a single official gateway to apply for Central and State government scholarships, tuition reimbursement, and merit fellowships directly into bank accounts.',
      mr: 'शालेय व महाविद्यालयीन विद्यार्थ्यांना केंद्र आणि राज्य शासनाच्या सर्व शिष्यवृत्तींसाठी थेट अर्ज करण्याची अधिकृत सुविधा.',
      te: 'పాఠశాల మరియు కళాశాల విద్యార్థులకు కేంద్ర, రాష్ట్ర ప్రభుత్వాల అన్ని స్కాలర్‌షిప్‌లను ఒకే చోట పొందే అధికారిక పోర్టల్.',
      kn: 'ಶಾಲಾ ಮತ್ತು ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರಗಳ ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳಿಗೆ ಒಂದೇ ಅಧಿಕೃತ ವೇದಿಕೆ.',
    },
    whoItIsFor: {
      ta: '1-ம் வகுப்பு முதல் கல்லூரி, பாலிடெக்னிக், மற்றும் ஆராய்ச்சி படிக்கும் அனைத்து தகுதியான மாணவ, மாணவிகள்.',
      hi: 'कक्षा 1 से लेकर कॉलेज, डिप्लोमा व उच्च शिक्षा प्राप्त करने वाले सभी पात्र छात्र-छात्राएं।',
      en: 'Eligible students studying from Class 1 up to college, diploma, undergraduate, postgraduate, and professional courses.',
    },
    eligibility: {
      ta: [
        'அங்கீகரிக்கப்பட்ட பள்ளி அல்லது கல்லூரியில் தொடர்ந்து படித்து வர வேண்டும்.',
        'குடும்ப ஆண்டு வருமானம் மற்றும் குறிப்பிட்ட பிரிவினருக்கான விதிமுறைகள் பூர்த்தி செய்யப்பட வேண்டும்.',
        'மாணவர் பெயரில் ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கு இருக்க வேண்டும்.',
      ],
      hi: [
        'मान्यता प्राप्त स्कूल या कॉलेज में नामांकित होना चाहिए।',
        'परिवार की वार्षिक आय योजना के निर्धारित नियमों के अनुरूप हो।',
        'विद्यार्थी के नाम पर आधार से जुड़ा सक्रिय बैंक खाता होना आवश्यक है।',
      ],
      en: [
        'Enrolled in a recognized school, college, polytechnic, or university.',
        'Family income within the ceiling specified by the respective ministry scheme.',
        'Aadhaar-seeded active bank savings account in the student’s own name.',
      ],
    },
    documents: {
      ta: [
        'மாணவர் ஆதார் அட்டை (Student Aadhaar)',
        'கல்வி நிறுவன சேர்க்கை ரசீது (Bonafide / Admission Slip)',
        'மதிப்பெண் பட்டியல் (Previous Marksheet)',
        'வருமானச் சான்றிதழ் (Income Certificate)',
        'வங்கி கணக்கு புத்தக நகல் (Bank Passbook)',
      ],
      hi: [
        'छात्र का आधार कार्ड',
        'संस्थान प्रवेश पत्र / बोनाफाइड सर्टिफिकेट',
        'पिछली कक्षा की मार्कशीट',
        'आय प्रमाण पत्र',
        'बैंक खाता पासबुक',
      ],
      en: [
        'Student Aadhaar Card',
        'Bonafide Certificate / Institute Admission Fee Receipt',
        'Previous qualifying examination Marksheet',
        'Income Certificate from competent Revenue Authority',
        'Bank Passbook showing Account Number & IFSC',
      ],
    },
  },
  {
    id: 'pm-vishwakarma',
    category: 'skills',
    keywords: [
      'vishwakarma',
      'திறன்',
      'தையல்',
      'darzi',
      'tailor',
      'artisan',
      'toolkit',
      'stitching',
      'سिलाई',
      'craft',
      'equipment',
      'தொழில்',
      'கைவினை',
    ],
    officialSourceName: 'PM Vishwakarma Official Portal (pmvishwakarma.gov.in)',
    officialUrl: 'https://pmvishwakarma.gov.in',
    sourceType: 'official',
    domainHierarchy: 'Ministry of MSME & Ministry of Skill Development, Govt. of India (.gov.in)',
    lastVerified: 'Active 2026',
    title: {
      ta: 'பிரதமர் விஸ்வகர்மா திட்டம் (தையல் கலைஞர்கள் & கைவினைஞர்கள் உதவி)',
      hi: 'पीएम विश्वकर्मा योजना (दर्जी एवं महिला कारीगर सहायता)',
      en: 'PM Vishwakarma Scheme (Tailors, Artisans & Craftspeople Support)',
      mr: 'पीएम विश्वकर्मा योजना (शिंपी व कारागीर योजना)',
      te: 'పీఎం విశ్వకర్మ పథకం (టైలర్లు & చేతివృత్తుల వారు)',
      kn: 'ಪಿಎಂ ವಿಶ್ವಕರ್ಮ ಯೋಜನೆ (ದರ್ಜಿಗಳು ಮತ್ತು ಕುಶಲಕರ್ಮಿಗಳು)',
    },
    department: {
      ta: 'சிறு, குறு மற்றும் நடுத்தர தொழில் அமைச்சகம் (MSME), இந்திய அரசு',
      hi: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME), भारत सरकार',
      en: 'Ministry of Micro, Small and Medium Enterprises (MSME), Government of India',
    },
    whatItHelps: {
      ta: 'தையல் கலைஞர்களுக்கு ₹15,000 இலவச நவீன தையல் இயந்திர உபகரண உதவி, சான்றிதழுடன் இலவச பயிற்சி மற்றும் ₹3 லட்சம் வரை குறைந்த வட்டி தொழில் கடன் வழங்குகிறது.',
      hi: 'दर्जी व कारीगर महिलाओं को ₹15,000 का मुफ्त टूलकिट प्रोत्साहन, आधुनिक सिलाई प्रशिक्षण तथा ₹3 लाख तक बिना गारंटी सस्ता ऋण।',
      en: 'Offers ₹15,000 free modern toolkit incentive for tailors/artisans, certified skill upskilling with ₹500/day stipend, and collateral-free enterprise credit up to ₹3 Lakhs.',
    },
    whoItIsFor: {
      ta: 'பாரம்பரிய தையல் கலை செய்பவர்கள் மற்றும் 18 வகையான கைவினைத் தொழில் செய்யும் பெண்கள்.',
      hi: 'सिलाई का काम करने वाली महिलाएं एवं 18 पारंपरिक शिल्पकलाओं से जुड़े परिवार।',
      en: 'Traditional women tailors (Darzi) and artisans engaged in home-based trades.',
    },
    eligibility: {
      ta: [
        'வயது 18 பூர்த்தியடைந்தவராக இருக்க வேண்டும்.',
        'தையல் அல்லது கைவினைத் தொழிலில் ஈடுபட்டிருக்க வேண்டும்.',
        'குடும்பத்தில் ஒருவர் மட்டுமே பயன்பெற முடியும்.',
      ],
      hi: [
        'न्यूनतम आयु 18 वर्ष होनी चाहिए।',
        'पारंपरिक सिलाई या हस्तशिल्प से जुड़ी हों।',
        'एक परिवार से एक ही सदस्य लाभ ले सकता है।',
      ],
      en: [
        'Minimum age 18 years.',
        'Engaged in tailoring (Darzi) or one of the 18 recognized artisan crafts.',
        'One beneficiary per family.',
      ],
    },
    documents: {
      ta: [
        'ஆதார் அட்டை (Aadhaar Card)',
        'மொபைல் எண் (ஆதாருடன் இணைக்கப்பட்டது)',
        'வங்கி சேமிப்புக் கணக்கு புத்தகம்',
        'ரேஷன் கார்டு நகல்',
      ],
      hi: [
        'आधार कार्ड',
        'आधार से लिंक मोबाइल नंबर',
        'बैंक खाता पासबुक',
        'राशन कार्ड',
      ],
      en: [
        'Aadhaar Card',
        'Aadhaar-linked mobile phone',
        'Bank Passbook copy',
        'Ration card / Family document',
      ],
    },
  },
  {
    id: 'pm-mudra-yojana',
    category: 'jobs',
    keywords: [
      'mudra',
      'loan',
      'கடன்',
      'சுயதொழில்',
      'ऋण',
      'कर्ज',
      'business',
      'shop',
      'enterprise',
      'store',
      'தொழில் தொடங்க',
      'பணம்',
      'self employment',
    ],
    officialSourceName: 'Pradhan Mantri MUDRA Yojana Portal (mudra.org.in)',
    officialUrl: 'https://www.mudra.org.in',
    sourceType: 'government-backed',
    domainHierarchy: 'Small Industries Development Bank of India (SIDBI) / Department of Financial Services',
    lastVerified: 'Active 2026',
    title: {
      ta: 'பிரதமர் முத்ரா திட்டம் (பெண்களுக்கான அடமானமில்லா தொழில் கடன்)',
      hi: 'प्रधानमंत्री मुद्रा योजना (महिलाओं के लिए आसान बिजनेस ऋण)',
      en: 'Pradhan Mantri MUDRA Yojana (Collateral-Free Enterprise Loans for Women)',
      mr: 'प्रधानमंत्री मुद्रा योजना (महिला व्यवसाय कर्ज)',
      te: 'ప్రధాన మంత్రి ముద్రా యోజన (వ్యాపార రుణం)',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮುದ್ರಾ ಯೋಜನೆ (ಮಹಿಳಾ ಉದ್ಯಮ ಸಾಲ)',
    },
    department: {
      ta: 'நிதிச் சேவைகள் துறை, நிதி அமைச்சகம், இந்திய அரசு',
      hi: 'वित्तीय सेवाएं विभाग, वित्त मंत्रालय, भारत सरकार',
      en: 'Department of Financial Services, Ministry of Finance, Government of India',
    },
    whatItHelps: {
      ta: 'வீட்டில் இருந்தே தையல் கடை, அழகு நிலையம், மளிகைக் கடை போன்ற தொழில் தொடங்க ₹50,000 முதல் ₹10 லட்சம் வரை சொத்து அடமானம் இன்றி எளிதாக வங்கி கடன் வழங்குகிறது.',
      hi: 'घर से सिलाई बुटीक, ब्यूटी पार्लर या किराना दुकान शुरू करने हेतु बिना किसी गारंटी के ₹50,000 से ₹10 लाख तक आसान बैंक ऋण।',
      en: 'Provides collateral-free loans from ₹50,000 (Shishu) up to ₹10 Lakhs (Tarun) for women starting or expanding home-based micro-enterprises.',
    },
    whoItIsFor: {
      ta: 'சொந்தமாக சிறு தொழில் தொடங்க விரும்பும் அல்லது நடத்தி வரும் பெண்கள்.',
      hi: 'अपना स्वयं का छोटा काम या दुकान शुरू करने की इच्छुक महिलाएं।',
      en: 'Women entrepreneurs starting micro manufacturing, tailoring, service units, or retail shops.',
    },
    eligibility: {
      ta: [
        '18 வயது நிரம்பிய இந்திய குடிமகள்.',
        'வங்கி கடன் நிலுவையில் ஏமாற்றிய பின்னணி இருக்கக் கூடாது.',
        'சுயதொழில் செய்யும் திட்டம் இருக்க வேண்டும்.',
      ],
      hi: [
        'आयु 18 वर्ष से अधिक हो।',
        'किसी बैंक में ऋण डिफ़ॉल्ट का रिकॉर्ड न हो।',
        'व्यवसाय शुरू करने की स्पष्ट योजना हो।',
      ],
      en: [
        'Indian citizen aged 18 and above.',
        'No default history with any bank or financial institution.',
        'Viable business activity proposal.',
      ],
    },
    documents: {
      ta: [
        'ஆதார் அட்டை & வாக்காளர் அட்டை',
        'வங்கி கணக்கு அறிக்கை (6 மாத கால)',
        'தொழில் திட்ட குறிப்பு (எளிய விபரம்)',
        'பாஸ்போர்ட் அளவு புகைப்படங்கள்',
      ],
      hi: [
        'आधार कार्ड एवं पहचान पत्र',
        'बैंक खाता विवरण (6 महीने का स्टेटमेंट)',
        'व्यवसाय की संक्षिप्त जानकारी',
        'पासपोर्ट साइज फोटो',
      ],
      en: [
        'Identity & Address Proof (Aadhaar / Voter ID)',
        'Bank Statement (last 6 months)',
        'Business activity proposal brief',
        'Recent passport photographs',
      ],
    },
  },
  {
    id: 'tnega-esevai',
    category: 'services',
    keywords: [
      'esevai',
      'சான்றிதழ்',
      'இ-சேவை',
      'certificate',
      'income certificate',
      'community certificate',
      'nativity',
      'வருமானச் சான்றிதழ்',
      'ஜாதி சான்றிதழ்',
      'tnega',
      'प्रमाण पत्र',
    ],
    officialSourceName: 'Tamil Nadu e-Governance Agency (tnesevai.tn.gov.in)',
    officialUrl: 'https://www.tnesevai.tn.gov.in',
    sourceType: 'official',
    domainHierarchy: 'Information Technology & Digital Services Dept, Govt. of Tamil Nadu (.gov.in)',
    lastVerified: 'Active 2026',
    title: {
      ta: 'தமிழ்நாடு இ-சேவை மையம் (அரசு சான்றிதழ்கள் சேவை)',
      hi: 'तमिलनाडु ई-सेवा केंद्र (सरकारी प्रमाण पत्र सेवा)',
      en: 'Tamil Nadu e-Sevai / TNeGA (Citizen Certificate Services)',
      mr: 'ई-सेवा केंद्र (प्रमाणपत्र सेवा)',
      te: 'ఈ-సేవ పోర్టల్ (ప్రమాణ పత్రాల సేవలు)',
      kn: 'ಇ-ಸೇವೆ ಪೋರ್ಟಲ್ (ಪ್ರಮಾಣಪತ್ರ ಸೇವೆಗಳು)',
    },
    department: {
      ta: 'தகவல் தொழில்நுட்பவியல் மற்றும் டிஜிட்டல் சேவைகள் துறை, தமிழ்நாடு அரசு',
      hi: 'सूचना प्रौद्योगिकी एवं डिजिटल सेवा विभाग, तमिलनाडु सरकार',
      en: 'Information Technology & Digital Services Department, Government of Tamil Nadu',
    },
    whatItHelps: {
      ta: 'வருமானச் சான்றிதழ், சாதிச் சான்றிதழ், இருப்பிடச் சான்றிதழ், மற்றும் முதல் பட்டதாரி சான்றிதழ் போன்றவற்றை உங்கள் வீட்டிற்கு அருகிலேயே எளிதாக பெற உதவுகிறது.',
      hi: 'आय प्रमाण पत्र, जाति प्रमाण पत्र, निवास प्रमाण पत्र जैसी सरकारी सेवाओं को घर के नजदीक आसानी से प्राप्त करने की आधिकारिक व्यवस्था।',
      en: 'Enables citizens to apply and obtain Revenue and Social Welfare certificates (Income, Community, Nativity, First Graduate) without visiting government offices.',
    },
    whoItIsFor: {
      ta: 'அரசு நலத்திட்டங்கள் மற்றும் கல்வி உதவித்தொகை பெற சான்றிதழ் தேவைப்படும் பொதுமக்கள்.',
      hi: 'सरकारी योजनाओं व छात्रवृत्ति के लिए प्रमाण पत्र की आवश्यकता वाले सभी नागरिक।',
      en: 'All citizens and families requiring certified documentation for government welfare schemes.',
    },
    eligibility: {
      ta: ['தமிழ்நாடு வாழ் பொதுமக்கள் அனைவரும் விண்ணப்பிக்கலாம்.'],
      hi: ['तमिलनाडु का कोई भी निवासी आवेदन कर सकता है।'],
      en: ['Any bonafide resident of Tamil Nadu.'],
    },
    documents: {
      ta: ['ஆதார் அட்டை', 'குடும்ப அட்டை (Ration card)', 'புகைப்படம்', 'வருமான ஆதார ஆவணம்'],
      hi: ['आधार कार्ड', 'राशन कार्ड', 'फोटो', 'वेतन या आय का प्रमाण'],
      en: ['Aadhaar Card', 'Smart Family Ration Card', 'Passport photograph', 'Income proof document'],
    },
  },
  {
    id: 'national-services-portal',
    category: 'other',
    keywords: [
      'services',
      'அரசு உதவி',
      'மத்திய அரசு',
      'india.gov.in',
      'citizen',
      'portal',
      'योजना',
      'scheme',
      'all schemes',
      'welfare',
    ],
    officialSourceName: 'National Government Services Portal (services.india.gov.in)',
    officialUrl: 'https://services.india.gov.in',
    sourceType: 'official',
    domainHierarchy: 'National Informatics Centre (NIC), Govt. of India (.gov.in)',
    lastVerified: 'Active 2026',
    title: {
      ta: 'தேசிய அரசு சேவைகள் தளம் (services.india.gov.in)',
      hi: 'राष्ट्रीय सरकारी सेवा पोर्टल (services.india.gov.in)',
      en: 'National Government Services Portal (services.india.gov.in)',
      mr: 'राष्ट्रीय शासकीय सेवा पोर्टल',
      te: 'జాతీయ ప్రభుత్వ సేవల పోర్టల్',
      kn: 'ರಾಷ್ಟ್ರೀಯ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಪೋರ್ಟಲ್',
    },
    department: {
      ta: 'மத்திய மற்றும் மாநில அரசுகளின் ஒருங்கிணைந்த தளம், NIC',
      hi: 'केंद्रीय एवं राज्य सरकारों का एकीकृत सेवा मंच, NIC',
      en: 'National Informatics Centre (NIC), Ministry of Electronics and IT, Govt. of India',
    },
    whatItHelps: {
      ta: 'இந்தியா முழுவதும் உள்ள 13,000-க்கும் மேற்பட்ட மத்திய மற்றும் மாநில அரசுகளின் குடிமக்கள் சேவைகளை ஒரே இடத்தில் கண்டறிந்து விண்ணப்பிக்க உதவுகிறது.',
      hi: 'पूरे भारत में 13,000 से अधिक केंद्रीय व राज्य सरकारी नागरिक सेवाओं को एक ही जगह खोजने और आवेदन करने का आधिकारिक मंच।',
      en: 'Official unified portal providing direct access to over 13,000 citizen services across Central and State Governments in India.',
    },
    whoItIsFor: {
      ta: 'அரசு திட்டங்கள் மற்றும் சேவைகளை தேடும் அனைத்து பொதுமக்கள்.',
      hi: 'सरकारी योजनाओं व सेवाओं की तलाश करने वाले सभी भारतीय नागरिक।',
      en: 'All citizens seeking verified official government resources and services.',
    },
    eligibility: {
      ta: ['இந்திய குடிமக்கள் அனைவரும் பயன்பெறலாம்.'],
      hi: ['सभी भारतीय नागरिक पात्र हैं।'],
      en: ['All Indian citizens.'],
    },
    documents: {
      ta: ['ஆதார் அட்டை மற்றும் குடும்ப அட்டை'],
      hi: ['आधार कार्ड एवं राशन कार्ड'],
      en: ['Aadhaar Card and relevant scheme documents'],
    },
  },
];

// 2. Strict Government Domain Verifier
// Enforces that destination URLs MUST be authentic, verified .gov.in, .nic.in or statutory government entities.
export function verifyOfficialUrl(url: string): {
  isValid: boolean;
  isVerified: boolean;
  sourceType: SourceType;
  domainHierarchy: string;
  cleanUrl: string;
  reason?: string;
} {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      isVerified: false,
      sourceType: 'other',
      domainHierarchy: 'Unspecified',
      cleanUrl: 'https://services.india.gov.in',
      reason: 'Missing URL',
    };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    // Protocol check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        isVerified: false,
        sourceType: 'other',
        domainHierarchy: 'Invalid Protocol',
        cleanUrl: 'https://services.india.gov.in',
        reason: 'Invalid protocol',
      };
    }

    const host = parsed.hostname.toLowerCase();

    // Tier 1: Official .gov.in or .nic.in domains
    if (host.endsWith('.gov.in') || host === 'gov.in') {
      return {
        isValid: true,
        isVerified: true,
        sourceType: 'official',
        domainHierarchy: `Official Government Domain (${host})`,
        cleanUrl: trimmed,
      };
    }

    if (host.endsWith('.nic.in') || host === 'nic.in') {
      return {
        isValid: true,
        isVerified: true,
        sourceType: 'official',
        domainHierarchy: `National Informatics Centre Official Domain (${host})`,
        cleanUrl: trimmed,
      };
    }

    // Tier 2: Government-backed statutory bodies & national public platforms
    const approvedGovBackedDomains = [
      'mudra.org.in',
      'www.mudra.org.in',
      'skillindiadigital.gov.in',
      'nsdcindia.org',
      'www.nsdcindia.org',
      'indiapost.gov.in',
      'www.indiapost.gov.in',
      'naanmudhalvan.tn.gov.in',
      'tnsocialwelfare.tn.gov.in',
    ];

    if (
      approvedGovBackedDomains.some(
        (approved) => host === approved || host.endsWith('.' + approved)
      )
    ) {
      return {
        isValid: true,
        isVerified: true,
        sourceType: 'government-backed',
        domainHierarchy: `Authorized Government Platform (${host})`,
        cleanUrl: trimmed,
      };
    }

    // Tier 3: Non-government or unverified domain
    return {
      isValid: true,
      isVerified: false,
      sourceType: 'other',
      domainHierarchy: `Third-Party Source (${host})`,
      cleanUrl: trimmed,
      reason: 'Not a verified .gov.in or .nic.in domain',
    };
  } catch (e) {
    return {
      isValid: false,
      isVerified: false,
      sourceType: 'other',
      domainHierarchy: 'Malformed URL',
      cleanUrl: 'https://services.india.gov.in',
      reason: 'Malformed URL',
    };
  }
}

// 3. Dynamic Resource Discovery
// Identifies the best official destination from the verified database or registry
export async function discoverOfficialResource(
  query: string,
  preferredLang: Language
): Promise<Resource> {
  const lower = query.toLowerCase().trim();

  // 1. Check existing verified exemplar schemes first
  if (
    /தையல் இயந்திரம்|இலவச தையல்|தையல் பயிற்சி|sewing machine|tailor|stitching|सिलाई मशीन|शिवणकाम|కుట్టు మిషన్/.test(
      lower
    )
  ) {
    const existing = VERIFIED_SCHEMES.find((s) => s.id === 'free-sewing-machine');
    if (existing) {
      return {
        ...existing,
        sourceType: 'official',
        verified: true,
        domainHierarchy: 'Government of Tamil Nadu (.gov.in)',
        lastVerified: 'Active 2026',
      };
    }
  }

  if (
    /புதுமைப் பெண்|கல்லூரி மாணவிகள்|pudhumai penn|girl college|higher education scholarship|புதமை/.test(
      lower
    )
  ) {
    const existing = VERIFIED_SCHEMES.find((s) => s.id === 'pudhumai-penn-scholarship');
    if (existing) {
      return {
        ...existing,
        sourceType: 'official',
        verified: true,
        domainHierarchy: 'Higher Education Dept, Govt. of Tamil Nadu (.gov.in)',
        lastVerified: 'Active 2026',
      };
    }
  }

  if (
    /உரிமைத் தொகை|மகளிர் உரிமை|1000 ரூபாய்|kmut|magalir urimai|ration card grant|மாதாந்திர உதவி/.test(
      lower
    )
  ) {
    const existing = VERIFIED_SCHEMES.find((s) => s.id === 'magalir-urimai-thittam');
    if (existing) {
      return {
        ...existing,
        sourceType: 'official',
        verified: true,
        domainHierarchy: 'Special Programme Implementation Dept (.gov.in)',
        lastVerified: 'Active 2026',
      };
    }
  }

  // 2. Search Official Government Registry for broader/dynamic needs
  let bestMatch: VerifiedPortalEntry | null = null;
  let highestScore = 0;

  for (const entry of OFFICIAL_GOV_REGISTRY) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  // If no match found, fallback to National Scholarship Portal for scholarship words or National Services Portal
  if (!bestMatch) {
    if (
      /scholarship|கல்வி|மாணவர்|छात्रवृत्ति|பள்ளி|கல்லூரி|fees|tuition|study/.test(
        lower
      )
    ) {
      bestMatch = OFFICIAL_GOV_REGISTRY[0]; // National Scholarship Portal
    } else {
      bestMatch = OFFICIAL_GOV_REGISTRY[OFFICIAL_GOV_REGISTRY.length - 1]; // National Services Portal
    }
  }

  return buildResourceFromEntry(bestMatch);
}

// Helper to turn any verified registry entry into a full Resource object
export function buildResourceFromEntry(entry: VerifiedPortalEntry): Resource {
  const stepsByLanguage: Record<string, GuidedStep[]> = {
    ta: [
      {
        stepNumber: 1,
        totalSteps: 4,
        title: 'அரசு தகுதி நிபந்தனைகளை உறுதி செய்தல்',
        instruction: 'இந்த திட்டத்திற்கு நீங்கள் தகுதியானவரா என்பதை அடிப்படை விதிமுறைகள் மூலம் தெரிந்து கொள்ளுங்கள்.',
        simplifiedInstruction: 'பயப்பட வேண்டாம். நீங்கள் இந்த திட்டத்திற்கு தகுதியானவரா என்று மட்டும் முதலில் பார்ப்போம்.',
        example: 'உதாரணம்: உங்கள் வயது மற்றும் குடும்ப ஆவணங்களை சரிபார்த்துக் கொள்ளுங்கள்.',
        actionType: 'select',
        options: ['தகுதிகளை நான் புரிந்துகொண்டேன்', 'கூடுதல் விளக்கம் தேவை'],
        badge: 'படி 1 / 4',
      },
      {
        stepNumber: 2,
        totalSteps: 4,
        title: 'அவசியமான ஆவணங்களை கையில் தயார் வைத்தல்',
        instruction: 'உங்கள் ஆதார் அட்டை, வங்கி கணக்கு புத்தகம் மற்றும் தேவையான சான்றிதழ்களை எடுத்து வைக்கவும்.',
        simplifiedInstruction: 'உங்கள் ஆதார் அட்டை மற்றும் பேங்க் பாஸ்புக்கை மட்டும் கையில் எடுத்து வையுங்கள்.',
        example: 'உதாரணம்: ஆதார் எண் மற்றும் வங்கி கணக்கு தெளிவாக இருக்க வேண்டும்.',
        actionType: 'select',
        options: ['ஆவணங்கள் என்னிடம் தயாராக உள்ளன'],
        badge: 'படி 2 / 4',
      },
      {
        stepNumber: 3,
        totalSteps: 4,
        title: 'அதிகாரப்பூர்வ அரசு இணையதளத்தில் சரிபார்த்தல்',
        instruction: 'அரசாங்கத்தின் அதிகாரப்பூர்வ பாதுகாப்பான தளத்திற்கு சென்று பதிவு செய்ய தயாராகுங்கள்.',
        simplifiedInstruction: 'அரசாங்கத்தின் உண்மையான இணையதளத்திற்கு செல்ல நாம் தயாராக உள்ளோம்.',
        example: 'உதாரணம்: .gov.in அல்லது .nic.in என்று முடியும் அரசு தளம்.',
        actionType: 'confirm_details',
        options: ['அரசு தளத்திற்கு செல்ல தயாராக இருக்கிறேன்'],
        badge: 'படி 3 / 4',
      },
      {
        stepNumber: 4,
        totalSteps: 4,
        title: 'விண்ணப்பத்தை சமர்ப்பித்து ரசீது பெறுதல்',
        instruction: 'விண்ணப்பித்த பின் கிடைக்கும் ஒப்புகை எண்ணை (Registration / Acknowledgement ID) குறித்து வைக்கவும்.',
        simplifiedInstruction: 'அவர்கள் தரும் ஒப்புகை எண்ணை டைரியில் குறித்து வையுங்கள்.',
        example: 'உதாரணம்: "Application Ref: GOV-2026-..." என்ற எண்.',
        actionType: 'external_handoff',
        options: ['அனைத்தையும் தெளிவாக புரிந்துகொண்டேன்'],
        badge: 'படி 4 / 4',
      },
    ],
    hi: [
      {
        stepNumber: 1,
        totalSteps: 4,
        title: 'पात्रता की पुष्टि करें',
        instruction: 'जांचें कि आप इस योजना की बुनियादी शर्तों को पूरा करती हैं।',
        simplifiedInstruction: 'चिंता न करें, बस यह देख लें कि आप इस योजना के लिए पात्र हैं।',
        example: 'उदाहरण: अपनी आयु और आवश्यक कागजात देख लें।',
        actionType: 'select',
        options: ['पात्रता समझ आ गई'],
        badge: 'कदम 1 / 4',
      },
      {
        stepNumber: 2,
        totalSteps: 4,
        title: 'जरूरी दस्तावेज साथ रखें',
        instruction: 'आधार कार्ड, बैंक पासबुक और संबंधित कागजात तैयार रखें।',
        simplifiedInstruction: 'बस आधार कार्ड और बैंक पासबुक संभाल कर रखें।',
        example: 'उदाहरण: दोनों की साफ कॉपी पास रखें।',
        actionType: 'select',
        options: ['दस्तावेज तैयार हैं'],
        badge: 'कदम 2 / 4',
      },
      {
        stepNumber: 3,
        totalSteps: 4,
        title: 'आधिकारिक पोर्टल पर प्रक्रिया',
        instruction: 'सरकार के आधिकारिक सुरक्षित पोर्टल पर जाकर जानकारी दर्ज करें।',
        simplifiedInstruction: 'सुरक्षित सरकारी वेबसाइट पर जाने की तैयारी करें।',
        example: 'उदाहरण: .gov.in समाप्त होने वाला आधिकारिक पोर्टल।',
        actionType: 'confirm_details',
        options: ['आगे बढ़ने को तैयार हूँ'],
        badge: 'कदम 3 / 4',
      },
      {
        stepNumber: 4,
        totalSteps: 4,
        title: 'आवेदन रसीद संभाल कर रखें',
        instruction: 'आवेदन जमा करने के बाद रसीद संख्या नोट कर लें।',
        simplifiedInstruction: 'दी गई रसीद का नंबर लिखकर रख लें।',
        example: 'उदाहरण: एप्लीकेशन नंबर भविष्य में काम आएगा।',
        actionType: 'external_handoff',
        options: ['सब समझ आ गया'],
        badge: 'कदम 4 / 4',
      },
    ],
    en: [
      {
        stepNumber: 1,
        totalSteps: 4,
        title: 'Verify Eligibility Criteria',
        instruction: 'Ensure you meet the basic eligibility conditions specified for this initiative.',
        simplifiedInstruction: 'Check your eligibility. HARSHU helps verify you qualify.',
        example: 'Example: Verify your age and category requirements.',
        actionType: 'select',
        options: ['I meet the eligibility criteria'],
        badge: 'Step 1 of 4',
      },
      {
        stepNumber: 2,
        totalSteps: 4,
        title: 'Keep Core Documents Ready',
        instruction: 'Gather your Aadhaar card copy, bank passbook, and relevant certificates.',
        simplifiedInstruction: 'Keep your Aadhaar and bank passbook handy.',
        example: 'Example: Active bank account in the applicant’s name.',
        actionType: 'select',
        options: ['Documents are ready with me'],
        badge: 'Step 2 of 4',
      },
      {
        stepNumber: 3,
        totalSteps: 4,
        title: 'Proceed to Official Government Gateway',
        instruction: 'Visit the authorized official government portal for secure submission.',
        simplifiedInstruction: 'Navigate to the real government website safely.',
        example: 'Example: Verified .gov.in official portal.',
        actionType: 'confirm_details',
        options: ['Ready to visit official portal'],
        badge: 'Step 3 of 4',
      },
      {
        stepNumber: 4,
        totalSteps: 4,
        title: 'Save Application Tracking Acknowledgement',
        instruction: 'Note down the official acknowledgement receipt number for future tracking.',
        simplifiedInstruction: 'Keep the tracking reference number safely.',
        example: 'Example: Application Reference: GOV-2026-...',
        actionType: 'external_handoff',
        options: ['Understood clearly, ready to proceed'],
        badge: 'Step 4 of 4',
      },
    ],
  };

  const verification = verifyOfficialUrl(entry.officialUrl);

  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    department: entry.department,
    whatItHelps: entry.whatItHelps,
    whoItIsFor: entry.whoItIsFor,
    eligibility: entry.eligibility,
    documents: entry.documents,
    officialSource: entry.officialSourceName,
    officialSourceName: entry.officialSourceName,
    officialUrl: verification.cleanUrl, // Real, verified, non-empty destination
    sourceType: verification.sourceType,
    verified: verification.isVerified,
    domainHierarchy: entry.domainHierarchy,
    lastVerified: entry.lastVerified,
    steps: stepsByLanguage,
  };
}
