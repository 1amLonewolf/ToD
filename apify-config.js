// Apify Integration Configuration
const apifyConfig = {
  // Base URL for Apify API
  baseUrl: 'https://api.apify.com/v2',
  
  // Level-based content configuration
  levels: {
    beginner: {
      name: "Beginner",
      description: "Easy questions and gentle dares",
      truthScraper: null, // To be configured with actual scraper IDs
      dareScraper: null,   // To be configured with actual scraper IDs
      color: "#00cc99"
    },
    intermediate: {
      name: "Intermediate", 
      description: "Moderate questions and playful dares",
      truthScraper: null,
      dareScraper: null,
      color: "#ff9900"
    },
    advanced: {
      name: "Advanced",
      description: "Deep questions and adventurous dares",
      truthScraper: null,
      dareScraper: null,
      color: "#ff3366"
    }
  },
  
  // Default fallback content (in case Apify is unavailable)
  defaultContent: {
    truths: [
      "What is your biggest fear in a relationship?",
      "What's the most embarrassing thing you've done for love?",
      "If you could change one thing about your partner, what would it be?"
    ],
    dares: [
      "Give your partner a 5-minute massage",
      "Let your partner style your hair and leave it that way for 2 hours",
      "Do 20 push-ups or let your partner spank you 10 times"
    ]
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = apifyConfig;
} else {
  window.apifyConfig = apifyConfig;
}