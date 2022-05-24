const l0payload = {
  riskAssessmentId: 36,
  dataLevel: [
    {
      propertyId: 169, // risk score id example
    },
  ],
};

/*
return for l0payload = {
    low: 0,
    mid: 0,
    high: 10,
    critical: 20 // we will select this
}
*/


const l1payload = {
  riskAssessmentId: 36,
  dataLevel: [
    {
      property: 169, // risk-score id
      type: "critical",
    },
    {
      property: 3000, // control-adq id
    },
  ],
};

/*
return for l1payload =  {
    low: 0,
    mid: 10, // we will select this
    high: 5,
    critical: 0,
}
*/

const l2payload = {
  riskAssessmentId: 36,
  dataLevel: [
    {
      property: 169, // risk-score id
      type: "critical",
    },
    {
      property: 3000, // control-adq id
      type: "mid",
    },
    {
      property: 6079, // impact-level
    },
  ],
};

/*
return for l2payload = {
    major: 50,
    material: 70, // we will select this
    severe: 30
}
*/

const l3payload = {
  riskAssessmentId: 36,
  dataLevel: [
    {
      property: 169, // risk-score id
      type: "crictcal",
    },
    {
      property: 3000, // control-adq id
      type: "mid",
    },
    {
      property: 6079, // impact-level id
      type: "material",
    },
    {
      property: 2039, // f-mod-severity id
    },
  ],
};
