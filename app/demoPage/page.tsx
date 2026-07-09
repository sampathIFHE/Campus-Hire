"use client";

import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { GetDemoData } from "../services/functionalApis";
import { ProgressBar } from "primereact/progressbar";
import { Knob } from "primereact/knob";
import { Dropdown } from "primereact/dropdown";

const DemoPage = () => {
  const [demoData, setDemoData] = useState<any>();

  useEffect(() => {
    const load = async () => {
      const data = await GetDemoData();
      const sortedCards = [...data.sessionCards].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setDemoData({ ...data, sortedCards });
      console.log({ ...data, sortedCards });
    };
    load();
  }, []);

 
  return (
    <div>
      <Divider />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Demo Management</h2>
        <Button icon="pi pi-plus" label="New Demo" severity="help" />
      </div>
      <Divider />
      <PreviewCard
      title="Demo Success Rate"
        sessionInfo={{
    successRate: demoData?.successRate,
    totalCandidatesAttended: demoData?.totalCandidatesAttended,
    totalCandidatesCalled: demoData?.totalCandidatesCalled,
    totalSessions: demoData?.totalSessions,
    totalFailed: demoData?.totalFailed,
    totalPassed: demoData?.totalPassed,
  }}
  InfoCards={demoInfoCards}
  description="Percentage of Candidates who Successfully attended and completed the demo process"
      />

      <SessionCardsDisplay
      title="Demo Sessions"
      oldestArray={demoData?.sessionCards}
      latestArray={demoData?.sortedCards}/>
   
    </div>
  );
};
export default DemoPage;

const demoInfoCards:InfoCard[] = [
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
type SessionInfo = {
  successRate: string;
  totalCandidatesAttended: number;
  totalCandidatesCalled: number;
  totalSessions: number;
  totalFailed: number;
  totalPassed: number;
};
export type InfoCard = {
  icon: string;
  title: string;
  field: keyof SessionInfo;
  color: string;
  bg: string;
};
type PreviewCardProps = {
  title: string;
  sessionInfo: SessionInfo;
  description: string;
  InfoCards: InfoCard[];
};

export const PreviewCard = ({
  title,
  sessionInfo,
  description,
  InfoCards,
}: PreviewCardProps) => {
  return (
    <Card
      header={
        <h3 style={{ color: "#6D5DF6" }}>
          <i className="pi pi-wave-pulse" style={{ marginRight: "8px" }} />
          {title}
        </h3>
      }
      style={{
        margin: "1rem",
        padding: "1rem",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            minWidth: "220px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Knob
            value={Number(sessionInfo.successRate) || 0}
            valueColor="#6D5DF6"
            rangeColor="#E5E7EB"
            size={180}
            strokeWidth={8}
            readOnly
          />
        </div>

        {/* Center Section */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                color: "#1E293B",
              }}
            >
              {title}
            </h2>

            <p
              style={{
                marginTop: "8px",
                color: "#64748B",
                lineHeight: "1.6",
              }}
            >
              {description}
            </p>
          </div>

          <ProgressBar
            value={Number(sessionInfo.successRate)}
            style={{
              height: "16px",
              borderRadius: "12px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            <span>0%</span>
            <span>{sessionInfo.successRate}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Right Section */}
        <div
          style={{
            width: "220px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/demo page image.png"
            alt="Analytics"
            style={{
              width: "180px",
              opacity: 0.9,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          margin: "1rem",
        }}
      >
        {InfoCards.map((item: InfoCard, index: number) => {
          return (
            <div
              key={index}
              className="stat-card"
              style={{
                borderBottom: `4px solid ${item.color}`,
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                paddingTop:"10px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                {/* Icon */}
                <div
                  className="icon-box"
                  style={{
                    background: item.bg,
                    color: item.color,
                    width: "54px",
                    height: "54px",
                    borderRadius: "14px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                  }}
                >
                  <i className={item.icon}></i>
                </div>

                {/* Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: item.color,
                      fontSize: "28px",
                      fontWeight: 700,
                      lineHeight: "1",
                    }}
                  >
                    {sessionInfo[item.field] ?? 0}
                  </h2>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#7A7A7A",
                      fontSize: "13px",
                    }}
                  >
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="divider"></div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};


type DisplayCards ={
CandidatesCalled:number;
date:string;
failedCount:number;
passedCount:number;
successRate:string;
totalAttended:number;
}
type SessionCardsDisplay = {
  title:string;
  oldestArray:DisplayCards[];
  latestArray:DisplayCards[];
}
export const SessionCardsDisplay = ({
  title,
  oldestArray,
  latestArray,
}: SessionCardsDisplay) => {
  const [dropdownSelection, setDropdownSelection] = useState<string>("Latest");
  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <h2 style={{ color: "#6D5DF6" }}>{title}</h2>

      <Dropdown
        value={dropdownSelection}
        onChange={(e: any) => {
          setDropdownSelection(e.value);
        }}
        options={["Latest", "Oldest"]}
      />
    </div>
  );
  return (
    <Card header={header}>
      <div
        style={{
          marginTop: "26px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
        }}
      >
        {(dropdownSelection == "Latest" ? latestArray : oldestArray)?.map(
          (item: any, index: any) => {
            return (
              <Card
                key={index}
                style={{
                  width: "320px",
                  borderRadius: "20px",
                  padding: "8px",
                  boxShadow: "0 8px 30px rgba(109,93,246,.08)",
                  border: "1px solid #F1F1FF",
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontSize: "20px",
                      }}
                    >
                      {item.date}
                    </h3>
                  </div>
                </div>
                {/* Progress */}
                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span>Success</span>
                    <span style={{ color: "#6D5DF6", fontWeight: 700 }}>
                      {item.successRate}
                    </span>
                  </div>
                  <ProgressBar
                    value={Number(item.successRate.replace("%", ""))}
                    showValue={false}
                    style={{ height: "10px" }}
                  />
                </div>
                {/* Stats */}
                <div
                  style={{
                    marginTop: "26px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "14px",
                  }}
                >
                  <div>
                    <h3 style={{ color: "#2563EB", margin: "6px 0" }}>
                      <i
                        className="pi pi-phone"
                        style={{
                          color: "#2563EB",
                          marginRight: "8px",
                        }}
                      />
                      {item.CandidatesCalled}
                    </h3>
                    <small>Called</small>
                  </div>
                  <div>
                    <h3 style={{ color: "#10B981", margin: "6px 0" }}>
                      <i
                        className="pi pi-users"
                        style={{
                          color: "#10B981",
                          marginRight: "8px",
                        }}
                      />
                      {item.totalAttended}
                    </h3>
                    <small>Attended</small>
                  </div>
                  <div>
                    <h3 style={{ color: "#F59E0B", margin: "6px 0" }}>
                      <i
                        className="pi pi-check-circle"
                        style={{
                          color: "#F59E0B",
                          marginRight: "8px",
                        }}
                      />
                      {item.passedCount}
                    </h3>
                    <small>Passed</small>
                  </div>
                  <div>
                    <h3 style={{ color: "#EF4444", margin: "6px 0" }}>
                      <i
                        className="pi pi-times-circle"
                        style={{
                          color: "#EF4444",
                          marginRight: "8px",
                        }}
                      />
                      {item.failedCount}
                    </h3>
                    <small>Failed</small>
                  </div>
                </div>
                {/* Footer */} <Divider />
                <Button
                  label="View Demo"
                  text
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  style={{ color: "#6D5DF6", padding: 0 }}
                />
              </Card>
            );
          },
        )}
      </div>
    </Card>
  );
};
