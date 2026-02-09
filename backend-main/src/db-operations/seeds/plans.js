const PLANS = [
  {
    name: "NEET 2026 Aspirants",
    amount: 3999,
    appleProductId: "neet_2026_plan",
    description: `
- Build a strong foundation: Dive deep into NCERT topics with clear and simple explanations.
- Steady learning: Designed for gradual and thorough understanding of every concept.
- Prepare smartly: Establish a solid base for your NEET preparation with consistent study.
      `,
    gstRate: 18,
    validUntil: new Date("2026-05-10"),
  },
  {
    name: "NEET 2027 Aspirants",
    amount: 5499,
    appleProductId: null,
    description: `
- Long-term mastery: Learn NCERT content in an easy-to-understand language over an extended period.
- Deepen your knowledge: Build a robust foundation with detailed and relatable explanations.
- Plan for the future: Ideal for those who want to progress steadily and ensure complete conceptual clarity.
      `,
    gstRate: 18,
    validUntil: new Date("2027-05-10"),
  },
];

module.exports = PLANS;
