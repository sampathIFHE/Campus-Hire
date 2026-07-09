"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { getLatestCandidatesData } from "../services/functionalApis";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
        

const ApprovalPage = () => {
  const [head, setHead] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const toast = useRef<Toast | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const goForward = () => {
    let currentIndex = candidates.findIndex(
      (candidate) =>
        candidate["CV Count"] === selectedCandidate["CV Count"]
    );
    if (currentIndex < candidates.length - 1) {
      setSelectedCandidate(candidates[currentIndex + 1]);
    }
  };

  const getData = async () => {
    const response = await getLatestCandidatesData();
    setCandidates(response);
    if (response?.length) {
      setSelectedCandidate(response[0]);
    }
  };

  const handleAssignDepartment = async(dept: string) => {
let temp = {...selectedCandidate, "Verification Status": "Verified", "Sorted by": head, "Assigned Department": dept}; 
console.log("temp", temp);
    const response = await fetch("/api/getApis", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(temp),
  });
  const result = await response.json();
  if (result.success) {
   let temp = candidates.map((candidate) => {
  if (
    candidate["CV Count"] ===
    selectedCandidate["CV Count"]
  ) {
    return {
      ...candidate,
      "Verification Status": "Verified", 
      "Sorted by": head,
      "Assigned Department": dept,
    };
  }

  return candidate;
});
      setCandidates(temp);
      goForward();
      setShowDialog(false);
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Candidate updated successfully.', life: 3000 });
  } else {
    toast.current?.show({ severity: 'error', summary: 'Error', detail:result.message, life: 3000 });
  }

  };

  const handleClick = async (action: string) => {
    if (!head ) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please select a Head of Department.', life: 3000 });
      return;
    }
    if(action === "Approve"){
        setShowDialog(true);
    }else{
        let temp = {...selectedCandidate, "Verification Status": action, "Sorted by": head};
            const response = await fetch("/api/getApis", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(temp),
  });
  const result = await response.json();
    if (result.success) {
      let temp = candidates.map((candidate) => {
  if (
    candidate["CV Count"] ===
    selectedCandidate["CV Count"]
  ) {
    return {
      ...candidate,
      "Verification Status": action, // Approved / Hold / Reject
      "Sorted by": head,
    };
  }

  return candidate;
});
      setCandidates(temp);
      goForward();
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Candidate updated successfully.', life: 3000 });
  } else {
    toast.current?.show({ severity: 'error', summary: 'Error', detail:result.message, life: 3000 });
  }
    }
  };

  useEffect(() => {
    getData();
  }, []);



  return (
    <div
      style={{
        background: "#F5F7FC",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
        <Toast ref={toast} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "24px",
        }}
      >
        {/* LEFT SIDEBAR */}

        <Card
          style={{
            borderRadius: "24px",
            padding: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            height: "fit-content",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#5663E9",
                fontSize: "32px",
                fontWeight: 600,
                display: "flex",
                justifyContent: "center",
            }}
          >
            Approval Page
          </h2>

          <Divider />

          <h3
            style={{
              marginTop: 0,
              color: "#5663E9",
              fontSize: "20px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            Head of Department
          </h3>

          {HeadsData.map((item) => (
            <div
              key={item.value}
              style={{
                marginBottom: "16px",
                display: "flex",
              }}
            >
              <RadioButton
                inputId={item.value}
                name="head"
                value={item.value}
                checked={head === item.value}
                onChange={(e) => setHead(e.value)}

              />

              <label
                htmlFor={item.value}
                style={{
                  marginLeft: "10px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {item.name}
              </label>
            </div>
          ))}

          <Divider />

          <h3
            style={{
              marginTop: 0,
              color: "#5663E9",
              fontSize: "20px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            Assigned Candidates
          </h3>

          <div
            style={{
              display: "grid",
              // CHANGED TO 3 COLUMNS
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "12px",
              maxHeight: "420px", // fixed height
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "8px",
            }}
          >
{candidates.map((candidate, index) => {
  const active =
    selectedCandidate?.["CV Count"] == candidate["CV Count"];

  return (
    <div
      key={index}
      onClick={() => setSelectedCandidate(candidate)}
      style={{
        height: "55px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: 700,
        transition: ".3s",

        background: active
          ? "#6674F6"
          : candidate["Verification Status"] === "Verified"
          ? "#D1FAE5"
          : candidate["Verification Status"] === "Hold"
          ? "#FEF3C7"
          : candidate["Verification Status"] === "Reject"
          ? "#FEE2E2"
          : "#EEF2FF",

        color: active
          ? "#FFF"
          : candidate["Verification Status"] === "Verified"
          ? "#15803D"
          : candidate["Verification Status"] === "Hold"
          ? "#B45309"
          : candidate["Verification Status"] === "Reject"
          ? "#DC2626"
          : "#6674F6",

        boxShadow: active
          ? "0 8px 20px rgba(102,116,246,.35)"
          : "none",
      }}
    >
      {candidate["CV Count"]}
    </div>
  );
})}
          </div>
        </Card>

        {/* RIGHT SECTION */}

        <Card
          style={{
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          }}
        >
          {selectedCandidate && (
            <>
              {/* HEADER */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "40px",
                }}
              >
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "32px",
                      fontWeight: 600,
                    }}
                  >
                    {selectedCandidate["Name"]}
                  </h1>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#6E7588",
                      fontSize: 16,
                    }}
                  >
                    Candidate No:
                    {selectedCandidate["CV Count"]}
                  </div>
                </div>
              </div>

              {/* DETAILS */}

              <div>
                {[
                  ["Experience", selectedCandidate["Experience"]],

                  [
                    "Current Organization",
                    selectedCandidate["Current Organization"],
                  ],

                  ["Location", selectedCandidate["Place"]],

                  ["Qualification", selectedCandidate["Education"]],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    style={{
                      padding: "24px 0",
                      borderBottom: i !== 3 ? "1px solid #ECECEC" : "none",
                      display: "flex",
                      gap: "40px",
                    }}
                  >
                    <div
                      style={{
                        width: "220px",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#6674F6",
                      }}
                    >
                      {label}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        fontSize: "17px",
                        lineHeight: "34px",
                        color: "#222",
                      }}
                    >
                      {value || "-"}
                    </div>
                  </div>
                ))}
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "50px",
                }}
              >
                <Button label="Reject" severity="danger"  onClick={() => handleClick("Reject")} />

                <Button label="Hold" severity="warning"  onClick={() => handleClick("Hold")} />

                <Button label="Approve" severity="success"  onClick={() => handleClick("Approve")} />
              </div>
            </>
          )}
        </Card>

<Dialog
  visible={showDialog}
  onHide={() => setShowDialog(false)}
  header="Assign Department"
  style={{ width: "850px" }}
    headerStyle={{
        textAlign: "center",
        justifyContent: "center"
    }}
>

<div
style={{
display: "flex",
gap: "16px",
justifyContent: "center",
alignItems: "stretch",
flexWrap: "nowrap",
}}
>

{DepartmentsData.map(
(dept: string, index: number) => (

<Card
key={index}

onClick={() =>
handleAssignDepartment(dept)
}

style={{
width: "220px",
cursor: "pointer",
padding: "20px",
textAlign: "center",
borderRadius: "18px",
transition: ".3s"
}}
onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = "#6674F6";
    e.currentTarget.style.color = "#FFF";
}}
onMouseLeave={(e) => {
    e.currentTarget.style.background = "#EEF2FF";
    e.currentTarget.style.color = "#6674F6";
}}
>

<div
style={{
fontWeight: 600,
fontSize: "18px"
}}
>
{dept}
</div>

</Card>

)
)}

</div>

</Dialog>
      </div>
    </div>
  );
};

export default ApprovalPage;

const HeadsData = [
  {
    name:
      "Prof. (Dr.) Jigeesh Nasina",
    value: "Jigeesh Sir",
  },
  {
    name:
      "Gp.Capt. N. Siva Prasad (Rtd.)",
    value: "Siva Prasad Sir",
  },
  {
    name: "B. Sravana Kumar",
    value: "Sravan Sir",
  },
];

const DepartmentsData = [
    "FST Hyderabad",
    "IBS Bangalore",
    "IBS Hyderabad",
    "FST Sociology"
]