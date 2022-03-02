import Head from "next/head";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Button, Menu, MenuItem } from "@mui/material";
import { LIBRARY_NAME } from "tps/constants";

function Dashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Head>
        <title>{`${LIBRARY_NAME} 后台管理系统`}</title>
      </Head>
      <div className="px-6 my-8 max-w-7xl mx-auto">
        <div className="flex items-center mb-8 justify-between">
          <h4 className="text-2xl">晚上好, ycjqf</h4>
          <div>
            <Button
              id="basic-button"
              className="relative -right-2"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              操作
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleClose}>退出</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-full">
              <Card variant="outlined" sx={{ width: "100%", minHeight: "260px" }}>
                <CardContent>content</CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
