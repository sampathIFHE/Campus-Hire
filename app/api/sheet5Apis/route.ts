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
      range: "Sheet5",
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

    return NextResponse.json(formattedData);
  } catch (error:any) {

     return NextResponse.json({
    message: error.message,
    stack: error.stack,
    full: error,
  });
  }
}