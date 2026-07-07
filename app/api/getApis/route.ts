import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth: auth,
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1",
    });

    

    const values =
            response.data.values || [];

        const headers =
            values[0] || [];
        const rows =
            values.slice(1);

        const formattedData =
            rows.map(
                (row: string[]) =>
                    headers.reduce(
                        (
                            acc: Record<string, any>,
                            key: string,
                            index: number
                        ) => {

                            acc[key] =
                                row[index] || "";

                            return acc;

                        },

                        {}
                    )
            );

    return NextResponse.json({
  data: formattedData,
  headers: headers
});;
  } catch (error:any) {

     return NextResponse.json({
    message: error.message,
    stack: error.stack,
    full: error,
  });
  }
}

export async function POST (req: Request){
 try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth: auth,
    });

 const body = await req.json();
 const values = [Object.values(body)];
 await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: "Sheet1",
  valueInputOption: "USER_ENTERED",
  requestBody: {
    values,
  },
});
        return NextResponse.json({
            success: true,
            data: values,
        });
 }catch(error:any){
 return NextResponse.json({
    message: error.message,
    stack: error.stack,
    full: error,
  },
   { status: 500 }
);
 }
}


export async function PUT(req: any) {
  try{
    const body = await req.json(); 

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({
        version: 'v4',
        auth,
    });
// Get all sheet data
    const sheetResponse =
      await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:Z",
      });

    const values: any[][] = sheetResponse.data.values || [];

    if (!values.length) {
      return NextResponse.json({
        success: false,
        message: "Sheet is empty",
      });
    }

    // First row = headers
    const headers = values[0];

    // Find CV Count column index dynamically
    const cvCountIndex = headers.findIndex(
      (header) => header === "CV Count"
    );

    if (cvCountIndex === -1) {
      return NextResponse.json({
        success: false,
        message: '"CV Count" column not found',
      });
    }

    // Find row by CV Count
    const rowIndex = values.findIndex(
      (row, index) =>
        index > 0 &&
        String(row[cvCountIndex]) ===
          String(body["CV Count"])
    );

    if (rowIndex === -1) {
      return NextResponse.json({
        success: false,
        message: `CV Count ${body["CV Count"]} not found`,
      });
    }

     // Convert body to correct column order
    const rowValues = headers.map(
      (header) => body[header] ?? ""
    );

    // Update exact row
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet1!A${rowIndex + 1}:Z${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [rowValues],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
}
