import { Circle } from "@mui/icons-material";
import { Avatar, Box, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {
  users: unknown;
};

const AdminHome = ({ users }: Props) => {
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "image",
      headerName: "Avatar",
      width: 150,
      renderCell: (params) => (
        <Avatar
          sx={{ bgcolor: "orange", color: "black", mt: 1 }}
          src={params.value}
          alt="userIcon"
        />
      ),
    },
    {
      field: "userName",
      headerName: "User name",
      //   width: 150,
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      type: "number",
      width: 110,
      renderCell: (params) => (
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
        >
          <span>{params.row.status ? "Online" : "Offline"} </span>
          <Circle
            sx={{
              color: params.row.status ? "green" : "red",
              fontSize: "1rem",
            }}
          />
        </Stack>
      ),
    },

    {
      field: "totalClocking",
      headerName: "Clocked",
      type: "number",
      width: 110,
    },
  ];

  // -------------------------------------- Table rows---------------------------------------

  const rows = Object.entries(users || {}).map(([key, value]) => {
 const row = value as User

    return {
      id: key,
      image: row.photo,
      userName: row.name,
      totalClocking: row.totalClocking,
      status: row.isActive,
    };
  });

  return (
    <Box width={"100%"} padding={"1.5rem 5rem"}>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
        />
      </Box>
    </Box>
  );
};

export default AdminHome;
