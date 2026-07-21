"use client";

import { useMemo, useState } from "react";
import { useDemoStore } from "../store/demoStore";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

interface Candidate {
  ["CV Count"]: string;
  Name: string;
  Mail: string;
  Mobile: string;
  Experience: string;
  Education: string;
  Place: string;
  ["Current Organization"]: string;
  ["Demo Status"]: string;
  ["Interview Status"]: string;
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const SummaryCard = ({
  title,
  value,
  icon,
  color,
}: SummaryCardProps) => (
  <Card
    className="shadow-2"
    style={{
      borderLeft: `5px solid ${color}`,
      height: "110px",
    }}
  >
    <div className="flex justify-content-between align-items-center">
      <div>
        <div
          style={{
            color: "#64748B",
            fontSize: "0.9rem",
          }}
        >
          {title}
        </div>

        <h2
          style={{
            color,
            marginTop: ".5rem",
          }}
        >
          {value}
        </h2>
      </div>

      <i
        className={icon}
        style={{
          color,
          fontSize: "2rem",
        }}
      />
    </div>
  </Card>
);

const DateWiseDataPage = () => {
  const summary = useDemoStore((state) => state.summary);
  const router = useRouter();
  const [status, setStatus] = useState<"Pass" | "Fail">("Pass");
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  if (!summary) {
    return (
      <div className="flex justify-content-center mt-8">
        <h2>No Data Found</h2>
      </div>
    );
  }

const filteredCandidates = useMemo(() => {
  const data =
    status === "Pass"
      ? (summary.passedCandidates as Candidate[])
      : (summary.failedCandidates as Candidate[]);

  if (!globalFilter) return data;

  return data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(globalFilter.toLowerCase())
  );
}, [status, summary, globalFilter]);



const experienceBodyTemplate = (rowData: Candidate) => {
  return rowData.Experience || "-";
};



  const exportExcel = () => {
    if (!selectedCandidates.length) return;

    const worksheet = XLSX.utils.json_to_sheet(selectedCandidates);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${status} Candidates`
    );

    XLSX.writeFile(workbook, `${summary.date}-${status}.xlsx`);
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <div className="flex justify-content-between align-items-center">
        <div>
          <h2 style={{ marginBottom: ".3rem" }}>Demo Results</h2>

          <p style={{ color: "#64748B" }}>
            <i className="pi pi-calendar mr-2" />
            {summary.date}
          </p>
        </div>

        <Button
          label="Back"
          icon="pi pi-arrow-left"
          outlined
            onClick={() => {router.push("/demoPage")}}
        />
      </div>

      <div className="grid mt-4">
        <div className="col-12 md:col-3">
          <SummaryCard
            title="Total Candidates"
            value={summary.totalAttended}
            icon="pi pi-users"
            color="#6366F1"
          />
        </div>

        <div className="col-12 md:col-3">
          <SummaryCard
            title="Passed"
            value={summary.passedCount}
            icon="pi pi-check-circle"
            color="#22C55E"
          />
        </div>

        <div className="col-12 md:col-3">
          <SummaryCard
            title="Failed"
            value={summary.failedCount}
            icon="pi pi-times-circle"
            color="#EF4444"
          />
        </div>

        <div className="col-12 md:col-3">
          <SummaryCard
            title="Success Rate"
            value={summary.successRate}
            icon="pi pi-chart-line"
            color="#3B82F6"
          />
        </div>
      </div>

      <Toolbar
        className="mt-4 mb-4"
        start={
          <SelectButton
            value={status}
            options={["Pass", "Fail"]}
            onChange={(e) => {
              setStatus(e.value);
              setSelectedCandidates([]);
            }}
          />
        }
        end={
          <div className="flex gap-3 align-items-center">
            <span className="p-input-icon-left">
              {/* <i className="pi pi-search" /> */}

              <InputText
                placeholder="Search Candidate"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </span>

            <Button
              icon="pi pi-file-excel"
              label={`Export (${selectedCandidates.length})`}
              severity="success"
              disabled={!selectedCandidates.length}
              onClick={exportExcel}
            />
          </div>
        }
      />

<Card className="shadow-2">

    <DataTable
        value={filteredCandidates}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        stripedRows
        removableSort
        sortMode="single"
        selection={selectedCandidates}
        onSelectionChange={(e) =>
            setSelectedCandidates(e.value as Candidate[])
        }
        selectionMode="checkbox"
        dataKey="CV Count"
        emptyMessage="No Candidates Found"
        className="p-datatable-sm"
    >

        <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
        />

        <Column
            field="Name"
            header="Candidate Name"
            sortable
        />

        <Column
            field="Mail"
            header="Email"
            sortable
        />

        <Column
            field="Mobile"
            header="Mobile"
        />

        <Column
            field="Experience"
            header="Experience"
            body={experienceBodyTemplate}
        />

        <Column
            field="Education"
            header="Education"
        />

        <Column
            field="Current Organization"
            header="Organization"
        />

        <Column
            field="Place"
            header="Location"
        />

    </DataTable>

</Card>    </div>
  );
};

export default DateWiseDataPage;