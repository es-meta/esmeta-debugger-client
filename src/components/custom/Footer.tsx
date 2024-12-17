import React from "react";

import SettingsIcon from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';

function IconExample() {
  return (
    <div>
      <SettingsIcon style={{ fontSize: 40 }} /> {/* Settings icon */}
    </div>
  );
}

function Footer() {
    return <footer className="header flex flex-row justify-center items-center w-full p-8">
      <div className="flex flex-row gap-8">
        <div>
          <GitHubIcon style={{ fontSize: 24  }} />
          ESMeta
        </div>
        <div>
          <GitHubIcon style={{ fontSize: 24 }} />
          ESMeta Debugger
        </div>
      </div>
    </footer>;
};

export default Footer;
