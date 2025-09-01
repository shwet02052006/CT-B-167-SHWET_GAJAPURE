<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Template for root element -->
  <xsl:template match="/">
    <html>
      <head>
        <title>Employee Information</title>
        <style>
          table {
            border-collapse: collapse;
            width: 80%;
            margin: 20px auto;
            font-family: Arial, sans-serif;
          }
          th, td {
            border: 1px solid #666;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #333;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          h2 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h2>Employee Information</h2>
        <table>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Email</th>
            <th>Salary</th>
          </tr>
          <xsl:for-each select="employees/employee">
            <tr>
              <td><xsl:value-of select="empId"/></td>
              <td><xsl:value-of select="empName"/></td>
              <td><xsl:value-of select="department"/></td>
              <td><xsl:value-of select="designation"/></td>
              <td><xsl:value-of select="email"/></td>
              <td><xsl:value-of select="salary"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
