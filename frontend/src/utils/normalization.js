/**
 * Normalizes user input condition/symptom into a medical specialist type.
 */
export const normalizeCondition = (input) => {
  if (!input) return 'general physician';

  const normalizedInput = input.toLowerCase().trim();

  // If user already typed a specialist
  const specialists = [
    'dermatologist',
    'pediatrician',
    'cardiologist',
    'psychiatrist',
    'neurologist',
    'orthopedic',
    'dentist',
    'ophthalmologist',
    'gastroenterologist',
    'endocrinologist',
    'gynecologist',
    'general physician',
    'physician',
    'surgeon',
  ];

  if (specialists.some((s) => normalizedInput.includes(s))) {
    return normalizedInput;
  }

  // Keyword-based mapping (IMPROVED)
  const mapping = [
    {
      keywords: [
        'fever',
        'cold',
        'cough',
        'fatigue',
        'weakness',
        'tired',
        'body pain',
        'viral',
        'covid',
      ],
      specialist: 'general physician',
    },
    {
      keywords: ['skin', 'rash', 'acne', 'itch', 'allergy'],
      specialist: 'dermatologist',
    },
    {
      keywords: ['chest', 'heart', 'breath', 'bp', 'palpitation'],
      specialist: 'cardiologist',
    },
    {
      keywords: ['child', 'baby', 'infant', 'vaccination'],
      specialist: 'pediatrician',
    },
    {
      keywords: ['anxiety', 'depression', 'stress', 'mental', 'panic'],
      specialist: 'psychiatrist',
    },
    {
      keywords: ['headache', 'migraine', 'brain', 'dizziness'],
      specialist: 'neurologist',
    },
    {
      keywords: ['back pain', 'joint', 'fracture', 'bone', 'knee'],
      specialist: 'orthopedic',
    },
    {
      keywords: ['tooth', 'gum', 'dental'],
      specialist: 'dentist',
    },
    {
      keywords: ['eye', 'vision', 'blur', 'sight'],
      specialist: 'ophthalmologist',
    },
    {
      keywords: ['stomach', 'digestion', 'gas', 'acidity'],
      specialist: 'gastroenterologist',
    },
    {
      keywords: ['diabetes', 'thyroid', 'hormone'],
      specialist: 'endocrinologist',
    },
    {
      keywords: ['pregnancy', 'period', 'women', 'pcos'],
      specialist: 'gynecologist',
    },
  ];

  // Smart keyword matching
  for (const item of mapping) {
    if (item.keywords.some((keyword) => normalizedInput.includes(keyword))) {
      return item.specialist;
    }
  }

  // Fallback
  return 'general physician';
};