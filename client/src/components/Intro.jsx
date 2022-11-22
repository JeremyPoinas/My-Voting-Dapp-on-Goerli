import * as React from 'react';
import useEth from "../contexts/EthContext/useEth";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Menu bar on top of the screen
export default function Intro({ setPagetoDisplay, isOwner, isVoter, workflowStatus }) {
  const { state: { accounts } } = useEth();
  const status = [
    'Registering Voters',
    'Registering proposals',
    'Proposals registered',
    'Voting session ongoing',
    'Voting session completed',
    'Votes tallied'
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isOwner && <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setPagetoDisplay('admin')}
          >
            Admin
          </IconButton>}
          {isVoter && <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setPagetoDisplay('voter')}
          >
            Voting session
          </IconButton>}
          <Typography variant="h3" component="div" align='center' sx={{ flexGrow: 1 }}>
            {status[workflowStatus]}
          </Typography>
          {accounts && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <Chip label={accounts[0]} sx={{bgcolor: "#cfd8dc"}} />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}