/**
 * Per-biomarker High/Low patient explanations across all display languages.
 *
 * Kept in its own module so it ships inside the lazy chunks that actually
 * render explanations (AnalyzeView / HistoryAndTrends / pdfExport) instead
 * of the eager main bundle (Phase 9.5).
 */
import type { SupportedLanguage } from '../types';
import { CATALOG_INDEX } from './catalog';

export const EXPLANATION_TRANSLATIONS: Record<string, { low: Record<SupportedLanguage, string>; high: Record<SupportedLanguage, string> }> = {
    hemoglobin: {
        low: {
            en: 'Your hemoglobin level is below normal, indicating anemia. This reduces oxygen transport, causing fatigue, weakness, or breathlessness.',
            hi: 'आपका हीमोग्लोबिन स्तर कम है, जो एनीमिया को दर्शाता है। इससे ऑक्सीजन का प्रवाह कम हो जाता है, जिससे कमजोरी और थकान महसूस हो सकती है।',
            mr: 'तुमचे हिमोग्लोबिनचे प्रमाण कमी आहे, जे ॲनिमियाचे लक्षण आहे. यामुळे शरीरात ऑक्सिजनचा पुरवठा कमी होतो, ज्यामुळे थकवा जाणवतो.',
            bn: 'আপনার হিমোগ্লোবিনের মাত্রা কম, যা রক্তাল্পতার লক্ষণ। এটি শরীরে অক্সিজেন সরবরাহ কমায়, যার ফলে ক্লান্তি ও দুর্বলতা দেখা দেয়।',
            te: 'మీ హిమోగ్లోబిన్ స్థాయి తక్కువగా ఉంది, ఇది రక్తహీనతను సూచిస్తుంది. ఇది ఆక్సిజన్ రవాణాను తగ్గిస్తుంది, అలసట మరియు బలహీనతకు దారితీస్తుంది.',
            ta: 'உங்கள் ஹீமோகுளோபின் அளவு குறைவாக உள்ளது, இது இரத்த சோகையைக் குறிக்கிறது. இது உடலுக்கு ஆக்சிஜன் செல்வதைக் குறைத்து, சோர்வை ஏற்படுத்தும்.',
            gu: 'તમારું હિમોગ્લોબિન સ્તર ઓછું છે, જે એનિમિયા સૂચવે છે. આનાથી शरीરમાં ઓક્સિજનનું વહન ઘટે છે, જેથી થાક અને નબળાઈ લાગે છે.',
            es: 'Su nivel de hemoglobina es bajo, lo que indica anemia. Esto reduce el transporte de oxígeno, causando fatiga, debilidad o falta de aliento.',
            fr: 'Votre taux d\'hémoglobine est bas, indiquant une anémie. Cela réduit le transport d\'oxygène, causant de la fatigue ou des faiblesses.',
            zh: '您的血红蛋白水平偏低，表明可能存在贫血。这会减少体内的氧气输送，导致疲劳、无力或气短。'
        },
        high: {
            en: 'Your hemoglobin level is high, which can be due to dehydration, smoking, chronic hypoxia, or bone marrow overproduction.',
            hi: 'आपका हीमोग्लोबिन स्तर उच्च है, जो निर्जलीकरण, धूम्रपान, या लाल रक्त कोशिकाओं के अत्यधिक उत्पादन के कारण हो सकता है।',
            mr: 'तुमचे हिमोग्लोबिनचे प्रमाण जास्त आहे, जे डिहायड्रेशन, धूम्रपान किंवा तांबड्या पेशींच्या अतिनिर्मितीमुळे असू शकते.',
            bn: 'আপনার হিমোগ্লোবিনের মাত্রা বেশি, যা পানিশূন্যতা, ধূমপান বা অতিরিক্ত লোহিত রক্তকণিকা তৈরির কারণে হতে পারে।',
            te: 'మీ హిమోగ్లోబిన్ స్థాయి ఎక్కువగా ఉంది, ఇది డీహైడ్రేషన్, ధూమపానం లేదా ఎర్ర రక్త కణాల అధిక ఉత్పత్తి వల్ల కావచ్చు.',
            ta: 'உங்கள் ஹீமோகுளோபின் அளவு அதிகமாக உள்ளது, இது நீர்ச்சத்து குறைப்பாடு, புகைபிடித்தல் அல்லது இரத்த அணுக்களின் அதிகப்படியான உற்பத்தியால் ஏற்படலாம்.',
            gu: 'તમારું હિમોગ્લોબિન સ્તર ઊંચું છે, જે ડીહાઇડ્રેશન, ધૂમ્રપાન અથવા લાલ રક્તકણોના વધુ પડતા ઉત્પાદનને કારણે હોઈ શકે છે.',
            es: 'Su nivel de hemoglobina es alto, lo que puede deberse a deshidratación, tabaquismo, hipoxia crónica o sobreproducción de la médula ósea.',
            fr: 'Votre taux d\'hémoglobine est élevé, ce qui peut être dû à une déshydratation, au tabagisme ou à une surproduction de globules rouges.',
            zh: '您的血红蛋白水平偏高，可能是由于脱水、吸烟、慢性缺氧或骨髓过度增生所致。'
        }
    },
    wbc: {
        low: {
            en: 'A low white blood cell count (leukopenia) weakens your immune system, making you more susceptible to infections.',
            hi: 'सफेद रक्त कोशिकाओं की कमी (ल्यूकोपेनिया) प्रतिरक्षा प्रणाली को कमजोर करती है, जिससे संक्रमण का खतरा बढ़ जाता है।',
            mr: 'पांढऱ्या पेशींची संख्या कमी असणे (ल्यूकोपेनिया) तुमची प्रतिकारशक्ती कमकुवत करते, ज्यामुळे इन्फेक्शन होण्याचा धोका वाढतो.',
            bn: 'শ্বেত রক্তকণিকার কম সংখ্যা (লিউকোপেনিয়া) রোগ প্রতিরোধ ক্ষমতা দুর্বল করে, ফলে সংক্রমণের ঝুঁকি বেড়ে যায়।',
            te: 'తెల్ల రక్త కణాల సంఖ్య తక్కువగా ఉండటం వల్ల మీ రోగనిరోధక శక్తి బలహీనపడుతుంది, దీనివల్ల ఇన్ఫెక్షన్లు వచ్చే ప్రమాదం పెరుగుతుంది.',
            ta: 'வெள்ளை இரத்த அணுக்களின் எண்ணிக்கை குறைவாக இருப்பது உங்கள் நோய் எதிர்ப்பு சக்தியை பலவீனப்படுத்தி, தொற்றுநோய்களை எளிதில் வரவழைக்கும்.',
            gu: 'શ્વેત રક્તકણોની ઓછી संख्या રોગપ્રતિકારક શક્તિને નબળી પાડે છે, જેથી ચેપ લાગવાનું જોખમ વધી જાય છે.',
            es: 'Un recuento bajo de glóbulos blancos (leucopenia) debilita su sistema inmunológico, haciéndolo más susceptible a infecciones.',
            fr: 'Un taux bas de globules blancs (leucopénie) affaiblit votre système immunitaire, vous rendant plus sensible aux infections.',
            zh: '白细胞计数偏低（白细胞减少症）会削弱您的免疫系统，使您更容易受到感染。'
        },
        high: {
            en: 'A high white blood cell count (leukocytosis) usually indicates that the body is fighting an infection or inflammation.',
            hi: 'सफेद रक्त कोशिकाओं की अधिकता आमतौर पर यह दर्शाती है कि शरीर किसी संक्रमण या सूजन से लड़ रहा है।',
            mr: 'पांढऱ्या पेशींची संख्या जास्त असणे हे दर्शवते की तुमचे शरीर एखाद्या इन्फेक्शन किंवा दाहकतेशी (सूज) लढत आहे.',
            bn: 'শ্বেত রক্তকণিকার আধিক্য সাধারণত নির্দেশ করে যে শরীর কোনো সংক্রমণ বা প্রদাহের বিরুদ্ধে লড়াই করছে।',
            te: 'తెల్ల రక్త కణాల సంఖ్య ఎక్కువగా ఉండటం సాధారణంగా శరీరం ఏదైనా ఇన్ఫెక్షన్ లేదా మంటతో పోరాడుతున్నట్లు సూచిస్తుంది.',
            ta: 'வெள்ளை இரத்த அணுக்கள் அதிகமாக இருப்பது பொதுவாக உங்கள் உடல் ஏதோ ஒரு தொற்று அல்லது அலற்சியை எதிர்த்துப் போராடுவதைக் காட்டுகிறது.',
            gu: 'શ્વેત રક્તકણોની ઊંચી સંખ્યા દર્શાવે છે કે શરીર કોઈ ચેપ અથવા બળતરા સામે લડી રહ્યું છે.',
            es: 'Un recuento alto de glóbulos blancos (leucocitosis) suele indicar que el cuerpo está combatiendo una infección o inflamación.',
            fr: 'Un taux élevé de globules blancs (leucocytose) indique généralement que le corps combat une infection ou une inflammation.',
            zh: '白细胞计数偏高（白细胞增多症）通常表明身体正在对抗感染或炎症。'
        }
    },
    platelets: {
        low: {
            en: 'A low platelet count (thrombocytopenia) impairs blood clotting, which can cause easy bruising or prolonged bleeding.',
            hi: 'प्लेटलेट्स की कमी (थ्रोम्बोसाइटोपेनिया) थक्के जमने की प्रक्रिया को प्रभावित करती है, जिससे चोट या रक्तस्राव का खतरा बढ़ता है।',
            mr: 'प्लेटलेटची संख्या कमी असणे रक्ताची गुठळी होण्यास अडथळा आणते, ज्यामुळे जखमा होऊन रक्तस्त्राव वाढू शकतो.',
            bn: 'প্লাটিলেটের কম সংখ্যা রক্ত জমাট বাঁধায় বাধা দেয়, যার ফলে সহজেই কালশিটে পড়া বা দীর্ঘস্থায়ী রক্তপাত হতে পারে।',
            te: 'ప్లేట్‌లెట్ సంఖ్య తక్కువగా ఉండటం రక్తం గడ్డకట్టడాన్ని దెబ్బతీస్తుంది, దీనివల్ల సులభంగా కమిలిపోవడం లేదా ఎక్కువ రక్తస్రావం కావచ్చు.',
            ta: 'பிளேட்லெட் எண்ணிக்கை குறைவாக இருப்பது இரத்தம் உறைவதைத் தடுத்து, எளிதில் தழும்பு அல்லது அதிக இரத்தப்போக்கை ஏற்படுத்தலாம்.',
            gu: 'પ્લેટલેટની ઓછી સંખ્યા લોહી જામી જવાની ક્ષમતા ઘટાડે છે, જેથી સહેલાઇથી બળતરા કે લોહી વહેવાનું જોખમ રહે છે.',
            es: 'Un recuento bajo de plaquetas (trombocitopenia) dificulta la coagulación de la sangre, lo que causa moretones o sangrado prolongado.',
            fr: 'Un taux de plaquettes bas (thrombopénie) nuit à la coagulation du sang, pouvant causer des ecchymoses ou des saignements prolongés.',
            zh: '血小板计数偏低（血小板减少症）会影响血液凝固，导致容易出现瘀伤或出血不止。'
        },
        high: {
            en: 'A high platelet count (thrombocytosis) can increase the risk of blood clots. It is often a response to inflammation or infection.',
            hi: 'प्लेटलेट्स की अधिकता से रक्त के थक्के जमने का खतरा बढ़ सकता है। यह अक्सर सूजन या संक्रमण की प्रतिक्रिया में होता है।',
            mr: 'प्लेटलेटची संख्या जास्त असल्यास रक्ताच्या गुठळ्या होण्याचा धोका वाढतो. हे बऱ्याचदा सूज किंवा इन्फेक्शनमुळे होते.',
            bn: 'প্লাটিলেট বেশি থাকলে রক্ত জমাট বাঁধার ঝুঁকি বাড়ে। এটি সাধারণত প্রদাহ বা সংক্রমণের কারণে হয়ে থাকে।',
            te: 'ప్లేట్‌లెట్ సంఖ్య ఎక్కువగా ఉండటం వల్ల రక్తం గడ్డకట్టే ప్రమాదం పెరుగుతుంది. ఇది ఇన్ఫెక్షన్ లేదా మంట వల్ల కావచ్చు.',
            ta: 'பிளேட்லெட் எண்ணிக்கை அதிகமாக இருப்பது இரத்தம் உறைதல் அபாயத்தை அதிகரிக்கும். இது அலற்சி அல்லது தொற்றுக்கு எதிரான எதிர்வினையாக இருக்கலாம்.',
            gu: 'પ્લેટલેટની ઊંચી સંખ્યા લોહીની ગાંઠો થવાનું જોખમ વધારે છે. આ બળતરા અથવા ચેપની પ્રતિક્રિયા હોઈ શકે છે.',
            es: 'Un recuento alto de plaquetas (trombocitosis) puede aumentar el riesgo de coágulos sanguíneos, a menudo debido a inflamación.',
            fr: 'Un taux de plaquettes élevé (thrombocytose) peut augmenter le risque de caillots sanguins, souvent lié à une inflammation.',
            zh: '血小板计数偏高（血小板增多症）可能会增加血栓风险。这通常是由于身体存在炎症或感染所致。'
        }
    },
    rbc: {
        low: {
            en: 'A low red blood cell count (anemia) means your tissues are receiving less oxygen, which leads to fatigue and weakness.',
            hi: 'लाल रक्त कोशिकाओं की कमी (एनीमिया) का अर्थ है कि ऊतकों को कम ऑक्सीजन मिल रही है, जिससे थकान और कमजोरी होती है।',
            mr: 'लाल पेशींची संख्या कमी असणे (ॲनिमिया) म्हणजे शरीराच्या अवयवांना कमी ऑक्सिजन मिळणे, ज्यामुळे थकवा येतो.',
            bn: 'লোহিত রক্তকণিকা কম থাকার অর্থ টিস্যু কম অক্সিজেন পাচ্ছে, যার ফলে শরীরে ক্লান্তি ও দুর্বলতা দেখা দেয়।',
            te: 'ఎర్ర రక్త కణాల సంఖ్య తక్కువగా ఉండటం వల్ల కణజాలాలకు తక్కువ ఆక్సిజన్ అందుతుంది, ఇది అలసట మరియు బలహీనతకు దారితీస్తుంది.',
            ta: 'சிவப்பு இரத்த அணுக்கள் குறைவாக இருப்பது உங்கள் திசுக்களுக்கு ஆக்சிஜன் குறைவாகச் செல்வதைக் காட்டுகிறது, இது சோர்வை ஏற்படுத்தும்.',
            gu: 'લાલ રક્તકણોની ઓછી સંખ્યા એટલે પેશીઓને ઓછો ઓક્સિજન મળી રહ્યો છે, જેના કારણે થાક आणि નબળાઈ અનુભવાય છે.',
            es: 'Un recuento bajo de glóbulos rojos (anemia) significa que sus tejidos reciben menos oxígeno, lo que provoca fatiga y debilidad.',
            fr: 'Un taux bas de globules rouges (anémie) signifie que vos tissus reçoivent moins d\'oxygène, ce qui entraîne de la fatigue.',
            zh: '红细胞计数偏低（贫血）意味着您的身体组织获得的氧气减少，从而导致疲劳和无力。'
        },
        high: {
            en: 'An elevated red blood cell count (erythrocytosis) makes the blood thicker, which can be linked to dehydration or smoking.',
            hi: 'लाल रक्त कोशिकाओं की अधिकता से रक्त गाढ़ा हो जाता है, जो निर्जलीकरण या धूम्रपान से जुड़ा हो सकता है।',
            mr: 'लाल पेशींची संख्या जास्त असल्यास रक्त घट्ट होते, जे डिहायड्रेशन किंवा धूम्रपानाशी संबंधित असू शकते.',
            bn: 'লোহিত রক্তকণিকার আধিক্য রক্তকে ঘন করে তোলে, যা পানিশূন্যতা বা ধূমপানের সাথে সম্পর্কিত হতে পারে।',
            te: 'ఎర్ర రక్త కణాల సంఖ్య ఎక్కువగా ఉండటం వల్ల రక్తం చిక్కబడుతుంది, ఇది డీహైడ్రేషన్ లేదా ధూమపానంతో ముడిపడి ఉండవచ్చు.',
            ta: 'சிவப்பு இரத்த அணுக்கள் அதிகமாக இருப்பது இரத்தத்தை தடிமனாக்கும், இது நீர்ச்சத்து குறைபாடு அல்லது புகைபிடித்தலோடு தொடர்புடையது.',
            gu: 'લાલ રક્તકણોની વધુ સંખ્યા લોહીને ઘટ્ટ બનાવે છે, જે ડીહાઇડ્રેશન કે ધૂમ્રપાન સાથે સંકળાયેલ હોઈ શકે છે.',
            es: 'Un recuento elevado de glóbulos rojos (eritrocitosis) espesa la sangre, lo que puede estar relacionado con deshidratación o tabaquismo.',
            fr: 'Un taux de globules rouges élevé (érythrocytose) épaissit le sang, ce qui peut être lié à la déshydratation ou au tabac.',
            zh: '红细胞计数偏高（红细胞增多症）会使血液粘稠度增高，这可能与脱水或吸烟有关。'
        }
    },
    hematocrit: {
        low: {
            en: 'Low hematocrit indicates a low proportion of red blood cells in the blood, commonly associated with anemia.',
            hi: 'कम हेमेटोक्रिट रक्त में लाल रक्त कोशिकाओं के कम अनुपात को दर्शाता है, जो आमतौर पर एनीमिया से जुड़ा होता है।',
            mr: 'कमी हेमेटोक्रिट रक्तात लाल पेशींचे प्रमाण कमी असल्याचे दर्शवते, जे सामान्यतः ॲनिमियामध्ये आढळते.',
            bn: 'কম হেমাটোক্রিট রক্তে লোহিত রক্তকণিকার কম অনুপাত নির্দেশ করে, যা সাধারণত রক্তাল্পতার সাথে জড়িত।',
            te: 'తక్కువ హెమటోక్రిట్ రక్తంలో ఎర్ర రక్త కణాల నిష్పత్తి తక్కువగా ఉన్నట్లు సూచిస్తుంది, ఇదిక రక్తహీనతను చూపిస్తుంది.',
            ta: 'குறைந்த ஹெமாட்டோகிரிட் இரத்தத்தில் சிவப்பு அணுக்களின் விகிதம் குறைவாக இருப்பதைக் குறிக்கிறது, இது பொதுவாக சோகையுடன் தொடர்புடையது.',
            gu: 'નીચું હેમેટોક્રિટ લોહીમાં લાલ રક્તકણોનું ઓછું પ્રમાણ દર્શાવે છે, જે સામાન્ય રીતે એનિમિયા સાથે જોડાયેલ હોય છે.',
            es: 'Un hematocrito bajo indica una proporción baja de glóbulos rojos en la sangre, comúnmente asociado con anemia.',
            fr: 'Un hématocrite bas indique une faible proportion de globules rouges dans le sang, généralement associée à une anémie.',
            zh: '红细胞压积偏低表明血液中红细胞的比例较低，这通常与贫血有关。'
        },
        high: {
            en: 'High hematocrit means a higher concentration of red cells, very commonly caused by temporary dehydration.',
            hi: 'उच्च हेमेटोक्रिट का मतलब है लाल कोशिकाओं की अधिक सांद्रता, जो आमतौर पर अस्थायी निर्जलीकरण के कारण होती है।',
            mr: 'जास्त हेमेटोक्रिट म्हणजे लाल पेशींचे प्रमाण वाढणे, जे सामान्यतः तात्पुरत्या डिहायड्रेशनमुळे होते.',
            bn: 'উচ্চ হেমাটোক্রিট রক্তে লোহিত রক্তকণিকার বেশি ঘনত্ব নির্দেশ করে, যা পানিশূন্যতার কারণে হতে পারে।',
            te: 'అధిక హెమటోక్రిట్ ఎర్ర కణాల సాంద్రత ఎక్కువగా ఉన్నట్లు సూచిస్తుంది, ఇది సాధారణంగా డీహైడ్రేషన్ వల్ల జరుగుతుంది.',
            ta: 'அதிக ஹெமாட்டோகிரிட் சிவப்பு அணுக்களின் அடர்த்தி அதிகமாக இருப்பதைக் குறிக்கிறது, இது நீர்ச்சத்து குறைபாட்டால் நிகழலாம்.',
            gu: 'ઊંચું હેમેટોક્રિટ લાલ રક્તકણોની વધુ સાંદ્રતા દર્શાવે છે, જે મોટે ભાગે હંગામી ડીહાઇડ્રેશનને કારણે થાય છે.',
            es: 'Un hematocrito alto significa una mayor concentración de glóbulos rojos, muy comúnmente causado por deshidratación temporal.',
            fr: 'Un hématocrite élevé indique une concentration accrue de globules rouges, très souvent causée par une déshydratation temporaire.',
            zh: '红细胞压积偏高意味着红细胞浓度升高，这通常是由于暂时性脱水引起的。'
        }
    },
    cholesterol: {
        low: {
            en: 'Low total cholesterol is rare but can be linked to malnutrition, malabsorption, hyperthyroidism, or liver disease.',
            hi: 'कम कुल कोलेस्ट्रॉल दुर्लभ है लेकिन यह कुपोषण, अतिसक्रिय थायराइड, या यकृत रोग से जुड़ा हो सकता है।',
            mr: 'कमी कोलेस्ट्रॉल दुर्मिळ आहे, परंतु ते कुपोषण, हायपरथायरॉईडीझम किंवा यकृताच्या आजाराशी संबंधित असू शकते.',
            bn: 'কম মোট কোলেস্টেরল বিরল তবে এটি অপুষ্টি, থাইরয়েডের অতিসক্রিয়তা বা লিভারের রোগের সাথে সম্পর্কিত হতে পারে।',
            te: 'తక్కువ కొలెస్ట్రాల్ అరుదు, కానీ ఇది పోషకాహార లోపం, థైరాయిడ్ సమస్యలు లేదా కాలేయ వ్యాధితో ముడిపడి ఉండవచ్చు.',
            ta: 'குறைந்த கொழுப்பு அளவு அரிதானது, ஆனால் அது ஊட்டச்சத்து குறைபாடு, கல்லீரல் நோய் அல்லது தைராய்டு சுரப்பு அதிகரிப்போடு தொடர்புடையதாக இருக்கலாம்.',
            gu: 'નીચું કુલ કોલેસ્ટ્રોલ દુર્લભ છે પરંતુ તે કુપોષણ, અતિસક્રિય થાઇરોઇડ અથવા લિવરની બીમારી સાથે સંકળાયેલ હોઈ શકે.',
            es: 'El colesterol total bajo es poco común, pero puede estar relacionado con desnutrición, hipertiroidismo o enfermedad hepática.',
            fr: 'Un taux de cholestérol total bas est rare, mais peut être lié à la dénutrition, l\'hyperthyroïdie ou une maladie du foie.',
            zh: '总胆固醇偏低较罕见，可能与营养不良、吸收不良、甲状腺功能亢进或肝脏疾病有关。'
        },
        high: {
            en: 'High total cholesterol increases the risk of cardiovascular disease. Diet, exercise, and genetics play major roles.',
            hi: 'उच्च कोलेस्ट्रॉल हृदय रोग के खतरे को बढ़ाता है। आहार, व्यायाम और आनुवंशिकी इसमें महत्वपूर्ण भूमिका निभाते हैं।',
            mr: 'एकूण कोलेस्ट्रॉल जास्त असल्यास हृदयविकाराचा धोका वाढतो. आहार, व्यायाम आणि अनुवंशिकता यात महत्त्वाची भूमिका बजावतात.',
            bn: 'উচ্চ কোলেস্টেরল হৃদরোগের ঝুঁকি বাড়ায়। খাদ্যতালিকা, শারীরিক কসরত এবং বংশগত কারণ এতে ভূমিকা রাখে।',
            te: 'అధిక కొలెస్ట్రాల్ గుండె జబ్బుల ప్రమాదాన్ని పెంచుతుంది. ఆహారం, వ్యాయామం మరియు జన్యువులు దీనికి ప్రధాన కారణాలు.',
            ta: 'அதிக கொழுப்பு அளவு இதய நோய் அபாயத்தை அதிகரிக்கும். உணவு, உடற்பயிற்சி மற்றும் மரபியல் ஆகியவை இதில் முக்கிய பங்கு வகிக்கின்றன.',
            gu: 'ઊંચું કોલેસ્ટ્રોલ હૃદય રોગનું જોખમ વધારે છે. આહાર, કસરત आणि આનુવંશિકતા આમાં મહત્વનો ભાગ ભજવે છે.',
            es: 'El colesterol total alto aumenta el riesgo de enfermedad cardiovascular. La dieta, el ejercicio y la genética influyen mucho.',
            fr: 'Un taux de cholestérol total élevé augmente le risque cardiovasculaire. L\'alimentation et l\'activité physique sont cruciales.',
            zh: '总胆固醇偏高会增加心血管疾病的风险。饮食、运动和遗传因素是主要影响原因。'
        }
    },
    ldl: {
        low: {
            en: 'Low LDL cholesterol is generally excellent for heart health, but extremely low levels can sometimes indicate metabolic issues.',
            hi: 'कम एलडीएल कोलेस्ट्रॉल हृदय स्वास्थ्य के लिए अच्छा है, लेकिन बहुत कम स्तर चयापचय संबंधी समस्याओं को दर्शा सकता है।',
            mr: 'कमी एलडीएल कोलेस्ट्रॉल हृदयासाठी चांगले आहे, परंतु अत्यंत कमी पातळी चयापचय समस्या दर्शवू शकते.',
            bn: 'কম এলডিএল কোলেস্টেরল হৃদযন্ত্রের জন্য ভালো, তবে খুব কম মাত্রা মেটাবলিক সমস্যা নির্দেশ করতে পারে।',
            te: 'తక్కువ LDL కొలెస్ట్రాల్ గుండె ఆరోగ్యానికి మంచిది, కానీ చాలా తక్కువగా ఉండటం జీవక్రియ సమస్యలను సూచించవచ్చు.',
            ta: 'குறைந்த LDL கொழுப்பு இதய ஆரோக்கியத்திற்கு நல்லது, ஆனால் மிகக் குறைந்த அளவு வளர்சிதை மாற்றப் பிரச்சினைகளைக் குறிக்கலாம்.',
            gu: 'નીચું LDL કોલેસ્ટ્રોલ હૃદય માટે સારું છે, પણ અત્યંત નીચું સ્તર ચયાપચયની સમસ્યાઓ સૂચવી શકે છે.',
            es: 'El LDL bajo es excelente para el corazón, pero niveles extremadamente bajos pueden indicar problemas metabólicos.',
            fr: 'Un LDL bas est excellent pour le cœur, mais un taux extrêmement bas peut parfois indiquer des troubles métaboliques.',
            zh: '低密度脂蛋白胆固醇（LDL，即“坏”胆固醇）偏低通常对心脏健康非常有益，但极低水平有时也可能提示代谢异常。'
        },
        high: {
            en: 'High LDL ("bad") cholesterol deposits fats in arteries, increasing the risk of heart disease and stroke.',
            hi: 'उच्च एलडीएल ("खराब") कोलेस्ट्रॉल धमनियों में वसा जमा करता है, जिससे हृदय रोग और स्ट्रोक का खतरा बढ़ जाता है।',
            mr: 'जास्त एलडीएल ("वाईट") कोलेस्ट्रॉल रक्तवाहिन्यांमध्ये चरबी जमा करते, ज्यामुळे हृदयविकार आणि स्ट्रोकचा धोका वाढतो.',
            bn: 'উচ্চ এলডিএল ("খারাপ") কোলেস্টেরল ধমনিতে চর্বি জমায়, যা হৃদরোগ এবং স্ট্রোকের ঝুঁকি বাড়িয়ে দেয়।',
            te: 'అధిక LDL ("చెడు") కొలెస్ట్రాల్ ధమనులలో కొవ్వును పేరుకుపోయేలా చేస్తుంది, ఇది గుండె జబ్బులు మరియు స్ట్రోక్ ప్రమాదాన్ని పెంచుతుంది.',
            ta: 'அதிக LDL ("கெட்ட") கொழுப்பு இரத்த நாளங்களில் கொழுப்பைச் சேமித்து, இதய நோய் மற்றும் பக்கவாத அபாயத்தை அதிகரிக்கும்.',
            gu: 'ઊંચું LDL ("ખરાબ") કોલેસ્ટ્રોલ ધમનીઓમાં ચરબી જમા કરે છે, જેથી હૃદય રોગ અને લકવા (સ્ટ્રોક) નું જોખમ વધે છે.',
            es: 'El LDL ("malo") alto deposita grasa en las arterias, aumentando el riesgo de enfermedades cardíacas y accidentes cerebrovasculares.',
            fr: 'Un LDL ("mauvais" cholestérol) élevé dépose des graisses dans les artères, augmentant le risque d\'infarctus et d\'AVC.',
            zh: '低密度脂蛋白胆固醇（LDL）偏高会在动脉壁上沉积脂肪，增加患心脏病和中风的风险。'
        }
    },
    hdl: {
        low: {
            en: 'Low HDL ("good") cholesterol reduces your body’s ability to clear cholesterol from arteries, raising cardiovascular risk.',
            hi: 'कम एचडीएल ("अच्छा") कोलेस्ट्रॉल धमनियों से वसा को साफ करने की क्षमता को कम करता है, जिससे हृदय रोग का खतरा बढ़ता है।',
            mr: 'कमी एचडीएल ("चांगले") कोलेस्ट्रॉल धमन्यांमधील चरबी साफ करण्याची क्षमता कमी करते, ज्यामुळे हृदयविकाराचा धोका वाढतो.',
            bn: 'কম এইচডিএল ("ভালো") কোলেস্টেরল ধমনি থেকে চর্বি অপসারণের ক্ষমতা কমায়, যা হৃদরোগের ঝুঁকি বৃদ্ধি করে।',
            te: 'తక్కువ HDL ("మంచి") కొలెస్ట్రాల్ ధమనుల నుండి కొవ్వును తొలగించే సామర్థ్యాన్ని తగ్గిస్తుంది, ఇది గుండె జబ్బుల ప్రమాదాన్ని పెంచుతుంది.',
            ta: 'குறைந்த HDL ("நல்ல") கொழுப்பு இரத்த நாளங்களில் இருந்து கொழுப்பை அகற்றும் திறனைக் குறைத்து, இதய நோய் அபாயத்தை அதிகரிக்கும்.',
            gu: 'નીચું HDL ("સારું") કોલેસ્ટ્રોલ ધમનીઓમાંથી કોલેસ્ટ્રોલ સાફ કરવાની ક્ષમતા ઘટાડે છે, જેથી હૃદયનું જોખમ વધે છે.',
            es: 'El HDL ("bueno") bajo reduce la capacidad de eliminar el colesterol de las arterias, elevando el riesgo cardiovascular.',
            fr: 'Un HDL ("bon" cholestérol) bas limite l\'élimination du cholestérol des artères, augmentant le risque cardiovasculaire.',
            zh: '高密度脂蛋白胆固醇（HDL，即“好”胆固醇）偏低会降低清除动脉中胆固醇的能力，从而增加心血管风险。'
        },
        high: {
            en: 'High HDL cholesterol is cardioprotective, helping remove excess cholesterol from circulation.',
            hi: 'उच्च एचडीएल कोलेस्ट्रॉल हृदय के लिए सुरक्षात्मक है, जो रक्त से अतिरिक्त कोलेस्ट्रॉल को हटाने में मदद करता है।',
            mr: 'जास्त एचडीएल कोलेस्ट्रॉल हृदयासाठी फायदेशीर आहे, जे रक्तातील अतिरिक्त कोलेस्ट्रॉल काढून टाकण्यास मदत करते.',
            bn: 'উচ্চ এইচডিএল কোলেস্টেরল হৃদযন্ত্রের সুরক্ষায় কাজ করে, যা রক্ত থেকে অতিরিক্ত কোলেস্টেরল দূর করতে সাহায্য করে।',
            te: 'అధిక HDL కొలెస్ట్రాల్ గుండెకు రక్షణ ఇస్తుంది, ఇది రక్తప్రవాహం నుండి అదనపు కొలెస్ట్రాల్‌ను తొలగించడంలో సహాయపడుతుంది.',
            ta: 'அதிக HDL கொழுப்பு இதயத்திற்குப் பாதுகாப்பானது, இது இரத்த ஓட்டத்தில் இருந்து கூடுதல் கொழுப்பை அகற்ற உதவுகிறது.',
            gu: 'ઊંચું HDL કોલેસ્ટ્રોલ હૃદય માટે ફાયદાકારक છે, જે લોહીમાંથી વધારાનું કોલેસ્ટ્રોલ દૂર કરવામાં મદદ કરે છે.',
            es: 'El HDL alto protege el corazón al ayudar a eliminar el exceso de colesterol de la circulación.',
            fr: 'Un HDL élevé protège le cœur en aidant à éliminer l\'excès de cholestérol dans le sang.',
            zh: '高密度脂蛋白胆固醇（HDL）偏高通常具有心血管保护作用，有助于清除血液循环中的多余胆固醇。'
        }
    },
    triglycerides: {
        low: {
            en: 'Low triglycerides are rare and may reflect low-fat diets, malnutrition, or hyperthyroidism.',
            hi: 'कम ट्राइग्लिसराइड्स दुर्लभ हैं और यह कम वसा वाले आहार, कुपोषण या हाइपरथायरायडिज्म को दर्शा सकते हैं।',
            mr: 'कमी ट्रायग्लिसराईड्स दुर्मिळ आहेत, हे कमी चरबीयुक्त आहार, कुपोषण किंवा हायपरथायरॉईडीझमचे लक्षण असू शकते.',
            bn: 'কম ট্রাইগ্লিসারাইডস বিরল এবং এটি কম চর্বিযুক্ত খাবার, অপুষ্টি বা থাইরয়েডের অতিসক্রিয়তার কারণে হতে পারে।',
            te: 'తక్కువ ట్రైగ్లిజరైడ్స్ అరుదు, ఇది తక్కువ కొవ్వు ఉన్న ఆహారం, పోషకాహార లోపం లేదా థైరాయిడ్ సమస్యలను సూచించవచ్చు.',
            ta: 'குறைந்த ட்ரைகிளிசரைடு அளவு அரிதானது, இது குறைந்த கொழுப்பு உணவு, ஊட்டச்சத்து குறைபாடு அல்லது தைராய்டு சுரப்பு அதிகரிப்பைக் காட்டலாம்.',
            gu: 'નીચું ટ્રાઇગ્લિસરાઇડ્સ દુર્લભ છે અને તે ઓછી ચરબીવાળો આહાર, કુપોષણ કે અતિસક્રિય થાઇરોઇડ દર્શાવી શકે.',
            es: 'Los triglicéridos bajos son raros y pueden reflejar dietas bajas en grasas, desnutrición o hipertiroidismo.',
            fr: 'Des triglycérides bas sont rares et peuvent refléter un régime pauvre en graisses, une dénutrition ou de l\'hyperthyroïdie.',
            zh: '甘油三酯偏低较少见，可能反映出低脂饮食、营养不良或甲状腺功能亢进。'
        },
        high: {
            en: 'High triglycerides represent excess storage fat in blood, often linked to cardiovascular disease, inactivity, or high sugar intake.',
            hi: 'उच्च ट्राइग्लिसराइड्स रक्त में अतिरिक्त वसा को दर्शाते हैं, जो हृदय रोग, निष्क्रिय जीवनशैली या अधिक चीनी के सेवन से जुड़े होते हैं।',
            mr: 'जास्त ट्रायग्लिसराईड्स रक्तात साठलेली अतिरिक्त चरबी दर्शवतात, जे हृदयविकार, निष्क्रियता किंवा जास्त साखरेच्या सेवनाशी संबंधित असते.',
            bn: 'উচ্চ ট্রাইগ্লিসারাইডস রক্তে অতিরিক্ত চর্বি নির্দেশ করে, যা হৃদরোগ, নিষ্ক্রিয় জীবনযাপন বা অতিরিক্ত চিনি খাওয়ার সাথে জড়িত।',
            te: 'అధిక ట్రైగ్లిజరైడ్స్ రక్తంలో అదనపు కొవ్వును సూచిస్తాయి, ఇది గుండె జబ్బులు లేదా ఎక్కువ చక్కెర తీసుకోవడం వల్ల కావచ్చు.',
            ta: 'அதிக ட்ரைகிளிசரைடு என்பது இரத்தத்தில் கூடுதல் கொழுப்பு உள்ளதைக் காட்டுகிறது, இது இதய நோய் அல்லது அதிக சர்க்கரை உணவோடு தொடர்புடையது.',
            gu: 'ઊંચું ટ્રાઇગ્લિસરાઇડ્સ લોહીમાં વધારાની ચરબી દર્શાવે છે, જે હૃદય રોગ, બેઠાડું જીવન અથવા વધુ ખાંડ ખાવા સાથે જોડાયેલ છે.',
            es: 'Los triglicéridos altos representan grasa almacenada en exceso, vinculada a enfermedad cardíaca, inactividad o consumo de azúcar.',
            fr: 'Des triglycérides élevés représentent un excès de graisse dans le sang, lié au risque cardiovasculaire ou à un excès de sucre.',
            zh: '甘油三酯偏高代表血液中存在多余的储存脂肪，通常与心血管疾病、缺乏运动或高糖摄入有关。'
        }
    },
    tsh: {
        low: {
            en: 'Low TSH suggests an overactive thyroid gland (hyperthyroidism), which can cause fast heart rate, weight loss, or anxiety.',
            hi: 'कम टीएसएच अतिसक्रिय थायराइड (हाइपरथायरायडिज्म) का संकेत है, जिससे वजन कम होना, घबराहट या तेज धड़कन हो सकती है।',
            mr: 'कमी टीएसएच थायरॉईड ग्रंथी अतिसक्रिय असल्याचे (हायपरथायरॉईडीझम) दर्शवते, ज्यामुळे वजन कमी होणे, धडधडणे किंवा चिंता जाणवू शकते.',
            bn: 'কম টিএসএইচ থাইরয়েডের অতিসক্রিয়তা (হাইপারথাইরয়েডিজম) নির্দেশ করে, যার ফলে ওজন হ্রাস, দ্রুত হৃদস্পন্দন বা উদ্বেগ হতে পারে।',
            te: 'తక్కువ TSH థైరాయిడ్ గ్రంధి అతిగా పనిచేస్తుందని సూచిస్తుంది, దీనివల్ల బరువు తగ్గడం, గుండె వేగంగా కొట్టుకోవడం లేదా ఆందోళన కలగవచ్చు.',
            ta: 'குறைந்த TSH அளவு தைராய்டு சுரப்பு அதிகமாக இருப்பதைக் காட்டுகிறது, இது உடல் எடை குறைதல், படபடப்பு அல்லது பதற்றத்தை ஏற்படுத்தலாம்.',
            gu: 'નીચું TSH અતિસક્રિય થાઇરોઇડ ગ્રંથિ દર્શાવે છે, જેથી વજન ઘટવું, ઝડપી ધબકારા કે चિંતા જેવા લક્ષણો થઈ શકે.',
            es: 'Un TSH bajo sugiere una glándula tiroides hiperactiva (hipertiroidismo), lo que causa ritmo cardíaco rápido o pérdida de peso.',
            fr: 'Une TSH basse suggère une thyroïde hyperactive (hyperthyroïdie), pouvant causer une perte de poids ou de l\'anxiété.',
            zh: '促甲状腺激素（TSH）偏低提示甲状腺功能亢进（甲亢），可能导致心率加快、体重减轻或焦虑。'
        },
        high: {
            en: 'High TSH indicates an underactive thyroid gland (hypothyroidism), which often causes fatigue, slow metabolism, and weight gain.',
            hi: 'उच्च टीएसएच निष्क्रिय थायराइड (हाइपोथायरायडिज्म) को दर्शाता है, जिससे थकान, सुस्ती और वजन बढ़ना आम है।',
            mr: 'जास्त टीएसएच थायरॉईड ग्रंथी मंद असल्याचे (हायपोथायरॉईडीझम) दर्शवते, ज्यामुळे थकवा, सुस्ती आणि वजन वाढणे उद्भवते.',
            bn: 'উচ্চ টিএসএইচ থাইরয়েডের কম সক্রিয়তা (হাইপোথাইরয়েডিজম) নির্দেশ করে, যার ফলে ক্লান্তি, ধীর বিপাক এবং वजन বৃদ্ধি হতে পারে।',
            te: 'అధిక TSH థైరాయిడ్ గ్రంధి నెమ్మదిగా పనిచేస్తుందని సూచిస్తుంది, ఇది అలసట, నెమ్మదైన జీవక్రియ మరియు బరువు పెరగడానికి దారితీస్తుంది.',
            ta: 'அதிக TSH அளவு தைராய்டு சுரப்பு குறைவாக இருப்பதைக் காட்டுகிறது, இது சோர்வு, மெதுவான வளர்சிதை மாற்றம் மற்றும் உடல் எடை அதிகரிப்பை ஏற்படுத்தும்.',
            gu: 'ઊંચું TSH નબળી થાઇરોઇડ ગ્રંથિ દર્શાવे છે, જેનાથી थाक, ધીમી ચયાપચય ક્રિયા અને વજન વધવાની સમસ્યા થાય છે.',
            es: 'Un TSH alto indica tiroides hipoactiva (hipotiroidismo), lo que suele provocar fatiga, metabolismo lento y aumento de peso.',
            fr: 'Une TSH élevée indique une thyroïde sous-active (hypothyroïdie), provoquant fatigue, métabolisme ralenti et prise de poids.',
            zh: '促甲状腺激素（TSH）偏高表明甲状腺功能减退（甲减），通常会导致疲劳、代谢减缓和体重增加。'
        }
    },
    t3: {
        low: {
            en: 'Low T3 levels suggest hypothyroidism or systemic illness, which can lead to sluggishness and low body energy.',
            hi: 'कम टी3 स्तर थायराइड की कमी या पुरानी बीमारी का संकेत है, जिससे सुस्ती और शरीर में कम ऊर्जा महसूस हो सकती है।',
            mr: 'टी३ ची कमी पातळी हायपोथायरॉईडीझमचे संकेत देते, ज्यामुळे थकवा आणि शरीरात ऊर्जा कमी जाणवते.',
            bn: 'কম টি৩ মাত্রা হাইপোথাইরয়েডিজম বা দীর্ঘস্থায়ী অসুস্থতা নির্দেশ করে, যার ফলে ক্লান্তি ও শরীরে কম শক্তি অনুভূত হতে পারে।',
            te: 'తక్కువ T3 స్థాయిలు థైరాయిడ్ గ్రంధి నెమ్మదిగా పనిచేస్తుందని సూచిస్తాయి, ఇది అలసట మరియు తక్కువ శక్తికి దారితీస్తుంది.',
            ta: 'குறைந்த T3 அளவு தைராய்டு சுரப்புக் குறைவைக் காட்டுகிறது, இது மந்தநிலை மற்றும் குறைந்த உடல் ஆற்றலை ஏற்படுத்தலாம்.',
            gu: 'નીચું T3 સ્તર નબળું થાઇરોઇડ કે લાંબી બીમારી સૂચવે છે, જે સુસ્ती आणि ઓછી ઊર્જા તરફ દોરી શકે.',
            es: 'Niveles bajos de T3 sugieren hipotiroidismo o enfermedad sistémica, lo que puede provocar fatiga y baja energía corporal.',
            fr: 'Un taux bas de T3 suggère une hypothyroïdie, ce qui peut entraîner une léthargie et un manque d\'énergie générale.',
            zh: '三碘甲状腺原氨酸（T3）偏低提示可能存在甲状腺功能减退或全身性疾病，可导致精神不振和身体能量低下。'
        },
        high: {
            en: 'High T3 levels suggest hyperthyroidism, accelerating body metabolism and causing tremors or rapid heartbeats.',
            hi: 'उच्च टी3 स्तर अतिसक्रिय थायराइड का संकेत है, जो चयापचय को तेज करता है और कंपकंपी या तेज धड़कन पैदा कर सकता है।',
            mr: 'टी३ ची वाढलेली पातळी हायपरथायरॉईडीझम दर्शवते, ज्यामुळे चयापचय वेगवान होते आणि थरथरणे किंवा हृदय धडधडणे जाणवते.',
            bn: 'উচ্চ টি৩ মাত্রা হাইপারথাইরয়েডিজম নির্দেশ করে, যা বিপাককে ত্বরান্বিত করে এবং কম্পন বা দ্রুত হৃদস্পন্দন সৃষ্টি করতে পারে।',
            te: 'అధిక T3 స్థాయిలు థైరాయిడ్ గ్రంధి అతిగా పనిచేస్తుందని సూచిస్తాయి, ఇది గుండె వేगంగా కొట్టుకోవడం మరియు వణుకుకు దారితీస్తుంది.',
            ta: 'அதிக T3 அளவு தைராய்டு சுரப்பு அதிகமாக இருப்பதைக் காட்டுகிறது, இது நடுக்கம் அல்லது வேகமான இதயத் துடிப்பை ஏற்படுத்தலாம்.',
            gu: 'ઊંચું T3 સ્તર અતિસક્રિય થાઇરોઇડ દર્શાવે છે, જે ચયાપચય ઝડપી બનાવે છે અને ધ્રુજારી કે ઝડપી ધબકારા લાવી શકે.',
            es: 'Niveles altos de T3 sugieren hipertiroidismo, lo que acelera el metabolismo y causa temblores o latidos rápidos.',
            fr: 'Un taux élevé de T3 suggère une hyperthyroïdie, ce qui accélère le métabolisme et peut causer des tremblements ou tachycardies.',
            zh: '三碘甲状腺原氨酸（T3）偏高提示可能存在甲状腺功能亢进，会加速身体代谢，导致手抖或心慌。'
        }
    },
    t4: {
        low: {
            en: 'Low T4 indicates hypothyroidism, confirming that the thyroid gland is underproducing vital metabolic hormones.',
            hi: 'कम टी४ थायराइड की कमी को दर्शाता है, जिससे यह पुष्टि होती है कि थायराइड ग्रंथि पर्याप्त हार्मोन नहीं बना पा रही है।',
            mr: 'कमी टी४ हायपोथायरॉईडीझम दर्शवते, जे दर्शवते की थायरॉईड ग्रंथी आवश्यक प्रमाणात हार्मोन्स तयार करत नाही.',
            bn: 'কম টি৪ হাইপোথাইরয়েডিজম নির্দেশ করে, যার অর্থ থাইরয়েড গ্রন্থি पर्याप्त বিপাকীয় হরমোন তৈরি করছে না।',
            te: 'తక్కువ T4 థైరాయిడ్ గ్రంధి తగినంత హార్మోన్లను ఉత్పత్తి చేయడం లేదని సూచిస్తుంది, ఇది బరువు పెరగడానికి దారితీస్తుంది.',
            ta: 'குறைந்த T4 அளவு தைராய்டு சுரப்புக் குறைவை உறுதிப்படுத்துகிறது, அதாவது உடலுக்குத் தேவையான ஹார்மோன்களை சுரக்கவில்லை.',
            gu: 'નીચું T4 નબળું થાઇરોઇડ દર્શાવે છે, જે પુષ્ટિ કરે છે કે થાઇરોઇડ ગ્રંથિ જરૂરી હોर्મોન્સ પૂરતા પ્રમાણમાં ઉત્પન્ન કરતી નથી.',
            es: 'T4 bajo indica hipotiroidismo, lo que confirma que la tiroides produce menos hormonas metabólicas de las necesarias.',
            fr: 'Un taux bas de T4 indique une hypothyroïdie, confirmant une production insuffisante d\'hormones par la glande thyroïde.',
            zh: '甲状腺素（T4）偏低提示甲状腺功能减退，证实甲状腺未能产生足够的代谢激素。'
        },
        high: {
            en: 'High T4 levels suggest hyperthyroidism, which speeds up metabolic functions and can cause sweat, heat intolerance, or anxiety.',
            hi: 'उच्च टी४ स्तर अतिसक्रिय थायराइड का संकेत है, जो चयापचय को बढ़ाता है और पसीना आना, बेचैनी जैसी समस्याएं पैदा कर सकता है।',
            mr: 'जास्त टी४ हायपरथायरॉईडीझम दर्शवते, ज्यामुळे चयापचय जलद होते आणि घाम येणे किंवा उष्णता सहन न होणे जाणवते.',
            bn: 'উচ্চ টি৪ হাইপারথাইরয়েডিজম নির্দেশ করে, যা বিপাক বাড়ায় এবং অতিরিক্ত ঘাম বা গরম সহ্য করতে ना পারার समस्या सृष्टि करते পারে।',
            te: 'అధిక T4 స్థాయిలు థైరాయిడ్ గ్రంధి అతిగా పనిచేస్తుందని సూచిస్తాయి, దీనివల్ల వేడి తట్టుకోలేకపోవడం లేదా ఆందోళన కలగవచ్చు.',
            ta: 'அதிக T4 அளவு தைராய்டு சுரப்பு அதிகமாக இருப்பதைக் காட்டுகிறது, இது வியர்வை அல்லது வெப்பத்தைத் தாங்க முடியாத நிலையை ஏற்படுத்தலாம்.',
            gu: 'ઊંચું T4 સ્તર અતિસક્રિય થાઇરોઇડ દર્શાવે છે, જેનાથી ચયાપચય વધે છે અને પરસેવો કે અસ્વસ્થતા જેવા લક્ષણો થાય છે.',
            es: 'T4 alto sugiere hipertiroidismo, lo que acelera el metabolismo y puede causar sudoración, intolerancia al calor o ansiedad.',
            fr: 'Un taux élevé de T4 suggère une hyperthyroïdie, accélérant le métabolisme et causant transpiration ou anxiété.',
            zh: '甲状腺素（T4）偏高提示可能存在甲状腺功能亢进，会加快代谢速度，导致多汗、怕热或焦虑。'
        }
    },
    alt: {
        low: {
            en: 'Low ALT is normal and expected, showing healthy liver function with no active cell leakage.',
            hi: 'कम एएलटी सामान्य है और यह स्वस्थ यकृत कार्यप्रणाली को दर्शाता है जिसमें कोई कोशिका क्षति नहीं है।',
            mr: 'कमी एएलटी सामान्य आहे, जे यकृत निरोगी असल्याचे आणि कोणत्याही पेशींचे नुकसान नसल्याचे दर्शवते.',
            bn: 'কম এএলটি স্বাভাবিক এবং এটি সুস্থ লিভারের কার্যকারিতা নির্দেশ করে যেখানে কোনো কোষের ক্ষতি নেই।',
            te: 'తక్కువ ALT సాధారణం, ఇది కాలేయం ఆరోగ్యంగా ఉందని మరియు కణాల నష్టం లేదని సూచిస్తుంది.',
            ta: 'குறைந்த ALT அளவு இயல்பானது, இது கல்லீரல் ஆரோக்கியமாக இருப்பதையும், செல்கள் சேதமடையாமல் இருப்பதையும் காட்டுகிறது.',
            gu: 'નીચું ALT સામાન્ય છે અને તે દર્શાવે છે કે લિવર તંદુરસ્ત છે અને કોષોને કોઈ નુકસાન નથી.',
            es: 'Un nivel bajo de ALT es normal y esperado, lo que indica una función hepática saludable sin fuga de células.',
            fr: 'Une ALT basse est tout à fait normale et attendue, indiquant un foie sain sans fuite cellulaire.',
            zh: '丙氨酸氨基转移酶（ALT）偏低属于正常生理现象，表明肝功能健康，无细胞损伤。'
        },
        high: {
            en: 'High ALT suggests liver cell irritation or injury, often caused by alcohol, fatty liver, or medications.',
            hi: 'उच्च एएलटी यकृत कोशिकाओं में सूजन या क्षति को दर्शाता है, जो शराब, फैटी लीवर या दवाओं के कारण हो सकता है।',
            mr: 'जास्त एएलटी यकृताच्या पेशींना झालेली इजा दर्शवते, जे दारूचे सेवन, फॅटी लिव्हर किंवा औषधांमुळे असू शकते.',
            bn: 'উচ্চ এএলটি লিভারের কোষে প্রদাহ বা ক্ষতি নির্দেশ করে, যা অ্যালকোহল, ফ্যাটি লিভার বা ওষুধের কারণে হতে পারে।',
            te: 'అధిక ALT కాలేయ కణాల నష్టాన్ని సూచిస్తుంది, ఇది మద్యం, ఫ్యాటీ లివర్ లేదా మందుల వల్ల కావచ్చు.',
            ta: 'அதிக ALT கல்லீரல் செல்கள் சேதமடைந்திருப்பதைக் காட்டுகிறது, இது மது, கொழுப்பு கல்லீரல் அல்லது மருந்துகளால் ஏற்படலாம்.',
            gu: 'ઊંચું ALT લિવરના કોષોને નુકસાન સૂચવે છે, જે મોટે ભાગે દારૂ, ફેટી લિવર અથવા દવાઓને કારણે થાય છે.',
            es: 'ALT alta sugiere irritación o lesión de células hepáticas, a menudo por alcohol, hígado graso o medicamentos.',
            fr: 'Une ALT élevée suggère une irritation ou lésion des cellules du foie (alcool, foie gras, médicaments).',
            zh: '丙氨酸氨基转移酶（ALT）偏高提示肝细胞受损或炎症，通常由饮酒、脂肪肝或药物影响所致。'
        }
    },
    ast: {
        low: {
            en: 'Low AST levels are expected and indicate healthy liver and muscle tissues.',
            hi: 'कम एएसटी स्तर सामान्य हैं और यह यकृत और मांसपेशियों के स्वस्थ होने का संकेत देते हैं।',
            mr: 'कमी एएसटी पातळी सामान्य आहे, जे यकृत आणि स्नायू निरोगी असल्याचे दर्शवते.',
            bn: 'কম এএসটি মাত্রা স্বাভাবিক এবং এটি সুস্থ লিভার ও পেশী নির্দেশ করে।',
            te: 'తక్కువ AST స్థాయిలు కాలేయం మరియు కండరాలు ఆరోగ్యంగా ఉన్నాయని సూచిస్తాయి.',
            ta: 'குறைந்த AST அளவு இயல்பானது, இது கல்லீரல் மற்றும் தசைகள் ஆரோக்கியமாக இருப்பதைக் காட்டுகிறது.',
            gu: 'નીચું AST સ્તર સામાન્ય છે અને તે તંદુરસ્ત લિવર અને સ્નાયુઓ દર્શાવે છે.',
            es: 'Los niveles bajos de AST son esperados e indican que los tejidos hepáticos y musculares están sanos.',
            fr: 'Un taux bas d\'AST est attendu et indique des tissus hépatiques et musculaires en bonne santé.',
            zh: '天门冬氨酸氨基转移酶（AST）偏低属于正常生理现象，表明肝脏和肌肉组织健康。'
        },
        high: {
            en: 'Elevated AST suggests tissue damage in the liver or muscles. Alcohol, fatty liver, or heavy exercise are common triggers.',
            hi: 'बढ़ा हुआ एएसटी यकृत या मांसपेशियों में क्षति को दर्शाता है। शराब, फैटी लीवर या भारी व्यायाम इसके सामान्य कारण हैं।',
            mr: 'जास्त एएसटी यकृत किंवा स्नायूंना झालेली इजा दर्शवते. दारू, फॅटी लिव्हर किंवा जास्त व्यायाम हे याचे प्रमुख कारण असू शकतात.',
            bn: 'উচ্চ এএসটি লিভার বা পেশীতে ক্ষতি নির্দেশ করে। অ্যালকোহল, ফ্যাটি লিভার বা ভারী ব্যায়াম এর সাধারণ कारण।',
            te: 'అధిక AST కాలేయం లేదా కండరాల నష్టాన్ని సూచిస్తుంది. మద్యం, ఫ్యాటీ లివర్ లేదా ఎక్కువ వ్యాయామం దీనికి కారణం కావచ్చు.',
            ta: 'அதிக AST கல்லீரல் அல்லது தசைகளில் பாதிப்பைக் காட்டுகிறது. மது, கொழுப்பு கல்லீரல் அல்லது கடுமையான உடற்பயிற்சி இதற்கு பொதுவான காரணங்கள்.',
            gu: 'ઊંચું AST લિવર અથવા સ્નાયુઓમાં નુકસાન સૂચવે છે. દારૂ, ફેટી લિવર અથવા ભારે કસરત આના મુખ્ય કારણો છે.',
            es: 'El AST elevado sugiere daño en el hígado o músculos. El alcohol, hígado graso o ejercicio intenso son causas comunes.',
            fr: 'Une AST élevée suggère une lésion du foie ou des muscles (alcool, foie gras ou effort musculaire intense).',
            zh: '天门冬氨酸氨基转移酶（AST）偏高提示肝脏或肌肉组织受损。饮酒、脂肪肝或剧烈运动是常见诱因。'
        }
    },
    bilirubin: {
        low: {
            en: 'Low bilirubin levels are common and harmless, carrying no clinical concern on their own.',
            hi: 'कम बिलीरुबिन स्तर सामान्य और हानिरहित हैं, और इनका कोई नैदानिक महत्व नहीं है।',
            mr: 'कमी बिलीरुबिन पातळी सामान्य आणि निरुपद्रवी आहे, यात काळजीचे कोणतेही कारण नाही.',
            bn: 'কম বিলিরুবিন মাত্রা স্বাভাবিক এবং ক্ষতিকর নয়, এর কোনো ক্লিনিক্যাল গুরুত্ব নেই।',
            te: 'తక్కువ బిలిరుబిన్ స్థాయిలు సాధారణం మరియు ప్రమాదకరం కాదు, దీని గురించి ఆందోళన చెందాల్సిన అవసరం లేదు.',
            ta: 'குறைந்த பிலிரூபின் அளவு இயல்பானது மற்றும் தீங்கற்றது, தனியாக இருக்கும் போது இது எந்த பாதிப்பையும் குறிக்காது.',
            gu: 'નીચું બિલીરૂબીન સામાન્ય અને હાનિકારક છે, તેનાથી કોઈ તબીબી ચિંતા થતી નથી.',
            es: 'Los niveles bajos de bilirrubina son comunes e inofensivos, sin implicaciones clínicas por sí solos.',
            fr: 'Un taux bas de bilirubine est courant et inoffensif, sans signification clinique particulière.',
            zh: '总胆红素偏低很常见且无害，本身不具有临床意义。'
        },
        high: {
            en: 'High bilirubin can cause jaundice (yellow skin/eyes), indicating liver congestion or hemolysis.',
            hi: 'उच्च बिलीरुबिन पीलिया (त्वचा/आँखों का पीला होना) पैदा कर सकता है, जो लीवर की समस्या को दर्शाता है।',
            mr: 'जास्त बिलीरुबिनमुळे काविळ (त्वचा/डोळे पिवळे होणे) होऊ शकते, जे यकृताची समस्या दर्शवते.',
            bn: 'উচ্চ বিলিরুবিন জন্ডিস (ত্বক/চোখ হলুদ হওয়া) সৃষ্টি করতে পারে, যা লিভারের সমস্যা নির্দেশ করে।',
            te: 'అధిక బిలిరుబిన్ కామెర్లు (పసుపు రంగు చర్మం/కళ్ళు) కలిగిస్తుంది, ఇది కాలేయ సమస్యను సూచిస్తుంది.',
            ta: 'அதிக பிலிரூபின் மஞ்சள் காமாலையை (மஞ்சள் நிற தோல்/கண்கள்) ஏற்படுத்தலாம், இது கல்லீரல் பாதிப்பைக் காட்டுகிறது.',
            gu: 'ઊંચું બિલીરૂબીન કમળો (ત્વચા કે આંખો પીળી થવી) લાવી શકે છે, જે લિવરની તકલીફ સૂચવે છે.',
            es: 'La bilirrubina alta puede causar ictericia (piel/ojos amarillos), indicando congestión hepática o hemólisis.',
            fr: 'Une bilirubine élevée peut causer un ictère (jaunisse des yeux/peau), indiquant un trouble hépatique ou une hémolyse.',
            zh: '总胆红素偏高可能会导致黄疸（皮肤/眼睛发黄），提示肝脏排泄受阻或溶血。'
        }
    },
    alp: {
        low: {
            en: 'Low ALP is rare and can suggest malnutrition, zinc deficiency, or hypothyroidism.',
            hi: 'कम एएलपी दुर्लभ है और यह कुपोषण, जिंक की कमी या हाइपोथायरायडिज्म का संकेत दे सकता है।',
            mr: 'कमी एएलपी दुर्मिळ आहे, हे कुपोषण, झिंकची कमतरता किंवा हायपोथायरॉईडीझमचे संकेत असू शकते.',
            bn: 'কম এএলপি বিরল এবং এটি অপুষ্টি, জিঙ্কের ঘাটতি বা হাইপোথাইরয়েডিজম নির্দেশ করতে পারে।',
            te: 'తక్కువ ALP అరుదు, ఇది పోషకాహార లోపం, జింక్ లోపం లేదా థైరాయిడ్ సమస్యలను సూచించవచ్చు.',
            ta: 'குறைந்த ALP அளவு அரிதானது, இது ஊட்டச்சத்து குறைபாடு, துத்தநாகக் குறைபாடு அல்லது தைராய்டு சுரப்புக் குறைவைக் காட்டலாம்.',
            gu: 'નીચું ALP દુર્લભ છે અને તે કુપોષણ, ઝિંકની ઉણપ અથવા નબળું થાઇરોઇડ સૂચવી શકે.',
            es: 'El ALP bajo es raro y puede sugerir desnutrición, deficiencia de zinc o hipotiroidismo.',
            fr: 'Une ALP basse est rare et peut évoquer une dénutrition, une carence en zinc ou une hypothyroïdie.',
            zh: '碱性磷酸酶（ALP）偏低较罕见，可能提示营养不良、缺锌或甲状腺功能减退。'
        },
        high: {
            en: 'Elevated ALP is commonly associated with bile duct obstruction, bone metabolic activity, or liver congestion.',
            hi: 'बढ़ा हुआ एएलपी आमतौर पर पित्त नली में रुकावट, हड्डियों की बीमारी या लीवर की समस्या से जुड़ा होता है।',
            mr: 'वाढलेला एएलपी पित्तनलिकेतील अडथळा, हाडांचे आजार किंवा यकृताच्या सूजेशी संबंधित असतो.',
            bn: 'উচ্চ এএলটি সাধারণত পিত্তনালী ব্লক, হাড়ের রোগ বা লিভারের সমস্যার সাথে জড়িত।',
            te: 'అధిక ALP పిత్త వాహిక అడ్డంకి, ఎముకల సమస్యలు లేదా కాలేయ సమస్యలను సూచిస్తుంది.',
            ta: 'அதிக ALP பித்த நாள அடைப்பு, எலும்பு நோய்கள் அல்லது கல்லீரல் பாதிப்போடு தொடர்புடையதாக இருக்கலாம்.',
            gu: 'ઊંચું ALP પિત્ત નળીમાં અવરોધ, હાડકાની બીમારી કે લિવરની તકલીફ દર્શાવે છે.',
            es: 'El ALP elevado se asocia comúnmente con obstrucción de vías biliares, actividad ósea o congestión hepática.',
            fr: 'Une ALP élevée est souvent associée à une obstruction biliaire, une maladie osseuse ou une congestion du foie.',
            zh: '碱性磷酸酶（ALP）偏高通常与胆管梗阻、骨骼代谢活跃或肝脏淤胆有关。'
        }
    },
    creatinine: {
        low: {
            en: 'Low creatinine is harmless and usually indicates low muscle mass or a low-protein diet.',
            hi: 'कम क्रिएटिनिन हानिरहित है और यह आमतौर पर कम मांसपेशियों या कम प्रोटीन वाले आहार को दर्शाता है।',
            mr: 'कमी क्रिएटिनिन निरुपद्रवी आहे, हे सहसा स्नायूंचे प्रमाण कमी असणे किंवा कमी प्रोटीन आहारामुळे होते.',
            bn: 'কম ক্রিয়েটিনিন ক্ষতিকর নয় এবং এটি সাধারণত পেশীর ভর কম থাকা বা কম প্রোটিনযুক্ত খাবার খাওয়া নির্দেশ করে।',
            te: 'తక్కువ క్రియాటినిన్ ప్రమాదకరం కాదు, ఇది సాధారణంగా కండరాల ద్రవ్యరాశి తక్కువగా ఉండటం లేదా తక్కువ ప్రోటీన్ ఆహారాన్ని సూచిస్తుంది.',
            ta: 'குறைந்த கிரியேட்டினின் அளவு தீங்கற்றது, இது பொதுவாக தசை அளவு குறைவாக இருப்பதையோ அல்லது குறைந்த புரத உணவையோ காட்டுகிறது.',
            gu: 'નીચું ક્રિએટિનાઇન હાનિકારક છે અને તે સ્નાયુઓનું ઓછું પ્રમાણ કે ઓછો પ્રોટીનવાળો આહાર સૂચવે છે.',
            es: 'La creatinina baja es inofensiva y suele indicar baja masa muscular o dieta baja en proteínas.',
            fr: 'Une créatinine basse est inoffensive, traduisant souvent une faible masse musculaire ou un régime pauvre en protéines.',
            zh: '肌酐偏低无害，通常表明肌肉量偏少或低蛋白质饮食。'
        },
        high: {
            en: 'High creatinine suggests decreased kidney filtration capacity. Dehydration, kidney stress, or high protein are potential causes.',
            hi: 'उच्च क्रिएटिनिन गुर्दे की छननी क्षमता में कमी को दर्शाता है। निर्जलीकरण, गुर्दे पर तनाव, या उच्च प्रोटीन इसके संभावित कारण हैं।',
            mr: 'जास्त क्रिएटिनिन मूत्रपिंडाची गाळण्याची क्षमता कमी झाल्याचे दर्शवते. डिहायड्रेशन किंवा मूत्रपिंडावरील ताण हे याचे कारण असू शकते.',
            bn: 'উচ্চ ক্রিয়েটিনিন কিডনির কার্যকারিতা কমে যাওয়া নির্দেশ করে। পানিশূন্যতা বা কিডনিতে চাপ এর অন্যতম कारण।',
            te: 'అధిక క్రియాటినిన్ కిడ్నీ వడపోత సామర్థ్యం తగ్గినట్లు సూచిస్తుంది. డీహైడ్రేషన్ లేదా కిడ్నీ సమస్య దీనికి కారణం కావచ్చు.',
            ta: 'அதிக கிரியேட்டினின் சிறுநீரக வடிகட்டும் திறன் குறைந்திருப்பதைக் காட்டுகிறது. நீர்ச்சத்து குறைப்பாடு அல்லது சிறுநீரக அழுத்தம் இதன் காரணங்கள்.',
            gu: 'ઊંચું ક્રિએટિનાઇન કિડનીની ગાળણ ક્ષમતામાં ઘટાડો સૂચવે છે. ડીહાઇડ્રેશન કે કિડની પર સોજો આના સંભવિત કારણો છે.',
            es: 'Creatinina alta sugiere menor filtración renal. Deshidratación, estrés renal o alto consumo de proteínas son causas comunes.',
            fr: 'Une créatinine élevée suggère une baisse de filtration des reins (déshydratation, stress rénal ou excès de protéines).',
            zh: '肌酐偏高提示肾脏滤过功能下降。脱水、肾脏压力过大或高蛋白饮食是潜在原因。'
        }
    },
    bun: {
        low: {
            en: 'Low BUN is uncommon and can be linked to overhydration, low-protein diets, or liver insufficiency.',
            hi: 'कम बीयूएन असामान्य है और यह अत्यधिक पानी पीने, कम प्रोटीन वाले आहार, या यकृत की शिथिलता से जुड़ा हो सकता है।',
            mr: 'कमी बीयूएन असामान्य आहे, हे अति-जलदता (जास्त पाणी पिणे), कमी प्रोटीन आहार किंवा यकृताच्या समस्येमुळे असू शकते.',
            bn: 'কম বিইউএন অস্বাভাবিক এবং এটি অতিরিক্ত পানি পান, কম প্রোটিনযুক্ত খাবার বা লিভারের সমস্যার কারণে হতে পারে।',
            te: 'తక్కువ BUN అరుదు, ఇది ఎక్కువ నీరు తాగడం, తక్కువ ప్రోటీన్ ఆహారం లేదా కాలేయ సమస్యలను సూచించవచ్చు.',
            ta: 'குறைந்த BUN அளவு அசாதாரணமானது, இது அதிக நீர் அருந்துதல், குறைந்த புரத உணவு அல்லது கல்லீரல் பற்றாக்குறையைக் காட்டலாம்.',
            gu: 'નીચું BUN અસામાન્ય છે અને તે વધુ પાણી પીવું, ઓછો પ્રોટીનવાળો આહાર કે લિવરની નબળાઇ સૂચવી શકે.',
            es: 'Un BUN bajo es poco común y puede debido a sobrehidratación, dieta baja en proteínas o insuficiencia hepática.',
            fr: 'Un taux d\'azote uréique bas est rare et peut être lié à une surhydratation, une alimentation pauvre en protéines ou un trouble du foie.',
            zh: '尿素氮（BUN）偏低较少见，可能与过度补水、低蛋白饮食或肝功能不全有关。'
        },
        high: {
            en: 'Elevated BUN suggests kidneys are not clearing urea efficiently. Common reasons include dehydration or decreased renal blood flow.',
            hi: 'बढ़ा हुआ बीयूएन दर्शाता है कि गुर्दे यूरिया को ठीक से साफ नहीं कर रहे हैं। निर्जलीकरण या गुर्दे में रक्त प्रवाह की कमी इसके सामान्य कारण हैं।',
            mr: 'वाढलेला बीयूएन मूत्रपिंड युरिया योग्यरित्या बाहेर टाकत नसल्याचे दर्शवतो. डिहायड्रेशन किंवा मूत्रपिंडातील कमी रक्तप्रवाह हे याचे कारण असू शकते.',
            bn: 'উচ্চ বিইউএন নির্দেশ করে কিডনি ইউরিয়া সঠিকভাবে দূর করছে না। পানিশূন্যতা বা কিডনিতে রক্তপ্রবাহ কমে যাওয়া এর কারণ।',
            te: 'అధిక BUN కిడ్నీ యూరియాను సమర్థవంతంగా క్లియర్ చేయడం లేదని సూచిస్తుంది. డీహైడ్రేషన్ దీనికి ప్రధాన కారణం.',
            ta: 'அதிக BUN சிறுநீரகம் யூரியாவைச் சரியாக வெளியேற்றவில்லை என்பதைக் காட்டுகிறது. நீர்ச்சத்து குறைபாடு அல்லது சிறுநீரக இரத்த ஓட்டம் குறைதல் இதன் காரணங்கள்.',
            gu: 'ઊંચું BUN દર્શાવે છે કે કિડની યુરિયા યોગ્ય રીતે સાફ કરતી નથી. ડીહાઇડ્રેશન કે કિડનીમાં રક્તપ્રવાહ ઘટવો એ આના સામાન્ય कारणो છે.',
            es: 'BUN elevado sugiere que los riñones no eliminan la urea eficientemente, comúnmente por deshidratación.',
            fr: 'Un azote uréique élevé suggère une mauvaise élimination de l\'urée par les reins, souvent due à une déshydratation.',
            zh: '尿素氮（BUN）偏高提示肾脏未能有效清除尿素。常见原因包括脱水或肾脏血流量减少。'
        }
    },
    uricacid: {
        low: {
            en: 'Low uric acid is rare and typically harmless, sometimes linked to low-protein nutrition or SIADH.',
            hi: 'कम यूरिक एसिड दुर्लभ और हानिरहित है, जो कभी-कभी कम प्रोटीन वाले भोजन से जुड़ा होता है।',
            mr: 'कमी यूरिक ॲसिड दुर्मिळ आणि निरुपद्रवी आहे, हे कधीकधी कमी प्रोटीन पोषणामुळे होते.',
            bn: 'কম ইউরিক অ্যাসিড বিরল এবং ক্ষতিকর নয়, যা মাঝে মাঝে কম প্রোটিনযুক্ত খাবারের কারণে হতে পারে।',
            te: 'తక్కువ యూరిక్ యాసిడ్ అరుదు మరియు ప్రమాదకరం కాదు, ఇది తక్కువ ప్రోటీన్ ఆహారాన్ని సూచించవచ్చు.',
            ta: 'குறைந்த யூரிக் அமிலம் அரிதானது மற்றும் தீங்கற்றது, சில நேரங்களில் குறைந்த புரத உணவோடு தொடர்புடையது.',
            gu: 'નીચું યુરિક એસિડ દુર્લભ અને સામાન્ય રીતે હાનિકારક છે, ક્યારેક ઓછું પ્રોટીન ખાવાથી આવું થાય છે.',
            es: 'El ácido úrico bajo es raro y típicamente inofensivo, a veces ligado a nutrición baja en proteínas.',
            fr: 'Un acide urique bas est rare et généralement inoffensif, parfois lié à une alimentation pauvre en protéines.',
            zh: '尿酸偏低较罕见，通常无害，有时与低蛋白饮食有关。'
        },
        high: {
            en: 'High uric acid can form crystals in joints, causing gout (painful inflammation), or lead to kidney stones.',
            hi: 'उच्च यूरिक एसिड जोड़ों में क्रिस्टल बना सकता है, जिससे गठिया (दर्दनाक सूजन) या गुर्दे की पथरी हो सकती है।',
            mr: 'जास्त यूरिक ॲसिड सांध्यांमध्ये खडे तयार करू शकते, ज्यामुळे गाउट (सांधेदुखी) किंवा मूत्रपिंडातील खडे होऊ शकतात.',
            bn: 'উচ্চ ইউরিক অ্যাসিড জয়েন্টে ক্রিস্টাল তৈরি করতে পারে, যার ফলে গেঁটে বাত বা কিডনিতে পাথর হতে পারে।',
            te: 'అధిక యూరిక్ యాసిడ్ కీళ్లలో స్పటికాలుగా ఏర్పడి గౌట్ (నొప్పి) లేదా కిడ్నీ రాళ్లకు దారితీస్తుంది.',
            ta: 'அதிக யூரிக் அமிலம் மூட்டுகளில் படிகங்களை உருவாக்கி, மூட்டுவலியை (கடுமையான வலி) ஏற்படுத்தலாம் அல்லது சிறுநீரகக் கற்களை உருவாக்கலாம்.',
            gu: 'ઊંચું યુરિક એસિડ સાંધાઓમાં પથરી બનાવી શકે છે, જેથી સંધિવા (ગાઉટ) કે કિડનીમાં પથરી થઈ શકે છે.',
            es: 'El ácido úrico alto puede formar cristales en articulaciones, causando gota (inflamación dolorosa) o cálculos renales.',
            fr: 'Un acide urique élevé peut former des cristaux dans les articulations, causant la goutte ou des calculs rénaux.',
            zh: '尿酸偏高可能导致结晶在关节处沉积，引起痛风（关节剧烈疼痛和发炎），或导致肾结石。'
        }
    },
    hba1c: {
        low: {
            en: 'A low HbA1c represents low average blood glucose, occasionally linked to hemolytic anemia or red blood cell life variations.',
            hi: 'कम एचबीए1सी रक्त शर्करा के कम औसत को दर्शाता है, जो कभी-कभी एनीमिया या लाल रक्त कोशिकाओं की कमी से जुड़ा होता है।',
            mr: 'कमी एचबीए१सी कमी सरासरी रक्तशर्करा दर्शवते, हे काही वेळा ॲनिमिया किंवा लाल पेशींच्या कमतरतेमुळे असू शकते.',
            bn: 'কম এইচবিএ১সি রক্তের শর্করার কম গড় নির্দেশ করে, যা রক্তাল্পতা বা লোহিত রক্তকণিকার আয়ু কমে যাওয়ার কারণে হতে পারে।',
            te: 'తక్కువ HbA1c రక్తంలో గ్లూకోజ్ సగటు తక్కువగా ఉన్నట్లు సూచిస్తుంది, ఇది రక్తహీనత వల్ల కావచ్చు.',
            ta: 'குறைந்த HbA1c இரத்த சர்க்கரையின் குறைந்த சராசரியைக் காட்டுகிறது, இது இரத்த சோகையுடன் தொடர்புடையதாக இருக்கலாம்.',
            gu: 'નીચું HbA1c લોહીમાં ગ્લુકોઝનું ઓછું સરેરાશ પ્રમાણ દર્શાવે છે, જે ક્યારેક એનિમિયા સાથે જોડાયેલ હોય છે.',
            es: 'Un HbA1c bajo representa un promedio bajo de glucosa, ocasionalmente ligado a anemia hemolítica.',
            fr: 'Une HbA1c basse représente une moyenne de glycémie basse, parfois liée à une anémie hémolytique.',
            zh: '糖化血红蛋白（HbA1c）偏低代表平均血糖水平较低，有时可能与溶血性贫血或红细胞寿命缩短有关。'
        },
        high: {
            en: 'Elevated HbA1c reflects high average blood sugar. Values from 5.7% to 6.4% suggest prediabetes; 6.5% or more indicates diabetes.',
            hi: 'बढ़ा हुआ एचबीए1सी उच्च औसत रक्त शर्करा को दर्शाता है। 5.7%-6.4% प्रीडायबिटीज और 6.5% या अधिक मधुमेह का संकेत है।',
            mr: 'वाढलेला एचबीए१सी वाढलेली सरासरी रक्तशर्करा दर्शवतो. ५.७% ते ६.४% प्रीडायबिटीज आणि ६.५% किंवा अधिक मधुमेह दर्शवते.',
            bn: 'উচ্চ এইচবিএ১সি রক্তের শর্করার উচ্চ গড় নির্দেশ করে। ৫.৭%-৬.৪% প্রি-ডায়াবেটিস এবং ৬.৫% বা তার বেশি ডায়াবেটিস নির্দেশ করে।',
            te: 'అధిక HbA1c రక్తంలో గ్లూకోజ్ సగటు ఎక్కువగా ఉన్నట్లు సూచిస్తుంది. 5.7%-6.4% ప్రీడయాబెటిస్, 6.5% లేదా ఎక్కువ డయాబెటిస్‌ను సూచిస్తుంది.',
            ta: 'அதிக HbA1c சர்க்கரையின் உயர் சராசரியைக் காட்டுகிறது. 5.7% முதல் 6.4% வரை இருப்பது நீரிழிவு நோய்க்கு முந்தைய நிலையையும், 6.5% மேல் நீரிழிவையும் குறிக்கும்.',
            gu: 'ઊંચું HbA1c લોહીમાં ગ્લુકોઝનું વધુ સરેરાશ પ્રમાણ દર્શાવે છે. 5.7%-6.4% પ્રી-ડાયાબિટીસ અને 6.5% કે વધુ ડાયાબિટીસ સૂચવે છે.',
            es: 'El HbA1c elevado indica azúcar promedio alto. De 5.7% a 6.4% sugiere prediabetes; 6.5% o más indica diabetes.',
            fr: 'Une HbA1c élevée indique une moyenne de glycémie haute. 5,7%-6,4% évoque un prédiabète, et >=6,5% confirme un diabète.',
            zh: '糖化血红蛋白（HbA1c）偏高反映了平均血糖水平升高。5.7% 至 6.4% 提示糖尿病前期；6.5% 及以上提示糖尿病。'
        }
    },
    fbs: {
        low: {
            en: 'Low fasting blood sugar (hypoglycemia) can cause shaking, sweating, dizziness, or confusion. Fast sugar intake is needed.',
            hi: 'खाली पेट कम ब्लड शुगर (हाइपोग्लाइसीमिया) से कंपकंपी, पसीना, चक्कर आना हो सकता है। तुरंत मीठा खाने की आवश्यकता है।',
            mr: 'उपाशी पोटी कमी ब्लड शुगर (हायपोग्लाइसीमिया) मुळे थरथरणे, घाम येणे, चक्कर येणे होते. त्वरित साखरेचे सेवन आवश्यक आहे.',
            bn: 'খালি পেটে কম ব্লাড সুগার (হাইপোগ্লাইসেমিয়া) কাঁপুনি, অতিরিক্ত ঘাম, মাথা ঘোরা সৃষ্টি করতে পারে। দ্রুত মিষ্টি খাওয়ার প্রয়োজন।',
            te: 'ఖాళీ కడుపుతో తక్కువ బ్లడ్ షుగర్ ఉండటం వల్ల వణుకు, చెమటలు పట్టడం, కళ్లు తిరగడం జరగవచ్చు. వెంటనే చక్కెర తీసుకోవాలి.',
            ta: 'வெறும் வயிற்றில் சர்க்கரை அளவு குறைவாக இருப்பது நடுக்கம், வியர்வை, தலைச்சுற்றலை ஏற்படுத்தலாம். உடனடியாக சர்க்கரை உணவு தேவை.',
            gu: 'ભૂખ્યા પેટે ઓછી શુગર (હાઇપોગ્લાયસેમિયા) ધ્રુજારી, પરસેવો, ચક્કર લાવી શકે છે. તુરંત ખાંડ ખાવાની જરૂર છે.',
            es: 'El azúcar bajo en ayunas (hipoglucemia) causa temblores, sudoración o mareos. Requiere consumo inmediato de azúcar.',
            fr: 'Une glycémie à jeun basse (hypoglycémie) peut causer des tremblements, sueurs ou vertiges. Une prise de sucre immédiate est requise.',
            zh: '空腹血糖偏低（低血糖）会导致发抖、出汗、头晕或意识混乱。需要立即补充糖分。'
        },
        high: {
            en: 'High fasting blood sugar suggests glucose intolerance, indicating prediabetes or diabetes. Lifestyle or therapy changes are needed.',
            hi: 'खाली पेट उच्च ब्लड शुगर इंसुलिन की कमी, प्रीडायबिटीज या मधुमेह का संकेत है। जीवनशैली में बदलाव जरूरी है।',
            mr: 'उपाशी पोटी जास्त ब्लड शुगर प्रीडायबिटीज किंवा मधुमेह दर्शवते. जीवनशैलीत बदल करणे गरजेचे आहे.',
            bn: 'খালি পেটে উচ্চ ব্লাড সুগার প্রি-ডায়াবেটিস বা ডায়াবেটিস নির্দেশ করে। জীবনযাত্রায় পরিবর্তন আনা প্রয়োজন।',
            te: 'అధిక ఖాళీ కడుపు బ్లడ్ షుగర్ ప్రీడయాబెటిస్ లేదా డయాబెటిస్‌ను సూచిస్తుంది. జీవనశైలి మార్పులు అవసరం.',
            ta: 'உயர் சர்க்கரை அளவு நீரிழிவு நோய்க்கு முந்தைய நிலை அல்லது நீरीழிவு நோயைக் குறிக்கும். உணவு மற்றும் உடற்பயிற்சி மாற்றங்கள் தேவை.',
            gu: 'ભૂખ્યા પેટે ઊંચી શુગર પ્રી-ડાયાબિટીસ કે ડાયાબિટીસ સૂચવે છે. જીવનશૈલીમાં ફેરફાર કરવો જરૂરી છે.',
            es: 'El azúcar alto en ayunas sugiere intolerancia a la glucosa, indicando prediabetes o diabetes. Requiere cambios en el estilo de vida.',
            fr: 'Une glycémie à jeun élevée suggère une intolérance au glucose, traduisant un prédiabète ou diabète.',
            zh: '空腹血糖偏高提示糖耐量异常，提示糖尿病前期或糖尿病。需要调整生活方式或进行治疗。'
        }
    },
    vitamind: {
        low: {
            en: 'Vitamin D deficiency is common and can weaken bones, cause muscle aches, or affect immunity. Supplementation is often recommended.',
            hi: 'विटामिन डी की कमी बहुत आम है, जो हड्डियों को कमजोर कर सकती है, मांसपेशियों में दर्द पैदा कर सकती है। पूरक खुराक की सलाह दी जाती है।',
            mr: 'व्हिटॅमिन डी ची कमतरता खूप सामान्य आहे, ज्यामुळे हाडे कमकुवत होतात आणि स्नायू दुखतात. सप्लिमेंट्स घेण्याचा सल्ला दिला जातो.',
            bn: 'ভিটামিন ডি-এর ঘাটতি খুব সাধারণ, যা হাড়কে দুর্বল করতে পারে এবং পেশী ব্যথা সৃষ্টি করতে পারে। সাপ্লিমেন্ট নেওয়ার পরামর্শ দেওয়া হয়।',
            te: 'విటమిన్ డి లోపం చాలా సాధారణం, ఇది ఎముకలను బలహీనపరుస్తుంది మరియు కండరాల నొప్పులను కలిగిస్తుంది. సప్లిమెంట్స్ అవసరం.',
            ta: 'வைட்டமின் டி குறைபாடு எலும்புகளை பலவீனப்படுத்தி, தசை வலியை ஏற்படுத்தலாம். இதற்கு ஊட்டச்சத்து மாத்திரைகள் பரிந்துரைக்கப்படலாம்.',
            gu: 'વિટામિન ડીની ઉણપ સામાન્ય છે, જે હાડકાંને નબળા પાડે છે અને સ્नाયુઓમાં દુખાવો લાવે છે. સપ્લિમેન્ટ્સ લેવાની સલાહ અપાય છે.',
            es: 'La deficiencia de vitamina D es común y debilita los huesos, causa dolores musculares o afecta la inmunidad.',
            fr: 'La carence en vitamine D est courante, pouvant affaiblir les os et causer des douleurs musculaires. Une supplémentation est conseillée.',
            zh: '维生素 D 缺乏很常见，会导致骨骼变软、肌肉酸痛或免疫力下降。通常建议补充维生素 D。'
        },
        high: {
            en: 'High Vitamin D is rare and usually caused by high-dose supplement overuse, potentially leading to excess calcium in blood (hypercalcemia).',
            hi: 'विटामिन डी की अधिकता दुर्लभ है और यह अक्सर अत्यधिक सप्लीमेंट्स लेने से होती है, जिससे रक्त में कैल्शियम बढ़ सकता है।',
            mr: 'व्हिटॅमिन डी चे जास्त प्रमाण दुर्मिळ आहे आणि ते सप्लिमेंट्सच्या अतिवापरामुळे होते, ज्यामुळे रक्तात कॅल्शियम वाढू शकते.',
            bn: 'অতিরিক্ত ভিটামিন ডি বিরল এবং সাধারণত বেশি সাপ্লিমেন্ট খাওয়ার কারণে হয়, যা রক্তে ক্যালসিয়াম বাড়াতে পারে।',
            te: 'అధిక విటమిన్ డి అరుదు, ఇది సాధారణంగా ఎక్కువ సప్లిమెంట్స్ తీసుకోవడం వల్ల జరుగుతుంది, ఇది రక్తంలో కాల్షియంను పెంచుతుంది.',
            ta: 'அதிக வைட்டமின் டி அரிதானது, இது ஊட்டச்சத்து மாத்திரைகளை அதிகமாக உட்கொள்வதால் ஏற்பட்டு, இரத்தத்தில் கால்சியத்தை அதிகரிக்கும்.',
            gu: 'વિટામિન ડીનું વધુ પ્રમાણ દુર્લભ છે અને તે સપ્લિમેન્ટ્સના અતિ ઉપયોગથી થાય છે, જેથી લોહીમાં કેલ્શિયમ વધી શકે.',
            es: 'La vitamina D alta es rara y suele deberse al abuso de suplementos, lo que podría elevar el calcio en sangre (hipercalcemia).',
            fr: 'Un taux élevé de vitamine D est rare, souvent dû à un excès de suppléments, pouvant augmenter le calcium sanguin (hypercalcémie).',
            zh: '维生素 D 水平偏高较罕见，通常是由于过度服用高剂量补充剂引起的，可能导致血钙过高（高钙血症）。'
        }
    },
    vitaminb12: {
        low: {
            en: 'Low Vitamin B12 can cause megaloblastic anemia, persistent fatigue, and neurological symptoms like numbness or tingling.',
            hi: 'विटामिन बी12 की कमी से एनीमिया, लगातार थकान और नसों में झुनझुनी या सुन्नता जैसे न्यूरोलॉजिकल लक्षण हो सकते हैं।',
            mr: 'व्हिटॅमिन बी१२ च्या कमतरतेमुळे ॲनिमिया, थकवा आणि हातापायांना मुंग्या येणे यासारख्या मज्जासंस्थेच्या समस्या उद्भवू शकतात.',
            bn: 'ভিটামিন বি১২-এর ঘাটতি অ্যানিমিয়া, ক্লান্তি এবং হাতে-পায়ে অবশ ভাব বা ঝিনঝিন করার মতো স্নায়বিক সমস্যা তৈরি করতে পারে।',
            te: 'తక్కువ విటమిన్ బి12 రక్తహీనత, అలసట మరియు కండరాలలో తిమ్మిరి వంటి నరాల సమస్యలకు దారితీస్తుంది.',
            ta: 'குறைந்த வைட்டமின் பி12 இரத்த சோகை, சோர்வு மற்றும் கை, கால்களில் மரத்துப்போதல் போன்ற நரம்புப் பிரச்சினைகளை ஏற்படுத்தலாம்.',
            gu: 'વિટામિન બી12 ની ઉણપથી એનિમિયા, થાક અને હાથ-પગમાં ખાલી ચડવી જેવા ચેતાતંત્રના લક્ષણો થઈ શકે છે.',
            es: 'El B12 bajo causa anemia megaloblástica, fatiga y síntomas neurológicos como entumecimiento o cosquilleo.',
            fr: 'Une carence en B12 cause une anémie mégaloblastique, de la fatigue et des troubles neurologiques (engourdissements).',
            zh: '维生素 B12 偏低会导致巨幼细胞性贫血、持续疲劳以及手脚麻木或刺痛等神经系统症状。'
        },
        high: {
            en: 'High B12 is often due to supplementation and generally non-toxic, though extreme levels merit check for liver conditions.',
            hi: 'विटामिन बी12 का उच्च स्तर अक्सर सप्लीमेंट्स के कारण होता है और यह हानिरहित है, लेकिन बहुत अधिक होने पर लीवर की जांच करानी चाहिए।',
            mr: 'व्हिटॅमिन बी१२ चे प्रमाण जास्त असणे हे सप्लिमेंट्समुळे होते आणि ते निरुपद्रवी असते, पण खूप जास्त असल्यास यकृताची तपासणी करावी.',
            bn: 'অতিরিক্ত বি১২ সাধারণত সাপ্লিমেন্টের কারণে হয় এবং এটি ক্ষতিকর নয়, তবে খুব বেশি হলে লিভার পরীক্ষা করা উচিত।',
            te: 'అధిక బి12 సాధారణంగా సప్లిమెంట్స్ వల్ల జరుగుతుంది మరియు హానికరం కాదు, కానీ చాలా ఎక్కువగా ఉంటే కాలేయాన్ని పరీక్షించాలి.',
            ta: 'அதிக வைட்டமின் பி12 பொதுவாக மாத்திரைகளால் ஏற்படுகிறது மற்றும் இது ஆபத்தற்றது, இருப்பினும் கல்லீரலை பரிசோதிப்பது நல்லது.',
            gu: 'વિટામિન બી12 નું ઊંચું સ્તર સપ્લિમેન્ટ્સને લીધે થાય છે અને તે હાનિકારક નથી, પણ વધુ પ્રમાણ હોય તો લિવરની તપાસ કરાવો.',
            es: 'El B12 alto suele deberse a suplementos y no es tóxico, aunque niveles extremos ameritan revisar la función hepática.',
            fr: 'Un taux élevé de B12 est souvent dû aux suppléments et est inoffensif, mais un taux extrême justifie un contrôle du foie.',
            zh: '维生素 B12 偏高通常是由服用补充剂引起的，一般无毒性，但极高水平需排查肝脏相关疾病。'
        }
    },
    ferritin: {
        low: {
            en: 'Low ferritin indicates depleted iron stores, which is the primary cause of iron-deficiency anemia and fatigue.',
            hi: 'कम फेरिटिन शरीर में आयरन के संचय की कमी को दर्शाता है, जो आयरन की कमी से होने वाले एनीमिया और थकान का मुख्य कारण है।',
            mr: 'कमी फेरिटिन शरीरात लोहाचे प्रमाण कमी असल्याचे दर्शवते, जे ॲनिमिया आणि थकव्याचे मुख्य कारण आहे.',
            bn: 'কম ফেরিটিন শরীরে আয়রনের ঘাটতি নির্দেশ করে, যা আয়রনের ঘাটতিজনিত রক্তাল্পতা ও ক্লান্তির প্রধান কারণ।',
            te: 'తక్కువ ఫెర్రిటిన్ ఐరన్ నిల్వలు తగ్గినట్లు సూచిస్తుంది, ఇది రక్తహీనత మరియు అలసటకు దారితీస్తుంది.',
            ta: 'குறைந்த ஃபெரிட்டின் இரும்புச்சத்து சேமிப்பு குறைந்துள்ளதைக் காட்டுகிறது, இது இரும்புச்சத்து குறைபாட்டினால் ஏற்படும் சோகை மற்றும் சோர்வுக்கு முக்கிய காரணம்.',
            gu: 'નીચું ફેરીટીન લોખંડ (આયર્ન) નો સંગ્રહ ઘટી ગયાનું સૂચવે છે, જે એનિમિયા અને થાકનું મુખ્ય कारण છે.',
            es: 'La ferritina baja indica reservas de hierro agotadas, causa principal de la anemia ferropénica y la fatiga.',
            fr: 'Une ferritine basse indique des réserves de fer épuisées, cause principale de l\'anémie ferriprive et de la fatigue.',
            zh: '铁蛋白偏低表明体内铁储存耗尽，这是缺铁性贫血和疲劳的主要原因。'
        },
        high: {
            en: 'High ferritin suggests excess iron storage, often triggered by inflammation, liver stress, or genetic iron overload (hemochromatosis).',
            hi: 'उच्च फेरिटिन आयरन के अत्यधिक संचय को दर्शाता है, जो सूजन, यकृत के तनाव या आनुवंशिक विकारों के कारण हो सकता है।',
            mr: 'जास्त फेरिटिन शरीरात लोहाचे प्रमाण जास्त असल्याचे दर्शवते, जे सूज, यकृताचा ताण किंवा अनुवंशिक आजारामुळे असू शकते.',
            bn: 'উচ্চ ফেরিটিন শরীরে আয়রন বেশি থাকা নির্দেশ করে, যা প্রদাহ, লিভারের সমস্যা বা বংশগত কারণে হতে পারে।',
            te: 'అధిక ఫెర్రిటిన్ ఐరన్ నిల్వలు ఎక్కువ ఉన్నట్లు సూచిస్తుంది, ఇది కాలేయ సమస్య లేదా మంట వల్ల కావచ్చు.',
            ta: 'அதிக ஃபெரிட்டின் இரும்புச்சத்து அதிகமாக சேமிக்கப்பட்டுள்ளதைக் காட்டுகிறது, இது அலற்சி, கல்லீரல் பாதிப்பு போன்றவற்றால் ஏற்படலாம்.',
            gu: 'ઊંચું ફેરીટીન શરીરમાં વધુ પડતો આયર્ન સંગ્રહ સૂચવે છે, જે બળતરા, લિવરનો સોજો કે વારસાગत રોગોથી થઈ શકે છે.',
            es: 'La ferritina alta sugiere exceso de hierro, a menudo por inflamación, estrés hepático o sobrecarga genética de hierro.',
            fr: 'Une ferritine élevée suggère un excès de fer, souvent lié à une inflammation, un stress du foie ou une hémochromatose.',
            zh: '铁蛋白偏高提示铁储存过量，通常由炎症、肝脏受累或遗传性铁载量过多（血色病）引起。'
        }
    },
    mcv: {
        low: {
            en: 'Low MCV indicates microcytosis, meaning red blood cells are smaller than average, typical of iron deficiency or thalassemia trait.',
            hi: 'Mean Corpuscular Volume (MCV) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Mean Corpuscular Volume (MCV) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Mean Corpuscular Volume (MCV)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Mean Corpuscular Volume (MCV) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Mean Corpuscular Volume (MCV) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Mean Corpuscular Volume (MCV) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Mean Corpuscular Volume (MCV) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Mean Corpuscular Volume (MCV) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Mean Corpuscular Volume (MCV)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High MCV indicates macrocytosis, meaning red blood cells are larger than normal, often linked to Vitamin B12 or folate deficiency.',
            hi: 'Mean Corpuscular Volume (MCV) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Mean Corpuscular Volume (MCV) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Mean Corpuscular Volume (MCV)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Mean Corpuscular Volume (MCV) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Mean Corpuscular Volume (MCV) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Mean Corpuscular Volume (MCV) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Mean Corpuscular Volume (MCV) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Mean Corpuscular Volume (MCV) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Mean Corpuscular Volume (MCV)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    mch: {
        low: {
            en: 'Low MCH means less hemoglobin per red blood cell, giving cells a paler appearance (hypochromia).',
            hi: 'Mean Corpuscular Hemoglobin (MCH) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Mean Corpuscular Hemoglobin (MCH) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Mean Corpuscular Hemoglobin (MCH)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Mean Corpuscular Hemoglobin (MCH) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Mean Corpuscular Hemoglobin (MCH) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Mean Corpuscular Hemoglobin (MCH) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Mean Corpuscular Hemoglobin (MCH) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Mean Corpuscular Hemoglobin (MCH) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Mean Corpuscular Hemoglobin (MCH)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High MCH indicates a higher amount of hemoglobin per cell, seen in macrocytic anemias.',
            hi: 'Mean Corpuscular Hemoglobin (MCH) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Mean Corpuscular Hemoglobin (MCH) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Mean Corpuscular Hemoglobin (MCH)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Mean Corpuscular Hemoglobin (MCH) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Mean Corpuscular Hemoglobin (MCH) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Mean Corpuscular Hemoglobin (MCH) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Mean Corpuscular Hemoglobin (MCH) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Mean Corpuscular Hemoglobin (MCH) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Mean Corpuscular Hemoglobin (MCH)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    mchc: {
        low: {
            en: 'Low MCHC indicates reduced hemoglobin concentration relative to red cell volume.',
            hi: 'MCHC का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'MCHC चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'MCHC-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'MCHC స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'MCHC அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'MCHC નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de MCHC es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de MCHC est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的MCHC偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High MCHC indicates abnormally concentrated hemoglobin in red cells, seen in spherocytosis or dehydration.',
            hi: 'MCHC का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'MCHC चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'MCHC-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'MCHC స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'MCHC அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'MCHC નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de MCHC es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de MCHC est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的MCHC偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    rdw: {
        low: {
            en: 'Low RDW indicates that red blood cells are very uniform in size, a healthy finding.',
            hi: 'Red Cell Distribution Width (RDW) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Red Cell Distribution Width (RDW) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Red Cell Distribution Width (RDW)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Red Cell Distribution Width (RDW) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Red Cell Distribution Width (RDW) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Red Cell Distribution Width (RDW) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Red Cell Distribution Width (RDW) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Red Cell Distribution Width (RDW) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Red Cell Distribution Width (RDW)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High RDW indicates significant variation in red blood cell size (anisocytosis), an early sign of nutritional deficiency.',
            hi: 'Red Cell Distribution Width (RDW) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Red Cell Distribution Width (RDW) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Red Cell Distribution Width (RDW)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Red Cell Distribution Width (RDW) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Red Cell Distribution Width (RDW) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Red Cell Distribution Width (RDW) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Red Cell Distribution Width (RDW) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Red Cell Distribution Width (RDW) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Red Cell Distribution Width (RDW)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    neutrophils: {
        low: {
            en: 'Low neutrophils (neutropenia) reduces immediate bacterial infection defense.',
            hi: 'Neutrophils का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Neutrophils चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Neutrophils-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Neutrophils స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Neutrophils அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Neutrophils નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Neutrophils es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Neutrophils est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Neutrophils偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High neutrophils (neutrophilia) is typically an acute immune response to bacterial infection or inflammation.',
            hi: 'Neutrophils का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Neutrophils चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Neutrophils-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Neutrophils స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Neutrophils அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Neutrophils નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Neutrophils es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Neutrophils est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Neutrophils偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    vldl: {
        low: {
            en: 'Low VLDL cholesterol is generally favorable, reflecting low circulating triglyceride carriers.',
            hi: 'VLDL Cholesterol का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'VLDL Cholesterol चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'VLDL Cholesterol-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'VLDL Cholesterol స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'VLDL Cholesterol அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'VLDL Cholesterol નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de VLDL Cholesterol es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de VLDL Cholesterol est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的VLDL Cholesterol偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High VLDL cholesterol carries triglycerides and contributes to arterial plaque build-up and cardiovascular risk.',
            hi: 'VLDL Cholesterol का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'VLDL Cholesterol चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'VLDL Cholesterol-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'VLDL Cholesterol స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'VLDL Cholesterol அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'VLDL Cholesterol નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de VLDL Cholesterol es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de VLDL Cholesterol est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的VLDL Cholesterol偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    non_hdl: {
        low: {
            en: 'Low non-HDL cholesterol reflects minimal total atherogenic particle burden.',
            hi: 'Non-HDL Cholesterol का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Non-HDL Cholesterol चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Non-HDL Cholesterol-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Non-HDL Cholesterol స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Non-HDL Cholesterol அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Non-HDL Cholesterol નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Non-HDL Cholesterol es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Non-HDL Cholesterol est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Non-HDL Cholesterol偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High non-HDL cholesterol measures total atherogenic lipid burden and indicates higher cardiovascular risk.',
            hi: 'Non-HDL Cholesterol का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Non-HDL Cholesterol चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Non-HDL Cholesterol-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Non-HDL Cholesterol స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Non-HDL Cholesterol அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Non-HDL Cholesterol નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Non-HDL Cholesterol es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Non-HDL Cholesterol est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Non-HDL Cholesterol偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    chol_hdl_ratio: {
        low: {
            en: 'A low Total Cholesterol to HDL ratio indicates a highly protective lipid balance.',
            hi: 'Total Cholesterol / HDL Ratio का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Cholesterol / HDL Ratio चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Total Cholesterol / HDL Ratio-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Total Cholesterol / HDL Ratio స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Cholesterol / HDL Ratio அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Total Cholesterol / HDL Ratio નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Cholesterol / HDL Ratio es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Total Cholesterol / HDL Ratio est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Total Cholesterol / HDL Ratio偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'An elevated Total Cholesterol to HDL ratio suggests higher risk of cardiovascular events.',
            hi: 'Total Cholesterol / HDL Ratio का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Cholesterol / HDL Ratio चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Total Cholesterol / HDL Ratio-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Total Cholesterol / HDL Ratio స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Cholesterol / HDL Ratio அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Total Cholesterol / HDL Ratio નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Cholesterol / HDL Ratio es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Total Cholesterol / HDL Ratio est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Total Cholesterol / HDL Ratio偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    ft3: {
        low: {
            en: 'Low Free T3 reflects decreased circulating active thyroid hormone, causing fatigue or sluggishness.',
            hi: 'Free T3 का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Free T3 चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Free T3-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Free T3 స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Free T3 அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Free T3 નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Free T3 es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Free T3 est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Free T3偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High Free T3 indicates excessive thyroid hormone activity (hyperthyroidism).',
            hi: 'Free T3 का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Free T3 चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Free T3-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Free T3 స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Free T3 அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Free T3 નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Free T3 es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Free T3 est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Free T3偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    ft4: {
        low: {
            en: 'Low Free T4 indicates underactive thyroid gland hormone production.',
            hi: 'Free T4 का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Free T4 चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Free T4-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Free T4 స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Free T4 அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Free T4 નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Free T4 es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Free T4 est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Free T4偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High Free T4 confirms active thyroid hormone overproduction.',
            hi: 'Free T4 का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Free T4 चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Free T4-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Free T4 స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Free T4 அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Free T4 નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Free T4 es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Free T4 est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Free T4偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    anti_tpo: {
        low: {
            en: 'Low or negative Anti-TPO antibodies indicate absence of autoimmune thyroid disease.',
            hi: 'Anti-TPO Antibodies का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Anti-TPO Antibodies चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Anti-TPO Antibodies-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Anti-TPO Antibodies స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Anti-TPO Antibodies அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Anti-TPO Antibodies નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Anti-TPO Antibodies es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Anti-TPO Antibodies est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Anti-TPO Antibodies偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated Anti-TPO antibodies indicate autoimmune thyroiditis such as Hashimotos or Graves disease.',
            hi: 'Anti-TPO Antibodies का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Anti-TPO Antibodies चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Anti-TPO Antibodies-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Anti-TPO Antibodies స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Anti-TPO Antibodies அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Anti-TPO Antibodies નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Anti-TPO Antibodies es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Anti-TPO Antibodies est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Anti-TPO Antibodies偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    direct_bilirubin: {
        low: {
            en: 'Low direct conjugated bilirubin is normal and healthy.',
            hi: 'Direct Bilirubin का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Direct Bilirubin चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Direct Bilirubin-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Direct Bilirubin స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Direct Bilirubin அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Direct Bilirubin નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Direct Bilirubin es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Direct Bilirubin est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Direct Bilirubin偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High direct bilirubin indicates impaired bile drainage or biliary obstruction.',
            hi: 'Direct Bilirubin का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Direct Bilirubin चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Direct Bilirubin-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Direct Bilirubin స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Direct Bilirubin அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Direct Bilirubin નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Direct Bilirubin es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Direct Bilirubin est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Direct Bilirubin偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    ggt: {
        low: {
            en: 'Low GGT levels are normal and reassuring for liver and bile duct health.',
            hi: 'Gamma-Glutamyl Transferase (GGT) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Gamma-Glutamyl Transferase (GGT) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Gamma-Glutamyl Transferase (GGT)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Gamma-Glutamyl Transferase (GGT) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Gamma-Glutamyl Transferase (GGT) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Gamma-Glutamyl Transferase (GGT) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Gamma-Glutamyl Transferase (GGT) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Gamma-Glutamyl Transferase (GGT) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Gamma-Glutamyl Transferase (GGT)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated GGT is a sensitive indicator of liver inflammation, alcohol effect, or bile tract blockage.',
            hi: 'Gamma-Glutamyl Transferase (GGT) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Gamma-Glutamyl Transferase (GGT) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Gamma-Glutamyl Transferase (GGT)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Gamma-Glutamyl Transferase (GGT) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Gamma-Glutamyl Transferase (GGT) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Gamma-Glutamyl Transferase (GGT) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Gamma-Glutamyl Transferase (GGT) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Gamma-Glutamyl Transferase (GGT) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Gamma-Glutamyl Transferase (GGT)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    total_protein: {
        low: {
            en: 'Low total protein can indicate reduced liver protein synthesis or kidney filtration loss.',
            hi: 'Total Serum Protein का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Serum Protein चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Total Serum Protein-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Total Serum Protein స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Serum Protein அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Total Serum Protein નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Serum Protein es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Total Serum Protein est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Total Serum Protein偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High total protein can be caused by chronic inflammation, dehydration, or bone marrow disorders.',
            hi: 'Total Serum Protein का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Serum Protein चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Total Serum Protein-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Total Serum Protein స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Serum Protein அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Total Serum Protein નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Serum Protein es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Total Serum Protein est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Total Serum Protein偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    albumin: {
        low: {
            en: 'Low serum albumin suggests reduced liver synthesis capacity, active inflammation, or kidney leakage.',
            hi: 'Albumin का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Albumin चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Albumin-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Albumin స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Albumin அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Albumin નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Albumin es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Albumin est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Albumin偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High albumin is usually caused by acute dehydration.',
            hi: 'Albumin का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Albumin चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Albumin-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Albumin స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Albumin அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Albumin નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Albumin es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Albumin est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Albumin偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    egfr: {
        low: {
            en: 'A lower eGFR indicates reduced kidney waste filtration efficiency.',
            hi: 'Estimated GFR (eGFR) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Estimated GFR (eGFR) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Estimated GFR (eGFR)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Estimated GFR (eGFR) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Estimated GFR (eGFR) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Estimated GFR (eGFR) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Estimated GFR (eGFR) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Estimated GFR (eGFR) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Estimated GFR (eGFR)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Normal or high eGFR demonstrates robust kidney filtration function.',
            hi: 'Estimated GFR (eGFR) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Estimated GFR (eGFR) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Estimated GFR (eGFR)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Estimated GFR (eGFR) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Estimated GFR (eGFR) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Estimated GFR (eGFR) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Estimated GFR (eGFR) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Estimated GFR (eGFR) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Estimated GFR (eGFR)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    ppbs: {
        low: {
            en: 'Low postprandial glucose suggests reactive hypoglycemia following meals.',
            hi: 'Postprandial Blood Sugar का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Postprandial Blood Sugar चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Postprandial Blood Sugar-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Postprandial Blood Sugar స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Postprandial Blood Sugar அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Postprandial Blood Sugar નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Postprandial Blood Sugar es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Postprandial Blood Sugar est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Postprandial Blood Sugar偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated postprandial blood sugar indicates impaired glucose tolerance or diabetes.',
            hi: 'Postprandial Blood Sugar का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Postprandial Blood Sugar चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Postprandial Blood Sugar-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Postprandial Blood Sugar స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Postprandial Blood Sugar அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Postprandial Blood Sugar નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Postprandial Blood Sugar es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Postprandial Blood Sugar est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Postprandial Blood Sugar偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    insulin: {
        low: {
            en: 'Low fasting insulin indicates reduced pancreatic beta cell hormone secretion.',
            hi: 'Fasting Serum Insulin का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Fasting Serum Insulin चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Fasting Serum Insulin-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Fasting Serum Insulin స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Fasting Serum Insulin அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Fasting Serum Insulin નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Fasting Serum Insulin es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Fasting Serum Insulin est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Fasting Serum Insulin偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated fasting insulin is a classic signal of systemic insulin resistance and metabolic stress.',
            hi: 'Fasting Serum Insulin का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Fasting Serum Insulin चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Fasting Serum Insulin-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Fasting Serum Insulin స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Fasting Serum Insulin அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Fasting Serum Insulin નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Fasting Serum Insulin es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Fasting Serum Insulin est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Fasting Serum Insulin偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    iron: {
        low: {
            en: 'Low serum iron indicates insufficient circulating iron for red blood cell production.',
            hi: 'Serum Iron का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Serum Iron चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Serum Iron-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Serum Iron స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Serum Iron அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Serum Iron નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Serum Iron es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Serum Iron est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Serum Iron偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High serum iron can indicate iron overload or acute liver cellular injury.',
            hi: 'Serum Iron का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Serum Iron चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Serum Iron-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Serum Iron స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Serum Iron அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Serum Iron નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Serum Iron es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Serum Iron est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Serum Iron偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    tibc: {
        low: {
            en: 'Low TIBC occurs in iron overload, malnutrition, or chronic inflammation.',
            hi: 'Total Iron Binding Capacity (TIBC) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Iron Binding Capacity (TIBC) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Total Iron Binding Capacity (TIBC)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Total Iron Binding Capacity (TIBC) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Iron Binding Capacity (TIBC) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Total Iron Binding Capacity (TIBC) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Iron Binding Capacity (TIBC) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Total Iron Binding Capacity (TIBC) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Total Iron Binding Capacity (TIBC)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated TIBC is a classic compensatory sign of iron deficiency.',
            hi: 'Total Iron Binding Capacity (TIBC) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Iron Binding Capacity (TIBC) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Total Iron Binding Capacity (TIBC)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Total Iron Binding Capacity (TIBC) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Iron Binding Capacity (TIBC) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Total Iron Binding Capacity (TIBC) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Iron Binding Capacity (TIBC) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Total Iron Binding Capacity (TIBC) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Total Iron Binding Capacity (TIBC)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    transferrin_sat: {
        low: {
            en: 'Low transferrin saturation (<20%) confirms depleted iron availability for red cells.',
            hi: 'Transferrin Saturation का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Transferrin Saturation चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Transferrin Saturation-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Transferrin Saturation స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Transferrin Saturation அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Transferrin Saturation નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Transferrin Saturation es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Transferrin Saturation est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Transferrin Saturation偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High transferrin saturation (>50%) warns of systemic iron overload risk.',
            hi: 'Transferrin Saturation का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Transferrin Saturation चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Transferrin Saturation-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Transferrin Saturation స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Transferrin Saturation அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Transferrin Saturation નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Transferrin Saturation es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Transferrin Saturation est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Transferrin Saturation偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    folate: {
        low: {
            en: 'Low folate can cause megaloblastic anemia, weakness, and elevated homocysteine.',
            hi: 'Folate (Vitamin B9) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Folate (Vitamin B9) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Folate (Vitamin B9)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Folate (Vitamin B9) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Folate (Vitamin B9) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Folate (Vitamin B9) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Folate (Vitamin B9) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Folate (Vitamin B9) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Folate (Vitamin B9)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High folate is generally harmless and reflects dietary intake or supplement use.',
            hi: 'Folate (Vitamin B9) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Folate (Vitamin B9) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Folate (Vitamin B9)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Folate (Vitamin B9) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Folate (Vitamin B9) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Folate (Vitamin B9) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Folate (Vitamin B9) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Folate (Vitamin B9) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Folate (Vitamin B9)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    sodium: {
        low: {
            en: 'Low sodium (hyponatremia) can cause headache, fatigue, confusion, or muscle weakness.',
            hi: 'Sodium (Na) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Sodium (Na) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Sodium (Na)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Sodium (Na) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Sodium (Na) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Sodium (Na) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Sodium (Na) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Sodium (Na) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Sodium (Na)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High sodium (hypernatremia) indicates dehydration or excessive fluid loss.',
            hi: 'Sodium (Na) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Sodium (Na) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Sodium (Na)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Sodium (Na) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Sodium (Na) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Sodium (Na) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Sodium (Na) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Sodium (Na) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Sodium (Na)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    potassium: {
        low: {
            en: 'Low potassium (hypokalemia) causes muscle cramps, weakness, and risk of heart rhythm changes.',
            hi: 'Potassium (K) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Potassium (K) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Potassium (K)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Potassium (K) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Potassium (K) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Potassium (K) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Potassium (K) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Potassium (K) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Potassium (K)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High potassium (hyperkalemia) is a critical finding requiring prompt review to protect cardiac rhythm.',
            hi: 'Potassium (K) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Potassium (K) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Potassium (K)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Potassium (K) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Potassium (K) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Potassium (K) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Potassium (K) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Potassium (K) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Potassium (K)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    chloride: {
        low: {
            en: 'Low chloride can occur with fluid loss, persistent vomiting, or metabolic alkalosis.',
            hi: 'Chloride (Cl) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Chloride (Cl) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Chloride (Cl)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Chloride (Cl) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Chloride (Cl) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Chloride (Cl) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Chloride (Cl) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Chloride (Cl) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Chloride (Cl)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High chloride can indicate dehydration, kidney dysfunction, or metabolic acidosis.',
            hi: 'Chloride (Cl) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Chloride (Cl) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Chloride (Cl)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Chloride (Cl) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Chloride (Cl) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Chloride (Cl) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Chloride (Cl) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Chloride (Cl) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Chloride (Cl)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    calcium: {
        low: {
            en: 'Low calcium (hypocalcemia) can cause muscle twitching, tingling, or bone fragility.',
            hi: 'Calcium (Ca) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Calcium (Ca) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Calcium (Ca)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Calcium (Ca) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Calcium (Ca) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Calcium (Ca) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Calcium (Ca) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Calcium (Ca) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Calcium (Ca)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High calcium (hypercalcemia) can cause fatigue, kidney stones, and bone aches.',
            hi: 'Calcium (Ca) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Calcium (Ca) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Calcium (Ca)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Calcium (Ca) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Calcium (Ca) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Calcium (Ca) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Calcium (Ca) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Calcium (Ca) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Calcium (Ca)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    phosphorus: {
        low: {
            en: 'Low phosphorus can cause muscle weakness, bone pain, and fatigue.',
            hi: 'Phosphorus (P) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Phosphorus (P) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Phosphorus (P)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Phosphorus (P) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Phosphorus (P) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Phosphorus (P) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Phosphorus (P) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Phosphorus (P) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Phosphorus (P)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High phosphorus is frequently associated with chronic kidney disease or hypoparathyroidism.',
            hi: 'Phosphorus (P) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Phosphorus (P) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Phosphorus (P)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Phosphorus (P) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Phosphorus (P) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Phosphorus (P) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Phosphorus (P) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Phosphorus (P) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Phosphorus (P)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    magnesium: {
        low: {
            en: 'Low magnesium can cause muscle cramps, tremors, and irregular heartbeat.',
            hi: 'Magnesium (Mg) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Magnesium (Mg) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Magnesium (Mg)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Magnesium (Mg) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Magnesium (Mg) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Magnesium (Mg) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Magnesium (Mg) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Magnesium (Mg) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Magnesium (Mg)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High magnesium can cause weakness, sluggish reflexes, and low blood pressure.',
            hi: 'Magnesium (Mg) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Magnesium (Mg) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Magnesium (Mg)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Magnesium (Mg) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Magnesium (Mg) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Magnesium (Mg) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Magnesium (Mg) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Magnesium (Mg) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Magnesium (Mg)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    hscrp: {
        low: {
            en: 'Low hs-CRP demonstrates low systemic arterial inflammation and lower cardiovascular risk.',
            hi: 'High-Sensitivity C-Reactive Protein (hs-CRP) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'High-Sensitivity C-Reactive Protein (hs-CRP) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'High-Sensitivity C-Reactive Protein (hs-CRP)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'High-Sensitivity C-Reactive Protein (hs-CRP) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'High-Sensitivity C-Reactive Protein (hs-CRP) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'High-Sensitivity C-Reactive Protein (hs-CRP) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de High-Sensitivity C-Reactive Protein (hs-CRP) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de High-Sensitivity C-Reactive Protein (hs-CRP) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的High-Sensitivity C-Reactive Protein (hs-CRP)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated hs-CRP indicates systemic inflammation or heightened cardiovascular risk.',
            hi: 'High-Sensitivity C-Reactive Protein (hs-CRP) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'High-Sensitivity C-Reactive Protein (hs-CRP) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'High-Sensitivity C-Reactive Protein (hs-CRP)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'High-Sensitivity C-Reactive Protein (hs-CRP) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'High-Sensitivity C-Reactive Protein (hs-CRP) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'High-Sensitivity C-Reactive Protein (hs-CRP) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de High-Sensitivity C-Reactive Protein (hs-CRP) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de High-Sensitivity C-Reactive Protein (hs-CRP) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的High-Sensitivity C-Reactive Protein (hs-CRP)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    esr: {
        low: {
            en: 'Low ESR is normal and confirms absence of systemic inflammatory proteins.',
            hi: 'Erythrocyte Sedimentation Rate (ESR) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Erythrocyte Sedimentation Rate (ESR) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Erythrocyte Sedimentation Rate (ESR)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Erythrocyte Sedimentation Rate (ESR) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Erythrocyte Sedimentation Rate (ESR) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Erythrocyte Sedimentation Rate (ESR) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Erythrocyte Sedimentation Rate (ESR) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Erythrocyte Sedimentation Rate (ESR) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Erythrocyte Sedimentation Rate (ESR)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High ESR indicates non-specific systemic inflammation, infection, or tissue response.',
            hi: 'Erythrocyte Sedimentation Rate (ESR) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Erythrocyte Sedimentation Rate (ESR) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Erythrocyte Sedimentation Rate (ESR)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Erythrocyte Sedimentation Rate (ESR) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Erythrocyte Sedimentation Rate (ESR) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Erythrocyte Sedimentation Rate (ESR) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Erythrocyte Sedimentation Rate (ESR) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Erythrocyte Sedimentation Rate (ESR) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Erythrocyte Sedimentation Rate (ESR)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    troponin_i: {
        low: {
            en: 'Normal low Troponin-I confirms absence of acute heart muscle damage.',
            hi: 'Troponin-I का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Troponin-I चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Troponin-I-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Troponin-I స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Troponin-I அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Troponin-I નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Troponin-I es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Troponin-I est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Troponin-I偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated Troponin-I is a critical cardiac marker signaling myocardial injury.',
            hi: 'Troponin-I का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Troponin-I चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Troponin-I-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Troponin-I స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Troponin-I அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Troponin-I નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Troponin-I es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Troponin-I est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Troponin-I偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    total_testosterone: {
        low: {
            en: 'Low total testosterone can cause fatigue, reduced muscle mass, and low libido.',
            hi: 'Total Testosterone का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Testosterone चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Total Testosterone-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Total Testosterone స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Testosterone அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Total Testosterone નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Testosterone es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Total Testosterone est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Total Testosterone偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High total testosterone can be linked to hormone therapy or endocrine conditions.',
            hi: 'Total Testosterone का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Total Testosterone चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Total Testosterone-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Total Testosterone స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Total Testosterone அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Total Testosterone નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Total Testosterone es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Total Testosterone est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Total Testosterone偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    free_testosterone: {
        low: {
            en: 'Low free testosterone reflects reduced bioavailable hormone accessible to tissues.',
            hi: 'Free Testosterone का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Free Testosterone चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Free Testosterone-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Free Testosterone స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Free Testosterone அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Free Testosterone નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Free Testosterone es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Free Testosterone est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Free Testosterone偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High free testosterone indicates abundant bioavailable hormone levels.',
            hi: 'Free Testosterone का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Free Testosterone चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Free Testosterone-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Free Testosterone స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Free Testosterone அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Free Testosterone નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Free Testosterone es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Free Testosterone est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Free Testosterone偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    estradiol: {
        low: {
            en: 'Low estradiol can impact bone mineral density and menstrual regularity.',
            hi: 'Estradiol (E2) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Estradiol (E2) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Estradiol (E2)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Estradiol (E2) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Estradiol (E2) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Estradiol (E2) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Estradiol (E2) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Estradiol (E2) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Estradiol (E2)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated estradiol can lead to fluid retention or hormonal imbalances.',
            hi: 'Estradiol (E2) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Estradiol (E2) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Estradiol (E2)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Estradiol (E2) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Estradiol (E2) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Estradiol (E2) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Estradiol (E2) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Estradiol (E2) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Estradiol (E2)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    cortisol: {
        low: {
            en: 'Low morning cortisol can suggest adrenal insufficiency or chronic fatigue.',
            hi: 'Cortisol का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Cortisol चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Cortisol-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Cortisol స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Cortisol அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Cortisol નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Cortisol es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Cortisol est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Cortisol偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High cortisol reflects physiological stress, steroid therapy, or adrenal overactivity.',
            hi: 'Cortisol का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Cortisol चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Cortisol-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Cortisol స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Cortisol அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Cortisol નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Cortisol es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Cortisol est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Cortisol偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    progesterone: {
        low: {
            en: 'Low progesterone can cause menstrual irregularity or luteal phase defect.',
            hi: 'Progesterone का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Progesterone चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Progesterone-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Progesterone స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Progesterone அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Progesterone નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Progesterone es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Progesterone est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Progesterone偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High progesterone is naturally elevated during ovulation, pregnancy, or progesterone therapy.',
            hi: 'Progesterone का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Progesterone चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Progesterone-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Progesterone స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Progesterone அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Progesterone નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Progesterone es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Progesterone est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Progesterone偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    psa: {
        low: {
            en: 'Low PSA indicates healthy prostate tissue with minimal cell leakage into blood.',
            hi: 'Prostate-Specific Antigen (PSA) का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Prostate-Specific Antigen (PSA) चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Prostate-Specific Antigen (PSA)-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Prostate-Specific Antigen (PSA) స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Prostate-Specific Antigen (PSA) அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Prostate-Specific Antigen (PSA) નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Prostate-Specific Antigen (PSA) es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Prostate-Specific Antigen (PSA) est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Prostate-Specific Antigen (PSA)偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated PSA can indicate prostate enlargement, inflammation (prostatitis), or tissue changes.',
            hi: 'Prostate-Specific Antigen (PSA) का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Prostate-Specific Antigen (PSA) चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Prostate-Specific Antigen (PSA)-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Prostate-Specific Antigen (PSA) స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Prostate-Specific Antigen (PSA) அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Prostate-Specific Antigen (PSA) નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Prostate-Specific Antigen (PSA) es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Prostate-Specific Antigen (PSA) est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Prostate-Specific Antigen (PSA)偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    lipase: {
        low: {
            en: 'Low lipase is generally normal and expected.',
            hi: 'Lipase का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Lipase चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Lipase-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Lipase స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Lipase அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Lipase નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Lipase es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Lipase est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Lipase偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'Elevated lipase (>3x upper limit) is a primary indicator of acute pancreatitis.',
            hi: 'Lipase का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Lipase चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Lipase-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Lipase స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Lipase அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Lipase નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Lipase es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Lipase est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Lipase偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    },
    amylase: {
        low: {
            en: 'Low amylase can occur with chronic pancreatic tissue injury.',
            hi: 'Amylase का स्तर कम है, जो असंतुलन का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Amylase चे प्रमाण कमी आहे, जे असंतुलन दर्शवू शकते. कृपया डॉक्टरांशी संपर्क साधा.',
            bn: 'Amylase-এর মাত্রা কম, যা কোনো ঘাটতি বা ভারসাম্যহীনতার লক্ষণ হতে পারে। চিকিৎসকের পরামর্শ নিন।',
            te: 'Amylase స్థాయి తక్కువగా ఉంది, ఇది అసమతుల్యతను సూచించవచ్చు. దయచేసి మీ వైద్యుడిని సంప్రదించండి.',
            ta: 'Amylase அளவு குறைவாக உள்ளது, இது ஏற்றத்தாழ்வைக் குறிக்கலாம். உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும்.',
            gu: 'Amylase નું સ્તર ઓછું છે, જે અસંતુલન સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Amylase es bajo, lo que puede sugerir un desequilibrio. Se recomienda consultar a su médico.',
            fr: 'Votre taux de Amylase est bas, ce qui peut indiquer un déséquilibre. Veuillez consulter votre médecin.',
            zh: '您的Amylase偏低，可能提示存在生理失衡。建议咨询您的医生进行综合评估。'
        },
        high: {
            en: 'High amylase points to acute pancreatic or salivary gland inflammation.',
            hi: 'Amylase का स्तर उच्च है, जो शरीर में वृद्धि या तनाव का संकेत दे सकता है। कृपया अपने चिकित्सक से परामर्श लें।',
            mr: 'Amylase चे प्रमाण जास्त आहे, जे शरीरातील ताण किंवा वाढ दर्शवू शकते. कृपया डॉक्टरांचा सल्ला घ्या.',
            bn: 'Amylase-এর মাত্রা বেশি, যা শারীরিক চাপ বা বৃদ্ধির লক্ষণ। আপনার চিকিৎসকের সাথে কথা বলুন।',
            te: 'Amylase స్థాయి ఎక్కువగా ఉంది, ఇది శరీరంలో ఒత్తిడి లేదా పెరుగుదలను సూచించవచ్చు. దయచేసి వైద్యుడిని సంప్రదించండి.',
            ta: 'Amylase அளவு அதிகமாக உள்ளது, இது உடலில் அதிகரிப்பு அல்லது அழுத்தத்தைக் குறிக்கலாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
            gu: 'Amylase નું સ્તર ઊંચું છે, જે શરીરમાં વધારો સૂચવે છે. કૃપા કરીને ડૉક્ટરની સલાહ લો.',
            es: 'Su nivel de Amylase es alto, lo que puede indicar sobreproducción o estrés celular. Consulte a su médico.',
            fr: 'Votre taux de Amylase est élevé, ce qui peut refléter une surproduction ou un stress tissulaire. Consultez votre médecin.',
            zh: '您的Amylase偏高，可能提示代谢亢进或组织负荷增加。建议咨询医生以进一步评估。'
        }
    }
};

/**
 * Localized explanation copy for a biomarker result. 'Normal' results use
 * generated per-language templates; High/Low look up EXPLANATION_TRANSLATIONS
 * and fall back to the shared catalog's English copy when missing.
 */
export function getLocalizedExplanation(
    testId: string,
    classification: 'Normal' | 'High' | 'Low',
    lang: SupportedLanguage
): string {
    const catEntry = CATALOG_INDEX.get(testId);
    const testName = catEntry ? catEntry.name : testId;

    if (classification === 'Normal') {
        if (lang === 'hi') {
            return `आपका ${testName} स्तर सामान्य संदर्भ सीमा के भीतर है। यह दर्शाता है कि यह बायोमार्कर संतुलित और स्वस्थ स्थिति में काम कर रहा है।`;
        }
        if (lang === 'mr') {
            return `तुमची ${testName} पातळी सामान्य मर्यादेत आहे. हे दर्शवते की हे बायोमार्कर निरोगी आणि संतुलित स्थितीत आहे.`;
        }
        if (lang === 'es') {
            return `Su nivel de ${testName} se encuentra dentro del rango de referencia estándar, lo que indica un equilibrio biológico saludable y un funcionamiento óptimo.`;
        }
        if (lang === 'fr') {
            return `Votre taux de ${testName} se situe dans la plage de référence normale, ce qui reflète un équilibre physiologique sain et un bon fonctionnement.`;
        }
        return `Your ${testName} level is within the standard healthy reference range. This represents balanced biological function with no immediate signs of deficiency or elevation.`;
    }

    const expObj = EXPLANATION_TRANSLATIONS[testId];
    const key = classification === 'Low' ? 'low' : 'high';

    if (expObj && expObj[key] && expObj[key][lang]) {
        return expObj[key][lang];
    }

    if (catEntry && catEntry.explanations) {
        return classification === 'Low' ? catEntry.explanations.low : catEntry.explanations.high;
    }

    return '';
}
