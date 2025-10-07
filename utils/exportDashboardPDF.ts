import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const exportDashboardPDF = async (adminName: string, reports: any[]) => {
  try {
    const total = reports.length;
    const inProgress = reports.filter((r) => r.status === "In Progress").length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const unresolved = reports.filter((r) => r.status === "Unresolved").length;
    const escalated = reports.filter((r) => r.status === "Escalated").length;

    // Clean and simple dashboard-only PDF layout
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              background: #fff;
              color: #333;
            }
            h1 {
              color: #20C997;
              text-align: center;
              margin-bottom: 10px;
            }
            p {
              text-align: center;
              font-size: 14px;
              color: #666;
            }
            .summary {
              background: #f8f9fa;
              border-radius: 12px;
              padding: 20px;
              margin-top: 25px;
            }
            .summary ul {
              list-style-type: none;
              padding: 0;
            }
            .summary li {
              padding: 10px 0;
              border-bottom: 1px solid #ddd;
              font-size: 16px;
            }
            .summary li:last-child {
              border-bottom: none;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <h1>Admin Dashboard Report</h1>
          <p>Prepared by <strong>${adminName}</strong></p>
          <div class="summary">
            <ul>
              <li><strong>Total Reports:</strong> ${total}</li>
              <li><strong>In Progress:</strong> ${inProgress}</li>
              <li><strong>Resolved:</strong> ${resolved}</li>
              <li><strong>Unresolved:</strong> ${unresolved}</li>
              <li><strong>Escalated:</strong> ${escalated}</li>
            </ul>
          </div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("PDF Generated", `File saved at: ${uri}`);
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to export PDF");
  }
};
