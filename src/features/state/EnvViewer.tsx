import React, { ReactElement } from "react";
import { v4 as uuid } from "uuid";
import "@/styles/EnvViewer.css";

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
        <div
          className="env-viewer-table-container"
        >
          <table>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>name</th>
                <th style={{ width: "75%" }}>value</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(([name, value]) => (
                <tr key={uuid()}>
                  <th style={{ width: "25%", overflow: "hidden" }}>
                    {/* <Tooltip title={name}>
                      <span>{name}</span>
                    </Tooltip> */}
                    {name}
                  </th>
                  <th style={{ width: "75%", overflow: "hidden" }}>
                    {/* <Tooltip title={value}>
                      <span>{value}</span>
                    </Tooltip> */}
                    {value}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default EnvViewer;
