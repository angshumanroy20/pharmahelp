// Clinical intelligence: Drug interactions & Prescription AI analysis

const KNOWN_INTERACTIONS = [
  {
    drugs: ['paracetamol', 'tramadol'],
    severity: 'Moderate',
    mechanism: 'Enhanced central nervous system analgesia and slight sedation.',
    advice: 'Safe when monitored; avoid exceeding 4000mg Paracetamol/24h to avoid hepatotoxicity.'
  },
  {
    drugs: ['ibuprofen', 'aspirin'],
    severity: 'High Risk',
    mechanism: 'Additive gastrointestinal ulceration risk and antiplatelet inhibition conflict.',
    advice: 'Avoid simultaneous administration. Take Aspirin at least 2 hours before Ibuprofen.'
  },
  {
    drugs: ['paracetamol', 'alcohol'],
    severity: 'High Risk',
    mechanism: 'Depletion of glutathione causing accumulation of toxic NAPQI metabolite.',
    advice: 'Contraindicated. High risk of acute hepatic liver failure.'
  },
  {
    drugs: ['atorvastatin', 'amoxicillin'],
    severity: 'Low',
    mechanism: 'No significant pharmacokinetic interaction observed.',
    advice: 'Generally safe to co-administer as directed.'
  },
  {
    drugs: ['metformin', 'pantoprazole'],
    severity: 'Low to Moderate',
    mechanism: 'Long-term PPI use may decrease Vitamin B12 absorption when combined with Metformin.',
    advice: 'Check serum B12 levels periodically if on long-term therapy.'
  },
  {
    drugs: ['cetirizine', 'tramadol'],
    severity: 'Moderate',
    mechanism: 'Additive CNS depression, increased drowsiness, dizziness, and psychomotor impairment.',
    advice: 'Do not drive or operate machinery. Reduce nighttime dosage if excessive sedation occurs.'
  },
  {
    drugs: ['nemusulide', 'ibuprofen'],
    severity: 'High Risk',
    mechanism: 'Dual NSAID administration significantly amplifies renal strain and gastric bleeding risks.',
    advice: 'Do not combine multiple systemic NSAIDs. Choose single agent under physician guidance.'
  }
];

// Check Drug Interactions
exports.checkDrugInteractions = (req, res) => {
  const { medicines } = req.body; // Array of strings e.g. ["Paracetamol 650mg", "Ibuprofen 400mg"]

  if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
    return res.json({
      interactions: [],
      safetyScore: 100,
      summary: 'At least two medications are required to evaluate potential drug-drug interactions.'
    });
  }

  const cleanNames = medicines.map(m => (m || '').toLowerCase().trim());
  const detectedInteractions = [];

  for (let i = 0; i < cleanNames.length; i++) {
    for (let j = i + 1; j < cleanNames.length; j++) {
      const medA = cleanNames[i];
      const medB = cleanNames[j];

      for (const rule of KNOWN_INTERACTIONS) {
        const matchesA = medA.includes(rule.drugs[0]) || medA.includes(rule.drugs[1]);
        const matchesB = medB.includes(rule.drugs[0]) || medB.includes(rule.drugs[1]);

        if (matchesA && matchesB) {
          detectedInteractions.push({
            drugPair: [medicines[i], medicines[j]],
            severity: rule.severity,
            mechanism: rule.mechanism,
            advice: rule.advice
          });
        }
      }
    }
  }

  let safetyScore = 100;
  if (detectedInteractions.some(x => x.severity === 'High Risk')) {
    safetyScore = 45;
  } else if (detectedInteractions.some(x => x.severity === 'Moderate')) {
    safetyScore = 75;
  }

  res.json({
    interactions: detectedInteractions,
    safetyScore,
    testedCount: medicines.length,
    summary: detectedInteractions.length === 0
      ? 'No known adverse clinical interactions detected among the selected medications.'
      : `Found ${detectedInteractions.length} potential interaction(s) requiring clinical caution.`
  });
};

// Prescription AI Scanner Simulation
exports.scanPrescription = (req, res) => {
  const { fileUrl, originalName } = req.body;

  // Realistic OCR AI prescription parser response
  const sampleScanResults = {
    scanId: 'SCN-' + Math.floor(100000 + Math.random() * 900000),
    confidence: '98.4%',
    analysisTimestamp: new Date().toISOString(),
    extractedDoctor: 'Dr. Alice Grey, MD (Internal Medicine)',
    extractedPatient: req.user ? req.user.name : 'Angshuman Roy',
    detectedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    clinicalDiagnosis: 'Acute Upper Respiratory Tract Infection & Mild Bronchial Congestion',
    prescribedMedicines: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 Capsule',
        frequency: 'Three times daily (TID)',
        duration: '5 Days',
        instruction: 'Complete full antibiotic course after meals'
      },
      {
        name: 'Paracetamol 650mg',
        dosage: '1 Tablet',
        frequency: 'As needed (PRN) every 6-8 hrs',
        duration: '3 Days',
        instruction: 'Take if fever > 100°F or body pain'
      },
      {
        name: 'Cetirizine 10mg',
        dosage: '1 Tablet',
        frequency: 'Once at night (QHS)',
        duration: '5 Days',
        instruction: 'Take before sleep to alleviate allergic rhinitis'
      }
    ],
    vitalNotes: 'Patient advised warm hydration and rest. Follow-up in 5 days if fever persists.',
    verificationStatus: 'Ready for Pharmacist Digital Sign-Off'
  };

  res.json({
    success: true,
    data: sampleScanResults
  });
};
