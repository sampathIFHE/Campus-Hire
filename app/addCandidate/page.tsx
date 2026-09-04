"use client";

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const AddCandidatePage = () => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [headers, setHeaders]= useState<string[]>([]);
  const [candidatesData, setCandidatesData] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const requiredFields = [
  "Name",
  "Mail",
  "Mobile",
  "Received For",
  "Date of Email Received",
  "Experience",
  "Current Organization",
  "Place",
  "Education",
];


const isFormValid = requiredFields.every(
  (field) =>
    formData[field] &&
    String(formData[field]).trim() !== ""
);

  const fieldContainer = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  };

const inputStyle = {
  borderRadius: "10px",
  padding: "10px",
  width: "100%",
  border: "1px solid #d1d5db",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  background: "#ffffff",
};

  const labelStyle = {
    fontWeight: 600,
    fontSize: "14px",
    color: "#374151",
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  const json = {
    ...formData,
    "CV Count":
      Number(candidatesData[candidatesData.length - 1]?.["CV Count"] || 0) + 1,
    "No of times called": "0",
  };
  try {
    const response = await fetch("/api/getApis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    const result = await response.json();
    setFormData({});
    setDuplicates([]);
    getData();
  } catch (error) {
    console.error("Error saving candidate:", error);
  }
};
const getData = async () => {
  try {
    const response = await fetch("/api/getApis");
    const result = await response.json();
    setHeaders(result.headers);
    setCandidatesData(result.data);
  } catch (error) {
    console.log("FULL ERROR:", error);
  }
};
  const handleChanges = (field: string, value: any) => {
    if (field == "Name" || field == "Mail" || field == "Mobile")
      findDuplicate(field, value);
    const json: any = { ...formData };
    if (field.toLowerCase().includes(String("Date").toLowerCase())) {
      const formattedDate = value.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      json[field] = formattedDate;
    } else {
      json[field] = value;
    }
    setFormData(json);
  };
  const findDuplicate = (field: string, value: any) => {
    const temp = false;
    const duplicateArr: any = candidatesData.filter((item: any) => {
      return (
        item[field] == value ||
        String(item[field]).toLowerCase().includes(String(value).toLowerCase())
      );
    });
    setDuplicates(duplicateArr);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Card
          style={{
            width: "900px",
            borderRadius: "16px",
            padding: "20px",
            background: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "none",
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              Add Candidate
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              Enter candidate details below
            </p>
          </div>

          {/* Form Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Name */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Name</label>

              <InputText
                value={formData["Name"] || ""}
                onChange={(e) => handleChanges("Name", e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Mail */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Mail</label>

              <InputText
                value={formData["Mail"] || ""}
                onChange={(e) => handleChanges("Mail", e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Mobile */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Mobile</label>

              <InputText
                value={formData["Mobile"] || ""}
                onChange={(e) => handleChanges("Mobile", e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Recieved for */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Recieved for</label>

              <Dropdown
                value={formData["Recieved for"] || ""}
                onChange={(e) => handleChanges("Recieved for", e.value)}
                options={ReceivedOptions}
                optionLabel="name"
                optionValue="value"
                placeholder="Select"
                style={inputStyle}
              />
            </div>

            {/* Date */}
           {formData.Name && formData.Mail && formData.Mobile ?<div style={fieldContainer}>
              <label style={labelStyle}>Date of Email Received</label>

              <Calendar
                value={
                  formData["Date of Email received"]
                    ? new Date(formData["Date of Email received"])
                    : null
                }
                onChange={(e) =>
                  handleChanges("Date of Email received", e.value)
                }
                showIcon
                style={inputStyle}
              />
            </div>:null}

            {/* Experience */}
           {formData.Name && formData.Mail && formData.Mobile ? <div style={fieldContainer}>
              <label style={labelStyle}>Experience</label>

              <InputText
                value={formData["Experience"] || ""}
                onChange={(e) => handleChanges("Experience", e.target.value)}
                style={inputStyle}
              />
            </div>:null}

            {/* Current Organization */}
           {formData.Name && formData.Mail && formData.Mobile ? <div style={fieldContainer}>
              <label style={labelStyle}>Current Organization</label>

              <InputText
                value={formData["Current Organization"] || ""}
                onChange={(e) =>
                  handleChanges("Current Organization", e.target.value)
                }
                style={inputStyle}
              />
            </div>:null}

            {/* Place */}
           {formData.Name && formData.Mail && formData.Mobile ? <div style={fieldContainer}>
              <label style={labelStyle}>Place</label>

              <InputText
                value={formData["Place"] || ""}
                onChange={(e) => handleChanges("Place", e.target.value)}
                style={inputStyle}
              />
            </div>:null}

            {/* Referal */}
            {formData.Name && formData.Mail && formData.Mobile ?<div style={fieldContainer}>
              <label style={labelStyle}>Referal</label>

              <InputText
                value={formData["Referal"] || ""}
                onChange={(e) => handleChanges("Referal", e.target.value)}
                style={inputStyle}
              />
            </div>:null}

            {/* Education Full Width */}
           {formData.Name && formData.Mail && formData.Mobile ? <div
              style={{
                ...fieldContainer,
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>Education</label>

              <InputTextarea
                rows={5}
                value={formData["Education"] || ""}
                onChange={(e) => handleChanges("Education", e.target.value)}
                style={inputStyle}
              />
            </div>:null}
          </div>

          {/* Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              label="Save Candidate"
              severity="info"
              // disabled={!isFormValid}
              style={{
                borderRadius: "10px",
                padding: "12px 20px",
                background: "#3b82f6",
                color: "white",
                // opacity: !isFormValid ? 0.6 : 1,
                // cursor: !isFormValid ? "not-allowed" : "pointer",
              }}
              type="submit"
            />
          </div>
        </Card>
      </form>

      {duplicates.length ? (
        <DataTable
          value={duplicates}
          showGridlines
          tableStyle={{ minWidth: "80rem" }}
        >
          <Column
            field={"CV Count"}
            header={"CV Count"}
            headerStyle={{
              backgroundColor: "#06B6D4",
              color: "white",
            }}
          ></Column>
          {requiredFields.map((item: any) => {
            return (
              <Column
                field={item}
                header={item}
                headerStyle={{
                  backgroundColor: "#06B6D4",
                  color: "white",
                }}
              ></Column>
            );
          })}
        </DataTable>
      ) : null}
    </div>
  );
};

export default AddCandidatePage;

const ReceivedOptions = [
  { name: "Careers", value: "Careers" },
  { name: "FST", value: "FST" },
  { name: "Naukri", value: "Naukri" },
];


