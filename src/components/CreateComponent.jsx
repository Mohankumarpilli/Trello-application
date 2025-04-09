import { Button, TextField, Paper, Box, Typography } from "@mui/material";

const CreateComponent = ({
  showForm,
  boardName,
  setShowForm,
  setBoardName,
  handleCreateBoard,
  placeholder = "Enter board name",
  buttonLabel = "Create",
}) => {
  return (
    <Box>
      {!showForm ? (
        <Paper
          elevation={2}
          className="cursor-pointer bg-gray-100 p-4 rounded-lg hover:bg-gray-200"
          onClick={() => setShowForm(true)}
        >
          <Typography variant="body1" fontWeight="bold">
            {buttonLabel}
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} className="p-4 rounded-lg bg-white shadow-md flex flex-col gap-4">
          <TextField
            fullWidth
            label={placeholder}
            variant="outlined"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
          />
          <Box className="flex gap-2">
            <Button variant="contained" onClick={handleCreateBoard}>
              {buttonLabel}
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CreateComponent;
