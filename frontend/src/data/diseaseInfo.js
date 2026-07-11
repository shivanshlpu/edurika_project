export const diseaseInfo = {
  "Influenza": {
    description: "A viral infection that attacks your respiratory system — your nose, throat and lungs.",
    commonSymptoms: ["fever", "cough", "fatigue", "chills"],
    precautions: ["Rest", "Hydration", "Antiviral medications if prescribed", "Stay home to prevent spreading"],
  },
  "Common Cold": {
    description: "A viral infection of your nose and throat (upper respiratory tract).",
    commonSymptoms: ["cough", "sneezing", "fatigue", "sore throat"],
    precautions: ["Rest", "Hydration", "Over-the-counter cold medicines", "Wash hands frequently"],
  },
  "COVID-19": {
    description: "An infectious disease caused by the SARS-CoV-2 virus.",
    commonSymptoms: ["fever", "cough", "loss_of_smell", "shortness_of_breath"],
    precautions: ["Isolate", "Wear a mask", "Monitor oxygen levels", "Seek medical attention if breathing is difficult"],
  },
  "Allergy": {
    description: "A condition in which the immune system reacts abnormally to a foreign substance.",
    commonSymptoms: ["sneezing", "itching", "watery_eyes", "runny_nose"],
    precautions: ["Avoid allergens", "Take antihistamines", "Use nasal sprays", "Keep windows closed during high pollen seasons"],
  },
  "Asthma": {
    description: "A condition in which your airways narrow and swell and may produce extra mucus.",
    commonSymptoms: ["cough", "shortness_of_breath", "wheezing", "chest tightness"],
    precautions: ["Use inhaler as prescribed", "Avoid triggers", "Monitor breathing", "Seek emergency care for severe attacks"],
  },
  "Gastroenteritis": {
    description: "An intestinal infection marked by diarrhea, cramps, nausea, vomiting and fever.",
    commonSymptoms: ["vomiting", "diarrhea", "abdominal_pain", "nausea"],
    precautions: ["Drink plenty of fluids", "Eat bland foods", "Rest", "Avoid dairy and caffeine"],
  },
  // Add a fallback condition
  "default": {
    description: "Detailed info not available for this condition.",
    commonSymptoms: [],
    precautions: ["Consult a healthcare professional", "Monitor your symptoms", "Rest and stay hydrated"],
  }
};
