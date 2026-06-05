function applyGuardrails(message) {
  const text = message.toLowerCase();

  // --- Off-topic / harmful topics ---
  const blockedTopics = [
    "hack", "crack", "cheat", "bitcoin", "crypto",
    "medicine", "law advice", "dating",
    "build app for me"
  ];

  if (blockedTopics.some(word => text.includes(word))) {
    return {
      allowed: false,
      reply:
        "I can only assist with Belgium Campus IT courses, admissions, and student information.",
    };
  }

  // --- Salary / job guarantee requests ---
  const guaranteePhrases = [
    "guarantee",
    "guaranteed job",
    "guaranteed salary",
    "will i get a job",
    "promise me a job",
    "promise me a salary",
    "ensure i get hired",
  ];

  if (guaranteePhrases.some(phrase => text.includes(phrase))) {
    return {
      allowed: false,
      reply:
        "Belgium Campus cannot guarantee specific employment outcomes or salaries. What they can share is that they have a 100% graduate employment rate and strong industry partnerships. For career guidance, please contact info@belgiumcampus.ac.za or call 010 593 5368.",
    };
  }

  // --- Admission decision requests ---
  if (
    text.includes("will i get accepted") ||
    text.includes("am i accepted")
  ) {
    return {
      allowed: false,
      reply:
        "Admission decisions are made by Belgium Campus after reviewing your full application. Please apply at belgiumcampus.ac.za/applicant-portal or contact admissions at info@belgiumcampus.ac.za.",
    };
  }

  return { allowed: true };
}

module.exports = applyGuardrails;