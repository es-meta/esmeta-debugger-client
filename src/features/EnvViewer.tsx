import React, { ReactElement } from "react";
import { v4 as uuid } from "uuid";
import {
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "../styles/EnvViewer.css";

type EnvViewerProps = {
  // pair of variable name and value
  env: [string, string][];
};
class EnvViewer extends React.Component<EnvViewerProps> {
  render(): ReactElement {
    const { env } = this.props;
    const sorted = env.slice().sort((a, b) => a[0].localeCompare(b[0]));

    return (
      <div className="env-viewer-container">
        <TableContainer
          component={Paper}
          className="env-viewer-table-container"
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "25%" }}>name</TableCell>
                <TableCell style={{ width: "75%" }}>value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map(([name, value]) => (
                <TableRow key={uuid()}>
                  <TableCell style={{ width: "25%", overflow: "hidden" }}>
                    <Tooltip title={name}>
                      <span>{name}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell style={{ width: "75%", overflow: "hidden" }}>
                    <Tooltip title={value}>
                      <span>{value}</span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default EnvViewer;
