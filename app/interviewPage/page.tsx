"use client";

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { getInterviewData } from "../services/functionalApis";
import { InfoCard, PreviewCard, SessionCardsDisplay } from "../demoPage/page";


const InterviewPage = () =>{
      const [interviewData, setInterviewData] = useState<any>();
    
      useEffect(() => {
        const load = async () => {
          const data = await getInterviewData();
           data.sessionCards = data.sessionCards.filter(
  (item: any) => item.date !== "Invalid Date"
);
          const sortedCards = [...data.sessionCards].sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setInterviewData({ ...data, sortedCards });
          console.log({ ...data, sortedCards });
        };
        load();
      }, []);
    
     
      return (
        <div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Interview Info</h2>
            <Button icon="pi pi-plus" label="New Demo" severity="help" />
          </div>
          <Divider />
          <PreviewCard
          title="Interview Success Rate"
            sessionInfo={{
        successRate: interviewData?.successRate,
        totalCandidatesAttended: interviewData?.totalCandidatesAttended,
        totalCandidatesCalled: interviewData?.totalCandidatesCalled,
        totalSessions: interviewData?.totalSessions,
        totalFailed: interviewData?.totalFailed,
        totalPassed: interviewData?.totalPassed,
      }}
      InfoCards={InfoCards}
      description="Percentage of Candidates who Successfully attended and completed the interview process"
          />
    
          <SessionCardsDisplay
          title="Interview Sessions"
          oldestArray={interviewData?.sessionCards}
          latestArray={interviewData?.sortedCards}/>
       
        </div>
      );
    };

export default InterviewPage;

const InfoCards:InfoCard[] = [
  {
    icon: "pi pi-desktop",
    title: "Total Demos",
    field: "totalSessions",
    color: "#6C63FF",
    bg: "#F3F0FF",
  },
  {
    icon: "pi pi-phone",
    title: "Total Candidates Called",
    field: "totalCandidatesCalled",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: "pi pi-users",
    title: "Total Candidates Attended",
    field: "totalCandidatesAttended",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: "pi pi-trophy",
    title: "Total Candidates Passed",
    field: "totalPassed",
    color: "#F59E0B",
    bg: "#FFF7ED",
  },
];