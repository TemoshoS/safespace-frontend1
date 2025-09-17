import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const exportPDF = async (reports: any[]) => {
  if (reports.length === 0) return Alert.alert('No reports', 'There are no reports to export.');

  const htmlContent = `
    <html>
      <head>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #20C997; color: white; }
        </style>
      </head>
      <body>
        <h2>Abuse Reports</h2>
        <table>
          <tr>
            <th>Case #</th>
            <th>Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
          ${reports.map(r => `
            <tr>
              <td>${r.case_number}</td>
              <td>${r.anonymous ? 'Anonymous' : r.first_name + ' ' + r.surname}</td>
              <td>${r.location}</td>
              <td>${r.status}</td>
              <td>${r.description}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  } catch (err) {
    Alert.alert('Error', 'Failed to export PDF');
  }
};
