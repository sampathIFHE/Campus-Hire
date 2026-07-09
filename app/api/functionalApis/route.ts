export async function GetDemoData () {
  const response = await fetch("/api/getApis");
  const result: Record<string, any> = await response.json();
  const demoData: Record<string, any>[] = result.data;
  const temp = await fetch("/api/sheet4Apis");
  const demoInfo: Record<string, any>[] = await temp.json();

  // Only records with Demo Date
  const data = demoData.filter(
    (item) =>
    item["Demo Date"]?.trim() &&
    item["Demo Date"] !== "08/Dec/2025" &&
    item["Demo Date"] !== "09/Dec/2025"      
  );

   const finalData = await dataFormating(data,demoInfo,"Demo Date","Demo Status")
  return finalData
 
};

export const getLatestCandidatesData = async () => {
  const response = await fetch("/api/getApis");
  const result: Record<string, any> = await response.json();
  const finalData: Record<string, any>[] = result.data;


  const temp = finalData.filter(
  item => item["No of times called"] == "0" && item["Verification Status"] === ""
);

  return temp;
};


export const getHeadersofSheet1 = async () => {
  const response = await fetch("/api/getApis");
  const result: Record<string, any> = await response.json();
  return result.headers;
}


export const dataFormating = (data:any[],subData:any[]=[],dateField:string, statusField:string)=>{
let totalPassed = 0;
let totalFailed = 0;
let totalCandidatesAttended = 0;
let totalCandidates = 0;

  
    subData.forEach((item)=>{
    return(
      totalCandidates += item["No of Candidates called"]? Number(item["No of Candidates called"]):0
    )
  })
  

    // Group by Session Date
  const groupedData: Record<
      string,
      Record<string, any>[]
  > = data.reduce(
      (acc, item) => {
          const date = item[dateField];
          if (!acc[date]) {
              acc[date] = [];
          }
          acc[date].push(item);
          return acc;
      },
      {} as Record<string, Record<string, any>[]>
  );

   const sessionCards = Object.entries(groupedData).map(
      ([date, candidates]: [
          string,
          Record<string, any>[]
      ]) => {
         const passedCount = candidates.filter((item) => {
  const status = item[statusField]?.toLowerCase();

  return status === "pass" || status === "selected";
}).length;

const failedCount = candidates.filter((item) => {
  const status = item[statusField]?.toLowerCase();

  return status === "fail" || status === "not selected";
}).length;

          totalPassed += passedCount;
          totalFailed += failedCount;
          totalCandidatesAttended += candidates.length;

          return {
               date: new Date(date).toLocaleDateString(
                "en-GB",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            ),
              totalAttended: candidates.length,
              passedCount,
              failedCount,
              successRate:
                  candidates.length > 0
                      ? `${Math.round(
                            (passedCount /
                                candidates.length) *
                                100
                        )}%`
                      : "0%"
          };
      }
  ).sort(
    (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
  );


    const sessionInfoMap = new Map(
  subData.map((item: any) => [
    new Date(item[dateField]).getTime(),
    item["No of Candidates called"]
      ? Number(item["No of Candidates called"])
      : 0
  ])
);

sessionCards.forEach((card: any) => {
  const cardDate = new Date(card.date).getTime();
  card["CandidatesCalled"] = sessionInfoMap.get(cardDate) || 0;
}); 

return {
      totalSessions: sessionCards.length,
      totalCandidatesAttended,
      totalPassed,
      totalFailed,
     totalCandidatesCalled: totalCandidates,
      successRate:
          totalCandidatesAttended > 0
              ? `${Math.round(
                    (totalPassed /
                        totalCandidatesAttended) *
                        100
                )} `
              : "0%",
      sessionCards
  };
}

export const getInterviewData = async()=>{
  const response = await fetch("/api/getApis");
  const result: Record<string, any> = await response.json();
  const data: Record<string, any>[] = result.data;
  const temp = await fetch("/api/sheet5Apis");
  const subData: Record<string, any>[] = await temp.json();
   const finalData = await dataFormating(data,subData,"Interview Date","Interview Status")
  return finalData
}

export const calculateCandidateScores = (rows:any[]) => {
  const grouped = new Map();

  rows.forEach((row) => {
const date = new Date(row.Timestamp).toLocaleDateString(
  "en-GB",
  {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
);
    const candidate =
      row["Candidate Name"]
        ?.trim()
        ?.toLowerCase();

    const key =
      `${candidate}_${date}`;

    const planning =
      Number(
        row["Planning & Organization"]
      ) || 0;

    const communication =
      Number(
        row[
          "  Presentation / Communication Skills  "
        ]
      ) || 0;

    const alertness =
      Number(
        row[
          "  Mental Alertness  "
        ]
      ) || 0;

    const domain =
      Number(
        row[
          "  Domain Knowledge  "
        ]
      ) || 0;

    const maturity =
      Number(
        row[
          "  Maturity  "
        ]
      ) || 0;

    const panelAverage =
      (
        planning +
        communication +
        alertness +
        domain +
        maturity
      ) / 5;

    if (!grouped.has(key)) {
      grouped.set(key, {
        candidateName:
          row["Candidate Name"],

        date,

        evaluators: 0,

        planningTotal: 0,
        communicationTotal: 0,
        alertnessTotal: 0,
        domainTotal: 0,
        maturityTotal: 0,

        totalScore: 0,
      });
    }

    const item =
      grouped.get(key);

    item.evaluators++;

    item.planningTotal += planning;
    item.communicationTotal += communication;
    item.alertnessTotal += alertness;
    item.domainTotal += domain;
    item.maturityTotal += maturity;

    item.totalScore += panelAverage;
  });

  return [...grouped.values()].map(
    (item:any) => ({
      candidateName:
        item.candidateName,

      date:
        item.date,

      evaluators:
        item.evaluators,

      planningAvg:
        Number(
          (
            item.planningTotal /
            item.evaluators
          ).toFixed(2)
        ),

      communicationAvg:
        Number(
          (
            item.communicationTotal /
            item.evaluators
          ).toFixed(2)
        ),

      alertnessAvg:
        Number(
          (
            item.alertnessTotal /
            item.evaluators
          ).toFixed(2)
        ),

      domainAvg:
        Number(
          (
            item.domainTotal /
            item.evaluators
          ).toFixed(2)
        ),

      maturityAvg:
        Number(
          (
            item.maturityTotal /
            item.evaluators
          ).toFixed(2)
        ),

      finalAverage:
        Number(
          (
            item.totalScore /
            item.evaluators
          ).toFixed(2)
        ),
    })
  );
};