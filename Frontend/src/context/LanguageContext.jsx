import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {},
  ne: {
    'Overview': 'अवलोकन', 'Citizen directory': 'नागरिक विवरण', 'Register citizen': 'नागरिक दर्ता',
    'Verification queue': 'प्रमाणीकरण सूची', 'Audit history': 'लेखापरीक्षण इतिहास', 'WORKSPACE': 'कार्यस्थल',
    'Need assistance?': 'सहयोग चाहिन्छ?', 'Contact system administrator': 'प्रणाली प्रशासकलाई सम्पर्क गर्नुहोस्',
    'Secure workspace': 'सुरक्षित कार्यस्थल', 'Municipal Registry': 'नगरपालिका अभिलेख',
    'Loading secure workspace…': 'सुरक्षित कार्यस्थल लोड हुँदैछ…', 'STAFF PORTAL': 'कर्मचारी पोर्टल',
    'Welcome back': 'फेरि स्वागत छ', 'Sign in with your municipal account to continue.': 'जारी राख्न आफ्नो नगरपालिका खाताबाट साइन इन गर्नुहोस्।',
    'Email address': 'इमेल ठेगाना', 'Password': 'पासवर्ड', 'Enter your password': 'आफ्नो पासवर्ड लेख्नुहोस्',
    'Sign in': 'साइन इन', 'Signing in…': 'साइन इन हुँदैछ…', 'Your connection is protected with secure authentication.': 'तपाईंको जडान सुरक्षित प्रमाणीकरणद्वारा सुरक्षित छ।',
    'For authorized municipal personnel only': 'अधिकृत नगरपालिका कर्मचारीका लागि मात्र', 'Get help': 'सहयोग लिनुहोस्',
    'DIGITAL MUNICIPAL SERVICES': 'डिजिटल नगरपालिका सेवा', 'A clearer picture': 'समुदायको स्पष्ट चित्र',
    'of our community.': '', 'One secure place to manage citizen profiles, households and ward level insights.': 'नागरिक विवरण, घरपरिवार र वडा स्तरका जानकारी व्यवस्थापन गर्ने सुरक्षित स्थान।',
    'Citizen registry': 'नागरिक अभिलेख', 'CITIZEN REGISTRY': 'नागरिक अभिलेख',
    'Register a citizen': 'नागरिक दर्ता गर्नुहोस्', 'Add a citizen profile and optionally link them to a household.': 'नागरिक विवरण थप्नुहोस् र चाहेमा घरपरिवारसँग जोड्नुहोस्।',
    'Back to directory': 'सूचीमा फर्कनुहोस्', 'Personal information': 'व्यक्तिगत विवरण', 'Basic details for the citizen profile': 'नागरिक विवरणका आधारभूत जानकारी',
    'Full name': 'पूरा नाम', 'Phone number': 'फोन नम्बर', 'Ward number': 'वडा नम्बर', 'Assigned automatically from your account.': 'तपाईंको खाताबाट स्वतः निर्धारण हुन्छ।',
    'Household information': 'घरपरिवारको विवरण', 'Household details are optional': 'घरपरिवारको विवरण वैकल्पिक हो',
    'Household identifier': 'घरपरिवार पहिचान नम्बर', 'Optional': 'वैकल्पिक', 'Residential area / tole': 'बसोबास क्षेत्र / टोल',
    'Family members': 'परिवारका सदस्य', 'Family member names': 'परिवारका सदस्यको नाम', 'Add family member': 'परिवारका सदस्य थप्नुहोस्', 'Remove family member': 'परिवारका सदस्य हटाउनुहोस्', 'Add each family member as a separate name.': 'प्रत्येक परिवार सदस्यको नाम छुट्टाछुट्टै थप्नुहोस्।', 'Head of household': 'घरमूली', 'Optional; only collect if needed.': 'आवश्यक भएमा मात्र भर्नुहोस्।',
    'Enter one name per line': 'प्रत्येक पङ्क्तिमा एउटा नाम लेख्नुहोस्', 'Enter up to 50 names, one per line or separated by commas.': '५० जनासम्मका नाम लेख्नुहोस्; प्रत्येक पङ्क्तिमा एउटा नाम वा अल्पविरामले छुट्याउनुहोस्।',
    'Enter an identifier to link this citizen to a household.': 'नागरिकलाई घरपरिवारसँग जोड्न पहिचान नम्बर लेख्नुहोस्।',
    'Enter tole or settlement': 'टोल वा बस्ती लेख्नुहोस्', 'Economic classification': 'आर्थिक वर्गीकरण',
    'Record how the category was established': 'वर्ग कसरी निर्धारण गरिएको हो उल्लेख गर्नुहोस्', 'Category': 'वर्ग',
    'Higher income group': 'उच्च आय समूह', 'Middle income group': 'मध्यम आय समूह', 'Economically vulnerable': 'आर्थिक रूपमा विपन्न',
    'Classification source': 'वर्गीकरणको स्रोत', 'Self reported': 'स्वयं घोषणा', 'Provisional assessment': 'प्रारम्भिक मूल्याङ्कन',
    'Assessment notes': 'मूल्याङ्कन टिप्पणी', 'Brief supporting context': 'संक्षिप्त सहयोगी विवरण', 'Submission summary': 'पेश विवरणको सारांश',
    'Before you submit, confirm these details.': 'पेश गर्नुअघि यी विवरण जाँच गर्नुहोस्।', 'Submitted by': 'पेश गर्ने व्यक्ति',
    'Assigned ward': 'तोकिएको वडा', 'Initial status': 'प्रारम्भिक अवस्था', 'Pending review': 'समीक्षाको प्रतीक्षामा',
    'Save citizen record': 'नागरिक विवरण सुरक्षित गर्नुहोस्', 'Saving…': 'सुरक्षित हुँदैछ…', 'Cancel': 'रद्द गर्नुहोस्',
    'Search and review citizen profiles in your authorized scope.': 'तपाईंलाई अनुमति भएको क्षेत्रका नागरिक विवरण खोज्नुहोस् र हेर्नुहोस्।',
    'Search by citizen name...': 'नागरिकको नामबाट खोज्नुहोस्...', 'All statuses': 'सबै अवस्था', 'Pending': 'प्रतीक्षारत', 'Verified': 'प्रमाणित',
    'Rejected': 'अस्वीकृत', 'Needs correction': 'सच्याउनुपर्ने', 'All categories': 'सबै वर्ग', 'Export CSV': 'CSV निर्यात',
    'No records match these filters.': 'यी छनोटसँग मिल्ने विवरण भेटिएन।', 'Access is restricted to your assigned role and ward.': 'पहुँच तपाईंको भूमिका र तोकिएको वडामा सीमित छ।',
    'Review submitted profiles and record a decision.': 'पेश गरिएका विवरण जाँचेर निर्णय अभिलेख गर्नुहोस्।',
    'Submitted records': 'पेश गरिएका विवरण', 'Review the submitted information before making a decision.': 'निर्णय गर्नुअघि पेश गरिएको जानकारी जाँच गर्नुहोस्।',
    'Review': 'जाँच गर्नुहोस्', 'No pending records. New submissions will appear here.': 'समीक्षाका लागि विवरण छैन। नयाँ विवरण यहाँ देखिनेछन्।',
    'Recent activity': 'हालैका गतिविधि', 'Latest 200 recorded actions': 'पछिल्ला २०० अभिलेखित कार्य',
    'No audit actions have been recorded.': 'कुनै लेखापरीक्षण कार्य अभिलेख गरिएको छैन।', 'Total citizens': 'कुल नागरिक',
    'Households': 'घरपरिवार', 'Verified records': 'प्रमाणित विवरण', 'Awaiting review': 'समीक्षाको प्रतीक्षामा',
    'Ward performance': 'वडाको प्रगति', 'Export report': 'प्रतिवेदन निर्यात',
    'Citizen Information Management System': 'नागरिक सूचना व्यवस्थापन प्रणाली',
    'Delete citizen record': 'नागरिक विवरण मेटाउनुहोस्', 'Delete': 'मेटाउनुहोस्',
    'Could not delete the citizen record.': 'नागरिक विवरण मेटाउन सकिएन।'
    ,'We couldn’t sign you in. Check your details and try again.': 'साइन इन हुन सकेन। आफ्नो विवरण जाँच गरी पुनः प्रयास गर्नुहोस्।'
    ,'WARD 1 OVERVIEW': 'वडा १ अवलोकन', 'MUNICIPAL OVERVIEW': 'नगरपालिका अवलोकन', 'Good morning,': 'शुभ प्रभात,',
    'Here’s what’s happening in your ward today.': 'आज तपाईंको वडामा भइरहेका गतिविधिहरू।',
    'Here’s what’s happening across Dhulikhel Municipality today.': 'आज धुलिखेल नगरपालिकाभर भइरहेका गतिविधिहरू।',
    'Registered profiles': 'दर्ता भएका विवरण', 'Unique households': 'अद्वितीय घरपरिवार', 'Admin reviewed': 'प्रशासकद्वारा समीक्षा',
    'Pending verification': 'प्रमाणीकरणको प्रतीक्षामा',
    'Registration and verification across all wards': 'सबै वडाको दर्ता र प्रमाणीकरण', 'This year': 'यस वर्ष',
    'Ward overview': 'वडा अवलोकन', 'Citizen profiles by ward': 'वडाअनुसार नागरिक विवरण', 'View all': 'सबै हेर्नुहोस्',
    'Recently registered': 'हालै दर्ता भएका', 'The latest citizen profiles submitted to the registry': 'अभिलेखमा पेश गरिएका पछिल्ला नागरिक विवरण',
    'Ward / area': 'वडा / क्षेत्र', 'Household': 'घरपरिवार', 'Classification': 'वर्गीकरण', 'Status': 'अवस्था',
    'Submitted': 'पेश गरिएको', 'Phone not provided': 'फोन नम्बर दिइएको छैन', 'Showing': 'देखाइँदैछ',
    'records': 'विवरण', 'record': 'विवरण', 'Loading records…': 'विवरण लोड हुँदैछ…',
    'Could not save the citizen record.': 'नागरिक विवरण सुरक्षित गर्न सकिएन।',
    'Dashboard information could not be loaded.': 'ड्यासबोर्डको जानकारी लोड हुन सकेन।',
    'Citizen records will appear here when submitted.': 'पेश गरिएका नागरिक विवरण यहाँ देखिनेछन्।',
    'AUDIT HISTORY': 'लेखापरीक्षण इतिहास'
  }
};

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: (value) => value });
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('app-language') || 'en');
  const setLanguage = (next) => { localStorage.setItem('app-language', next); setLanguageState(next); };
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: (value) => translations[language]?.[value] ?? value }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
