import type { FormAnalytics, FormAnalyticsCollection } from "@/types/form-analytics"

// Single session example from the provided JSON
export const sampleSession: FormAnalytics = {
  sessionId: "b0cd6375-79de-4899-8275-0673f7d9cdbb",
  formStartTime: 1742547016934,
  formEndTime: 1742547672908,
  formCompletionTime: 655974,
  fields: {
    firstName: {
      id: "firstName",
      validationErrors: [],
    },
    lastName: {
      id: "lastName",
      validationErrors: [],
    },
    email: {
      id: "email",
      validationErrors: [],
    },
    dateOfBirth: {
      id: "dateOfBirth",
      validationErrors: [],
    },
    gender: {
      id: "gender",
      validationErrors: [],
    },
    phone: {
      id: "phone",
      validationErrors: [],
    },
    address: {
      id: "address",
      validationErrors: [],
    },
    city: {
      id: "city",
      validationErrors: [],
    },
    country: {
      id: "country",
      validationErrors: [],
    },
    zipCode: {
      id: "zipCode",
      validationErrors: [],
    },
    occupation: {
      id: "occupation",
      validationErrors: [],
    },
    companyName: {
      id: "companyName",
      validationErrors: [],
    },
    yearsOfExperience: {
      id: "yearsOfExperience",
      validationErrors: [],
    },
    skills: {
      id: "skills",
      validationErrors: [],
    },
    educationLevel: {
      id: "educationLevel",
      validationErrors: [],
    },
    cardNumber: {
      id: "cardNumber",
      validationErrors: [],
    },
    cardName: {
      id: "cardName",
      validationErrors: [],
    },
    expiryDate: {
      id: "expiryDate",
      validationErrors: [],
    },
    cvv: {
      id: "cvv",
      validationErrors: [],
    },
    lifeGoals: {
      id: "lifeGoals",
      validationErrors: [],
    },
    problemSolvingApproach: {
      id: "problemSolvingApproach",
      validationErrors: [],
    },
    ethicalDilemma: {
      id: "ethicalDilemma",
      validationErrors: ["Please provide a thoughtful response (min 100 chars)"],
    },
    satisfactionLevel: {
      id: "satisfactionLevel",
      validationErrors: [],
    },
    receiveUpdates: {
      id: "receiveUpdates",
      validationErrors: [],
    },
  },
  tabs: {
    personal: {
      visits: 2,
      totalTimeSpent: 1473,
    },
    professional: {
      visits: 1,
      totalTimeSpent: 244494,
    },
    payment: {
      visits: 1,
      totalTimeSpent: 200629,
    },
    experience: {
      visits: 1,
      totalTimeSpent: 209345,
    },
  },
  formSubmitted: false,
  formAbandoned: true,
  validationErrorCount: 1,
  exportReason: "tabClose",
}

// Create a collection with multiple sessions for more realistic analytics
export const mockAnalyticsData: FormAnalyticsCollection = {
  sessions: [
    sampleSession,
    // Additional mock sessions with variations
    {
      ...sampleSession,
      sessionId: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
      formSubmitted: true,
      formAbandoned: false,
      formCompletionTime: 432000,
      validationErrorCount: 0,
      fields: {
        ...sampleSession.fields,
        email: {
          id: "email",
          validationErrors: [],
        },
        ethicalDilemma: {
          id: "ethicalDilemma",
          validationErrors: [],
        },
      },
    },
    {
      ...sampleSession,
      sessionId: "f1e2d3c4-b5a6-7890-f1e2-d3c4b5a67890",
      formSubmitted: false,
      formAbandoned: true,
      formCompletionTime: 521000,
      validationErrorCount: 3,
      fields: {
        ...sampleSession.fields,
        email: {
          id: "email",
          validationErrors: ["Please enter a valid email address"],
        },
        phone: {
          id: "phone",
          validationErrors: ["Phone number must be in the format XXX-XXX-XXXX"],
        },
        cardNumber: {
          id: "cardNumber",
          validationErrors: ["Invalid credit card number"],
        },
      },
    },
    {
      ...sampleSession,
      sessionId: "1a2b3c4d-5e6f-7890-1a2b-3c4d5e6f7890",
      formSubmitted: true,
      formAbandoned: false,
      formCompletionTime: 378000,
      validationErrorCount: 2,
      fields: {
        ...sampleSession.fields,
        zipCode: {
          id: "zipCode",
          validationErrors: ["Please enter a valid ZIP code"],
        },
        email: {
          id: "email",
          validationErrors: ["Please enter a valid email address"],
        },
      },
    },
    {
      ...sampleSession,
      sessionId: "9i8u7y6t-5r4e-3w2q-9i8u-7y6t5r4e3w2q",
      formSubmitted: false,
      formAbandoned: true,
      formCompletionTime: 189000,
      validationErrorCount: 4,
      fields: {
        ...sampleSession.fields,
        email: {
          id: "email",
          validationErrors: ["Please enter a valid email address"],
        },
        phone: {
          id: "phone",
          validationErrors: ["Phone number must be in the format XXX-XXX-XXXX"],
        },
        cardNumber: {
          id: "cardNumber",
          validationErrors: ["Invalid credit card number"],
        },
        expiryDate: {
          id: "expiryDate",
          validationErrors: ["Expiry date must be in the future"],
        },
      },
    },
  ],
}

