import re

# Comprehensive mapping of natural language phrases/synonyms to dataset symptom strings
SYMPTOM_MAPPING = {
    # Head & Brain
    "headache": ["headache", "head hurts", "migraine", "head pounding", "throbbing head"],
    "dizziness": ["dizziness", "dizzy", "lightheaded", "faint", "spinning", "vertigo"],
    "spinning_movements": ["spinning", "room spinning", "vertigo"],
    "loss_of_balance": ["loss of balance", "can't balance", "falling", "unsteady"],
    "unsteadiness": ["unsteady", "wobbly", "clumsy", "stumbling"],
    "altered_sensorium": ["altered sensorium", "confusion", "disoriented", "delirious"],
    "coma": ["coma", "unconscious", "passed out", "blacked out"],
    "slurred_speech": ["slurred speech", "can't speak clearly", "mumbling"],
    "lack_of_concentration": ["can't concentrate", "lack of concentration", "brain fog", "focus"],
    
    # Eyes
    "blurred_and_distorted_vision": ["blurred vision", "blurry", "can't see clearly", "distorted vision", "fuzzy vision"],
    "redness_of_eyes": ["red eyes", "bloodshot", "redness in eyes", "eye redness"],
    "watering_from_eyes": ["watery eyes", "tearing", "eyes watering", "weeping eyes"],
    "pain_behind_the_eyes": ["pain behind eyes", "eye pain", "eyes hurt"],
    "sunken_eyes": ["sunken eyes", "hollow eyes"],
    "yellowing_of_eyes": ["yellow eyes", "yellowing of eyes", "jaundice eyes"],
    "puffy_face_and_eyes": ["puffy eyes", "swollen eyes", "puffy face", "face swollen"],
    "visual_disturbances": ["visual disturbances", "seeing spots", "flashes", "vision problems"],

    # Nose, Throat & Respiratory
    "continuous_sneezing": ["sneezing", "keep sneezing", "sneeze"],
    "runny_nose": ["runny nose", "nose running", "snot", "mucus from nose"],
    "congestion": ["congestion", "stuffy nose", "blocked nose"],
    "loss_of_smell": ["loss of smell", "can't smell", "anosmia"],
    "sinus_pressure": ["sinus pressure", "sinus pain", "face hurts"],
    "cough": ["cough", "coughing", "hacking"],
    "breathlessness": ["breathlessness", "short of breath", "can't breathe", "panting", "gasping", "shortness of breath", "trouble breathing"],
    "phlegm": ["phlegm", "mucus", "spit"],
    "mucoid_sputum": ["mucoid sputum", "white phlegm", "clear phlegm"],
    "rusty_sputum": ["rusty sputum", "brown phlegm", "bloody phlegm"],
    "blood_in_sputum": ["blood in sputum", "coughing blood", "blood in spit"],
    "throat_irritation": ["throat irritation", "sore throat", "scratchy throat", "throat hurts"],
    "patches_in_throat": ["patches in throat", "white spots in throat"],
    "ulcers_on_tongue": ["ulcers on tongue", "tongue ulcer", "sore on tongue", "mouth sores"],
    "drying_and_tingling_lips": ["dry lips", "tingling lips", "chapped lips"],

    # Chest & Heart
    "chest_pain": ["chest pain", "chest hurts", "heart hurts", "tight chest", "chest pressure"],
    "fast_heart_rate": ["fast heart rate", "heart beating fast", "racing heart", "tachycardia"],
    "palpitations": ["palpitations", "heart fluttering", "heart pounding", "heart skipping"],

    # Stomach & Digestion
    "stomach_pain": ["stomach pain", "stomach hurts", "tummy ache", "belly ache", "abdomen pain"],
    "abdominal_pain": ["abdominal pain", "abdomen hurts", "lower stomach pain", "gut pain", "stomach ache"],
    "belly_pain": ["belly pain", "belly hurts"],
    "acidity": ["acidity", "heartburn", "acid reflux", "chest burning"],
    "indigestion": ["indigestion", "upset stomach", "dyspepsia", "stomach upset"],
    "nausea": ["nausea", "feel sick", "queasy", "feel like throwing up", "nauseous"],
    "vomiting": ["vomiting", "throw up", "threw up", "puking", "barfing", "sick to my stomach"],
    "diarrhoea": ["diarrhoea", "diarrhea", "loose motion", "loose stool", "the runs", "watery stool"],
    "constipation": ["constipation", "can't poop", "hard stool", "blocked up"],
    "stomach_bleeding": ["stomach bleeding", "blood in vomit"],
    "bloody_stool": ["bloody stool", "blood in poop", "blood in stool"],
    "pain_during_bowel_movements": ["pain pooping", "pain during bowel movements", "hurts to poop"],
    "pain_in_anal_region": ["anal pain", "butt pain", "pain in anal region"],
    "irritation_in_anus": ["itchy anus", "irritation in anus", "anal itching"],
    "passage_of_gases": ["gas", "farting", "flatulence", "passage of gases", "gassy"],
    "swelling_of_stomach": ["swelling of stomach", "bloated", "bloating", "stomach swelling"],
    "distention_of_abdomen": ["distention of abdomen", "swollen belly", "enlarged stomach"],
    
    # Body, Muscle & Joints
    "fatigue": ["fatigue", "tired", "exhausted", "sleepy", "no energy", "worn out"],
    "lethargy": ["lethargy", "sluggish", "lazy", "heavy"],
    "malaise": ["malaise", "feeling unwell", "under the weather", "feeling sick"],
    "weakness_in_limbs": ["weak limbs", "weak arms", "weak legs"],
    "weakness_of_one_body_side": ["weakness of one body side", "half body weak", "one side weak"],
    "muscle_weakness": ["muscle weakness", "weak muscles"],
    "muscle_pain": ["muscle pain", "body ache", "muscles hurt", "sore muscles", "myalgia"],
    "muscle_wasting": ["muscle wasting", "losing muscle", "muscles shrinking"],
    "cramps": ["cramps", "muscle cramps", "spasms", "charley horse"],
    "joint_pain": ["joint pain", "joints hurt", "achy joints"],
    "knee_pain": ["knee pain", "knees hurt", "bad knees"],
    "hip_joint_pain": ["hip pain", "hip joint pain", "hips hurt"],
    "back_pain": ["back pain", "back hurts", "lower back pain", "backache"],
    "neck_pain": ["neck pain", "neck hurts"],
    "stiff_neck": ["stiff neck", "can't move neck"],
    "movement_stiffness": ["movement stiffness", "stiff", "can't move easily", "hard to move"],
    "swelling_joints": ["swelling joints", "swollen joints"],
    "painful_walking": ["painful walking", "hurts to walk"],

    # Skin, Hair & Nails
    "itching": ["itching", "itchy", "scratchy"],
    "internal_itching": ["internal itching", "itching inside"],
    "skin_rash": ["skin rash", "rash", "red bumps", "breakout"],
    "nodal_skin_eruptions": ["nodal skin eruptions", "lumps on skin", "bumpy skin"],
    "dischromic_patches": ["dischromic patches", "discolored patches", "white patches", "dark patches", "skin discoloration"],
    "pus_filled_pimples": ["pus filled pimples", "pimples", "zits", "acne", "whiteheads"],
    "blackheads": ["blackheads", "dark pores"],
    "scurring": ["scurring", "scarring", "scars"],
    "skin_peeling": ["skin peeling", "peeling skin", "flaky skin"],
    "silver_like_dusting": ["silver like dusting", "silvery scales", "dusting on skin"],
    "blister": ["blister", "blisters"],
    "red_sore_around_nose": ["red sore around nose", "sore nose", "crusty nose"],
    "yellow_crust_ooze": ["yellow crust ooze", "yellow discharge", "crusty skin", "oozing skin"],
    "bruising": ["bruising", "bruises", "black and blue"],
    "red_spots_over_body": ["red spots over body", "red spots", "spots on body"],
    "brittle_nails": ["brittle nails", "breaking nails", "weak nails"],
    "inflammatory_nails": ["inflammatory nails", "red nails", "swollen nails"],
    "small_dents_in_nails": ["small dents in nails", "pitted nails", "dents in nails"],
    "yellowish_skin": ["yellowish skin", "yellow skin", "jaundice skin"],

    # Temperature & General
    "chills": ["chills", "cold", "shivering", "freezing"],
    "shivering": ["shivering", "shaking", "trembling"],
    "sweating": ["sweating", "sweat", "perspiring", "drenched in sweat"],
    "high_fever": ["high fever", "burning up", "very hot", "high temp"],
    "mild_fever": ["mild fever", "fever", "feverish", "warm", "temperature"],
    "cold_hands_and_feets": ["cold hands and feets", "cold hands", "cold feet", "freezing hands"],
    
    # Weight, Hunger & Fluids
    "weight_loss": ["weight loss", "losing weight", "lost weight", "skinny"],
    "weight_gain": ["weight gain", "gaining weight", "getting fat", "putting on weight"],
    "loss_of_appetite": ["loss of appetite", "no appetite", "don't want to eat", "can't eat"],
    "increased_appetite": ["increased appetite", "eating a lot", "hungry often"],
    "excessive_hunger": ["excessive hunger", "starving", "always hungry", "ravenous"],
    "dehydration": ["dehydration", "thirsty", "dry mouth", "parched"],
    "fluid_overload": ["fluid overload", "water retention"],

    # Urine & Genital
    "burning_micturition": ["burning micturition", "burning urine", "pain when peeing", "burning when I pee", "hurts to pee"],
    "spotting_urination": ["spotting urination", "blood in urine", "spotting when peeing"],
    "dark_urine": ["dark urine", "brown urine", "orange urine"],
    "yellow_urine": ["yellow urine", "bright yellow urine"],
    "foul_smell_of_urine": ["foul smell of urine", "smelly urine", "urine smells bad", "stinky pee"],
    "continuous_feel_of_urine": ["continuous feel of urine", "always need to pee", "frequent urination", "have to pee all the time"],
    "bladder_discomfort": ["bladder discomfort", "bladder pain", "lower belly pain"],
    "polyuria": ["polyuria", "peeing a lot", "excessive urination"],
    "abnormal_menstruation": ["abnormal menstruation", "irregular periods", "heavy periods", "missed period"],

    # Mental & Emotional
    "anxiety": ["anxiety", "anxious", "nervous", "panic", "worried"],
    "depression": ["depression", "depressed", "sad", "hopeless", "down"],
    "irritability": ["irritability", "irritable", "cranky", "angry", "snapping"],
    "mood_swings": ["mood swings", "emotional", "up and down"],
    "restlessness": ["restlessness", "can't sit still", "fidgety", "restless"],

    # Other Specifics
    "acute_liver_failure": ["acute liver failure", "liver failure"],
    "enlarged_thyroid": ["enlarged thyroid", "goiter", "swollen neck"],
    "swelled_lymph_nodes": ["swelled lymph nodes", "swollen glands", "lumps in neck", "lymph nodes"],
    "prominent_veins_on_calf": ["prominent veins on calf", "bulging veins", "spider veins", "varicose veins"],
    "swollen_legs": ["swollen legs", "legs swollen", "puffy legs"],
    "swollen_extremeties": ["swollen extremeties", "swollen hands", "swollen feet", "swollen arms", "swollen legs", "swollen extremities"],
    "swollen_blood_vessels": ["swollen blood vessels", "veins swelling", "large veins"],
    "history_of_alcohol_consumption": ["history of alcohol consumption", "drink alcohol", "alcoholic", "drinker"],
    "extra_marital_contacts": ["extra marital contacts", "multiple partners", "cheating"],
    "family_history": ["family history", "runs in family", "genetic"],
    "receiving_blood_transfusion": ["receiving blood transfusion", "blood transfusion"],
    "receiving_unsterile_injections": ["receiving unsterile injections", "dirty needle", "used needles"],
    "irregular_sugar_level": ["irregular sugar level", "blood sugar", "glucose"],
    "obesity": ["obesity", "obese", "overweight", "very fat"],
    "toxic_look_(typhos)": ["toxic look (typhos)", "toxic look", "look very sick", "typhos"]
}


def extract_symptoms_local(text: str) -> list:
    """
    Takes a natural language string and extracts matching symptoms based on
    a synonym mapping dictionary.
    """
    text = text.lower()
    # Normalize text: remove punctuation except spaces and letters
    text = re.sub(r'[^a-z\s]', ' ', text)
    # Condense multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    extracted_symptoms = set()
    
    # 1. Exact string matching for synonyms
    for symptom_key, synonyms in SYMPTOM_MAPPING.items():
        for synonym in synonyms:
            synonym_clean = re.sub(r'[^a-z\s]', ' ', synonym.lower())
            synonym_clean = re.sub(r'\s+', ' ', synonym_clean).strip()
            
            # Using word boundaries to ensure we don't match partial words
            # e.g., we don't want "rash" to match "trash"
            pattern = r'\b' + re.escape(synonym_clean) + r'\b'
            if re.search(pattern, text):
                extracted_symptoms.add(symptom_key)
                
    # 2. Token-level matching for multi-word symptoms that might be mixed up
    # e.g. "my stomach really hurts" -> "stomach" and "hurts"
    tokens = set(text.split())
    
    # Helper heuristic for common multi-word concepts not strictly adjacent
    if "stomach" in tokens and ("hurt" in tokens or "hurts" in tokens or "pain" in tokens):
        extracted_symptoms.add("stomach_pain")
    if "chest" in tokens and ("hurt" in tokens or "hurts" in tokens or "pain" in tokens):
        extracted_symptoms.add("chest_pain")
    if "head" in tokens and ("hurt" in tokens or "hurts" in tokens or "pain" in tokens):
        extracted_symptoms.add("headache")
    if "vomit" in tokens or "vomiting" in tokens or "puke" in tokens:
        extracted_symptoms.add("vomiting")
    if "fever" in tokens:
        # Check if high fever
        if "high" in tokens or "burning" in tokens:
            extracted_symptoms.add("high_fever")
        else:
            extracted_symptoms.add("mild_fever")
    if "cough" in tokens or "coughing" in tokens:
        extracted_symptoms.add("cough")
    if "fatigue" in tokens or "tired" in tokens or "exhausted" in tokens:
        extracted_symptoms.add("fatigue")
    
    return list(extracted_symptoms)
